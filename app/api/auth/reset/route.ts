// app/api/auth/reset/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT } from "jose";

const SECURE = process.env.NODE_ENV === "production";
const CROSS_SITE = !!process.env.FRONTEND_ORIGIN; // çapraz site kullanımı varsa SameSite=None
const SAMESITE: "lax" | "none" = CROSS_SITE ? "none" : "lax";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
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

    // Token doğrulama
    const tokenHash = sha256(String(token));
    const row = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!row || row.usedAt || row.expiresAt < new Date()) {
      return NextResponse.json({ message: "Token geçersiz veya süresi dolmuş" }, { status: 400 });
    }

    // Şifreyi üret
    const newHash = await bcrypt.hash(String(password), 12);

    // Atomik: şifreyi güncelle + bu tokenı kullanılmış işaretle + diğer aktif tokenları temizle
    await db.$transaction([
      db.user.update({
        where: { id: row.userId },
        data: { passwordHash: newHash, canLogin: true },
      }),
      db.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
      db.passwordResetToken.deleteMany({
        where: {
          userId: row.userId,
          usedAt: null,
          expiresAt: { gt: new Date() },
          NOT: { id: row.id },
        },
      }),
    ]);

    // Yeni session (JWT)
    const jwt = await new SignJWT({
      sub: row.user.id,
      email: row.user.email,
      name: row.user.name,
      role: row.user.role ?? null,
      profileRole: row.user.profileRole ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    const res = NextResponse.json({ ok: true, redirectTo: "/panel" });

    res.cookies.set({
      name: "auth",
      value: jwt,
      httpOnly: true,
      secure: SECURE,
      sameSite: SAMESITE,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });

    return res;
  } catch (e: any) {
    console.error("RESET_500", e?.message || e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
