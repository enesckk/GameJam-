import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    const norm = String(email ?? "").toLowerCase().trim();
    if (!norm) {
      return NextResponse.json({ message: "E-posta zorunlu" }, { status: 400 });
    }

    // Kullanıcıyı bul (bilgi sızdırmayı önlemek için, sonuçtan bağımsız 200 döneceğiz)
    const user = await db.user.findUnique({
      where: { email: norm },
      select: { id: true /*, blocked: true*/ },
    });

    // Kullanıcı yoksa da 200 dönüyoruz (enumeration koruması)
    if (!user /*|| user.blocked*/) {
      return NextResponse.json({ ok: true });
    }

    // Önce mevcut reset token'larını temizle
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Yeni token oluştur
    const raw = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(raw);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: expires },
    });

    // Reset linki
    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const resetUrl = `${origin}/reset-password?token=${raw}`;

    // PROD'da e-posta gönder; DEV'de log
    console.log("[RESET LINK]", resetUrl);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
