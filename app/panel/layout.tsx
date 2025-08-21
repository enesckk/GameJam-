"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PanelSidebar from "./_components/panel-sidebar";
import PanelTopbar from "./_components/panel-topbar";
import { useDisplayName } from "@/lib/use-user";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { displayName } = useDisplayName();
  const pathname = usePathname();

  // Drawer açıkken sadece body'yi kilitle
  useEffect(() => {
    const el = document.body;
    const prev = el.style.overflow;
    el.style.overflow = open ? "hidden" : prev || "";
    return () => { el.style.overflow = prev; };
  }, [open]);

  // route değişince olası global overflow’ları sıfırla
  useEffect(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }, [pathname]);

  // bfcache/focus sonrası kullanıcı bilgisini tazele
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
        lg:fixed lg:inset-0          /* mobilde fixed değil -> body scroll (PTR) */
        min-h-dvh                    /* mobilde tam ekran minimum yükseklik */
        isolate lg:grid lg:grid-cols-[16rem_1fr]
        text-white dark:text-white
        bg-gradient-to-b from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
        lg:overflow-hidden           /* overflow-hidden sadece lg+ */
      "
    >
      {/* Katman A: büyük mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 inset-[-20%] opacity-80
                   [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
                   motion-safe:animate-[meshPan_18s_ease-in-out_infinite]"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman B: küçük mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 inset-[-30%] opacity-70
                   [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
                   motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman C: conic swirl */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 -inset-[25%] opacity-60
                   [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
                   motion-safe:animate-[swirl_22s_linear_infinite] rounded-[9999px] blur-3xl"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Sidebar (tek scroller; scrollbar gizli) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
          "border-r border-slate-200/60 dark:border-slate-700/60",
          "overflow-y-auto overscroll-contain",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", // sadece sidebar'da gizle
          "touch-pan-y [touch-action:pan-y] [-webkit-overflow-scrolling:touch]",
          "lg:static lg:translate-x-0 lg:h-full",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col">
          <PanelSidebar onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      {/* Sağ sütun = TOPBAR + CONTENT */}
      {/* Mobilde body scroller: overflow vermiyoruz.
          Masaüstünde (lg+) iç scroller: overflow-y-auto + overscroll-contain */}
      <div
        className="
          relative z-10 flex min-h-0 flex-col lg:col-start-2
          overflow-visible lg:overflow-y-auto lg:overscroll-contain
          min-h-[calc(100svh+1px)] lg:min-h-0
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {/* Topbar (sticky; mobilde body'e, lg'de sağ sütun scroller'ına göre yapışır) */}
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
