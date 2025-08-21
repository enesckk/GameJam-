// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import AdminTopbar from "./_components/admin-topbar";
import { useDisplayName } from "@/lib/use-user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { displayName } = useDisplayName();

  // Mobil çekmece açıkken arka plan kaymasın
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // bfcache / geri tuşu sonrası yeniden mount olunca isim senkronu
  useEffect(() => {
    const onShow = () => {
      window.dispatchEvent(new CustomEvent("user:refresh"));
    };
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
        relative isolate h-screen lg:grid lg:grid-cols-[16rem_1fr]
        text-white dark:text-white
        bg-gradient-to-b 
        from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
        overflow-hidden
      "
    >
      {/* Katman A: büyük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman B: küçük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman C: conic swirl */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 -inset-[25%] opacity-60
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
          motion-safe:animate-[swirl_22s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
      />

      {/* Sidebar (mobil çekmece + masaüstü sabit) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-background/35 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20",
          "lg:static lg:translate-x-0 lg:h-screen lg:overflow-y-auto no-scrollbar lg:overscroll-contain lg:pr-2",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col p-3">
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* İçerik sütunu */}
      <div className="relative z-10 flex min-h-0 flex-col">
        <AdminTopbar onMenuClick={() => setOpen((s) => !s)} />

        {/* Mobilde sidebar açıkken karartma */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
