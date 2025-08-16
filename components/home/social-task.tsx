"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function SocialTask() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div
        className="
          group relative rounded-2xl
          bg-white/[0.04] p-6 text-center backdrop-blur-md shadow-lg
          transition-all duration-300 ease-out
          hover:scale-[1.03] hover:rounded-3xl
          hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]

          /* Kartın hover'ında gradient kenarlık */
          before:content-[''] before:absolute before:inset-0
          before:pointer-events-none before:opacity-0
          before:rounded-2xl group-hover:before:rounded-3xl
          group-hover:before:opacity-100 group-hover:before:p-[3px]
          group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
          group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
          group-hover:before:[-webkit-mask-composite:xor] group-hover:before:[mask-composite:exclude]
        "
      >
        <h3 className="text-xl font-extrabold">Sosyal Medya Görevi</h3>

        <p 
          className="mx-auto mt-2 max-w-2xl"
          style={{ color: 'color-mix(in oklab, var(--foreground) 80%, transparent)' }}
        >
          Etkinlik boyunca <span className="font-semibold">#Şehitkamil</span> etiketiyle LinkedIn, Instagram ve X (Twitter) üzerinde paylaşım yap.
          Paylaşımlar final değerlendirmesine <span className="font-semibold">%10</span> katkı sağlar.
        </p>

        {/* Marka rengine göre ARKA IŞIK (glow) — yalnızca ikon hover'ında */}
        <div className="mt-5 flex items-center justify-center gap-7 md:gap-9">
          {/* Instagram */}
          <Link
            href="https://instagram.com"
            target="_blank" rel="noopener noreferrer"
            aria-label="Instagram" title="Instagram"
            className="group/icon relative inline-flex items-center justify-center rounded-full p-3.5 md:p-4 transition-transform duration-300 hover:scale-110"
          >
            <span
              aria-hidden
              className="
                pointer-events-none absolute -inset-5 md:-inset-6 -z-10
                rounded-full opacity-0 blur-2xl md:blur-3xl
                transition-opacity duration-300 mix-blend-screen
                group-hover/icon:opacity-100
                bg-[radial-gradient(closest-side,#dd2a7b_0%,#8134af_55%,transparent_70%)]
              "
            />
            <FaInstagram className="relative z-10 h-9 w-9 md:h-10 md:w-10 transition-colors duration-300 group-hover/icon:text-[#dd2a7b]" />
            <span className="sr-only">Instagram</span>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com"
            target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn" title="LinkedIn"
            className="group/icon relative inline-flex items-center justify-center rounded-full p-3.5 md:p-4 transition-transform duration-300 hover:scale-110"
          >
            <span
              aria-hidden
              className="
                pointer-events-none absolute -inset-5 md:-inset-6 -z-10
                rounded-full opacity-0 blur-2xl md:blur-3xl
                transition-opacity duration-300 mix-blend-screen
                group-hover/icon:opacity-100
                bg-[radial-gradient(closest-side,#0A66C2_0%,#004182_55%,transparent_70%)]
              "
            />
            <FaLinkedin className="relative z-10 h-9 w-9 md:h-10 md:w-10 transition-colors duration-300 group-hover/icon:text-[#0A66C2]" />
            <span className="sr-only">LinkedIn</span>
          </Link>

          {/* X (Twitter) */}
          <Link
            href="https://twitter.com"
            target="_blank" rel="noopener noreferrer"
            aria-label="X (Twitter)" title="X (Twitter)"
            className="group/icon relative inline-flex items-center justify-center rounded-full p-3.5 md:p-4 transition-transform duration-300 hover:scale-110"
          >
            <span
              aria-hidden
              className="
                pointer-events-none absolute -inset-5 md:-inset-6 -z-10
                rounded-full opacity-0 blur-2xl md:blur-3xl
                transition-opacity duration-300 mix-blend-screen
                group-hover/icon:opacity-100
                bg-[radial-gradient(closest-side,#1DA1F2_0%,#0ea5e9_55%,transparent_70%)]
              "
            />
            <FaXTwitter className="relative z-10 h-9 w-9 md:h-10 md:w-10 transition-colors duration-300 group-hover/icon:text-[#1DA1F2]" />
            <span className="sr-only">X (Twitter)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
