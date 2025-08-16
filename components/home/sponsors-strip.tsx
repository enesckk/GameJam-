"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SPONSORS = [
  { src: "/sehitkamill.png", alt: "Şehitkamil Belediyesi" },
  { src: "/huaweilogo.png", alt: "Huawei Türkiye" },
  { src: "/rotatelab.png", alt: "RotateLab" },
  { src: "/globe.svg", alt: "Planet Ekipman" },
  { src: "/varil.png", alt: "Varil Çorba" },
  // daha fazla logo ekleyebilirsin
];

export default function SponsorsStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amt = Math.max(360, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 text-xl font-extrabold uppercase tracking-wide text-neon-blue drop-shadow-[0_0_8px_#00ffff]">
        Destek Verenler
      </div>

      <div className="relative">
        {/* Kaydırma alanı */}
        <div
          ref={trackRef}
          role="region"
          aria-label="Sponsor logoları"
          className="
            overflow-x-auto scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            px-2 py-2
            [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]
            [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]
          "
          onScroll={updateArrows}
        >
          <div className="flex items-center gap-16 md:gap-24">
            {SPONSORS.map((s, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[260px] md:w-[320px] lg:w-[380px] h-[110px] md:h-[140px] lg:h-[160px] flex items-center justify-center"
                title={s.alt}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-contain opacity-95 hover:opacity-100 transition-transform duration-300 hover:scale-105"
                  sizes="(min-width:1024px) 380px, (min-width:768px) 320px, 260px"
                  priority={i < 2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Büyük ve belirgin oklar */}
        {canLeft && (
          <button
            aria-label="Sola kaydır"
            onClick={() => scrollByAmount("left")}
            className="
              group absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10
              p-[3px] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400
              shadow-[0_0_25px_#ff00ff,0_0_35px_#7900ff]
              hover:scale-110 active:scale-95 transition
            "
          >
            <span
              className="
                flex items-center justify-center rounded-full
                w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12
                bg-black/55 backdrop-blur-md
                text-white
              "
            >
              {/* inline svg: sol ok */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-8 md:h-8"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        )}

        {canRight && (
          <button
            aria-label="Sağa kaydır"
            onClick={() => scrollByAmount("right")}
            className="
              group absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10
              p-[3px] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400
              shadow-[0_0_25px_#ff00ff,0_0_35px_#7900ff]
              hover:scale-110 active:scale-95 transition
            "
          >
            <span
              className="
                flex items-center justify-center rounded-full
                w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                bg-black/55 backdrop-blur-md
                text-white
              "
            >
              {/* inline svg: sağ ok */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-8 md:h-8"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}