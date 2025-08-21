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
        relative z-0 isolate w-full overflow-hidden
        py-20 md:py-24
        text-white dark:text-white
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/bg-hero.png')" }}
    >
      {/* SOL tarafı butonlar için karartan overlay */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10
          bg-gradient-to-r from-black/60 via-black/40 to-transparent
          dark:from-black/70 dark:via-black/50
        "
      />

      {/* İçerik */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        {/* SOL */}
        <div className="drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Oyna ve Kazan!
          </h1>
          <p className="mt-4 max-w-xl opacity-95 text-white/90">
            Oyununu geliştir, puan topla, ödülleri kap. Başarılı projeler belediye
            mobil uygulamasına entegre edilecek.
          </p>

          {/* CTA’lar — yüksek kontrastlı */}
          <div
            className="
              mt-8 inline-flex flex-wrap gap-3
              rounded-2xl bg-black/35 dark:bg-black/40
              backdrop-blur-md p-2 ring-1 ring-white/15
            "
          >
            <Link href="/kayit" aria-label="Kayıt Ol sayfasına git">
              <Button
                variant="neon"
                className="
                  px-5 py-2 text-base font-semibold
                  !bg-emerald-600/95 hover:!bg-emerald-600
                  !text-white
                  ring-2 ring-white/30 hover:ring-white/40
                  shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                  hover:scale-[1.02] transition-all
                "
              >
                Kayıt Ol
              </Button>
            </Link>

            <Link href="/takvim" aria-label="Etkinlik takvimini gör">
              <Button
                variant="neon"
                className="
                  px-5 py-2 text-base font-semibold
                  !bg-white/95 hover:!bg-white
                  !text-slate-900
                  ring-2 ring-white/40
                  shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                  hover:scale-[1.02] transition-all
                  dark:!bg-white/90 dark:hover:!bg-white dark:!text-slate-900
                "
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
