// app/panel/duyurular/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Pin, Tag } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: { name: string; role?: string };
  pinned?: boolean;
  category?: string;
};

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
  } catch { return s; }
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
        if (mounted) setItems(j);
      } catch {
        if (mounted) setErr("Duyurular alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const pinned = useMemo(() => items.filter(i => i.pinned), [items]);
  const others = useMemo(() => items.filter(i => !i.pinned), [items]);

  return (
    <div className="space-y-6">
      {/* Başlık: tema uyumlu siyah/beyaz */}
      <PageHeader title="Duyurular" desc="Güncel bilgilendirmeler, kurallar ve program notları" variant="plain" />

      <SectionCard>
        {loading && <p className="text-sm opacity-80">Yükleniyor…</p>}
        {err && <p className="text-sm text-red-300">{err}</p>}

        {/* Sabitlenenler */}
        {pinned.length > 0 && (
          <div className="mb-4 space-y-3">
            {pinned.map(a => (
              <article
                key={a.id}
                className={[
                  "group relative overflow-hidden rounded-2xl p-4",
                  "bg-white/10 dark:bg-black/10 backdrop-blur",
                  "transition-transform duration-200 hover:scale-[1.01]",
                  "ring-1 ring-foreground/10 hover:ring-foreground/20",
                ].join(" ")}
              >
                {/* pin ve kategori */}
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-foreground/20 bg-foreground/5">
                    <Pin className="h-3 w-3" /> Sabit
                  </span>
                  {a.category && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-foreground/20 bg-foreground/5">
                      <Tag className="h-3 w-3" /> {a.category}
                    </span>
                  )}
                  <span className="opacity-70 ml-auto">{fmtDate(a.createdAt)}</span>
                </div>

                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                  {a.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed opacity-95">
                  {openId === a.id ? a.body : (a.body.length > 220 ? a.body.slice(0, 220) + "…" : a.body)}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                  <span>{a.author.name}{a.author.role ? ` • ${a.author.role}` : ""}</span>
                  <button
                    onClick={() => setOpenId(openId === a.id ? null : a.id)}
                    className="underline underline-offset-4 hover:opacity-90"
                  >
                    {openId === a.id ? "Kapat" : "Devamını oku"}
                  </button>
                </div>

                {/* hover efekti: çok hafif gradient parıltı */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{ background: "radial-gradient(1200px 200px at 10% 0%, color-mix(in oklab, var(--foreground) 10%, transparent), transparent)" }} />
              </article>
            ))}
          </div>
        )}

        {/* Diğer duyurular */}
        <div className="grid gap-3">
          {others.map(a => (
            <article
              key={a.id}
              className={[
                "group relative overflow-hidden rounded-2xl p-4",
                "bg-white/10 dark:bg-black/10 backdrop-blur",
                "transition-transform duration-200 hover:scale-[1.01]",
                "ring-1 ring-foreground/10 hover:ring-foreground/20",
              ].join(" ")}
            >
              <div className="mb-1 flex items-center gap-2 text-xs opacity-75">
                {a.category && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 ring-1 ring-foreground/20 bg-foreground/5">
                    <Tag className="h-3 w-3" /> {a.category}
                  </span>
                )}
                <span className="ml-auto">{fmtDate(a.createdAt)}</span>
              </div>

              {/* Başlık büyük ve belirgin */}
              <h3 className="text-lg md:text-xl font-bold tracking-tight">
                {a.title}
              </h3>

              {/* İçerik daha küçük */}
              <p className="mt-2 text-sm leading-relaxed opacity-95">
                {openId === a.id ? a.body : (a.body.length > 220 ? a.body.slice(0, 220) + "…" : a.body)}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                <span>{a.author.name}{a.author.role ? ` • ${a.author.role}` : ""}</span>
                <button
                  onClick={() => setOpenId(openId === a.id ? null : a.id)}
                  className="underline underline-offset-4 hover:opacity-90"
                >
                  {openId === a.id ? "Kapat" : "Devamını oku"}
                </button>
              </div>

              {/* hover efekti */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--foreground) 8%, transparent), transparent)" }} />
            </article>
          ))}

          {(!loading && items.length === 0) && (
            <p className="text-sm opacity-75">Henüz duyuru yok.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
