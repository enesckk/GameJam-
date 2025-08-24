"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const HIDE_PREFIXES = ["/panel", "/admin", "/auth"];
  const shouldHide = HIDE_PREFIXES.some((p) => pathname?.startsWith(p));
  if (shouldHide) return null;

  return (
    <footer className="w-full overflow-x-clip border-t border-white/10 dark:border-white/5 bg-black/5 dark:bg-white/5 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 py-12 md:grid-cols-3">
        {/* 1) MENÜ */}
        <nav aria-label="Alt Menü" className="text-sm">
          <h4 className="mb-3 text-lg font-semibold text-[color:var(--foreground)]">Menü</h4>
          <ul className="grid gap-2">
            {[
              { href: "/hakkinda", label: "Hakkında" },
              { href: "/takvim", label: "Etkinlik Takvimi" },
              { href: "/kurallar", label: "Kurallar" },
              { href: "/juri-mentor", label: "Jüri & Mentörler" }, // rota tutarlı
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[color:var(--foreground)] transition hover:font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 2) İLETİŞİM + HARİTA */}
        <div className="text-sm">
          <h4 className="mb-3 text-lg font-semibold text-[color:var(--foreground)]">İletişim</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-80" aria-hidden />
              <a
                href="mailto:info@gamejam.org"
                className="text-[color:var(--foreground)] transition hover:font-semibold"
              >
                info@gamejam.org
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 opacity-80" aria-hidden />
              <a
                href="https://maps.app.goo.gl/LgN4axwWZ4pgbzwu9"
                target="_blank"
                rel="noopener noreferrer"
                className="leading-snug text-[color:var(--foreground)] transition hover:font-semibold"
                title="Haritada Aç"
              >
                Şehitkamil Belediyesi Kültür ve Kongre Merkezi <br />
                Gaziantep, Türkiye
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/LgN4axwWZ4pgbzwu9"
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-colors duration-300"
                title="Haritada Aç"
              >
                <iframe
                  title="Şehitkamil Belediyesi Kültür ve Kongre Merkezi"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.1234567890123!2d37.12345678901234!3d37.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA3JzM0LjQiTiAzN8KwMDcnMzQuNCJF!5e0!3m2!1str!2str!4v1234567890123"
                  width="100%"
                  height="140"
                  loading="lazy"
                  className="block w-full border-0 pointer-events-none"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </a>
            </li>
          </ul>
        </div>

        {/* 3) SOSYAL MEDYA */}
        <div className="text-sm">
          <h4 className="text-lg font-semibold text-[color:var(--foreground)]">Sosyal Medya</h4>
          <p className="mb-3 text-xs opacity-75">Bizi Takip Et</p>

          <div className="flex gap-5">
            {/* Instagram */}
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative inline-flex items-center justify-center rounded-full p-3 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/70"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-300 mix-blend-screen group-hover:opacity-100 bg-[radial-gradient(closest-side,#dd2a7b_0%,#8134af_55%,transparent_70%)]"
              />
              <FaInstagram className="relative z-10 h-7 w-7 transition-colors duration-300 group-hover:text-[#dd2a7b]" />
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group relative inline-flex items-center justify-center rounded-full p-3 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/70"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-300 mix-blend-screen group-hover:opacity-100 bg-[radial-gradient(closest-side,#0A66C2_0%,#004182_55%,transparent_70%)]"
              />
              <FaLinkedin className="relative z-10 h-7 w-7 transition-colors duration-300 group-hover:text-[#0A66C2]" />
            </Link>

            {/* X (Twitter) */}
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="group relative inline-flex items-center justify-center rounded-full p-3 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-300 mix-blend-screen group-hover:opacity-100 bg-[radial-gradient(closest-side,#1DA1F2_0%,#0ea5e9_55%,transparent_70%)]"
              />
              <FaXTwitter className="relative z-10 h-7 w-7 transition-colors duration-300 group-hover:text-[#1DA1F2]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Alt satır */}
      <div className="border-t border-white/10 dark:border-white/5 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Şehitkamil Game Jam • #OynaVeKazan
      </div>
    </footer>
  );
}
