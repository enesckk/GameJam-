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
    <div className="flex flex-col items-center rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 text-[8px] sm:text-[10px] md:text-xs font-medium">
      <span className="tabular-nums font-bold text-xs sm:text-sm md:text-base text-white">
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
      {/* Sabit yükseklik YOK; padding ile yükseklik, notch için safe-area */}
      <div className="relative w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl overflow-hidden">
        {/* animasyon katmanı etkileşimi engellemesin */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 motion-safe:animate-pulse" />

        <div className="relative px-2 sm:px-3 md:px-6 pt-[env(safe-area-inset-top)] py-2 sm:py-3 md:py-4">
          {/* Mobilde dikey yığılır, md+ yatay hizalanır */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {/* Sol: Menü + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <button
                className="lg:hidden rounded-xl p-2 sm:p-2.5 hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm"
                onClick={onMenuClick}
                aria-label="Menüyü Aç"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50" />
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Gamepad2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent truncate">
                    Şehitkamil Game Jam
                  </span>
                  <span className="text-[10px] sm:text-xs text-purple-200/80 font-medium truncate">
                    Oyun Geliştirme Yarışması
                  </span>
                </div>
              </div>
            </div>

            {/* Sağ: Sayaç + Kullanıcı + Çıkış */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap md:justify-end">
              {/* Sayaç (mobilde de sığacak şekilde esnek) */}
              {targetDate && (
                <div className="relative group max-w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative flex items-center gap-1.5 sm:gap-2 rounded-2xl px-2 sm:px-4 py-2 sm:py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                      <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>

                    {!isDone ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-purple-200/80 font-medium">Kalan Süre</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                          <TimePill label="Gün" value={days} />
                          <span className="text-purple-200/60 font-bold text-xs sm:text-sm">:</span>
                          <TimePill label="Saat" value={hours} />
                          <span className="text-purple-200/60 font-bold text-xs sm:text-sm">:</span>
                          <TimePill label="Dak" value={minutes} />
                          <span className="text-purple-200/60 font-bold text-xs sm:text-sm">:</span>
                          <TimePill label="Sn" value={seconds} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        <span className="font-bold text-yellow-400 text-xs sm:text-sm">{countdownDoneText}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Kullanıcı */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-white">{initials}</span>
                  </div>
                  <div className="hidden sm:flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {displayName ?? "Katılımcı"}
                    </span>
                    <span className="text-xs text-purple-200/80">Oyuncu</span>
                  </div>
                </div>
              </div>

              {/* Çıkış */}
              <button
                onClick={handleLogout}
                className="group relative inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2.5 font-semibold text-white transition-all duration-200 active:scale-95 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <LogOut className="relative h-3 w-3 sm:h-4 sm:w-4" />
                <span className="relative hidden sm:inline text-xs sm:text-sm">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
