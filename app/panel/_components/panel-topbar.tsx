// app/panel/_components/panel-topbar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, LogOut, Hourglass, Mail, Users2, PlusSquare } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useDisplayName } from "@/lib/use-user";

/* ------------------ Config ------------------ */
const MAX_TEAM = 4;

/* ------------------ Utils ------------------ */
function getInitialsTR(fullName?: string | null) {
  if (!fullName) return "K";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last || "K").toLocaleUpperCase("tr-TR");
}

type Countdown = { days: number; hours: number; minutes: number; seconds: number; finished: boolean };
function useCountdown(targetDate?: Date | string | null) {
  const target = useMemo(() => {
    if (!targetDate) return null;
    return typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  }, [targetDate]);

  const calc = (): Countdown | null => {
    if (!target) return null;
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, finished: false };
  };

  const [time, setTime] = useState<Countdown | null>(calc);
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.getTime?.()]);
  return time;
}

function fmtCountdown(t?: Countdown | null) {
  if (!t) return "Tarih bekleniyor";
  if (t.finished) return "Teslim başladı!";
  // kısa: 12g 03s 14d 08s
  return `${t.days}g ${String(t.hours).padStart(2, "0")}s ${String(t.minutes).padStart(2, "0")}d ${String(t.seconds).padStart(2, "0")}s`;
}

/* ------------------ Data fetchers ------------------ */
async function fetchUnreadCount(signal?: AbortSignal): Promise<number> {
  // sadece total'i okumak için küçük pageSize
  const res = await fetch(`/api/messages?box=inbox&unread=1&pageSize=1`, { credentials: "include", signal });
  if (!res.ok) return 0;
  const data = await res.json().catch(() => ({}));
  return Number.isFinite(data?.total) ? data.total : 0;
}

type TeamState = {
  type: "individual" | "team";
  teamName: string;
  inviteCode?: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    role: "developer" | "designer" | "audio" | "pm";
    status: "active" | "invited" | "admin_added" | "form_applied";
    isLeader?: boolean;
  }>;
};
async function fetchTeam(signal?: AbortSignal): Promise<TeamState | null> {
  const res = await fetch(`/api/team`, { credentials: "include", signal });
  if (!res.ok) return null;
  return res.json();
}

/* ------------------ UI bits ------------------ */
function Badge({
  icon,
  label,
  value,
  ariaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number | string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={[
        "group relative flex items-center gap-2 rounded-2xl px-3.5 py-2",
        "backdrop-blur bg-white/10 ring-1 ring-white/20 text-white/95",
        "hover:bg-white/14 hover:ring-white/40 transition",
        "shadow-[0_0_12px_rgba(255,255,255,.08)]",
      ].join(" ")}
      aria-label={ariaLabel ?? label}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xs/5 opacity-90">{label}</span>
        <span className="text-sm md:text-base font-semibold tracking-tight">
          {value ?? "—"}
        </span>
      </div>
      <span
        className="pointer-events-none absolute -bottom-px left-1/2 h-[2px] w-2/3 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(236,72,153,1), rgba(139,92,246,1), rgba(6,182,212,1))",
        }}
      />
    </div>
  );
}

function CountdownPill({ targetDate }: { targetDate?: Date | string }) {
  const t = useCountdown(targetDate);
  const text = fmtCountdown(t);
  return (
    <div
      className={[
        "relative flex items-center gap-2 rounded-2xl px-3.5 py-2",
        "backdrop-blur bg-black/25 ring-1 ring-white/25 text-white",
        "shadow-[inset_0_0_30px_rgba(0,0,0,.25)]",
      ].join(" ")}
      aria-live="polite"
      aria-label="Geri sayım"
      title={text}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
        <Hourglass className="h-4 w-4" />
      </div>
      <div className="text-sm md:text-base font-semibold tracking-tight">
        {text}
      </div>
    </div>
  );
}

/* ------------------ Component ------------------ */
export default function PanelTopbar({
  onMenuClick,
  targetDate, // teslim/son başvuru/oyun yükleme tarihi
}: {
  onMenuClick: () => void;
  targetDate?: Date | string;
}) {
  const { displayName } = useDisplayName();
  const initials = getInitialsTR(displayName);

  const [unread, setUnread] = useState<number>(0);
  const [teamState, setTeamState] = useState<TeamState | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // İlk yükleme + odaklanınca hafif yenileme
  useEffect(() => {
    const load = async () => {
      abortRef.current?.abort();
      const c = new AbortController();
      abortRef.current = c;
      try {
        const [u, t] = await Promise.all([
          fetchUnreadCount(c.signal),
          fetchTeam(c.signal),
        ]);
        setUnread(u);
        setTeamState(t);
      } catch {
        // sessizce geç
      }
    };
    load();

    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      abortRef.current?.abort();
    };
  }, []);

  const members = teamState?.members?.length ?? 1;
  const remaining = Math.max(0, MAX_TEAM - members);

  // Çıkış
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

  // “Teslime kalan gün” metni (gün bazında büyük vurgu)
  const c = useCountdown(targetDate);
  const teslimKalanGun = !c ? "—" : c.finished ? "0" : String(c.days);

  return (
    <div className="sticky top-0 z-40">
      {/* Kenarlıksız, geniş, gradient hero bar */}
      <div className="relative h-28 md:h-32 hero-gradient text-white">
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

          {/* Orta: “Teslime kalan” + Sayaç + Önemli rozetler */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Teslime kalan gün (vurgulu kısa metin) */}
            <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2 bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <span className="text-xs opacity-90">Teslime kalan</span>
              <span className="text-lg font-extrabold tabular-nums">{teslimKalanGun}</span>
              <span className="text-sm font-semibold opacity-90">gün</span>
            </div>

            {/* Geri sayım */}
            <CountdownPill targetDate={targetDate} />

            {/* Önemli rozetler — sadece burada sayı var */}
            <div className="flex items-center gap-2 lg:gap-3">
              <Badge
                icon={<Mail className="h-4 w-4" />}
                label="Okunmamış"
                value={unread}
                ariaLabel="Okunmamış mesaj sayısı"
              />
              <Badge
                icon={<Users2 className="h-4 w-4" />}
                label="Takım Üye"
                value={members}
                ariaLabel="Takımdaki aktif üye sayısı"
              />
              <Badge
                icon={<PlusSquare className="h-4 w-4" />}
                label="Boş Kontenjan"
                value={remaining}
                ariaLabel="Takımda kalan boş kontenjan"
              />
            </div>
          </div>

          {/* Sağ: avatar + İsim Soyisim + Tema + Çıkış */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <span className="text-sm md:text-base font-semibold">{getInitialsTR(displayName)}</span>
              </div>
              <span className="text-base md:text-lg font-semibold drop-shadow-sm">
                {displayName ?? ""}
              </span>
            </div>

            <ThemeToggle />

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

        {/* Mobil: altta sayaç + rozetler */}
        <div className="md:hidden px-4 pb-3 -mt-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2 bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <span className="text-xs opacity-90">Teslime kalan</span>
              <span className="text-base font-extrabold tabular-nums">{teslimKalanGun}</span>
              <span className="text-sm font-semibold opacity-90">gün</span>
            </div>
            <CountdownPill targetDate={targetDate} />
            <Badge icon={<Mail className="h-4 w-4" />} label="Okunmamış" value={unread} />
            <Badge icon={<Users2 className="h-4 w-4" />} label="Takım Üye" value={members} />
            <Badge icon={<PlusSquare className="h-4 w-4" />} label="Boş Kontenjan" value={remaining} />
          </div>
        </div>
      </div>
    </div>
  );
}
