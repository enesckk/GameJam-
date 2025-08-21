// app/panel/_components/panel-topbar.tsx
"use client";

import { Menu, LogOut, CalendarClock } from "lucide-react";
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
    <div className="flex flex-col items-center rounded-md px-2 py-1 bg-white/10 text-[10px] md:text-xs">
      <span className="tabular-nums font-bold text-sm md:text-base">
        {typeof value === "number" ? value.toString().padStart(2, "0") : value}
      </span>
      {label}
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
    <div className="sticky top-0 z-40">
      {/* Siyah topbar */}
      <div className="relative h-20 md:h-28 bg-black text-white shadow-md">
        <div className="relative flex h-full items-center justify-between px-3 sm:px-6">
          {/* Sol taraf */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="lg:hidden rounded-lg p-2 hover:bg-white/10 transition"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Şehitkamil Game Jam
            </span>
          </div>

          {/* Sağ taraf */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Sayaç */}
            {targetDate && (
              <div
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:pl-3 sm:pr-2 py-1 sm:py-1.5 bg-white/10 ring-1 ring-white/20 backdrop-blur-[2px] text-xs sm:text-sm"
                role="status"
                aria-live="polite"
              >
                <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 opacity-90" />
                {!isDone ? (
                  <>
                    <span className="hidden sm:inline mr-1 font-semibold">
                      Kalan
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <TimePill label="Gün" value={days} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Saat" value={hours} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Dak" value={minutes} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Sn" value={seconds} />
                    </div>
                  </>
                ) : (
                  <span className="font-semibold">{countdownDoneText}</span>
                )}
              </div>
            )}

            {/* Kullanıcı */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <span className="text-xs sm:text-sm font-semibold">{initials}</span>
              </div>
              <span className="hidden sm:block text-sm sm:text-base font-semibold">
                {displayName ?? ""}
              </span>
            </div>

            {/* Çıkış */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white/10 hover:bg-white/20 ring-1 ring-white/30"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
