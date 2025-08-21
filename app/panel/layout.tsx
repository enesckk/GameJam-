"use client";

import { useEffect, useState } from "react";
import PanelSidebar from "./_components/panel-sidebar";
import PanelTopbar from "./_components/panel-topbar";
import { useDisplayName } from "@/lib/use-user";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { displayName } = useDisplayName();

  // Mobil çekmece açıkken arka plan kaymasın
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // bfcache veya geri tuşu sonrası yeniden mount olunca ismi cookie'den çek
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
      {/* Background layers */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
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
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:relative lg:translate-x-0 lg:flex lg:flex-col",
          "bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60",
        ].join(" ")}
      >
        <PanelSidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* Ana içerik alanı */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PanelTopbar
          onMenuClick={() => setOpen(true)}
          countdownTargetISO="2025-09-20T10:00:00+03:00"
          countdownDoneText="Başladı!"
        />
        
        {/* Mobilde sidebar overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* İçerik */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}