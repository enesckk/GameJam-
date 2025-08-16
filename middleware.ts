// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

type RolePayload = JWTPayload & { sub?: string; role?: "ADMIN" | "MENTOR" | "JURY" | "PARTICIPANT" };

const PROTECTED_PREFIXES = ["/panel", "/admin"]; // panel + admin koruması

const BYPASS_PREFIXES = [
  "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml",
  "/images", "/videos", "/fonts", "/public",
  "/api/auth", // auth uçlarını serbest bırak
];

async function verifyJWT(token: string) {
  try {
    const secretStr = process.env.AUTH_SECRET;
    if (!secretStr || secretStr.length < 16) return null;
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 5 });
    return payload as RolePayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Bypass edilen yollar
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Korunmayan sayfalar
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // JWT oku
  const token = req.cookies.get("auth")?.value ?? null;
  const payload = token ? await verifyJWT(token) : null;
  const isAuthed = Boolean(payload?.sub);

  // Yetkisiz -> login'e gönder (redirectTo ile)
  if (!isAuthed) {
    const url = new URL("/login", origin);
    url.searchParams.set("redirectTo", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // /admin için role kontrolü
  if (pathname.startsWith("/admin")) {
    const role = payload?.role;
    if (role !== "ADMIN") {
      const url = new URL("/login", origin);
      url.searchParams.set("redirectTo", pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // Panel/admin sayfalarında cache kapat
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

// Sadece panel ve admin’i eşle
export const config = {
  matcher: ["/panel/:path*", "/admin/:path*"],
};
