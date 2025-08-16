"use client";

import { useEffect, useState } from "react";
import PanelSidebar from "./_components/panel-sidebar";
import PanelTopbar from "./_components/panel-topbar";
import VideoBG from "@/components/background/video-bg";
import { useDisplayName } from "@/lib/use-user";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { displayName } = useDisplayName();

  // Mobil çekmece açıkken arka plan kaymasın
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  // bfcache veya geri tuşu sonrası yeniden mount olunca ismi cookie'den çek
  useEffect(() => {
    const onShow = () => {
      window.dispatchEvent(new CustomEvent("user:refresh")); // useDisplayName'de bu event'i dinle
    };
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, []);

  return (
    <div className="relative h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <div className="fixed inset-0 -z-10">
        <VideoBG
          overlay
          mode="auto"
          opacity={0.9}
          light={{ webm: "/videos/register-light.webm", mp4: "/videos/bg-light.mp4", poster: "/videos/register-poster-light.jpg" }}
          dark={{ webm: "/videos/register-dark.webm", mp4: "/videos/bg-dark.mp4", poster: "/videos/register-poster-dark.jpg" }}
        />
      </div>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "bg-background/35 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20",
          "lg:static lg:translate-x-0 lg:h-screen lg:overflow-y-auto no-scrollbar lg:overscroll-contain lg:pr-2",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col p-3">
          <PanelSidebar onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      <div className="relative flex min-h-0 flex-col">
        <PanelTopbar onMenuClick={() => setOpen(s => !s)} />

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
