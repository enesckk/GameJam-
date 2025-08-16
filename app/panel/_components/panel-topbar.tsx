// app/panel/_components/panel-topbar.tsx
"use client";

import { Menu, LogOut, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { useDisplayName } from "@/lib/use-user";
import { useEffect, useMemo, useRef, useState } from "react";

function getInitialsTR(fullName?: string | null) {
  if (!fullName) return "K";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last || "K").toLocaleUpperCase("tr-TR");
}

type PanelTopbarProps = {
  onMenuClick: () => void;
  /** Sayaç hedef zamanı. Örn: "2025-09-20T10:00:00+03:00" */
  countdownTargetISO?: string; // gelmezse sayaç gösterilmez
  /** Sayaç bittiğinde yazılacak kısa metin (örn: "Başladı!") */
  countdownDoneText?: string;
};

function useCountdown(target?: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // 1 sn’de bir güncelle; görünürlük değişiminde drift’i azalt
    const tick = () => setNow(new Date());
    const interval = setInterval(tick, 1000);
    const onVis = () => tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const diffMs = useMemo(() => {
    if (!target) return 0;
    return Math.max(0, target.getTime() - now.getTime());
  }, [now, target]);

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { diffMs, days, hours, minutes, seconds, isDone: diffMs === 0 };
}

function TimePill({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center",
        "rounded-xl px-2.5 py-1.5 md:px-3 md:py-2",
        "bg-white/12 ring-1 ring-white/20",
        "backdrop-blur-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,.15)]",
      ].join(" ")}
      aria-label={`${label} ${value}`}
    >
      <span className="tabular-nums text-sm md:text-base font-extrabold tracking-tight">
        {typeof value === "number" ? value.toString().padStart(2, "0") : value}
      </span>
      <span className="mt-0.5 text-[10px] md:text-xs leading-none text-white/85">
        {label}
      </span>
    </div>
  );
}

export default function PanelTopbar({
  onMenuClick,
  countdownTargetISO,
  countdownDoneText = "Başladı!",
}: PanelTopbarProps) {
  const router = useRouter();
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
    try {
      localStorage.removeItem("displayName");
      sessionStorage.removeItem("displayName");
    } catch {}
    window.dispatchEvent(new CustomEvent("user:name", { detail: "" }));
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

          {/* Sağ: Sayaç + avatar + Tema + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Sayaç */}
            {targetDate && (
              <div
                className={[
                  "hidden sm:flex items-center gap-2 md:gap-3 rounded-2xl pl-3 pr-2 md:pl-3.5 md:pr-3 py-1.5 md:py-2",
                  "bg-white/10 ring-1 ring-white/20 backdrop-blur-[2px]",
                  "hover:ring-white/40 transition-shadow",
                  "hover:shadow-[0_0_18px_rgba(236,72,153,.28),0_0_22px_rgba(6,182,212,.28)]",
                ].join(" ")}
                role="status"
                aria-live="polite"
                aria-label="Etkinliğe kalan süre"
                title={isDone ? countdownDoneText : "Etkinliğe kalan süre"}
              >
                <CalendarClock className="h-5 w-5 opacity-90" />
                {!isDone ? (
                  <>
                    <span className="mr-1 text-xs md:text-sm font-semibold text-white/95">
                      Kalan Süre
                    </span>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <TimePill label="Gün" value={days} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Saat" value={hours} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Dakika" value={minutes} />
                      <span className="opacity-70">:</span>
                      <TimePill label="Saniye" value={seconds} />
                    </div>
                  </>
                ) : (
                  <span className="text-sm md:text-base font-semibold">
                    {countdownDoneText}
                  </span>
                )}
                {/* Alt çizgi gradient */}
                <span
                  className="pointer-events-none absolute -bottom-px left-1/2 h-[2px] w-2/3 -translate-x-1/2 rounded-full opacity-70"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(236,72,153,1), rgba(139,92,246,1), rgba(6,182,212,1))",
                  }}
                />
              </div>
            )}

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
