// app/api/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/prisma"; // İstersen kaldır; sadece JWT'den okumak için şart değil

export const dynamic = "force-dynamic";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET eksik veya çok kısa");
  return new TextEncoder().encode(s);
}

export async function GET() {
  try {
    // ← HATA BURADAYDI: cookies() Promise; await et
    const store = cookies();
    const token = (await store).get("auth")?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const { payload } = await jwtVerify(token, getSecret(), { clockTolerance: 5 });

    let id = (payload.sub as string) || null;
    let email = (payload as any)?.email ?? null;
    let name = (payload as any)?.name ?? (payload as any)?.fullName ?? null;
    let role = (payload as any)?.role ?? null;
    let profileRole = (payload as any)?.profileRole ?? null;

    // (Opsiyonel) JWT'de eksikse DB'den tamamla
    if ((!name || !email) && id) {
      const u = await db.user.findUnique({
        where: { id },
        select: { name: true, email: true, role: true, profileRole: true },
      });
      if (u) {
        name = name ?? u.name ?? null;
        email = email ?? u.email ?? null;
        role = role ?? u.role ?? null;
        profileRole = profileRole ?? u.profileRole ?? null;
      }
    }

    const res = NextResponse.json({ ok: true, id, email, name, role, profileRole }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
