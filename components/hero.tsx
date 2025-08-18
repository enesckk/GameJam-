"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { useMemo } from "react";

export default function Hero() {
  return (
    <section
      className="
        relative z-0 isolate w-full
        overflow-hidden
        py-20 md:py-24
        text-white dark:text-white
        bg-gradient-to-b 
        from-white via-gray-100 to-gray-200    /* Light tema */
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 /* Dark tema */
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
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Logo Bölümü */}
        <div className="flex justify-center mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 backdrop-blur-md shadow-xl">
            {/* Şirket Logosu */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/sehitkamill.png" 
                  alt="Şirket Logosu"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // Resim yüklenemezse fallback ikon göster
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <svg className="w-12 h-12 text-blue-600 hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-black dark:text-white">Şirket Adı</h2>
                <p className="text-sm text-black/70 dark:text-white/70">Resmi Sponsor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* SOL */}
          <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white">
              Oyna ve Kazan!
            </h1>
            <p className="mt-4 max-w-xl opacity-90 text-black/80 dark:text-white/90">
              Oyununu geliştir, puan topla, ödülleri kap. Başarılı projeler belediye
              mobil uygulamasına entegre edilecek.
            </p>

            {/* CTA'lar */}
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
      </div>
    </section>
  );
}
