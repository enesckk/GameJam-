"use client";

import { Menu, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDisplayName } from "@/lib/use-user";

function getInitialsTR(fullName?: string | null) {
  if (!fullName) return "A";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last || "A").toLocaleUpperCase("tr-TR");
}

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { displayName } = useDisplayName();
  const initials = getInitialsTR(displayName);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    try {
      localStorage.removeItem("displayName");
      sessionStorage.removeItem("displayName");
    } catch {}
    window.dispatchEvent(new CustomEvent("user:name", { detail: "" }));
    window.location.replace("/login");
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Arka planı siyah topbar */}
      <div className="relative h-20 md:h-24 bg-black text-white shadow-md">
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
            <div className="flex items-center gap-2 text-xl md:text-2xl font-extrabold tracking-tight">
              <ShieldCheck className="h-6 w-6 opacity-90" />
              <span>Şehitkamil Game Jam</span>
            </div>
          </div>

          {/* Sağ: avatar + İsim + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <span className="text-sm md:text-base font-semibold">{initials}</span>
              </div>
              <span className="text-base md:text-lg font-semibold">
                {displayName ?? "Yönetici"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white transition active:scale-[0.99] bg-white/10 hover:bg-white/20 ring-1 ring-white/30 hover:ring-white/50"
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
