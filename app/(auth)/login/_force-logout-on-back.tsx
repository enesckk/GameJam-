// app/(auth)/login/_force-logout-on-back.tsx
"use client";

import { useEffect, useRef } from "react";

function hasAuthCookie() {
  return document.cookie.split(";").some(c => c.trim().startsWith("auth="));
}

function clearUiCookiesAndStorage() {
  try {
    // Aynı isimli çerezler farklı path'lerde kalmış olabilir -> hepsini sil
    const paths = ["/", "/panel", "/(auth)", "/panel/profil"];
    for (const p of paths) {
      document.cookie = `displayName=; Path=${p}; Max-Age=0; SameSite=Lax`;
      document.cookie = `profile=; Path=${p}; Max-Age=0; SameSite=Lax`;
    }
    localStorage.removeItem("displayName");
    sessionStorage.removeItem("displayName");
  } catch {}
}

async function doServerLogout() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {}
}

export default function ForceLogoutOnBack() {
  const busy = useRef(false);

  const doLogout = async () => {
    if (busy.current) return;
    busy.current = true;
    await doServerLogout();
    clearUiCookiesAndStorage();
    // bfcache etkisini kırmak için hard navigation
    window.location.replace("/login");
  };

  useEffect(() => {
    // bfcache'ten geri dönüşte
    const onPageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted && hasAuthCookie()) doLogout();
    };
    window.addEventListener("pageshow", onPageShow as any);

    // back/forward navigasyon tespiti
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "back_forward" && hasAuthCookie()) doLogout();
    } catch {}

    // login'e auth ile gelindiyse her durumda logout
    if (hasAuthCookie()) doLogout();

    return () => window.removeEventListener("pageshow", onPageShow as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
