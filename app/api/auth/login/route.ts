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

function invCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Panel yönlendirmeleri (gerekirse genişlet)
const routeByRole: Record<string, string> = {
  ADMIN: "/admin",
  MENTOR: "/mentor",
  JURY: "/jury",
  PARTICIPANT: "/panel",
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "Geçersiz gövde" }, { status: 400 });
    }

    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ message: "E-posta ve şifre zorunlu" }, { status: 400 });
    }

    // TAKIM + ÜYELERİYLE OKU
    const user = await db.user.findUnique({
      where: { email },
      include: { team: { include: { members: true } } },
    });

    // Kullanıcı/şifre doğrulaması
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: "E-posta veya şifre hatalı" }, { status: 401 });
    }

    // Başvuru durumunu kontrol et
    const application = await db.application.findUnique({
      where: { email },
    });

    if (!application) {
      return NextResponse.json({ message: "Başvuru bulunamadı" }, { status: 403 });
    }

    if (application.status === "pending") {
      return NextResponse.json({ 
        message: "Başvurunuz henüz değerlendirilmedi. Lütfen onay bekleyin." 
      }, { status: 403 });
    }

    if (application.status === "rejected") {
      return NextResponse.json({ 
        message: "Başvurunuz reddedilmiştir." 
      }, { status: 403 });
    }

    if (application.status !== "approved") {
      return NextResponse.json({ 
        message: "Başvurunuz onaylanmamıştır." 
      }, { status: 403 });
    }

   // canLogin kuralı — ADMIN için bypass
if (!user.canLogin && user.role !== "ADMIN") {
  return NextResponse.json(
    { message: "Hesabın aktif değil. Davet linkini kullanarak şifreni belirlemelisin." },
    { status: 403 }
  );
}

    
    const safeName = normalizeDisplayNameTR(user.name ?? "");

    // JWT üret
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

    // Yönlendirme hedefi (role -> route)
    const defaultRedirect =
      routeByRole[user.role as keyof typeof routeByRole] ?? "/panel";

    // Response (JSON + cookies)
    const res = NextResponse.json(
      { ok: true, role: user.role, redirectTo: defaultRedirect },
      { status: 200 }
    );

    // Eski UI cookie’lerini temizle
    for (const name of ["profile", "displayName", "team"]) {
      res.cookies.set(name, "", { path: "/", sameSite: "lax", maxAge: 0 });
    }

    // AUTH cookies (HttpOnly)
    res.cookies.set({
      name: "auth",
      value: token,
      httpOnly: true,
      secure: SECURE,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });
    res.cookies.set({
      name: "uid",
      value: user.id,
      httpOnly: true,
      secure: SECURE,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
    });

    // PROFILE cookie (UI’nin okuduğu)
    res.cookies.set(
      "profile",
      JSON.stringify({
        fullName: safeName,
        email: user.email.toLowerCase(),
        phone: user.phone ?? "",
        role: (ROLES.includes(user.profileRole as Role)
          ? user.profileRole
          : "developer") as Role,
      }),
      { path: "/", sameSite: "lax", maxAge: ONE_YEAR }
    );

    // TEAM cookie snapshot
    const teamMembers = user.team
      ? user.team.members.map((m) => ({
          id: m.id,
          name: m.name ?? "",
          email: (m.email ?? "").toLowerCase(),
          phone: m.phone ?? "",
          age: Number.isFinite(m.age as any) ? Number(m.age) : 18,
          role: (ROLES.includes(m.profileRole as Role)
            ? (m.profileRole as Role)
            : "developer") as Role,
          status: m.canLogin ? "active" : "admin_added",
          isLeader: m.id === user.id, // giriş yapan lider
        }))
      : [
          {
            id: user.id,
            name: safeName,
            email: user.email.toLowerCase(),
            phone: user.phone ?? "",
            age: Number.isFinite(user.age as any) ? Number(user.age) : 18,
            role: (ROLES.includes(user.profileRole as Role)
              ? (user.profileRole as Role)
              : "developer") as Role,
            status: "active" as const,
            isLeader: true,
          },
        ];

    // garanti: en az bir isLeader olsun
    if (!teamMembers.some((x) => x.isLeader)) {
      const meIdx = teamMembers.findIndex(
        (x) => x.email === user.email.toLowerCase()
      );
      if (meIdx >= 0) {
        teamMembers[meIdx].isLeader = true;
        teamMembers[meIdx].status = "active";
      }
    }

    res.cookies.set(
      "team",
      JSON.stringify({
        type: "team",
        teamName: user.team?.name || "Takımım",
        inviteCode: invCode(),
        members: teamMembers,
      }),
      { path: "/", sameSite: "lax", maxAge: ONE_YEAR }
    );

    // Üst bardaki isim (HttpOnly değil)
    res.cookies.set("displayName", safeName, {
      path: "/",
      sameSite: "lax",
      maxAge: ONE_YEAR,
      httpOnly: false,
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
