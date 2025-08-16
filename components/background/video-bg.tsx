"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

type VideoSet = { webm: string; mp4: string; poster?: string };

type Props = {
  /** Light tema için video seti */
  light: VideoSet;
  /** Dark tema için video seti */
  dark: VideoSet;
  /** 'auto' = temayı otomatik algıla (varsayılan), 'light' veya 'dark' ile zorlayabilirsin */
  mode?: "auto" | "light" | "dark";
  /** Video opaklığı (0..1) */
  opacity?: number;
  /** Karanlık maske/overlay (true: varsayılan degrade; false: kapalı) */
  overlay?: boolean;
  /** Tema değişince mevcut videoyu sıfırdan başlatmak istemezsen false yap */
  restartOnThemeChange?: boolean;
};

export default function VideoBG({
  light,
  dark,
  mode = "auto",
  opacity = 0.85,
  overlay = true,
  restartOnThemeChange = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // SSR hydration sorunlarını önlemek için
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { resolvedTheme } = useTheme();

  const isDark = useMemo(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    // auto: next-themes + sistem tercihine saygı
    if (resolvedTheme) return resolvedTheme === "dark";
    if (typeof window !== "undefined") {
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    }
    return false;
  }, [mode, resolvedTheme]);

  // Tema değişiminde videonun takılmasını önlemek için play/pause + kaynak güncelleme
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Sekme gizliyken durdur, görünür olunca devam et (performans)
    const onVis = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    // Ekranda yokken durdur (performans)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
      { rootMargin: "200px" }
    );
    io.observe(v);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);

  // Tema değişince videoyu başa alma tercihi
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (restartOnThemeChange) {
      try {
        v.currentTime = 0;
      } catch {}
    }
    v.play().catch(() => {});
  }, [isDark, restartOnThemeChange]);

  if (!mounted) return null;

  const src = isDark ? dark : light;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* motion hassas kullanıcılar için video yerine poster */}
      <div className="hidden prefers-reduced-motion:block absolute inset-0">
        {src.poster && <img src={src.poster} alt="" className="h-full w-full object-cover" />}
      </div>

      <video
        ref={videoRef}
        className="prefers-reduced-motion:hidden h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={src.poster}
        style={{ opacity }}
        key={isDark ? "dark" : "light"} // tema değişiminde kaynakları güvenle yenile
      >
        <source src={src.webm} type="video/webm" />
        <source src={src.mp4} type="video/mp4" />
      </video>

      {overlay && (
        // Light/Dark'a göre overlay yoğunluğunu doğal tut
        <div
          className={[
            "absolute inset-0",
            isDark
              ? "bg-gradient-to-b from-black/50 via-black/45 to-black/60"
              : "bg-gradient-to-b from-black/30 via-black/25 to-black/40",
          ].join(" ")}
        />
      )}
    </div>
  );
}
