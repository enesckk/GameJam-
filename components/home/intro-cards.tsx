"use client";

import { ReactNode } from "react";

function Item({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="
        not-prose
        group relative rounded-2xl
        border-0 ring-0 outline-none focus-visible:outline-none
        bg-white/[0.04] p-5 backdrop-blur-md
        transition-all duration-300 ease-out
        hover:scale-[1.05] hover:rounded-3xl
        hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]

        /* Hover'da görünen, köşeleri tam uyumlu gradient 'border' */
        before:content-[''] before:absolute before:inset-0
        before:pointer-events-none before:opacity-0
        before:rounded-2xl
        group-hover:before:opacity-100
        group-hover:before:rounded-3xl
        group-hover:before:p-[3px]
        group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
        group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
        group-hover:before:[-webkit-mask-composite:xor]
        group-hover:before:[mask-composite:exclude]
      "
    >
      <div className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* Başlık: CSS custom properties using existing theme */}
      <h3
        className="
          font-bold text-lg tracking-wide
          group-hover:!text-neon-pink
          transition-colors duration-300
        "
        style={{
          color: 'var(--foreground)',
        }}
      >
        {title}
      </h3>

      {/* Alt metin: consistent with existing theme pattern */}
      <p 
        className="mt-1 text-sm"
        style={{
          color: 'color-mix(in oklab, var(--foreground) 75%, transparent)',
        }}
      >
        {desc}
      </p>
    </div>
  );
}


export default function IntroCards() {
  return (
    <section className="relative z-0 mx-auto max-w-6xl px-6 py-14">
      <div
        className="
          mb-6 text-xl font-extrabold uppercase tracking-wide
          text-neon-blue drop-shadow-[0_0_8px_#00ffff]
        "
      >
        Etkinlik Özeti
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <Item
          icon={<span>🎮</span>}
          title="Tema: Yarışma Başlangıcında Açıklanacak"
          desc="Tema, Game Jam başlangıcında tüm katılımcılara açıklanacak."
        />
        <Item
          icon={<span>🗓️</span>}
          title="Tarihler"
          desc="Açılış, geliştirme, teslim ve ödül töreni tarihleri takvimde yer alacak."
        />
        <Item
          icon={<span>🏆</span>}
          title="Ödüller"
          desc="İlk 3 takıma büyük ödüller, tüm katılımcılara sürpriz hediyeler."
        />
        <Item
          icon={<span>🎯</span>}
          title="Yarışma Formatı"
          desc="48 saatlik yoğun geliştirme süreci ile yaratıcılığınızı sergileyin."
        />
      </div>
    </section>
  );
}