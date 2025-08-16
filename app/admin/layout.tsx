"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

type VideoSet = { mp4: string; poster?: string };

type Props = {
  light: VideoSet;
  dark: VideoSet;
  mode?: "auto" | "light" | "dark";
  opacity?: number;
  overlay?: boolean;
  /** true: tema değişince videoyu başa alıp resetler; false: kaldığı yerden devam etmeye çalışır */
  restartOnThemeChange?: boolean;
  /** stacking sorunlarını aşmak için: "absolute" (varsayılan) veya "fixed" */
  position?: "absolute" | "fixed";
  /** görünürlük optimizasyonu (IntersectionObserver). Sorunlu sayfalarda false yap */
  useIO?: boolean;
};

export default function VideoBG({
  light,
  dark,
  mode = "auto",
  opacity = 0.85,
  overlay = true,
  restartOnThemeChange = false,
  position = "absolute",
  useIO = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // SSR hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { resolvedTheme } = useTheme();

  const isDark = useMemo(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    if (resolvedTheme) return resolvedTheme === "dark";
    if (typeof window !== "undefined") {
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    }
    return false;
  }, [mode, resolvedTheme]);

  const src = isDark ? dark : light;

  // görünürlük & viewport dışında durdur/başlat (performans)
  useEffect(() => {
    if (!useIO) return;
    const v = videoRef.current;
    if (!v) return;

    const onVis = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? v.play().catch(() => {}) : v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(v);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [useIO]);

  // Tema değişiminde davranış
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (restartOnThemeChange) {
      v.load();
      v.play().catch(() => {});
      return;
    }

    // Kaldığı yerden devam etmeye çalış
    const currentTime = v.currentTime || 0;
    const wasPaused = v.paused;
    const next = src.mp4;

    // hiç değişmeyecekse dokunma
    if ((v as any)._activeSrc === next) return;

    const onLoaded = () => {
      try {
        v.currentTime = Math.min(currentTime, v.duration || currentTime);
      } catch {}
      wasPaused ? v.pause() : v.play().catch(() => {});
      v.removeEventListener("loadedmetadata", onLoaded);
    };

    v.addEventListener("loadedmetadata", onLoaded);
    (v as any)._activeSrc = next;
    v.src = next;
    if (src.poster) v.poster = src.poster;
    v.load();
  }, [src, restartOnThemeChange]);

  if (!mounted) return null;

  const wrapperClass =
    "pointer-events-none " +
    (position === "fixed" ? "fixed inset-0 z-[-1]" : "absolute inset-0 -z-10");

  return (
    <div aria-hidden className={wrapperClass}>
      {/* motion hassas kullanıcılar için video yerine poster */}
      <div className="motion-reduce:block hidden absolute inset-0">
        {src.poster && <img src={src.poster} alt="" className="h-full w-full object-cover" />}
      </div>

      <video
        ref={videoRef}
        className="motion-reduce:hidden h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload={restartOnThemeChange ? "metadata" : "auto"}
        poster={src.poster}
        key={restartOnThemeChange ? (isDark ? "dark" : "light") : "static"}
        style={{ opacity }}
        onCanPlay={() => videoRef.current?.play().catch(() => {})}
      >
        <source src={src.mp4} type="video/mp4" />
      </video>

      {overlay && (
        <div
          className={
            "absolute inset-0 " +
            (isDark
              ? "bg-gradient-to-b from-black/50 via-black/45 to-black/60"
              : "bg-gradient-to-b from-black/30 via-black/25 to-black/40")
          }
        />
      )}
    </div>
  );
}
