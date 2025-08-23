"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla

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
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        text-white
        bg-gradient-to-br from-slate-950 via-slate-900/50 to-purple-950/30
      "
    >
      {/* Basitleştirilmiş arka plan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10
        "
      />
      
      {/* Katman B: küçük mesh - daha yumuşak */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-80
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.35),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.32),transparent_60%)]
          motion-safe:animate-[meshPanAlt_15s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      
      {/* Katman C: conic swirl - daha yavaş */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 -inset-[25%] opacity-70
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.4),rgba(139,92,246,.4),rgba(34,197,94,.3),rgba(14,165,233,.4))]
          motion-safe:animate-[swirl_25s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-20">
        {/* Hero Section - daha etkileyici */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
              Duyurular
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Güncel bilgilendirmeler, kurallar ve program notları
          </p>
        </div>

        {/* Duyurular Bölümü - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-amber-500/10 dark:shadow-orange-500/10
            hover:shadow-3xl hover:shadow-amber-500/20 dark:hover:shadow-orange-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Güncel Duyurular"
            desc="Game Jam ile ilgili en son bilgilendirmeler"
            variant="plain"
          />

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-amber-600 font-semibold">Yükleniyor…</span>
              </div>
            </div>
          )}
          
          {err && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <span className="text-red-600 font-semibold">{err}</span>
              </div>
            </div>
          )}

          <div className="space-y-8 mt-10">
            {sorted.map((a) => {
              const isOpen = openId === a.id;
              const raw = a.body ?? "";
              const showHTML = isOpen && isLikelyHTML(raw);

              return (
                <article
                  key={a.id}
                  className={`
                    group relative rounded-2xl p-8 backdrop-blur-sm
                    bg-gradient-to-br from-amber-500/10 to-orange-500/10
                    border border-amber-500/20
                    hover:scale-[1.02] hover:shadow-2xl
                    transition-all duration-500 ease-out
                    cursor-pointer
                    ${a.pinned ? 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {a.pinned && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.4 11A5 5 0 017 6h6a5 5 0 011.6 5H5.4z"/>
                              <path d="M5.4 11A5 5 0 017 6h6a5 5 0 011.6 5H5.4z"/>
                            </svg>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                          <span className="font-medium">{a.author?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span>{fmtDate(a.createdAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-white transition-colors duration-300">
                      {a.title}
                    </h3>

                    {/* Content */}
                    {showHTML ? (
                      <div
                        className="prose prose-invert mt-4 text-base leading-relaxed max-w-none group-hover:text-slate-200 transition-colors duration-300"
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    ) : (
                      <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                        {isOpen ? raw : previewText(raw)}
                      </p>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => setOpenId(isOpen ? null : a.id)}
                      className="
                        mt-6 inline-flex items-center gap-2 px-6 py-3
                        bg-gradient-to-r from-amber-500/20 to-orange-500/20
                        border border-amber-500/30 rounded-xl
                        text-amber-600 font-semibold
                        hover:from-amber-500/30 hover:to-orange-500/30
                        hover:scale-105 hover:shadow-lg
                        transition-all duration-300
                      "
                    >
                      <span>{isOpen ? "Kapat" : "Devamını oku"}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}

            {!loading && sorted.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-slate-500/20 to-gray-500/20 border border-slate-500/30 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-slate-500/20 flex items-center justify-center text-3xl">
                    📢
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Henüz Duyuru Yok
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Yakında güncel duyurular burada görünecek.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Bölümü */}
        <div className="text-center">
          <div className="
            relative p-10 rounded-3xl 
            bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 
            border border-amber-500/30 backdrop-blur-xl
            shadow-2xl shadow-amber-500/10
            hover:shadow-3xl hover:shadow-amber-500/20
            transition-all duration-500 hover:scale-[1.02]
            group
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Güncel Kalın!
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Duyuruları takip ederek Game Jam hakkında en güncel bilgilere ulaşın.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/kayit"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-gradient-to-r from-amber-600 to-orange-600 
                    hover:from-amber-500 hover:to-orange-500
                    text-white rounded-2xl font-bold text-lg
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                    shadow-lg
                  "
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                  </svg>
                  Kayıt Ol
                </a>
                <a
                  href="/takvim"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-transparent border-2 border-orange-500/50 
                    hover:bg-orange-500/10 hover:border-orange-500/70
                    text-orange-600 rounded-2xl font-bold text-lg
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  "
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  Takvimi Gör
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
