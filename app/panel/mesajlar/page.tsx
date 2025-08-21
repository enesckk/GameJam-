"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Inbox, Mail, Send, EyeOff, Trash2, ChevronDown, ChevronRight, MessageSquare, Clock, User, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Plus } from "lucide-react";

type InboxItem = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
  readAt: string | null;
};
type OutboxItem = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  recipients: { id: string; name: string | null; email: string; readAt: string | null }[];
};

export default function UserMessagesPage() {
  const [tab, setTab] = useState<"inbox" | "outbox" | "compose">("inbox");
  const [q, setQ] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  const [loading, setLoading] = useState(false);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [alert, setAlert] = useState<string | null>(null);

  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (tab === "compose") return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setAlert(null);
      try {
        const sp = new URLSearchParams();
        sp.set("box", tab);
        if (q) sp.set("q", q);
        if (tab === "inbox" && onlyUnread) sp.set("unread", "1");
        sp.set("page", String(page));
        sp.set("pageSize", String(pageSize));

        const r = await fetch(`/api/messages?${sp.toString()}`, { credentials: "include", cache: "no-store" });
        const j = await r.json();
        if (!ignore) {
          if (!r.ok) throw new Error(j?.message || "Liste alınamadı");
          setTotal(j.total ?? 0);
          if (tab === "inbox") setInbox(j.items ?? []);
          else setOutbox(j.items ?? []);
        }
      } catch (e: any) {
        if (!ignore) {
          setTotal(0); setInbox([]); setOutbox([]);
          setAlert(e?.message || "Hata oluştu");
        }
      } finally { if (!ignore) setLoading(false); }
    })();
    return () => { ignore = true; };
  }, [tab, q, onlyUnread, page, pageSize]);

  const fmt = (iso: string) => { try { return new Date(iso).toLocaleString("tr-TR"); } catch { return iso; } };
  const toggleExpand = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  async function markRead(id: string) {
    try {
      await fetch("/api/messages/read", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: id }),
      });
      setInbox((prev) => prev.map((m) => (m.id === id ? { ...m, readAt: m.readAt ?? new Date().toISOString() } : m)));
    } catch {}
  }

  async function deleteInbox(id: string) {
    if (!confirm("Bu mesajı gelen kutundan silmek istiyor musun?")) return;
    try {
      const r = await fetch(`/api/messages/${id}?box=inbox`, { method: "DELETE", credentials: "include" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Silinemedi");
      setInbox((prev) => prev.filter((m) => m.id !== id));
      setAlert("Mesaj silindi.");
    } catch (e: any) {
      setAlert(e?.message || "Hata");
    }
  }

  async function deleteOutbox(id: string) {
    if (!confirm("Gönderdiğin mesaj silinsin mi?")) return;
    try {
      const r = await fetch(`/api/messages/${id}?box=outbox`, { method: "DELETE", credentials: "include" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Silinemedi");
      setOutbox((prev) => prev.filter((m) => m.id !== id));
      setAlert("Mesaj silindi.");
    } catch (e: any) {
      setAlert(e?.message || "Hata");
    }
  }

  async function send() {
    setSending(true);
    setAlert(null);
    try {
      const payload = { subject: subj.trim(), body: body.trim() };
      const r = await fetch("/api/messages", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Gönderilemedi");
      setSubj(""); setBody("");
      setAlert("Mesajın yetkili ekibe gönderildi.");
      setTab("outbox"); setPage(1);
    } catch (e: any) {
      setAlert(e?.message || "Hata");
    } finally { setSending(false); }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Mesajlar</h1>
              <p className="text-purple-200/80">Organizasyon ekibi ile iletişim</p>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-purple-100 max-w-2xl">
            Sorularınız, önerileriniz veya teknik destek ihtiyacınız için organizasyon ekibi ile 
            iletişime geçebilirsiniz. Mesajlarınız en kısa sürede yanıtlanacaktır.
          </p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex items-center gap-3">
        {[
          { id: "inbox", label: "Gelen Kutusu", icon: Inbox, color: "from-blue-500 to-cyan-500" },
          { id: "outbox", label: "Giden Kutusu", icon: Mail, color: "from-green-500 to-emerald-500" },
          { id: "compose", label: "Yeni Mesaj", icon: Send, color: "from-purple-500 to-pink-500" },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => { 
              if (item.id !== "compose") setPage(1);
              setTab(item.id as any);
            }} 
            className={`group relative overflow-hidden rounded-2xl px-6 py-3 transition-all duration-300 ${
              tab === item.id 
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-lg" 
                : "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:from-white/20 hover:to-white/10"
            } backdrop-blur-xl border`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                tab === item.id 
                  ? "bg-gradient-to-br from-purple-500 to-pink-600" 
                  : `bg-gradient-to-br ${item.color}`
              }`}>
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <span className={`font-medium ${
                tab === item.id ? "text-white" : "text-purple-200 hover:text-white"
              }`}>
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Alert */}
      {alert && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-green-200">{alert}</span>
        </div>
      )}

      {/* Search and Filters */}
      {tab !== "compose" && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300 z-10" />
              <input
                className="w-full rounded-xl bg-white/20 backdrop-blur-sm pl-10 pr-4 py-3 text-sm outline-none border border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                placeholder={tab === "inbox" ? "Konu/içerik/gönderen ara…" : "Konu/içerik/alıcı ara…"}
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {tab === "inbox" && (
                <label className="flex items-center gap-2 text-sm text-purple-200">
                  <input
                    type="checkbox"
                    checked={onlyUnread}
                    onChange={(e) => { setOnlyUnread(e.target.checked); setPage(1); }}
                    className="rounded border-purple-500/30 bg-white/20"
                  />
                  Yalnızca okunmamış
                </label>
              )}
              
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <MessageSquare className="h-4 w-4" />
                Toplam: <strong className="text-white">{total}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {tab === "inbox" && (
        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-purple-200/80">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Mesajlar yükleniyor...</span>
              </div>
            </div>
          )}
          
          {!loading && inbox.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Inbox className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gelen Kutusu Boş</h3>
              <p className="text-sm text-purple-200/80">Henüz mesajınız bulunmuyor</p>
            </div>
          )}
          
          <div className="space-y-3">
            {inbox.map((m) => {
              const open = !!expanded[m.id];
              const unread = !m.readAt;
              return (
                <div key={m.id} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 hover:scale-[1.02] transition-all duration-300">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    unread 
                      ? "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" 
                      : "bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5"
                  }`}></div>
                  
                  <div className="relative z-10 p-6">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => { toggleExpand(m.id); if (!open && unread) markRead(m.id); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpand(m.id); if (!open && unread) markRead(m.id); }}}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {open ? <ChevronDown className="h-5 w-5 text-purple-300" /> : <ChevronRight className="h-5 w-5 text-purple-300" />}
                          
                          {unread && (
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-lg"></div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white">{m.subject}</h3>
                            {unread && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-2 py-1 text-xs font-bold">
                                <EyeOff className="h-3 w-3" /> Yeni
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-purple-200/80">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{m.sender.name ?? m.sender.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <time dateTime={m.createdAt}>{fmt(m.createdAt)}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteInbox(m.id); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Sil</span>
                      </button>
                    </div>
                    
                    {open && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="text-sm leading-relaxed text-purple-100 whitespace-pre-wrap">
                          {m.body}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Pager
            page={page}
            total={total}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      )}

      {tab === "outbox" && (
        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-purple-200/80">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Mesajlar yükleniyor...</span>
              </div>
            </div>
          )}
          
          {!loading && outbox.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Giden Kutusu Boş</h3>
              <p className="text-sm text-purple-200/80">Henüz mesaj göndermediniz</p>
            </div>
          )}
          
          <div className="space-y-3">
            {outbox.map((m) => {
              const open = !!expanded[m.id];
              const anyRead = m.recipients.some((r) => r.readAt);
              return (
                <div key={m.id} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl border border-green-500/20 hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleExpand(m.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpand(m.id); }}}
                        className="flex items-center gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {open ? <ChevronDown className="h-5 w-5 text-green-300" /> : <ChevronRight className="h-5 w-5 text-green-300" />}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white">{m.subject}</h3>
                            {anyRead && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 text-xs font-bold">
                                <CheckCircle className="h-3 w-3" /> Okundu
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-green-200/80">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>Alıcılar: {m.recipients.map((r) => r.name ?? r.email).join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <time dateTime={m.createdAt}>{fmt(m.createdAt)}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => deleteOutbox(m.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Sil</span>
                      </button>
                    </div>
                    
                    {open && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="text-sm leading-relaxed text-green-100 whitespace-pre-wrap">
                          {m.body}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Pager
            page={page}
            total={total}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      )}

      {tab === "compose" && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Yeni Mesaj</h3>
              <p className="text-sm text-purple-200/80">Organizasyon ekibine mesaj gönder</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Konu</label>
              <input
                className="w-full rounded-xl bg-white/20 backdrop-blur-sm px-4 py-3 text-sm outline-none border border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                value={subj}
                onChange={(e) => setSubj(e.target.value)}
                placeholder="Mesaj konusunu girin..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Mesaj</label>
              <textarea
                className="w-full min-h-[200px] rounded-xl bg-white/20 backdrop-blur-sm px-4 py-3 text-sm outline-none border border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setSubj(""); setBody(""); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 border border-gray-500/30 hover:border-gray-500/50 transition-all duration-200 text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Temizle
              </button>
              
              <button
                type="button"
                onClick={send}
                disabled={sending || !subj.trim() || !body.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg"
              >
                <Send className="h-4 w-4" />
                {sending ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pager({
  page, total, pageSize, onPrev, onNext,
}: { page: number; total: number; pageSize: number; onPrev: () => void; onNext: () => void; }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20">
      <div className="text-sm text-purple-200">
        Toplam <strong className="text-white">{total}</strong> mesaj • Sayfa <strong className="text-white">{page}</strong> / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Önceki
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}