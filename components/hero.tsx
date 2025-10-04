"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Countdown from "./countdown";
import { useMemo } from "react";

export default function Hero() {
  // Etkinlik başlangıcı
  const target = useMemo(() => new Date("2025-10-24T06:00:00Z"), []);

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
        text-white
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/bg-hero.png')" }}
    >
      {/* Şehitkamil renklerine uygun overlay */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10
          bg-gradient-to-r from-green-900/80 via-blue-900/60 to-purple-900/40
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

          {/* CTA'lar — Neon Tema Uyumlu */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/kayit" aria-label="Başvuru Yap sayfasına git">
              <div className="group relative">
                {/* Şehitkamil Yeşil Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-400 hover:to-emerald-500 rounded-xl px-6 py-3 text-white font-semibold text-base shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:scale-[1.02] border border-green-400/50 hover:border-green-300/70">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span>Başvuru Yap</span>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/takvim" aria-label="Etkinlik takvimini gör">
              <div className="group relative">
                {/* Şehitkamil Mavi Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-400 hover:to-indigo-500 rounded-xl px-6 py-3 text-white font-semibold text-base shadow-lg hover:shadow-blue-400/30 transition-all duration-300 hover:scale-[1.02] border border-blue-400/50 hover:border-blue-300/70">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Takvimi Gör</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
