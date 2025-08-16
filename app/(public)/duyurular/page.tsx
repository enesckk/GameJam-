"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla
// SectionCard artık gerekmiyor; dış kapsayıcıyı About'taki gibi gborder yapıyoruz
import { Pin } from "lucide-react";
import VideoBG from "@/components/background/video-bg";

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
  try {
    return new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
  } catch { return s; }
}

function isLikelyHTML(s: string) {
  return typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);
}
function stripTags(s: string) {
  try { return s.replace(/<[^>]*>/g, " "); } catch { return s; }
}
function previewText(raw: string, limit = 220) {
  const plain = isLikelyHTML(raw) ? stripTags(raw) : raw;
  return plain.length > limit ? plain.slice(0, limit) + "…" : plain;
}

// API yanıtını diziye normalize et
function toArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.items)) return x.items;
  if (x && Array.isArray(x.announcements)) return x.announcements;
  return [];
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
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
      setErr("Duyurular alınamadı.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Pinned üstte, sonra yeni→eski
  const sorted = useMemo(() => {
    const c = [...items];
    c.sort((a, b) => {
      const p = Number(!!b.pinned) - Number(!!a.pinned);
      if (p !== 0) return p;
      return (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0);
    });
    return c;
  }, [items]);

  const pinned = useMemo(() => sorted.filter(i => !!i.pinned), [sorted]);
  const others = useMemo(() => sorted.filter(i => !i.pinned), [sorted]);

  return (
    <section className="relative min-h-screen">
      {/* 🎥 Arka plan video — About ile aynı */}
      <VideoBG
        light={{ webm: "/videos/light.webm", mp4: "/videos/bg-light.mp4", poster: "/videos/light-poster.jpg" }}
        dark={{ webm: "/videos/dark.webm", mp4: "/videos/bg-dark.mp4", poster: "/videos/dark-poster.jpg" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Duyurular"
            desc="Güncel bilgilendirmeler, kurallar ve program notları"
            variant="plain"
          />

          {/* Hata / yükleniyor */}
          {err && (
            <div className="mb-4 flex items-center gap-3">
              <p className="text-sm text-red-300">Duyurular alınamadı.</p>
              <button onClick={load} className="text-sm transition hover:font-semibold">
                Tekrar dene
              </button>
            </div>
          )}
          {loading && (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl p-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm">
                  <div className="h-3 w-24 mb-2 bg-white/20 dark:bg-white/10 rounded" />
                  <div className="h-5 w-3/4 mb-2 bg-white/30 dark:bg-white/10 rounded" />
                  <div className="h-3 w-full mb-1 bg-white/20 dark:bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-white/20 dark:bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Sabitlenenler */}
          {!loading && pinned.length > 0 && (
            <div className="mt-4 mb-6 space-y-4">
              {pinned.map((a) => {
                const isOpen = openId === a.id;
                const raw = a.body ?? "";
                const showHTML = isOpen && isLikelyHTML(raw);

                return (
                  <article
                    key={a.id}
                    className="rounded-xl p-5 bg-white/10 dark:bg-black/10 backdrop-blur-sm gborder"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-[color:var(--foreground)]/20 bg-[color:var(--foreground)]/5">
                        <Pin className="h-3 w-3" /> Sabit
                      </span>
                      <span className="opacity-70 ml-auto" style={{ color: "var(--foreground)" }}>
                        {fmtDate(a.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
                      {a.title}
                    </h3>

                    {showHTML ? (
                      <div
                        className="mt-2 text-sm leading-relaxed opacity-95"
                        style={{ color: "var(--foreground)" }}
                        // backend'de sanitize etmeyi unutma
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed opacity-95" style={{ color: "var(--foreground)" }}>
                        {isOpen ? raw : previewText(raw)}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs opacity-85" style={{ color: "var(--foreground)" }}>
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

          {/* Diğerleri */}
          {!loading && (
            <div className="grid gap-4">
              {others.map((a) => {
                const isOpen = openId === a.id;
                const raw = a.body ?? "";
                const showHTML = isOpen && isLikelyHTML(raw);

                return (
                  <article
                    key={a.id}
                    className="rounded-xl p-5 bg-white/10 dark:bg-black/10 backdrop-blur-sm"
                    style={{
                      // About'taki ince ayırıcı hissi için alt çizgi gibi gradient hat
                      boxShadow:
                        "inset 0 -1px 0 color-mix(in oklab, var(--foreground) 10%, transparent)",
                    }}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs opacity-75" style={{ color: "var(--foreground)" }}>
                      <span className="ml-auto">{fmtDate(a.createdAt)}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                      {a.title}
                    </h3>

                    {showHTML ? (
                      <div
                        className="mt-2 text-sm leading-relaxed opacity-95"
                        style={{ color: "var(--foreground)" }}
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed opacity-95" style={{ color: "var(--foreground)" }}>
                        {isOpen ? raw : previewText(raw)}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs opacity-85" style={{ color: "var(--foreground)" }}>
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

              {!err && sorted.length === 0 && (
                <p className="text-sm opacity-75" style={{ color: "var(--foreground)" }}>
                  Henüz duyuru yok.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
