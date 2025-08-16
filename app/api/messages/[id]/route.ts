import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireUser(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (!payload?.sub) throw new Error("unauth");
    return { userId: String(payload.sub) };
  } catch {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
}

// PATCH { action: "read" }  veya  { subject, body }  (yalnızca gönderen ise)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const payload = await req.json().catch(() => ({} as any));
    const action = String(payload?.action ?? "update");

    if (action === "read") {
      await db.messageRecipient.updateMany({
        where: { messageId: id, userId: me, readAt: null, deletedByRecipientAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ ok: true });
    }

    // sadece gönderense güncelleyebilir (adminlerde yaptığın gibi okundu kilidi yok)
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
      if (s && s.length < 3) return NextResponse.json({ message: "Başlık en az 3 karakter" }, { status: 400 });
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
      select: { id: true, subject: true, body: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[messages.user.[id].PATCH] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/messages/:id?box=inbox|outbox  (+&hard=1)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const sp = new URL(req.url).searchParams;
    const hard = sp.get("hard") === "1";
    let box = (sp.get("box") ?? "") as "inbox" | "outbox" | "";

    if (!box) {
      const msg = await db.message.findUnique({ where: { id }, select: { senderId: true } });
      if (msg?.senderId === me) box = "outbox";
      else {
        const rec = await db.messageRecipient.findFirst({ where: { messageId: id, userId: me } });
        box = rec ? "inbox" : "" as any;
      }
    }

    if (box === "outbox") {
      if (hard) {
        const res = await db.message.deleteMany({ where: { id, senderId: me } });
        if (res.count === 0) return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
        return NextResponse.json({ ok: true, hard: true });
      }
      const res = await db.message.updateMany({
        where: { id, senderId: me, deletedBySenderAt: null },
        data: { deletedBySenderAt: new Date() },
      });
      if (res.count === 0) return NextResponse.json({ message: "Mesaj bulunamadı veya zaten silinmiş" }, { status: 404 });
      return NextResponse.json({ ok: true, hard: false });
    }

    if (box === "inbox") {
      if (hard) {
        const res = await db.messageRecipient.deleteMany({ where: { messageId: id, userId: me } });
        if (res.count === 0) return NextResponse.json({ message: "Mesaj alımı bulunamadı" }, { status: 404 });
        return NextResponse.json({ ok: true, hard: true });
      }
      const res = await db.messageRecipient.updateMany({
        where: { messageId: id, userId: me, deletedByRecipientAt: null },
        data: { deletedByRecipientAt: new Date() },
      });
      if (res.count === 0) return NextResponse.json({ message: "Mesaj alımı bulunamadı veya zaten silinmiş" }, { status: 404 });
      return NextResponse.json({ ok: true, hard: false });
    }

    return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
  } catch (e) {
    console.error("[messages.user.[id].DELETE] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
