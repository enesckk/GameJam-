"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useDisplayName } from "@/lib/use-user";

// Ağır olmayan bileşenleri böl: ilk boyama hafifler
const AdminSidebar = dynamic(() => import("./_components/admin-sidebar"), {
  ssr: false,
});
const AdminTopbar = dynamic(() => import("./_components/admin-topbar"), {
  ssr: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { displayName } = useDisplayName();

  // Query veya env ile "lite" moda geç
  const perfLite = useMemo(() => {
    if (typeof window === "undefined") return !!process.env.NEXT_PUBLIC_PERF_LITE;
    const sp = new URLSearchParams(window.location.search);
    return sp.get("lite") === "1" || !!process.env.NEXT_PUBLIC_PERF_LITE;
  }, []);

  // Drawer açıkken scroll kilidi
  useEffect(() => {
    const el = document.documentElement;
    if (open) {
      el.style.overflow = "hidden";
      // arka planı tamamen pasifleştir
      (document.getElementById("admin-main") as HTMLElement | null)?.setAttribute("inert", "");
    } else {
      el.style.overflow = "";
      (document.getElementById("admin-main") as HTMLElement | null)?.removeAttribute("inert");
    }
    return () => {
      el.style.overflow = "";
      (document.getElementById("admin-main") as HTMLElement | null)?.removeAttribute("inert");
    };
  }, [open]);

  // bfcache/geri dönüş senkronu
  useEffect(() => {
    const onShow = () => window.dispatchEvent(new CustomEvent("user:refresh"));
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, []);

  return (
    <div
      className="
        relative isolate
        min-h-dvh lg:h-dvh
        lg:grid lg:grid-cols-[16rem_1fr]
        text-white
        bg-gradient-to-b from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
        overflow-x-hidden [overflow-x:clip] lg:overflow-hidden
      "
      // layout seviyesinde boyama sınırla
      style={{ contain: "paint layout style", willChange: "transform" }}
    >
      {/* === Arkaplan efektleri - sadece lg ve perfLite=false olduğunda === */}
      {!perfLite && (
        <>
          <div
            aria-hidden
            className="
              pointer-events-none absolute -z-10 inset-[-20%] opacity-80 hidden lg:block
              [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
              motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
            "
            style={{ mixBlendMode: "screen" }}
          />
          <div
            aria-hidden
            className="
              pointer-events-none absolute -z-10 inset-[-30%] opacity-70 hidden lg:block
              [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
              motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
            "
            style={{ mixBlendMode: "screen" }}
          />
          <div
            aria-hidden
            className="
              pointer-events-none absolute -z-10 -inset-[25%] opacity-60 hidden lg:block
              [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
              motion-safe:animate-[swirl_22s_linear_infinite]
              rounded-[9999px] blur-3xl
            "
            style={{ mixBlendMode: "screen" }}
          />
        </>
      )}

      {/* Sidebar (çekmece) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform touch-pan-y",
          open ? "translate-x-0" : "-translate-x-full",
          // ağır blur'u destek yoksa otomatik sadeleştir
          "bg-background/70 supports-[backdrop-filter]:bg-background/30",
          "supports-[backdrop-filter]:backdrop-blur-xl",
          "lg:static lg:translate-x-0 lg:h-full lg:overflow-y-auto no-scrollbar lg:overscroll-contain",
        ].join(" ")}
        // boyamayı bölümle
        style={{ contain: "paint layout", willChange: "transform" }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* İçerik sütunu */}
      <div className="relative z-10 flex min-h-0 flex-col" style={{ contain: "paint layout" }}>
        <AdminTopbar onMenuClick={() => setOpen((s) => !s)} />

        {/* Mobilde sidebar açıkken karartma */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}

        {/* Ana içerik */}
        <main
          id="admin-main"
          className="
            min-h-0 flex-1
            lg:overflow-y-auto overscroll-contain
            p-4 pb-[env(safe-area-inset-bottom)]
          "
          // içerik görünür oldukça render et (Chrome/Edge/Opera/Firefox yeni)
          style={{
            WebkitOverflowScrolling: "touch",
            contentVisibility: "auto",
            containIntrinsicSize: "1px 1000px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
