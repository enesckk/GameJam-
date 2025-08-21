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
      {/* Gradient arka planlı topbar */}
      <div className="relative h-20 md:h-24 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        <div className="relative flex h-full items-center justify-between px-4 md:px-6">
          {/* Sol: hamburger (mobil) + marka */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-xl p-2.5 hover:bg-white/10 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
              onClick={onMenuClick}
              aria-label="Menüyü aç/kapat"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 text-xl md:text-2xl font-extrabold tracking-tight">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Şehitkamil Game Jam
              </div>
            </div>
          </div>

          {/* Sağ: avatar + İsim + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Avatar with gradient border */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 shadow-lg">
                  <span className="text-sm md:text-base font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {initials}
                  </span>
                </div>
              </div>
              
              {/* User name with gradient */}
              <div className="hidden sm:block">
                <span className="text-base md:text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  {displayName ?? "Yönetici"}
                </span>
                <div className="text-xs text-gray-300 font-medium">
                  Admin Panel
                </div>
              </div>
            </div>

            {/* Logout button with enhanced styling */}
            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-lg blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <LogOut className="h-4 w-4 relative z-10" />
              </div>
              <span className="relative z-10">Çıkış Yap</span>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </div>
        </div>
        
        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
}