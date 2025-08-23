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
        relative isolate
        min-h-dvh lg:h-dvh
        lg:grid lg:grid-cols-[16rem_1fr]
        text-white dark:text-white
        bg-gradient-to-b 
        from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
        overflow-x-hidden [overflow-x:clip] lg:overflow-hidden
      "
    >
      {/* Basitleştirilmiş arka plan - sadece statik gradient */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5
        "
      />

      {/* Sidebar (mobil çekmece + masaüstü sabit) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 will-change-transform touch-pan-y",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
          "lg:static lg:translate-x-0 lg:h-full lg:overflow-y-auto no-scrollbar lg:overscroll-contain",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col">
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

        {/* Mobilde sayfa (body) kayar; lg'de main kayar */}
        <main
          className="
            min-h-0 flex-1
            lg:overflow-y-auto overscroll-contain
            p-4
            pb-[env(safe-area-inset-bottom)]
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
