"use client";

import Button from "@/components/ui/button";
import Countdown from "./countdown";

import { useMemo } from "react";

export default function Hero() {
  // Etkinlik başlangıcı — kendi tarihinle değiştir
  const target = useMemo(() => new Date("2025-10-12T20:59:00Z"), []);

  const fullDateTR = useMemo(() => {
    try {
      return (
        new Intl.DateTimeFormat("tr-TR", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Europe/Istanbul",
        }).format(target) + " (TSİ)"
      );
    } catch {
      return "";
    }
  }, [target]);

  return (
    <section
      className="
        relative overflow-hidden py-24
        /* 1) koyu taban (light/dark temadan bağımsız) */
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900
        text-white
      "
    >
      {/* 2) daha belirgin hareket: iki mesh + bir conic katman */}
      {/* katman A: büyük mesh, yavaş pan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* katman B: küçük mesh, farklı hız */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* katman C: conic + rotasyon, hareketi bariz yapar */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -inset-[25%] opacity-60
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
          animate-[swirl_22s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
      />

      {/* içerik */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 relative">
        {/* SOL */}
        <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Oyna ve Kazan!
          </h1>
          <p className="mt-4 max-w-xl opacity-90">
            Oyununu geliştir, puan topla, ödülleri kap. Başarılı projeler belediye
            mobil uygulamasına entegre edilecek.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="neon">Kayıt Ol</Button>
            <Button variant="outline">Takvimi Gör</Button>
          </div>
        </div>

        {/* SAĞ: sayaç kartı */}
        <div className="md:justify-self-end">
          <div
            className="
              w-full max-w-sm rounded-2xl border border-white/20
              bg-white/10 p-5 backdrop-blur-md shadow-2xl
            "
          >
            <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/90">
              Başlangıca Kalan Süre
            </div>

            <Countdown targetDate={target} />

            <div className="mt-4 text-sm font-medium text-white/95">
              {fullDateTR}
            </div>
            <div className="mt-2 text-xs text-white/80">
              Sayaç İstanbul saatine göre çalışır.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
