"use client";

import Button from "@/components/ui/button";
import Link from "next/link";

const AWARDS = [
  { place: "🥇 1. Takım", prize: "Huawei Tablet" },
  { place: "🥈 2. Takım", prize: "Huawei Akıllı Saat" },
  { place: "🥉 3. Takım", prize: "Oyun Aksesuar Seti (mouse, mousepad, kablo vb.)" },
  { place: "🎁 Tüm Katılımcılara", prize: "Özel Hediyeler & Dijital Katılım Sertifikası" },
  { place: "🎉 Ekstra Ödüller", prize: "Kahoot Yarışması & Çekiliş Sürprizleri" },
  { place: "🚀 Belediye Desteği", prize: "Başarılı oyunların uygulamaya entegrasyonu" },
];

const TOP3 = AWARDS.slice(0, 3);
const OTHERS = AWARDS.slice(3);

export default function AwardsPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      {/* Başlık: Etkinlik Özeti ile aynı boyut/renk */}
      <div className="mb-6 flex items-end justify-between">
        <div
          className="
            text-xl font-extrabold uppercase tracking-wide
            text-neon-blue drop-shadow-[0_0_8px_#00ffff]
          "
        >
          Ödüller
        </div>
      </div>

      {/* Üst satır: ilk 3 ödül */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {TOP3.map((a) => (
          <div
            key={a.place}
            className="
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
            <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {a.place.split(" ")[0]}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70">
              {a.place.replace(/^[^\s]+\s/, "")}
            </div>
            <div className="text-lg font-semibold mt-1 transition-colors duration-300 group-hover:text-neon-pink">
              {a.prize}
            </div>
          </div>
        ))}
      </div>

      {/* Alt satır: diğer ödüller */}
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {OTHERS.map((a) => (
          <div
            key={a.place}
            className="
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
            <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {a.place.split(" ")[0]}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70">
              {a.place.replace(/^[^\s]+\s/, "")}
            </div>
            <div className="text-lg font-semibold mt-1 transition-colors duration-300 group-hover:text-neon-pink">
              {a.prize}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
