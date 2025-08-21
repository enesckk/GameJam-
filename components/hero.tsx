"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Countdown from "./countdown";
import { useMemo } from "react";

export default function Hero() {
  // Etkinlik başlangıcı
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
    overflow-hidden
    py-20 md:py-24
    text-white dark:text-white
    bg-cover bg-center bg-no-repeat
  "
  style={{
    backgroundImage: "url('/bg-hero.png')",
  }}
>
  {/* İçerik */}
  <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
    {/* SOL */}
    <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white">
        Oyna ve Kazan!
      </h1>
      <p className="mt-4 max-w-xl opacity-90 text-black/80 dark:text-white/90">
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
            Kayıt Ol
          </Button>
        </Link>

        <Link href="/takvim" aria-label="Etkinlik takvimini gör">
          <Button
            variant="neon"
            className="px-5 py-2 text-base font-semibold bg-black/10 hover:bg-black/20 dark:bg-white/15 dark:hover:bg-white/25 transition-all hover:scale-105"
          >
            Takvimi Gör
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>

  );
}
