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
      {/* Basitleştirilmiş topbar */}
      <div className="relative h-20 md:h-24 bg-slate-900 text-white shadow-lg">
        <div className="relative flex h-full items-center justify-between px-4 md:px-6">
          {/* Sol: hamburger (mobil) + marka */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-xl p-2.5 hover:bg-white/10 active:scale-[0.98] transition-colors duration-200 border border-white/10 hover:border-white/20"
              onClick={onMenuClick}
              aria-label="Menüyü aç/kapat"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 text-xl md:text-2xl font-extrabold tracking-tight">
              <div className="bg-indigo-500 p-2 rounded-xl shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-white">
                Şehitkamil Game Jam
              </div>
            </div>
          </div>

          {/* Sağ: avatar + İsim + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Avatar */}
              <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-slate-800 ring-2 ring-white/20 shadow-sm">
                <span className="text-sm md:text-base font-bold text-white">
                  {initials}
                </span>
              </div>
              
              {/* User name */}
              <div className="hidden sm:block">
                <span className="text-base md:text-lg font-semibold text-white">
                  {displayName ?? "Yönetici"}
                </span>
                <div className="text-xs text-gray-300 font-medium">
                  Admin Panel
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-semibold text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>
    </div>
  );
}