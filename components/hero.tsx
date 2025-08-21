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

          {/* CTA'lar — Modern ve Estetik */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/kayit" aria-label="Kayıt Ol sayfasına git">
              <div className="group relative">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75 group-hover:opacity-100"></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl px-8 py-4 text-white font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border border-emerald-400/30 hover:border-emerald-300/50">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Kayıt Ol</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/takvim" aria-label="Etkinlik takvimini gör">
              <div className="group relative">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 backdrop-blur-sm"></div>
                
                {/* Button */}
                <div className="relative bg-white/15 backdrop-blur-xl hover:bg-white/25 rounded-2xl px-8 py-4 text-white font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 border border-white/30 hover:border-white/50">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Takvimi Gör</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}