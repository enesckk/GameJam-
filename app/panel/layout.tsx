"use client";

import { useEffect, useState } from "react";
import PanelSidebar from "./_components/panel-sidebar";
import PanelTopbar from "./_components/panel-topbar";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Mobil çekmece açıkken arka plan kaymasın
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className="
        relative isolate
        min-h-dvh lg:h-dvh
        lg:grid lg:grid-cols-[16rem_1fr]
        text-white
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900
        overflow-x-hidden [overflow-x:clip] lg:overflow-hidden
      "
    >
      {/* Basitleştirilmiş arka plan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5
        "
      />

      {/* Sidebar (tek scroll noktası: aside) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
          "border-r border-slate-700/60",
          "overflow-y-auto overscroll-contain",
          // ↓↓↓ yalnızca sidebar'da scrollbar'ı gizle
          "[-ms-overflow-style:none]",     // IE/Edge
          "[scrollbar-width:none]",        // Firefox
          "[&::-webkit-scrollbar]:hidden", // WebKit (Chrome/Safari)
          "lg:static lg:translate-x-0 lg:h-full",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col">
          <PanelSidebar onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* Sağ sütun = TOPBAR + CONTENT (tek scroll container) */}
      <div className="relative z-10 flex min-h-0 flex-col lg:col-start-2
                 overflow-y-auto overscroll-contain
                 h-dvh lg:h-auto
                 touch-pan-y [touch-action:pan-y] [-webkit-overflow-scrolling:touch]">
        {/* Topbar (sticky, aynı scroller içinde olduğu için tekerlek her yerde çalışır) */}
        <div className="sticky top-0 z-20">
          <PanelTopbar
            onMenuClick={() => setOpen((s) => !s)}
            countdownTargetISO="2025-09-20T10:00:00+03:00"
            countdownDoneText="Başladı!"
          />
        </div>

        {/* Mobilde sidebar overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* İçerik */}
        <main className="min-h-0 flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
