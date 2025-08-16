// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { normalizeDisplayNameTR } from "@/lib/name";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET eksik veya çok kısa");
  return new TextEncoder().encode(s);
}

const ROLES = ["developer", "designer", "audio", "pm"] as const;
type Role = (typeof ROLES)[number];

const SECURE = process.env.NODE_ENV === "production";
const ONE_YEAR = 60 * 60 * 24 * 365;

// Panel yönlendirmeleri
const routeByRole: Record<string, string> = {
  ADMIN: "/admin",
  MENTOR: "/mentor",
  JURY: "/jury",
  PARTICIPANT: "/panel",
};

// API ile Frontend farklı origin ise .env'de FRONTEND_ORIGIN set ederek cross-site cookie moduna geç
const CROSS_SITE = !!process.env.FRONTEND_ORIGIN;
const SAMESITE: "lax" | "none" = CROSS_SITE ? "none" : "lax";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ message: "Geçersiz gövde" }, { status: 400 });

    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    if (!email || !password) {
      return NextResponse.json({ message: "E-posta ve şifre zorunlu" }, { status: 400 });
    }

    // Kullanıcı + takım ilişkisi
    const user = await db.user.findUnique({
      where: { email },
      include: { team: { include: { members: true } } },
    });

    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: "E-posta veya şifre hatalı" }, { status: 401 });
    }

    // canLogin kuralı — ADMIN için bypass
    if (!user.canLogin && user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Hesabın aktif değil. Davet linkini kullanarak şifreni belirlemelisin." },
        { status: 403 }
      );
    }

    const safeName = normalizeDisplayNameTR(user.name ?? "");

    // JWT
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: safeName,
      role: user.role,
      profileRole: user.profileRole ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    // Yönlendirme
    const redirectTo = routeByRole[user.role as keyof typeof routeByRole] ?? "/panel";

    // JSON body — UI bunu localStorage'a yazabilir ya da /api/me çağırabilir
    const payload = {
      ok: true,
      redirectTo,
      user: {
        id: user.id,
        fullName: safeName,
        email: user.email.toLowerCase(),
        phone: user.phone ?? "",
        role: user.role,
        profileRole: (ROLES.includes(user.profileRole as Role) ? user.profileRole : "developer") as Role,
      },
      team:
        user.team
          ? {
              type: "team" as const,
              teamName: user.team?.name || "Takımım",
              memberCount: user.team.members.length, // yalnızca özet
            }
          : { type: "individual" as const },
    };

    // Response
    const res = NextResponse.json(payload, { status: 200 });

    // Eski UI cookie’lerini temizlik
    for (const name of ["profile", "displayName", "team"]) {
      res.cookies.set(name, "", { path: "/", sameSite: "lax", maxAge: 0 });
    }

    // Auth cookies (küçük ve güvenli)
    res.cookies.set({
      name: "auth",
      value: token,
      httpOnly: true,
      secure: SECURE,
      sameSite: SAMESITE,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });
    res.cookies.set({
      name: "uid",
      value: user.id,
      httpOnly: true,
      secure: SECURE,
      sameSite: SAMESITE,
      path: "/",
      maxAge: ONE_YEAR,
    });

    // (Opsiyonel) üst barda ad göstermek istersen küçük ve HttpOnly olmayan cookie
    res.cookies.set("displayName", safeName, {
      path: "/",
      sameSite: SAMESITE,
      secure: SECURE,
      maxAge: ONE_YEAR,
      httpOnly: false,
    });

    return res;
  } catch (e: any) {
    console.error("LOGIN_500", {
      err: e?.message,
      stack: e?.stack,
      hasDbUrl: !!process.env.DATABASE_URL,
      secretLen: process.env.AUTH_SECRET?.length,
    });
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
