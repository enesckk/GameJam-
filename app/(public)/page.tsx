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
import VideoBG from "@/components/background/video-bg";
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
    return <div className="text-sm opacity-70">Geri sayım yükleniyor…</div>;
  }

  if (diff.isStarted) {
    return (
      <div className="inline-flex items-center gap-3 rounded-xl px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 backdrop-blur-sm shadow-lg">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-500 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            BAŞLADI!
          </div>
          <div className="text-xs uppercase opacity-80 mt-1">Etkinlik Devam Ediyor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl px-6 py-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 backdrop-blur-sm shadow-lg">
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
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        {pad(value)}
      </div>
      <div className="text-xs uppercase opacity-80 mt-1">{label}</div>
    </div>
  );
}

function Sep() { 
  return (
    <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-60"></div>
  ); 
}

export default function HomePage() {
  // Game Jam başlangıç tarihi: 12 Ekim 2025 23:59 (TSİ)
  const targetDate = new Date('2025-10-12T23:59:00+03:00');

  return (
    <>
      <Hero />
      
      {/* Ana İçerik Bölümü */}
      <section className="relative">
        <VideoBG
          light={{ mp4: "/videos/bg-light.mp4"}}
          dark={{  mp4: "/videos/bg-dark.mp4" }}
          opacity={0.78}
          overlay
        />
        <div className="relative z-10">
           {/* Countdown Bölümü */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm">
                <PageHeader
                  title="Başlangıca Kalan Süre"
                  desc="Game Jam başlangıcına geri sayım"
                  variant="plain"
                />
                
                <div className="mt-8 flex justify-center">
                  <Countdown targetDate={targetDate} />
                </div>
                
                <p className="text-sm text-muted-foreground mt-6">
                  12 Ekim 2025 Pazar 23:59
                </p>
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
