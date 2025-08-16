"use client";

import Link from "next/link";
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
        relative z-0 isolate w-full
        overflow-x-clip overflow-y-visible
        py-20 md:py-24
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900
        text-white
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
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        {/* SOL */}
        <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
            Oyna ve Kazan!
          </h1>
          <p className="mt-4 max-w-xl opacity-90">
            Oyununu geliştir, puan topla, ödülleri kap. Başarılı projeler belediye
            mobil uygulamasına entegre edilecek.
          </p>

          {/* CTA’lar */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kayit" aria-label="Kayıt Ol sayfasına git">
              <Button
                variant="neon"
                className="px-5 py-2 text-base font-semibold transition-all hover:scale-105 hover:shadow-[0_0_16px_#ff00ff,0_0_22px_#00ffff]"
              >
                <span className="mr-2 inline-flex items-center" aria-hidden>
                  {/* Pencil */}
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </span>
                Kayıt Ol
              </Button>
            </Link>

            <Link href="/takvim" aria-label="Etkinlik takvimini gör">
              <Button
                variant="neon"
                className="px-5 py-2 text-base font-semibold bg-white/15 hover:bg-white/25 transition-all hover:scale-105"
              >
                <span className="mr-2 inline-flex items-center" aria-hidden>
                  {/* Takvim */}
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                Takvimi Gör
              </Button>
            </Link>
          </div>
        </div>

        {/* SAĞ: Sayaç kartı */}
        <div className="md:justify-self-end">
          <div
            className="
              group relative w-full max-w-sm rounded-2xl
              bg-white/10 p-5 backdrop-blur-md shadow-2xl
              transition-all duration-300 hover:scale-[1.02]
              hover:shadow-[0_0_18px_#ff00ff,0_0_24px_#00ffff]

              before:content-[''] before:absolute before:inset-0 before:rounded-2xl
              before:pointer-events-none before:opacity-0
              group-hover:before:opacity-100 group-hover:before:p-[3px]
              group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
              group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
              group-hover:before:[-webkit-mask-composite:xor]
              group-hover:before:[mask-composite:exclude]
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
