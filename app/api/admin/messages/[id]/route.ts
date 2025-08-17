// app/api/admin/messages/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// GET - Mesaj detayı (yalnızca adminin erişebildiği kayıtlar)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const msg = await db.message.findFirst({
      where: {
        id,
        OR: [
          { senderId: me, deletedBySenderAt: null },
          { recipients: { some: { userId: me, deletedByRecipientAt: null } } },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipients: {
          select: {
            user: { select: { id: true, name: true, email: true} },
            readAt: true,
            deletedByRecipientAt: true,
          },
        },
        team: { select: { id: true, name: true } },
      },
    });
    if (!msg) return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
    return NextResponse.json(msg);
  } catch (e) {
    console.error("[admin.messages/:id.GET] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// PATCH - { action: "read" } veya { subject, body } (yalnızca gönderen admin düzenler)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const payload = await req.json().catch(() => ({} as any));
    const action = String(payload?.action ?? "update");

    // Okundu işareti (admin inbox'ı)
    if (action === "read") {
      await db.messageRecipient.updateMany({
        where: { messageId: id, userId: me, readAt: null, deletedByRecipientAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ ok: true });
    }

    // Düzenleme: yalnızca gönderen admin
    const message = await db.message.findUnique({
      where: { id },
      select: { id: true, senderId: true, deletedBySenderAt: true },
    });
    if (!message || message.senderId !== me || message.deletedBySenderAt) {
      return NextResponse.json({ message: "Yetki yok veya mesaj yok" }, { status: 404 });
    }

    const data: Record<string, string> = {};
    if (typeof payload?.subject === "string") {
      const s = payload.subject.trim();
      if (s && s.length < 3) return NextResponse.json({ message: "Başlık en az 3 karakter olmalı" }, { status: 400 });
      if (s) data.subject = s;
    }
    if (typeof payload?.body === "string") {
      const b = payload.body.trim();
      if (b && b.length < 1) return NextResponse.json({ message: "İçerik boş olamaz" }, { status: 400 });
      if (b) data.body = b;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "Güncellenecek alan yok" }, { status: 400 });
    }

    const updated = await db.message.update({
      where: { id },
      data,
      select: { id: true, subject: true, body: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ ...updated, message: "Mesaj başarıyla güncellendi" });
  } catch (e) {
    console.error("[admin.messages.[id].PATCH] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE - /api/admin/messages/:id?box=inbox|outbox(&hard=1)
// - outbox: gönderen admin → soft delete (deletedBySenderAt) veya hard (transaction)
// - inbox : alıcı admin   → soft delete (deletedByRecipientAt) veya hard; ardından auto-cleanup
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const sp = new URL(req.url).searchParams;
    const hard = sp.get("hard") === "1";
    let box = (sp.get("box") ?? "") as "inbox" | "outbox" | "";

    // box verilmediyse otomatik tespit
    if (!box) {
      const msg = await db.message.findUnique({ where: { id }, select: { senderId: true } });
      if (msg?.senderId === me) box = "outbox";
      else {
        const rec = await db.messageRecipient.findFirst({ where: { messageId: id, userId: me } });
        box = rec ? "inbox" : ("" as any);
      }
    }

    // OUTBOX (gönderen admin)
    if (box === "outbox") {
      if (hard) {
        await db.$transaction(async (tx) => {
          await tx.messageRecipient.deleteMany({ where: { messageId: id } });
          const res = await tx.message.deleteMany({ where: { id, senderId: me } });
          if (res.count === 0) throw new Error("NOT_FOUND");
        });
        return NextResponse.json({ ok: true, hard: true });
      }

      const res = await db.message.updateMany({
        where: { id, senderId: me, deletedBySenderAt: null },
        data: { deletedBySenderAt: new Date() },
      });
      if (res.count === 0) {
        return NextResponse.json({ message: "Mesaj bulunamadı veya zaten silinmiş" }, { status: 404 });
      }

      // Kimse görmüyorsa auto-hard
      const stillVisible = await db.messageRecipient.count({
        where: { messageId: id, deletedByRecipientAt: null },
      });
      if (stillVisible === 0) {
        await db.message.delete({ where: { id } }).catch(() => {});
      }
      return NextResponse.json({ ok: true, hard: false });
    }

    // INBOX (alıcı admin) — soft/hard silmeyi destekle
    if (box === "inbox") {
      if (hard) {
        await db.$transaction(async (tx) => {
          const res = await tx.messageRecipient.deleteMany({ where: { messageId: id, userId: me } });
          if (res.count === 0) throw new Error("NOT_FOUND");
          const left = await tx.messageRecipient.count({ where: { messageId: id } });
          if (left === 0) {
            const msg = await tx.message.findUnique({ where: { id }, select: { deletedBySenderAt: true } });
            if (msg?.deletedBySenderAt) {
              await tx.message.delete({ where: { id } });
            }
          }
        });
        return NextResponse.json({ ok: true, hard: true });
      }

      const res = await db.messageRecipient.updateMany({
        where: { messageId: id, userId: me, deletedByRecipientAt: null },
        data: { deletedByRecipientAt: new Date() },
      });
      if (res.count === 0) {
        return NextResponse.json({ message: "Mesaj alımı bulunamadı veya zaten silinmiş" }, { status: 404 });
      }

      // Artık kimse görmüyorsa ve gönderen de silmişse tamamen kaldır
      const leftVisible = await db.messageRecipient.count({
        where: { messageId: id, deletedByRecipientAt: null },
      });
      if (leftVisible === 0) {
        const msg = await db.message.findUnique({ where: { id }, select: { deletedBySenderAt: true } });
        if (msg?.deletedBySenderAt) {
          await db.message.delete({ where: { id } }).catch(() => {});
        }
      }
      return NextResponse.json({ ok: true, hard: false });
    }

    return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
  } catch (e: any) {
    if (String(e?.message) === "NOT_FOUND") {
      return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
    }
    console.error("[admin.messages.[id].DELETE] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
