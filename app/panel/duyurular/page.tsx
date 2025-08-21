"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Pin, Tag, Megaphone, Calendar, User, ChevronDown, ChevronUp, ExternalLink, Bell } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body: string;
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
      <SectionCard>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-purple-200/80">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Duyurular yükleniyor...</span>
            </div>
          </div>
        )}
        
        {err && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <span className="text-sm text-red-200">{err}</span>
          </div>
        )}

        {/* Sabitlenen Duyurular */}
        {pinned.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Pin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Önemli Duyurular</h2>
            </div>
            
            <div className="space-y-4">
              {pinned.map(a => {
                const isOpen = openId === a.id;
                const raw = a.body ?? "";
                const showHTML = isOpen && isLikelyHTML(raw);

                return (
                  <article key={a.id} className="group relative overflow-hidden rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10 backdrop-blur-xl border border-yellow-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                            <Pin className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs font-semibold text-yellow-200">Sabitlenmiş</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-purple-200/80">
                            <Calendar className="h-3 w-3" />
                            {fmtDate(a.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                        {a.title}
                      </h3>

                      {/* Content */}
                      {showHTML ? (
                        <div
                          className="prose prose-invert mt-4 text-sm leading-relaxed opacity-95 max-w-none"
                          dangerouslySetInnerHTML={{ __html: raw }}
                        />
                      ) : (
                        <p className="mt-4 text-sm leading-relaxed opacity-95 text-purple-100">
                          {isOpen ? raw : previewText(raw)}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-purple-200/80">
                          <User className="h-3 w-3" />
                          <span>{a.author?.name ?? "Organizasyon Ekibi"}</span>
                        </div>
                        
                        <button
                          onClick={() => setOpenId(isOpen ? null : a.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
                        >
                          {isOpen ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Kapat
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4" />
                              Devamını Oku
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Diğer Duyurular */}
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Tüm Duyurular</h2>
            </div>
          )}
          
          {others.map(a => {
            const isOpen = openId === a.id;
            const raw = a.body ?? "";
            const showHTML = isOpen && isLikelyHTML(raw);

            return (
              <article key={a.id} className="group relative overflow-hidden rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-200/80">
                      <Calendar className="h-3 w-3" />
                      {fmtDate(a.createdAt)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 leading-tight">
                    {a.title}
                  </h3>

                  {/* Content */}
                  {showHTML ? (
                    <div
                      className="prose prose-invert mt-4 text-sm leading-relaxed opacity-95 max-w-none"
                      dangerouslySetInnerHTML={{ __html: raw }}
                    />
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed opacity-95 text-purple-100">
                      {isOpen ? raw : previewText(raw)}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-purple-200/80">
                      <User className="h-3 w-3" />
                      <span>{a.author?.name ?? "Organizasyon Ekibi"}</span>
                    </div>
                    
                    <button
                      onClick={() => setOpenId(isOpen ? null : a.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Kapat
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Devamını Oku
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {!loading && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Megaphone className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Henüz Duyuru Yok</h3>
              <p className="text-sm text-purple-200/80">Yeni duyurular burada görünecek</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}