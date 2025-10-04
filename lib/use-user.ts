// lib/use-user.ts
"use client";
import { useEffect, useState } from "react";

function getCookieMap() {
  return document.cookie.split(";").reduce((acc, part) => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return acc;
    const raw = rest.join("=") || "";
    try { acc[k] = decodeURIComponent(raw); } catch { acc[k] = raw; }
    return acc;
  }, {} as Record<string, string>);
}

function readDisplayNameFromCookies() {
  const cookies = getCookieMap();
  if (cookies.displayName) return cookies.displayName;
  if (cookies.profile) {
    try {
      const p = JSON.parse(cookies.profile);
      if (p?.fullName) return p.fullName;
    } catch {}
  }
  return null;
}

export function useDisplayName() {
  const [name, setName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const setEverywhere = (val: string | null) => {
    setName(val);
    try {
      if (val) {
        localStorage.setItem("displayName", val);
        sessionStorage.setItem("displayName", val);
        document.cookie = `displayName=${encodeURIComponent(val)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      } else {
        localStorage.removeItem("displayName");
        sessionStorage.removeItem("displayName");
        document.cookie = "displayName=; Path=/; Max-Age=0; SameSite=Lax";
      }
    } catch {}
  };

  const refreshFromCookiesOrStorage = () => {
    const latest =
      readDisplayNameFromCookies() ||
      sessionStorage.getItem("displayName") ||
      localStorage.getItem("displayName") ||
      null;
    if (latest !== name) setEverywhere(latest);
    return latest;
  };

  const fetchFromMe = async () => {
    try {
      const r = await fetch("/api/me", { credentials: "include", cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json().catch(() => null);
      const serverName = j?.ok ? j?.name || null : null;
      if (serverName && serverName !== name) {
        setEverywhere(serverName);
      }
    } catch {}
  };

  useEffect(() => {
    setMounted(true);

    // 1) Hemen cookie/storage göster
    refreshFromCookiesOrStorage();

    // 2) Her zaman sunucudan doğrula (JWT → gerçek isim)
    fetchFromMe();

    // 3) Login/profil olayında anında güncelle
    const onUserName = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setEverywhere(detail || null);
    };

    // 4) Focus & bfcache dönüşünde HER SEFERİNDE /api/me ile sync et
    const onFocus = () => fetchFromMe();
    const onPageShow = (e: Event) => {
      if ((e as PageTransitionEvent).persisted) fetchFromMe();
    };

    window.addEventListener("user:name", onUserName as EventListener);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("user:name", onUserName as EventListener);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayName: mounted ? name : null };
}

// Server-side session function
export async function getSession(req: Request) {
  try {
    // JWT token'ı cookie'den al
    const cookies = req.headers.get('cookie') || '';
    const authMatch = cookies.match(/auth=([^;]+)/);
    
    if (!authMatch) {
      return { ok: false, user: null };
    }

    const token = authMatch[1];
    
    // JWT'yi decode et (Node.js uyumlu)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    // User bilgilerini database'den al
    const { db } = await import('./prisma');
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return { ok: false, user: null };
    }

    return { ok: true, user };
  } catch (error) {
    console.error('Session error:', error);
    return { ok: false, user: null };
  }
}