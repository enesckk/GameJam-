"use client";

import type { ReactNode } from "react";

function Item({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
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
        transform-gpu will-change-transform
        hover:scale-[1.05] hover:rounded-3xl
        hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]
        motion-reduce:transition-none motion-reduce:hover:scale-100

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

      <h3
        className="
          font-bold text-lg tracking-wide
          text-[color:var(--foreground)]
          group-hover:!text-neon-pink
          transition-colors duration-300
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-1 text-sm
          text-[color:color-mix(in_oklab,var(--foreground)_75%,transparent)]
        "
      >
        {desc}
      </p>
    </div>
  );
}

export default function IntroCards() {
  return (
    <section className="relative z-0 mx-auto w-full overflow-x-clip px-4 sm:px-6 py-12 md:py-14">
      <div
        className="
          mb-6 text-center
          text-xl font-extrabold uppercase tracking-wide
          text-neon-blue drop-shadow-[0_0_8px_#00ffff]
        "
      >
        Etkinlik Özeti
      </div>

      <div className="grid justify-center gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Item
          icon={<span role="img" aria-label="Oyun">🎮</span>}
          title="Tema: Oyna ve Kazan!"
          desc="Kullanıcıların oynadıkça puan kazandığı ve ödüller alabildiği oyunlar geliştirilecek."
        />
        <Item
          icon={<span role="img" aria-label="Takvim">🗓️</span>}
          title="Tarihler"
          desc="Açılış, geliştirme, teslim ve ödül töreni tarihleri takvimde yer alacak."
        />
        <Item
          icon={<span role="img" aria-label="Ödül">🏆</span>}
          title="Ödüller"
          desc="İlk 3 takıma büyük ödüller, tüm katılımcılara sürpriz hediyeler."
        />
        <Item
          icon={<span role="img" aria-label="Mobil">📱</span>}
          title="Mobil Entegrasyon"
          desc="Başarılı projeler Şehitkamil Belediyesi mobil uygulamasına entegre edilecek."
        />
      </div>
    </section>
  );
}
