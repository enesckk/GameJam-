"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/takvim", label: "Takvim" },
  { href: "/kurallar", label: "Kurallar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/kayit", label: "Başvuru" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Bu prefixlerde navbar'ı hiç gösterme
  const HIDE_PREFIXES = ["/panel", "/admin", "/auth"];
  if (pathname && HIDE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  // scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const THRESHOLD = 12;

  useEffect(() => {
    setMounted(true);
    const authCookieRegex =
      /(?:^|;\s*)(auth-token|sj_session|next-auth\.session-token)=/;
    setIsAuth(authCookieRegex.test(document.cookie));

    const onScroll = () => setIsScrolled((window.scrollY || 0) > THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        // Şehitkamil renklerine uygun navbar
        "sticky top-0 z-40 w-full overflow-x-clip isolate",
        // sadece ilgili özellikleri animasyonla
        "transition-all duration-300",
        // tepedeyken: şeffaf arka plan
        !isScrolled
          ? "bg-transparent backdrop-blur-0 border-b border-transparent"
          // aşağıda: Şehitkamil renklerinde blur efekti
          : "bg-gradient-to-r from-green-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-md border-b border-green-500/30 shadow-[0_8px_32px_rgba(34,197,94,0.15)]",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap group"
        >
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image
              src="/favicon.ico"
              alt="Şehitkamil Game Jam Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-white">
            Şehitkamil Game Jam
          </span>
        </Link>

        {/* Linkler */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {nav
            .filter((i) => i.href !== "/kayit")
            .map((i) => {
              const active =
                pathname === i.href || pathname?.startsWith(i.href + "/");
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 relative ${
                    active 
                      ? "bg-green-500/20 text-green-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-green-500 after:rounded-full" 
                      : "text-slate-300 hover:bg-green-500/20 hover:text-green-300"
                  }`}
                >
                  {i.label}
                </Link>
              );
            })}

          {/* Oturuma göre CTA'lar */}
          {mounted && !isAuth ? (
            <>
              <Link
                href="/kayit"
                className="
                  group relative inline-flex items-center justify-center
                  rounded-xl px-4 py-2.5 text-sm font-semibold
                  text-white
                  bg-gradient-to-r from-green-600 via-blue-600 to-slate-600
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_8px_25px_rgba(34,197,94,0.4)]
                  border border-green-500/30
                "
              >
                Başvuru
              </Link>

              <Link
                href="/login"
                className="
                  group relative inline-flex items-center justify-center
                  rounded-xl px-4 py-2.5 text-sm font-semibold
                  text-white
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)]
                  border border-blue-500/30
                "
              >
                Giriş
              </Link>
            </>
          ) : mounted && isAuth ? (
            <Link
              href="/panel"
              className="
                rounded-xl px-4 py-2.5 text-sm font-semibold
                text-white bg-gradient-to-r from-green-600 to-emerald-600
                transition-all duration-300 hover:scale-105
                hover:shadow-[0_8px_25px_rgba(34,197,94,0.4)]
                border border-green-500/30
              "
            >
              Panel
            </Link>
          ) : null}

        </div>
      </nav>
    </header>
  );
}
