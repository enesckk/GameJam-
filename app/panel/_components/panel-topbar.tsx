// app/panel/_components/panel-topbar.tsx
"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { useDisplayName } from "@/lib/use-user";

function getInitialsTR(fullName?: string | null) {
  if (!fullName) return "K";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last || "K").toLocaleUpperCase("tr-TR");
}

export default function PanelTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { displayName } = useDisplayName();
  const initials = getInitialsTR(displayName);

  const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {}

  // Local & session storage temizliği
  try {
    localStorage.removeItem("displayName");
    sessionStorage.removeItem("displayName");
  } catch {}

  // UI senkron (kullanıcı adını sıfırla)
  window.dispatchEvent(new CustomEvent("user:name", { detail: "" }));

  // Login’e yönlendir
  window.location.replace("/login");
};


  return (
    <div className="sticky top-0 z-40">
      {/* Kenarlıksız, geniş, gradient hero bar */}
      <div className="relative h-24 md:h-28 hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none"></div>

        <div className="relative flex h-full items-center justify-between px-4 md:px-6">
          {/* Sol: hamburger (mobil) + marka */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-lg p-2 hover:bg-white/10 active:scale-[0.98] transition"
              onClick={onMenuClick}
              aria-label="Menüyü aç/kapat"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-xl md:text-2xl font-extrabold tracking-tight drop-shadow">
              Şehitkamil Game Jam
            </div>
          </div>

          {/* Sağ: avatar + İsim Soyisim + Tema + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Avatar + Ad Soyad */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <span className="text-sm md:text-base font-semibold">{initials}</span>
              </div>
              <span className="text-base md:text-lg font-semibold drop-shadow-sm">
                {displayName ?? ""}
              </span>
            </div>

            {/* Tema */}
            <ThemeToggle />

            {/* Çıkış — renk efektli */}
            <button
              onClick={handleLogout}
              className={[
                "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold",
                "text-white/95 transition active:scale-[0.99]",
                "bg-white/10 hover:bg-white/15 ring-1 ring-white/20 hover:ring-white/40",
                "hover:shadow-[0_0_18px_rgba(236,72,153,.30),0_0_22px_rgba(6,182,212,.30)]",
              ].join(" ")}
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış Yap</span>
              <span
                className="pointer-events-none absolute -bottom-px left-1/2 h-[2px] w-1/2 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(236,72,153,1), rgba(139,92,246,1), rgba(6,182,212,1))",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
