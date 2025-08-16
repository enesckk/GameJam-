import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT } from "jose";

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}
function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET eksik");
  return new TextEncoder().encode(s);
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json().catch(() => ({}));
    if (!token || !password) {
      return NextResponse.json({ message: "Token ve yeni şifre zorunlu" }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalı" }, { status: 400 });
    }

    const tokenHash = sha256(String(token));
    const row = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!row || row.usedAt || row.expiresAt < new Date()) {
      return NextResponse.json({ message: "Token geçersiz veya süresi dolmuş" }, { status: 400 });
    }

    // Şifreyi güncelle + hesabı aktif et + token'ı tüket
    const hash = await bcrypt.hash(String(password), 10);
    await db.$transaction([
      db.user.update({
        where: { id: row.userId },
        data: {
          passwordHash: hash,
          canLogin: true,   // KRİTİK: login guard'ını geçmek için
          // blocked: false, // <- modelde yoksa KALDIR
        },
      }),
      db.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
      db.passwordResetToken.deleteMany({
        where: { userId: row.userId, usedAt: { not: null } },
      }),
    ]);

    // Otomatik login (JWT cookie)
    const tokenJwt = await new SignJWT({
      sub: row.user.id,
      email: row.user.email,
      name: row.user.name,
      role: row.user.role,
      profileRole: row.user.profileRole ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set({
      name: "auth",
      value: tokenJwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
