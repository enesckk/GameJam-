"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/hero";
import IntroCards from "@/components/home/intro-cards";
import AwardsPreview from "@/components/home/awards-preview";
import SchedulePreview from "@/components/home/schedule-preview";
import SponsorsStrip from "@/components/home/sponsors-strip";
import JuryPreview from "@/components/home/jury-preview";
import SocialTask from "@/components/home/social-task";
import BottomCTA from "@/components/home/bottom-cta";
import PageHeader from "../panel/_components/page-header";

// Countdown Component
type CountdownProps = { targetDate: Date };

function pad(n: number) { return n.toString().padStart(2, "0"); }

function Countdown({ targetDate }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = useMemo(() => {
    const delta = Math.max(0, targetDate.getTime() - now);
    const s = Math.floor(delta / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return { days, hours, mins, secs, isStarted: delta <= 0 };
  }, [now, targetDate]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-4 rounded-2xl px-6 py-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 backdrop-blur-sm shadow-lg animate-pulse">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            --
          </div>
          <div className="text-xs uppercase opacity-80 mt-1">Gün</div>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-60"></div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            --
          </div>
          <div className="text-xs uppercase opacity-80 mt-1">Saat</div>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-60"></div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            --
          </div>
          <div className="text-xs uppercase opacity-80 mt-1">Dak</div>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-60"></div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            --
          </div>
          <div className="text-xs uppercase opacity-80 mt-1">Sn</div>
        </div>
      </div>
    );
  }

  if (diff.isStarted) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl px-8 py-6 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/40 backdrop-blur-sm shadow-xl animate-pulse">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-bounce">
            🎉 BAŞLADI! 🎉
          </div>
          <div className="text-sm uppercase opacity-90 mt-2 font-semibold">Etkinlik Devam Ediyor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-4 rounded-3xl px-8 py-6 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-blue-500/40 backdrop-blur-md shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
      <TimeBox label="Gün" value={diff.days} />
      <Sep />
      <TimeBox label="Saat" value={diff.hours} />
      <Sep />
      <TimeBox label="Dak" value={diff.mins} />
      <Sep />
      <TimeBox label="Sn" value={diff.secs} />
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center group">
      <div className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">
        {pad(value)}
      </div>
      <div className="text-sm uppercase opacity-90 mt-2 font-semibold group-hover:text-blue-400 transition-colors duration-200">{label}</div>
    </div>
  );
}

function Sep() {
  return (
    <div className="w-px h-10 bg-gradient-to-b from-transparent via-blue-500/60 to-transparent opacity-70 animate-pulse"></div>
  );
}

export default function HomePage() {
  // Game Jam başlangıç tarihi: 12 Ekim 2025 23:59 (TSİ)
  const targetDate = new Date("2025-10-12T23:59:00+03:00");

  return (
    <>
      <Hero />

      {/* Ana İçerik Bölümü - VIDEO YERİNE KATMANLI ARKA PLAN */}
      <section
        className="
          relative z-0 isolate w-full overflow-hidden
          text-white dark:text-white
          bg-gradient-to-b 
          from-white via-gray-100 to-gray-200
          dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
        "
      >
        {/* Katman A: büyük mesh */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute -z-10 inset-[-20%] opacity-80
            [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
            motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
          "
          style={{ mixBlendMode: "screen" }}
        />
        {/* Katman B: küçük mesh */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute -z-10 inset-[-30%] opacity-70
            [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
            motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
          "
          style={{ mixBlendMode: "screen" }}
        />
        {/* Katman C: conic swirl */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute -z-10 -inset-[25%] opacity-60
            [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
            motion-safe:animate-[swirl_22s_linear_infinite]
            rounded-[9999px] blur-3xl
          "
          style={{ mixBlendMode: "screen" }}
        />

        {/* İçerik */}
        <div className="relative z-10">
          {/* Countdown Bölümü */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 backdrop-blur-md shadow-xl">
                <PageHeader
                  title="Başlangıca Kalan Süre"
                  desc="Game Jam başlangıcına geri sayım"
                  variant="plain"
                />

                <div className="mt-10 flex justify-center">
                  <Countdown targetDate={targetDate} />
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20">
                  <p className="text-lg text-muted-foreground font-medium">
                    🗓️ 12 Ekim 2025 Pazar 23:59
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 opacity-80">
                    ⏰ İstanbul saati (UTC+3)
                  </p>
                </div>
              </div>
            </div>
          </section>

          <IntroCards />
          <AwardsPreview />
          <SchedulePreview />
          <SponsorsStrip />
          <JuryPreview />
          <SocialTask />
          <BottomCTA />
        </div>
      </section>
    </>
  );
}
