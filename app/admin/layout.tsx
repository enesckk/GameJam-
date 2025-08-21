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
        text-gray-900 dark:text-gray-100
        bg-gradient-to-br 
        from-slate-50 via-white to-slate-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        overflow-hidden
      "
    >
      {/* Modern mesh pattern - tek renkli */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0 opacity-30
          [background:radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]
          motion-safe:animate-[meshPan_20s_ease-in-out_infinite]
        "
      />
      
      {/* Subtle geometric pattern */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0 opacity-20
          [background:linear-gradient(45deg,transparent_40%,rgba(59,130,246,0.03)_50%,transparent_60%)]
          motion-safe:animate-[meshPanAlt_25s_ease-in-out_infinite]
        "
      />

      {/* Sidebar (mobil çekmece + masaüstü sabit) */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-white/90 backdrop-blur-xl border-r border-slate-200/50",
          "dark:bg-slate-900/90 dark:border-slate-700/50",
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
