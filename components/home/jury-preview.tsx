"use client";

import Image from "next/image";
import Button from "@/components/ui/button";
import Link from "next/link";

const JURY = [
  { name: "Jüri Üyesi 1", title: "Oyun Geliştirici", avatar: "/file.svg" },
  { name: "Jüri Üyesi 2", title: "Yayıncı / Influencer", avatar: "/globe.svg" },
  { name: "Mentor 1",     title: "Teknik Mentor", avatar: "/window.svg" },
];

export default function JuryPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-6 flex items-end justify-between">
        <div
          className="
            text-xl font-extrabold uppercase tracking-wide
            text-neon-blue drop-shadow-[0_0_8px_#00ffff]
          "
        >
          Jüri & Mentorlar
        </div>

        <Link href="/juri-mentor">
          <Button
            variant="neon"
            className="px-5 py-2 text-base font-semibold hover:scale-105 hover:shadow-[0_0_15px_#ff00ff] transition-all"
          >
            Tüm Liste
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {JURY.map((p) => (
          <div
            key={p.name}
            className="
              group relative flex items-center gap-4
              rounded-2xl bg-white/[0.04] p-5 backdrop-blur-md shadow-lg
              transition-all duration-300 ease-out
              hover:scale-[1.05] hover:rounded-3xl
              hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]

              /* Hover'da çıkan gradient kenarlık (köşeler birebir uyumlu) */
              before:content-[''] before:absolute before:inset-0
              before:pointer-events-none before:opacity-0
              before:rounded-2xl group-hover:before:rounded-3xl
              group-hover:before:opacity-100 group-hover:before:p-[3px]
              group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
              group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
              group-hover:before:[-webkit-mask-composite:xor]
              group-hover:before:[mask-composite:exclude]
            "
          >
            {/* Avatar */}
            <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <Image
                src={p.avatar}
                alt={`${p.name} avatar`}
                fill
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                sizes="64px"
              />
            </div>

            {/* Metinler */}
            <div>
              <div 
                className="font-semibold transition-colors duration-300 group-hover:text-neon-pink"
                style={{ color: 'var(--foreground)' }}
              >
                {p.name}
              </div>
              <div 
                className="text-sm"
                style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
              >
                {p.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}