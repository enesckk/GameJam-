// app/api/admin/messages/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (payload?.role !== "ADMIN" || !payload?.sub) throw new Error("forbidden");
    return { userId: String(payload.sub) };
  } catch {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
}

// GET ?box=inbox|outbox&q=&unread=1&page=&pageSize=
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
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
          // relation filterler 'is:' ile
          { sender: { is: { name: { contains: q } } } },
          { sender: { is: { email: { contains: q } } } },
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
            recipients: {
              where: { userId: me, deletedByRecipientAt: null },
              select: { readAt: true },
            },
          },
        }),
      ]);

      return NextResponse.json({
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        items: items.map((m) => ({
          id: m.id,
          subject: m.subject,
          body: m.body,
          createdAt: m.createdAt,
          sender: m.sender,
          readAt: m.recipients[0]?.readAt ?? null,
        })),
      });
    }

    // OUTBOX
    const where: any = {
      senderId: me,
      deletedBySenderAt: null,
    };

    if (q) {
      where.OR = [
        { subject: { contains: q } },
        { body: { contains: q } },
        // recipients.user relation'ında da 'is:' kullanılmalı
        { recipients: { some: { user: { is: { name: { contains: q } } } } } },
        { recipients: { some: { user: { is: { email: { contains: q } } } } } },
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
          recipients: {
            select: {
              user: { select: { id: true, name: true, email: true } },
              readAt: true,
            },
          },
          team: { select: { id: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      items: items.map((m) => ({
        id: m.id,
        subject: m.subject,
        body: m.body,
        createdAt: m.createdAt,
        team: m.team,
        recipients: m.recipients.map((r) => ({ ...r.user, readAt: r.readAt })),
      })),
    });
  } catch (e) {
    console.error("[messages.GET] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// POST { subject, body, toUserIds?: string[], teamId?: string, teamMemberIds?: string[], allTeamMembers?: boolean }
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;

  try {
    const body = (await req.json().catch(() => null)) as {
      subject?: string;
      body?: string;
      toUserIds?: string[];
      teamId?: string;
      teamMemberIds?: string[];
      allTeamMembers?: boolean;
    } | null;

    const subject = (body?.subject ?? "").trim();
    const text = (body?.body ?? "").trim();
    if (subject.length < 3 || text.length < 1) {
      return NextResponse.json(
        { message: "Başlık en az 3, içerik en az 1 karakter olmalı" },
        { status: 400 }
      );
    }

    const recipientIds = new Set<string>(
      Array.isArray(body?.toUserIds) ? body!.toUserIds.filter(Boolean) : []
    );

    if (body?.teamId) {
      const team = await db.team.findUnique({
        where: { id: body.teamId },
        include: { members: { select: { id: true } } },
      });
      if (!team) return NextResponse.json({ message: "Takım bulunamadı" }, { status: 404 });

      if (body.allTeamMembers) {
        team.members.forEach((m) => recipientIds.add(m.id));
      } else if (Array.isArray(body.teamMemberIds) && body.teamMemberIds.length) {
        const inTeam = new Set(team.members.map((m) => m.id));
        body.teamMemberIds.forEach((id) => {
          if (inTeam.has(id)) recipientIds.add(id);
        });
      }
    }

    recipientIds.delete(me);
    const ids = Array.from(recipientIds);
    if (ids.length === 0) {
      return NextResponse.json({ message: "En az bir alıcı seçin" }, { status: 400 });
    }

    const msg = await db.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          subject,
          body: text,
          senderId: me,
          teamId: body?.teamId ?? null,
        },
      });
      await tx.messageRecipient.createMany({
        data: ids.map((userId) => ({ messageId: created.id, userId })),
      });
      return created;
    });

    return NextResponse.json({ ok: true, id: msg.id }, { status: 201 });
  } catch (e) {
    console.error("[messages.POST] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
