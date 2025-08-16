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

// GET - Mesaj detayı
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
            user: { select: { id: true, name: true, email: true } },
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
    console.error("[messages/:id.GET] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// PATCH - Mesaj güncelleme (sadece gönderen)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const payload = await req.json().catch(() => ({} as any));
    
    // Mesajın varlığını ve yetkiyi kontrol et
    const message = await db.message.findUnique({
      where: { id },
      select: { id: true, senderId: true, deletedBySenderAt: true },
    });
    
    if (!message || message.senderId !== me || message.deletedBySenderAt) {
      return NextResponse.json({ message: "Yetki yok veya mesaj yok" }, { status: 404 });
    }

    // Güncellenecek alanları hazırla
    const data: Record<string, string> = {};
    
    if (typeof payload?.subject === "string") {
      const s = payload.subject.trim();
      if (s.length < 3) {
        return NextResponse.json({ message: "Başlık en az 3 karakter olmalı" }, { status: 400 });
      }
      data.subject = s;
    }
    
    if (typeof payload?.body === "string") {
      const b = payload.body.trim();
      if (b.length < 1) {
        return NextResponse.json({ message: "İçerik boş olamaz" }, { status: 400 });
      }
      data.body = b;
    }

    // Hiçbir alan güncellenmeyecekse hata ver
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "Güncellenecek alan yok" }, { status: 400 });
    }

    // Mesajı güncelle
    const updated = await db.message.update({
      where: { id },
      data,
      select: { 
        id: true, 
        subject: true, 
        body: true, 
        createdAt: true, 
        updatedAt: true 
      },
    });
    
    return NextResponse.json({
      ...updated,
      message: "Mesaj başarıyla güncellendi"
    });
    
  } catch (e) {
    console.error("[messages.[id].PATCH] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE - Mesaj silme
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;
  const id = params.id;

  try {
    const sp = new URL(req.url).searchParams;
    const hard = sp.get("hard") === "1";
    let box = (sp.get("box") ?? "") as "inbox" | "outbox" | "";

    // Box otomatik tespiti
    if (!box) {
      const msg = await db.message.findUnique({ where: { id }, select: { senderId: true } });
      if (msg?.senderId === me) {
        box = "outbox";
      } else {
        const rec = await db.messageRecipient.findFirst({ where: { messageId: id, userId: me } });
        box = rec ? "inbox" : "" as any;
      }
    }

    // Sadece giden mesajlar silinebilir
    if (box === "outbox") {
      if (hard) {
        // Hard delete - mesajı tamamen sil
        const res = await db.message.deleteMany({ 
          where: { id, senderId: me } 
        });
        if (res.count === 0) {
          return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, hard: true });
      }
      
      // Soft delete - sadece gönderen için işaretle
      const res = await db.message.updateMany({
        where: { id, senderId: me, deletedBySenderAt: null },
        data: { deletedBySenderAt: new Date() },
      });
      
      if (res.count === 0) {
        return NextResponse.json({ 
          message: "Mesaj bulunamadı veya zaten silinmiş" 
        }, { status: 404 });
      }

      // Otomatik temizlik: alıcı kalmadıysa tamamen sil
      const aliveRecipients = await db.messageRecipient.count({
        where: { messageId: id, deletedByRecipientAt: null },
      });
      
      if (aliveRecipients === 0) {
        await db.message.delete({ where: { id } });
      }

      return NextResponse.json({ ok: true, hard: false });
    }

    if (box === "inbox") {
      // Gelen mesajlar silinemez kuralı
      return NextResponse.json({ 
        message: "Gelen mesajlar silinemez" 
      }, { status: 403 });
    }

    return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
    
  } catch (e) {
    console.error("[messages.[id].DELETE] ", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}