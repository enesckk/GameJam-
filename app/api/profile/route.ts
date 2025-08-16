// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { normalizeDisplayNameTR } from "@/lib/name";

type UiRole = "developer" | "designer" | "audio" | "pm";

type ProfileIn = {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: UiRole;
  newPassword?: string;
};

const PROFILE_COOKIE = "profile";
const DISPLAYNAME_COOKIE = "displayName";
const AUTH_COOKIE = "auth";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET eksik veya çok kısa");
  return new TextEncoder().encode(s);
}

// JSON güvenli parse
function safeParse<T = any>(v?: string): Partial<T> {
  if (!v) return {};
  try { return JSON.parse(v) as Partial<T>; } catch {}
  return {};
}

// UI cookie’lerini YASSIZ (no-encode) yaz
function writeUiCookies(
  res: NextResponse,
  d: { fullName: string; email: string; phone: string; role: UiRole }
) {
  // Profile: düz JSON string
  res.cookies.set(PROFILE_COOKIE, JSON.stringify(d), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Görünen ad: düz Unicode string
  res.cookies.set(DISPLAYNAME_COOKIE, d.fullName, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function GET(req: NextRequest) {
  const raw = req.cookies.get(PROFILE_COOKIE)?.value;
  const displayNameRaw = req.cookies.get(DISPLAYNAME_COOKIE)?.value;

  const data = safeParse<{ fullName?: string; email?: string; phone?: string; role?: UiRole }>(raw);

  return NextResponse.json(
    {
      fullName: (data.fullName ?? displayNameRaw ?? "").trim(),
      email: (data.email ?? "").trim(),
      phone: (data.phone ?? "").trim(),
      role: (data.role ?? "developer") || "developer",
    },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  // ---- body & validation
  let body: ProfileIn;
  try { body = await req.json(); }
  catch { return NextResponse.json({ message: "Geçersiz JSON" }, { status: 400 }); }

  const safeName = normalizeDisplayNameTR(body.fullName ?? "");
  const email    = (body.email ?? "").trim().toLowerCase();
  const phone    = (body.phone ?? "").replace(/\s/g, "");
  const role     = (body.role ?? "developer") as UiRole;
  const newPass  = body.newPassword?.trim();

  if (safeName.length < 3) return NextResponse.json({ message: "Ad Soyad en az 3 karakter" }, { status: 400 });
  if (!emailRe.test(email)) return NextResponse.json({ message: "Geçerli e-posta girin" }, { status: 400 });
  if (!phoneRe.test(phone)) return NextResponse.json({ message: "Geçerli telefon girin" }, { status: 400 });
  if (newPass && newPass.length < 6) return NextResponse.json({ message: "Şifre en az 6 karakter" }, { status: 400 });

  // ---- kullanıcıyı tespit: auth JWT -> (fallback) profile cookie/email
  const authToken = req.cookies.get(AUTH_COOKIE)?.value;
  let userId: string | null = null;

  if (authToken) {
    try {
      const { payload } = await jwtVerify(authToken, getSecret());
      userId = (payload.sub as string) || null;
    } catch {}
  }

  let current = null;
  if (userId) {
    current = await db.user.findUnique({ where: { id: userId } });
  }

  if (!current) {
    const cookieProf = safeParse<{ email?: string }>(req.cookies.get(PROFILE_COOKIE)?.value);
    const cookieEmail = (cookieProf.email ?? "").trim().toLowerCase();
    if (cookieEmail) {
      current = await db.user.findUnique({ where: { email: cookieEmail } });
    }
  }

  if (!current && email) {
    current = await db.user.findUnique({ where: { email } });
  }

  if (!current) {
    return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // ---- e-posta değişiyorsa uniqueness kontrolü
  if (email !== (current.email ?? "").toLowerCase()) {
    const exists = await db.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ message: "Bu e-posta başka bir hesapta kayıtlı." }, { status: 409 });
  }

  // ---- update payload
  const data: any = {
    name: safeName,
    email,
    phone,
    profileRole: role,
  };
  if (newPass) {
    const hash = await bcrypt.hash(newPass, 10);
    data.passwordHash = hash;
  }

  // ---- DB güncelle
  await db.user.update({ where: { id: current.id }, data });

  // ---- güncel kullanıcıyı oku
  const updated = await db.user.findUnique({
    where: { id: current.id },
    select: { id: true, name: true, email: true, phone: true, profileRole: true, role: true },
  });
  if (!updated) return NextResponse.json({ message: "Profil güncellenemedi." }, { status: 500 });

  // ---- UI cookie'lerini düz yaz
  const res = NextResponse.json({ ok: true }, { status: 200 });
  writeUiCookies(res, {
    fullName: updated.name ?? "",
    email: updated.email,
    phone: updated.phone,
    role: (updated.profileRole as UiRole) ?? "developer",
  });

  // ---- AUTH JWT'yi yenile (normalize edilmiş isim ile)
  try {
    const newToken = await new SignJWT({
      sub: updated.id,
      email: updated.email,
      name: updated.name, // normalized
      role: updated.role,
      profileRole: updated.profileRole ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    res.cookies.set({
      name: AUTH_COOKIE,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (e) {
    console.error("auth token refresh failed:", e);
  }

  // ---- RSC/SSR invalidate (anasayfa & panel)
  try {
    revalidatePath("/");
    revalidatePath("/panel");
  } catch {}

  return res;
}
