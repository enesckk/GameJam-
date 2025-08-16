export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

async function requireUser(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (!payload?.sub) throw new Error("unauth");
    return { userId: String(payload.sub), role: String(payload.role || "PARTICIPANT") };
  } catch {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
}

// GET ?box=inbox|outbox&q=&unread=1&page=&pageSize=
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;

  try {
    const sp = new URL(req.url).searchParams;
    const box = (sp.get("box") ?? "inbox") as "inbox" | "outbox";
    const q = (sp.get("q") ?? "").trim();
    const unread = sp.get("unread") === "1";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(Math.max(parseInt(sp.get("pageSize") ?? "10", 10) || 10, 1), 50);

    if (box === "inbox") {
      const where: any = {
        recipients: {
          some: {
            userId: me,
            ...(unread ? { readAt: null } : {}),
            deletedByRecipientAt: null,
          },
        },
      };
      if (q) {
        where.OR = [
          { subject: { contains: q } },
          { body: { contains: q } },
          { sender: { name: { contains: q } } },
          { sender: { email: { contains: q } } },
        ];
      }

      const [total, items] = await Promise.all([
        db.message.count({ where }),
        db.message.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            sender: { select: { id: true, name: true, email: true } },
            recipients: { where: { userId: me, deletedByRecipientAt: null }, select: { readAt: true } },
          },
        }),
      ]);

      return NextResponse.json({
        total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)),
        items: items.map((m) => ({
          id: m.id, subject: m.subject, body: m.body, createdAt: m.createdAt, sender: m.sender,
          readAt: m.recipients[0]?.readAt ?? null,
        })),
      });
    }

    // outbox
    const where: any = { senderId: me, deletedBySenderAt: null };
    if (q) {
      where.OR = [
        { subject: { contains: q } },
        { body: { contains: q } },
        { recipients: { some: { user: { name: { contains: q } } } } },
        { recipients: { some: { user: { email: { contains: q } } } } },
      ];
    }

    const [total, items] = await Promise.all([
      db.message.count({ where }),
      db.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          recipients: { select: { user: { select: { id: true, name: true, email: true } }, readAt: true } },
        },
      }),
    ]);

    return NextResponse.json({
      total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)),
      items: items.map((m) => ({
        id: m.id, subject: m.subject, body: m.body, createdAt: m.createdAt,
        recipients: m.recipients.map((r) => ({ ...r.user, readAt: r.readAt })),
      })),
    });
  } catch (e) {
    console.error("[messages.user.GET] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// POST { subject, body }
// -> Alıcılar: sistemdeki tüm ADMIN’ler
export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;

  try {
    const body = (await req.json().catch(() => null)) as { subject?: string; body?: string } | null;
    const subject = (body?.subject ?? "").trim();
    const text = (body?.body ?? "").trim();
    if (subject.length < 3 || text.length < 1) {
      return NextResponse.json({ message: "Başlık en az 3, içerik en az 1 karakter" }, { status: 400 });
    }

    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    const recipientIds = new Set(admins.map((a) => a.id));
    // Kendine gönderme
    recipientIds.delete(me);
    const ids = Array.from(recipientIds);
    if (ids.length === 0) {
      return NextResponse.json({ message: "Sistemde admin bulunamadı" }, { status: 400 });
    }

    const msg = await db.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: { subject, body: text, senderId: me, teamId: null },
      });
      await tx.messageRecipient.createMany({
        data: ids.map((userId) => ({ messageId: created.id, userId })),
      });
      return created;
    });

    return NextResponse.json({ ok: true, id: msg.id }, { status: 201 });
  } catch (e) {
    console.error("[messages.user.POST] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
