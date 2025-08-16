// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const shouldRedirect = url.searchParams.get("redirect") === "1";

  const res = shouldRedirect
    ? NextResponse.redirect(new URL("/login", req.url))
    : NextResponse.json({ ok: true });

  // Tüm olası path'lerde temizle (geçmiş denemelerden kalmış olabilir)
  const paths = ["/", "/panel", "/(auth)", "/panel/profil"];

  // HttpOnly olanlar
  for (const name of ["auth", "uid", "auth-token"]) {
    for (const path of paths) {
      res.cookies.set(name, "", {
        path,
        maxAge: 0,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
  }

  // UI çerezleri (HttpOnly değil)
  for (const name of ["profile", "displayName"]) {
    for (const path of paths) {
      res.cookies.set(name, "", { path, maxAge: 0, sameSite: "lax" });
    }
  }

  // Geri tuşu / bfcache etkisini azalt
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}
