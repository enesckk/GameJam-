"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SPONSORS = [
  { src: "/sehitkamill.png", alt: "Şehitkamil Belediyesi" },
  { src: "/huaweilogo.png",  alt: "Huawei Türkiye" },
  { src: "/rotatelab.png",   alt: "RotateLab" },
  { src: "/globe.svg",       alt: "Planet Ekipman" },
  { src: "/varil.png",       alt: "Varil Çorba" },
  // ...daha fazlası
];

export default function SponsorsStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    // 4px toleranslı sınır kontrolü
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    // ResizeObserver: responsive değişimde okları güncelle
    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    // Pencere boyutu değişiminde de kontrol
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amt = Math.max(360, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  // Klavye ile yatay kaydırma (←/→)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" && canLeft) {
      e.preventDefault();
      scrollByAmount("left");
    } else if (e.key === "ArrowRight" && canRight) {
      e.preventDefault();
      scrollByAmount("right");
    }
  };

  return (
    <section className="mx-auto w-full overflow-x-clip max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-6 text-xl font-extrabold uppercase tracking-wide text-neon-blue drop-shadow-[0_0_8px_#00ffff]">
        Destek Verenler
      </div>

      <div className="relative">
        {/* Kaydırma alanı */}
        <div
          ref={trackRef}
          role="region"
          aria-label="Sponsor logoları"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="
            overflow-x-auto scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            px-2 py-2
            snap-x snap-mandatory
            [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]
            [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-xl
          "
          onScroll={updateArrows}
        >
          <div className="flex items-center gap-10 sm:gap-16 md:gap-24">
            {SPONSORS.map((s, i) => (
              <div
                key={i}
                className="
                  relative shrink-0 snap-start
                  w-[220px] sm:w-[260px] md:w-[320px] lg:w-[380px]
                  h-[90px]   sm:h-[110px] md:h-[140px] lg:h-[160px]
                  flex items-center justify-center
                "
                title={s.alt}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-contain opacity-95 transition-transform duration-300 hover:scale-105 hover:opacity-100"
                  sizes="(min-width:1024px) 380px, (min-width:768px) 320px, (min-width:640px) 260px, 220px"
                  priority={i < 2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Oklar (eşit boyut, erişilebilir) */}
        <NavArrow
          side="left"
          visible={canLeft}
          onClick={() => scrollByAmount("left")}
          ariaLabel="Sola kaydır"
        />
        <NavArrow
          side="right"
          visible={canRight}
          onClick={() => scrollByAmount("right")}
          ariaLabel="Sağa kaydır"
        />
      </div>
    </section>
  );
}

/** Ok butonu (sol/sağ) */
function NavArrow({
  side,
  visible,
  onClick,
  ariaLabel,
}: {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  const common =
    "group absolute top-1/2 -translate-y-1/2 z-10 p-[3px] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 " +
    "shadow-[0_0_25px_#ff00ff,0_0_35px_#7900ff] transition will-change-transform " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/70";
  const pos = side === "left" ? "left-1 sm:left-2" : "right-1 sm:right-2";

  // görünür değilken butonu DOM’da tutup erişilebilirliği bozmamak için aria-disabled + opacity
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={visible ? onClick : undefined}
      className={`${common} ${pos} ${visible ? "opacity-100 hover:scale-110 active:scale-95" : "opacity-0 pointer-events-none"}`}
    >
      <span
        className="
          flex items-center justify-center rounded-full
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          bg-black/55 backdrop-blur-md text-white
        "
      >
        {/* inline svg ok */}
        {side === "left" ? (
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="none"
            aria-hidden="true"
          >
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="none"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
