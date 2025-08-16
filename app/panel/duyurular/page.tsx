"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import { Pin } from "lucide-react";
import VideoBG from "@/components/background/video-bg"; // mp4-only sürüm

type Announcement = {
  id: string;
  title: string;
  body: string;        // API: content -> body
  createdAt: string;
  pinned?: boolean;
  author?: { name: string; role?: string } | null;
  category?: string | null;
};

function fmtDate(s: string) {
  try { return new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }); }
  catch { return s; }
}
function isLikelyHTML(s: string) { return typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s); }
function stripTags(s: string) { try { return s.replace(/<[^>]*>/g, " "); } catch { return s; } }
function previewText(raw: string, limit = 220) {
  const plain = isLikelyHTML(raw) ? stripTags(raw) : raw;
  return plain.length > limit ? plain.slice(0, limit) + "…" : plain;
}
function toArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.items)) return x.items;
  if (x && Array.isArray(x.announcements)) return x.announcements;
  return [];
}

// blur + hover gradient-border
const CARD_HOVER =
  "group relative overflow-hidden rounded-2xl p-4 " +
  "backdrop-blur bg-white/10 dark:bg-black/10 " +
  "transition-transform duration-200 hover:scale-[1.01] " +
  "border-2 border-transparent rounded-3xl " +
  "hover:[border-image:linear-gradient(90deg,#ff00ff,#7c3aed,#06b6d4)_1] " +
  "focus-within:[border-image:linear-gradient(90deg,#ff00ff,#7c3aed,#06b6d4)_1]";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/announcements", { cache: "no-store" });
      const j = await r.json();
      const arr = toArray(j);
      const normalized: Announcement[] = arr.map((a: any) => ({
        id: String(a.id),
        title: String(a.title ?? ""),
        body: String(a.content ?? ""),               // <-- content -> body
        createdAt: a.createdAt ?? new Date().toISOString(),
        pinned: !!a.pinned,
        author: a.author ?? { name: "Organizasyon Ekibi" },
        category: a.category ?? null,
      }));
      setItems(normalized);
    } catch {
      setErr("Duyurular alınamadı."); setItems([]);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let m = true;
    (async () => { if (m) await load(); })();
    return () => { m = false; };
  }, []);

  const sorted = useMemo(() => {
    const c = [...items];
    c.sort((a, b) =>
      (Number(!!b.pinned) - Number(!!a.pinned)) ||
      ((new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0))
    );
    return c;
  }, [items]);

  const pinned = useMemo(() => sorted.filter(i => !!i.pinned), [sorted]);
  const others = useMemo(() => sorted.filter(i => !i.pinned), [sorted]);

  return (
    <section className="relative isolate min-h-[100dvh]">
      {/* 🎥 Arka plan video (sadece MP4) */}
      <VideoBG
        overlay
        opacity={0.9}
        light={{ mp4: "/videos/bg-light.mp4", poster: "/videos/light-poster.jpg" }}
        dark={{ mp4: "/videos/bg-dark.mp4",  poster: "/videos/dark-poster.jpg"  }}
      />

      <div className="relative z-10">
        <PageHeader
          title="Duyurular"
          desc="Güncel bilgilendirmeler, kurallar ve program notları"
          variant="plain"
        />

        {/* Dış kart: blur + her zaman renkli çerçeve */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-6 md:p-8 mx-auto max-w-5xl"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          {err && (
            <div className="mb-4 flex items-center gap-3">
              <p className="text-sm text-red-300">{err}</p>
              <button onClick={load} className="text-sm transition hover:font-semibold">
                Tekrar dene
              </button>
            </div>
          )}

          {loading && (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl p-4 backdrop-blur bg-white/10 dark:bg-black/10">
                  <div className="h-3 w-24 mb-2 bg-white/20 dark:bg-white/10 rounded" />
                  <div className="h-5 w-3/4 mb-2 bg-white/30 dark:bg-white/10 rounded" />
                  <div className="h-3 w-full mb-1 bg-white/20 dark:bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-white/20 dark:bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && pinned.length > 0 && (
            <div className="mb-5 space-y-3">
              {pinned.map(a => {
                const isOpen = openId === a.id;
                const raw = a.body ?? "";
                const showHTML = isOpen && isLikelyHTML(raw);

                return (
                  <article key={a.id} className={CARD_HOVER} tabIndex={0}>
                    <div className="mb-2 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-foreground/20 bg-foreground/5">
                        <Pin className="h-3 w-3" /> Sabit
                      </span>
                      <span className="opacity-70 ml-auto">{fmtDate(a.createdAt)}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-extrabold tracking-tight">{a.title}</h3>

                    {showHTML ? (
                      <div
                        className="prose prose-invert mt-2 text-sm leading-relaxed opacity-95 max-w-none"
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed opacity-95">
                        {isOpen ? raw : previewText(raw)}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                      <span>{a.author?.name ?? "Organizasyon Ekibi"}</span>
                      <button
                        onClick={() => setOpenId(isOpen ? null : a.id)}
                        className="transition hover:font-semibold"
                      >
                        {isOpen ? "Kapat" : "Devamını oku"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && (
            <div className="grid gap-3">
              {others.map(a => {
                const isOpen = openId === a.id;
                const raw = a.body ?? "";
                const showHTML = isOpen && isLikelyHTML(raw);

                return (
                  <article key={a.id} className={CARD_HOVER} tabIndex={0}>
                    <div className="mb-1 flex items-center gap-2 text-xs opacity-75">
                      <span className="ml-auto">{fmtDate(a.createdAt)}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight">{a.title}</h3>

                    {showHTML ? (
                      <div
                        className="prose prose-invert mt-2 text-sm leading-relaxed opacity-95 max-w-none"
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed opacity-95">
                        {isOpen ? raw : previewText(raw)}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                      <span>{a.author?.name ?? "Organizasyon Ekibi"}</span>
                      <button
                        onClick={() => setOpenId(isOpen ? null : a.id)}
                        className="transition hover:font-semibold"
                      >
                        {isOpen ? "Kapat" : "Devamını oku"}
                      </button>
                    </div>
                  </article>
                );
              })}

              {!loading && sorted.length === 0 && !err && (
                <p className="text-sm opacity-75">Henüz duyuru yok.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
