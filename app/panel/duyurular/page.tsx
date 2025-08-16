// app/panel/duyurular/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Pin, Tag } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body: string;        // content'ten doldurulacak
  createdAt: string;
  pinned?: boolean;
  // Opsiyonel/UI için:
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

// Kart rengi aynı kalır; hover’da sadece gradient border görünür
const CARD_HOVER = [
  "group relative overflow-hidden rounded-2xl p-4",
  "backdrop-blur bg-white/10 dark:bg-black/10",
  "transition-transform duration-200 hover:scale-[1.01]",
  "border-2 border-transparent",
  "rounded-3xl", // <— daha yuvarlak köşe
  "hover:[border-image:linear-gradient(90deg,#ff00ff,#7c3aed,#06b6d4)_1]",
  "focus-within:[border-image:linear-gradient(90deg,#ff00ff,#7c3aed,#06b6d4)_1]",
].join(" ");

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
          body: String(a.content ?? ""),              // <— content -> body
          createdAt: a.createdAt ?? new Date().toISOString(),
          pinned: !!a.pinned,
          author: { name: "Organizasyon Ekibi" },     // backend şu an göndermiyor
          category: null,
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
    return () => { mounted = false; };
  }, []);

  // Tarihe göre yeni→eski sırala, pinned üstte (backend de öyle döndürüyor; client'ta da garantili)
  const sorted = useMemo(() => {
    const cloned = [...items];
    cloned.sort((a, b) => {
      const p = Number(!!b.pinned) - Number(!!a.pinned);
      if (p !== 0) return p;
      return (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0);
    });
    return cloned;
  }, [items]);

  const pinned = useMemo(() => sorted.filter(i => !!i.pinned), [sorted]);
  const others = useMemo(() => sorted.filter(i => !i.pinned), [sorted]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyurular"
        desc="Güncel bilgilendirmeler, kurallar ve program notları"
        variant="plain"
      />

      <SectionCard>
        {loading && <p className="text-sm opacity-80">Yükleniyor…</p>}
        {err && <p className="text-sm text-red-300">{err}</p>}

        {/* Sabitlenenler — en üstte */}
        {pinned.length > 0 && (
          <div className="mb-4 space-y-3">
            {pinned.map(a => {
              const isOpen = openId === a.id;
              const raw = a.body ?? "";
              const showHTML = isOpen && isLikelyHTML(raw);

              return (
                <article key={a.id} className={CARD_HOVER} tabIndex={0} style={{
    borderRadius: "1rem", // burada istediğin kadar yuvarlak yapabilirsin
  }}>
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
                      className="underline underline-offset-4 hover:opacity-90"
                    >
                      {isOpen ? "Kapat" : "Devamını oku"}
                    </button>
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
                    style={{ background: "radial-gradient(1200px 200px at 10% 0%, color-mix(in oklab, var(--foreground) 10%, transparent), transparent)" }}
                  />
                </article>
              );
            })}
          </div>
        )}

        {/* Diğer duyurular */}
        <div className="grid gap-3">
          {others.map(a => {
            const isOpen = openId === a.id;
            const raw = a.body ?? "";
            const showHTML = isOpen && isLikelyHTML(raw);

            return (
              <article key={a.id} className={CARD_HOVER} tabIndex={0}>
                <div className="mb-1 flex items-center gap-2 text-xs opacity-75">
                  {/* İleride kategori eklersen: <Tag .../> */}
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
                    className="underline underline-offset-4 hover:opacity-90"
                  >
                    {isOpen ? "Kapat" : "Devamını oku"}
                  </button>
                </div>

                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
                  style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--foreground) 8%, transparent), transparent)" }}
                />
              </article>
            );
          })}

          {!loading && sorted.length === 0 && (
            <p className="text-sm opacity-75">Henüz duyuru yok.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
