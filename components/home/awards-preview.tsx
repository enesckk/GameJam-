"use client";

import Link from "next/link";
// Button şu an kullanılmıyor; CTA eklemek istersen yorumdan çıkarabilirsin.
// import Button from "@/components/ui/button";

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

function AwardCard({ place, prize }: { place: string; prize: string }) {
  const [emoji, ...rest] = place.split(" ");
  const placeText = rest.join(" ");

  return (
    <div
      className="
        group relative rounded-2xl
        border-0 ring-0 outline-none focus-visible:outline-none
        bg-white/[0.04] p-5 backdrop-blur-md
        transition-all duration-300 ease-out
        transform-gpu will-change-transform
        hover:scale-[1.05] hover:rounded-3xl
        hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]
        motion-reduce:transition-none motion-reduce:hover:scale-100

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
        <span role="img" aria-hidden>{emoji}</span>
      </div>
      <div className="text-sm text-black/70 dark:text-white/70">
        {placeText}
      </div>
      <div className="mt-1 text-lg font-semibold transition-colors duration-300 group-hover:text-neon-pink">
        {prize}
      </div>
    </div>
  );
}

export default function AwardsPreview() {
  return (
    <section className="mx-auto w-full overflow-x-clip max-w-6xl px-4 sm:px-6 py-12 md:py-14">
      {/* Başlık */}
      <div className="mb-6 flex items-end justify-between">
        <div
          className="
            text-xl font-extrabold uppercase tracking-wide
            text-neon-blue drop-shadow-[0_0_8px_#00ffff]
          "
        >
          Ödüller
        </div>

        {/* İstersen tüm ödüller sayfasına CTA koy:
        <Link href="/oduller">
          <Button variant="neon" className="px-4 py-2 text-sm">Tümünü Gör</Button>
        </Link>
        */}
      </div>

      {/* Üst satır: ilk 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {TOP3.map((a) => (
          <AwardCard key={a.place} place={a.place} prize={a.prize} />
        ))}
      </div>

      {/* Alt satır: diğerleri */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {OTHERS.map((a) => (
          <AwardCard key={a.place} place={a.place} prize={a.prize} />
        ))}
      </div>
    </section>
  );
}
