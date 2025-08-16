"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla
import VideoBG from "@/components/background/video-bg";

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
  author?: { name: string; role?: string } | null;
};

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return s;
  }
}

function isLikelyHTML(s: string) {
  return typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);
}
function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, " ");
}
function previewText(raw: string, limit = 220) {
  const plain = isLikelyHTML(raw) ? stripTags(raw) : raw;
  return plain.length > limit ? plain.slice(0, limit) + "…" : plain;
}
function toArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x?.items) return x.items;
  if (x?.announcements) return x.announcements;
  return [];
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch("/api/announcements", { cache: "no-store" });
        const j = await r.json();
        const arr = toArray(j);
        const normalized: Announcement[] = arr.map((a: any) => ({
          id: String(a.id),
          title: String(a.title ?? ""),
          body: String(a.content ?? ""),
          createdAt: a.createdAt ?? new Date().toISOString(),
          pinned: !!a.pinned,
          author: { name: "Organizasyon Ekibi" },
        }));
        if (mounted) setItems(normalized);
      } catch {
        if (mounted) {
          setErr("Duyurular alınamadı.");
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    const cloned = [...items];
    cloned.sort((a, b) => {
      const p = Number(!!b.pinned) - Number(!!a.pinned);
      if (p !== 0) return p;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return cloned;
  }, [items]);

  return (
    <section className="relative min-h-screen">
      {/* Arka plan video */}
      <VideoBG
        light={{
          webm: "/videos/light.webm",
          mp4: "/videos/bg-light.mp4",
          poster: "/videos/light-poster.jpg",
        }}
        dark={{
          webm: "/videos/dark.webm",
          mp4: "/videos/bg-dark.mp4",
          poster: "/videos/dark-poster.jpg",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{
            backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)",
          }}
        >
          <PageHeader
            title="Duyurular"
            desc="Güncel bilgilendirmeler, kurallar ve program notları"
            variant="plain"
          />

          {loading && <p className="text-sm opacity-80">Yükleniyor…</p>}
          {err && <p className="text-sm text-red-400">{err}</p>}

          <div className="space-y-6 mt-6">
            {sorted.map((a) => {
              const isOpen = openId === a.id;
              const raw = a.body ?? "";
              const showHTML = isOpen && isLikelyHTML(raw);

              return (
                <article
                  key={a.id}
                  className="relative rounded-xl p-5 backdrop-blur bg-white/5 dark:bg-black/20 border border-white/20 hover:border-transparent hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff] transition-all"
                >
                  <div className="flex items-center justify-between text-xs opacity-70 mb-2">
                    <span>{a.author?.name}</span>
                    <span>{fmtDate(a.createdAt)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                    {a.title}
                  </h3>

                  {showHTML ? (
                    <div
                      className="prose prose-invert mt-2 text-sm leading-relaxed max-w-none"
                      dangerouslySetInnerHTML={{ __html: raw }}
                    />
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]">
                      {isOpen ? raw : previewText(raw)}
                    </p>
                  )}

                  <button
                    onClick={() => setOpenId(isOpen ? null : a.id)}
                    className="mt-3 text-xs underline underline-offset-4 hover:opacity-90"
                  >
                    {isOpen ? "Kapat" : "Devamını oku"}
                  </button>
                </article>
              );
            })}

            {!loading && sorted.length === 0 && (
              <p className="text-sm opacity-75">Henüz duyuru yok.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
