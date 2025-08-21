"use client";

import { Menu, LogOut, CalendarClock, Gamepad2, Trophy } from "lucide-react";
import { useDisplayName } from "@/lib/use-user";
import { useMemo, useState, useEffect } from "react";

function getInitialsTR(fullName?: string | null) {
  if (!fullName) return "K";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last || "K").toLocaleUpperCase("tr-TR");
}

function useCountdown(target?: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const diff = target ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    isDone: diff === 0,
  };
}

function TimePill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center rounded-lg px-2 py-1.5 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 text-[10px] md:text-xs font-medium">
      <span className="tabular-nums font-bold text-sm md:text-base text-white">
        {typeof value === "number" ? value.toString().padStart(2, "0") : value}
      </span>
      <span className="text-white/80">{label}</span>
    </div>
  );
}

export default function PanelTopbar({
  onMenuClick,
  countdownTargetISO,
  countdownDoneText = "Başladı!",
}: {
  onMenuClick: () => void;
  countdownTargetISO?: string;
  countdownDoneText?: string;
}) {
  const { displayName } = useDisplayName();
  const initials = getInitialsTR(displayName);

  const targetDate = useMemo(
    () => (countdownTargetISO ? new Date(countdownTargetISO) : undefined),
    [countdownTargetISO]
  );
  const { days, hours, minutes, seconds, isDone } = useCountdown(targetDate);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("displayName");
    sessionStorage.removeItem("displayName");
    window.location.replace("/login");
  };

  return (
    <div className="relative z-10">
      {/* Gradient arka plan */}
      <div className="relative h-20 md:h-28 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl">
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        
        <div className="relative flex h-full items-center justify-between px-3 sm:px-6">
          {/* Sol taraf - Logo ve Marka */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="lg:hidden rounded-xl p-2.5 hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Şehitkamil Game Jam
                </span>
                <span className="text-xs text-purple-200/80 font-medium">
                  Oyun Geliştirme Yarışması
                </span>
              </div>
            </div>
          </div>

          {/* Sağ taraf - Sayaç ve Kullanıcı */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
            {/* Sayaç */}
            {targetDate && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <CalendarClock className="h-4 w-4 text-white" />
                  </div>
                  
                  {!isDone ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-purple-200/80 font-medium">Kalan Süre</span>
                      <div className="flex items-center gap-1.5">
                        <TimePill label="Gün" value={days} />
                        <span className="text-purple-200/60 font-bold">:</span>
                        <TimePill label="Saat" value={hours} />
                        <span className="text-purple-200/60 font-bold">:</span>
                        <TimePill label="Dak" value={minutes} />
                        <span className="text-purple-200/60 font-bold">:</span>
                        <TimePill label="Sn" value={seconds} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="font-bold text-yellow-400">{countdownDoneText}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kullanıcı Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {displayName ?? "Katılımcı"}
                  </span>
                  <span className="text-xs text-purple-200/80">Oyuncu</span>
                </div>
              </div>
            </div>

            {/* Çıkış Butonu */}
            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition-all duration-200 active:scale-95 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <LogOut className="relative h-4 w-4" />
              <span className="relative hidden sm:inline">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}