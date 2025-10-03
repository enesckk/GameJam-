"use client";

import Button from "@/components/ui/button";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div
        className="
          group relative rounded-3xl
          bg-gradient-to-r from-sky-600/30 to-fuchsia-600/30
          p-8 text-center backdrop-blur-md shadow-lg
          transition-all duration-300 ease-out
          hover:scale-[1.03]
          hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]

          /* Hover'da çıkan gradient 'border' (köşeler birebir uyumlu) */
          before:content-[''] before:absolute before:inset-0
          before:pointer-events-none before:opacity-0
          before:rounded-3xl
          group-hover:before:opacity-100 group-hover:before:p-[3px]
          group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
          group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
          group-hover:before:[-webkit-mask-composite:xor]
          group-hover:before:[mask-composite:exclude]
        "
      >
        <h3 className="text-2xl font-extrabold">Hazırsan hemen ekibinle katıl!</h3>
         <p 
          className="mx-auto mt-2 max-w-2xl"
          style={{ color: 'color-mix(in oklab, var(--foreground) 80%, transparent)' }}
        >
          Başvurular açık. Takvimi ve kuralları mutlaka incele.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/kayit">
            <Button variant="neon" className="hover:scale-105 transition-transform">
              Başvuru Yap
            </Button>
          </Link>
          <Link href="/takvim">
            <Button variant="neon" className="hover:scale-105 transition-transform">
              Takvimi Gör
            </Button>
          </Link>
          <Link href="/kurallar">
            <Button variant="neon" className="hover:scale-105 transition-transform">
              Kuralları Oku
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
