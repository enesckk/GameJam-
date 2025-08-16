"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Inbox, Mail, Send, EyeOff, Trash2, ChevronDown, ChevronRight } from "lucide-react";

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
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Mesajlar</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => { setTab("inbox"); setPage(1); }}
          className={btn(tab === "inbox")}
        >
          <Inbox className="h-4 w-4" /> Gelen
        </button>
        <button
          onClick={() => { setTab("outbox"); setPage(1); }}
          className={btn(tab === "outbox")}
        >
          <Mail className="h-4 w-4" /> Giden
        </button>
        <button
          onClick={() => setTab("compose")}
          className={btn(tab === "compose")}
        >
          <Send className="h-4 w-4" /> Yeni
        </button>
      </div>

      {alert && <div className="rounded-lg bg-foreground/10 px-3 py-2 text-sm">{alert}</div>}

      {tab !== "compose" && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <input
              className="w-80 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
              placeholder={tab === "inbox" ? "Konu/içerik/gönderen ara…" : "Konu/içerik/alıcı ara…"}
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          {tab === "inbox" && (
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => { setOnlyUnread(e.target.checked); setPage(1); }}
              />
              Yalnızca okunmamış
            </label>
          )}
          <div className="ml-auto text-sm opacity-75">Toplam: <strong>{total}</strong></div>
        </div>
      )}

      {/* GELEN */}
      {tab === "inbox" && (
        <div className="rounded-2xl ring-1 ring-foreground/10 p-3">
          {loading && <div className="py-10 text-center opacity-70">Yükleniyor…</div>}
          {!loading && inbox.length === 0 && <div className="py-10 text-center opacity-70">Mesaj yok.</div>}
          <div className="grid gap-3">
            {inbox.map((m) => {
              const open = !!expanded[m.id];
              const unread = !m.readAt;
              return (
                <div
                  key={m.id}
                  className={[
                    "relative rounded-xl",
                    "bg-white/50 dark:bg-white/10 backdrop-blur-md",
                    open ? "ring-2 ring-violet-500" : "ring-1 ring-transparent hover:ring-violet-400",
                  ].join(" ")}
                >
                  <div
                    role="button"
                    onClick={() => { toggleExpand(m.id); if (!open && unread) markRead(m.id); }}
                    className="flex items-center justify-between px-3 py-2 hover:bg-violet-500/5"
                  >
                    <div className="flex items-center gap-3">
                      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <div className="font-semibold">{m.subject}</div>
                      <span className="text-xs opacity-70">Gönderen: {m.sender.name ?? m.sender.email}</span>
                      {unread && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold">
                          <EyeOff className="h-3 w-3" /> Yeni
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs opacity-70">{fmt(m.createdAt)}</div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteInbox(m.id); }}
                        className={chipBtn()}
                      >
                        <Trash2 className="h-4 w-4" /> Sil
                      </button>
                    </div>
                  </div>
                  {open && <div className="px-3 pb-3 text-sm whitespace-pre-wrap">{m.body}</div>}
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

      {/* GİDEN */}
      {tab === "outbox" && (
        <div className="rounded-2xl ring-1 ring-foreground/10 p-3">
          {loading && <div className="py-10 text-center opacity-70">Yükleniyor…</div>}
          {!loading && outbox.length === 0 && <div className="py-10 text-center opacity-70">Mesaj yok.</div>}
          <div className="grid gap-3">
            {outbox.map((m) => {
              const open = !!expanded[m.id];
              const anyRead = m.recipients.some((r) => r.readAt);
              return (
                <div
                  key={m.id}
                  className={[
                    "relative rounded-xl",
                    "bg-white/50 dark:bg-white/10 backdrop-blur-md",
                    open ? "ring-2 ring-violet-500" : "ring-1 ring-transparent hover:ring-violet-400",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-violet-500/5">
                    <div role="button" onClick={() => toggleExpand(m.id)} className="flex items-center gap-3">
                      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <div className="font-semibold">{m.subject}</div>
                      <span className="text-xs opacity-70">Alıcılar: {m.recipients.map((r) => r.name ?? r.email).join(", ")}</span>
                      {anyRead && <span className="text-[10px] rounded-full bg-foreground/10 px-2 py-0.5">Okundu var</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs opacity-70">{fmt(m.createdAt)}</div>
                      <button
                        type="button"
                        onClick={() => deleteOutbox(m.id)}
                        className={chipBtn()}
                      >
                        <Trash2 className="h-4 w-4" /> Sil
                      </button>
                    </div>
                  </div>
                  {open && <div className="px-3 pb-3 text-sm whitespace-pre-wrap">{m.body}</div>}
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

      {/* YENİ */}
      {tab === "compose" && (
        <div className="rounded-2xl ring-1 ring-foreground/10 p-4 bg-white/50 dark:bg-white/10 backdrop-blur-md">
          <p className="mb-3 text-sm opacity-80">Bu formdan gönderdiğin mesaj organizasyon ekibine (admin) iletilir.</p>
          <div className="grid gap-2">
            <label className="text-sm">Konu</label>
            <input
              className="rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
              value={subj}
              onChange={(e) => setSubj(e.target.value)}
            />
            <label className="text-sm">Mesaj</label>
            <textarea
              className="min-h-[140px] rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => { setSubj(""); setBody(""); }}
                className={chipBtn()}
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={send}
                disabled={sending}
                className={[
                  "rounded-lg px-3 py-2 text-sm text-[color:var(--background)]",
                  "bg-white/30 dark:bg-white/10 backdrop-blur-md",
                  "ring-2 ring-transparent hover:ring-violet-500 active:ring-violet-600 disabled:opacity-60",
                  "transition"
                ].join(" ")}
              >
                {sending ? "Gönderiliyor…" : "Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Sekme butonları — blur + görünmez kenarlık, hover’da renkli; aktifken kalıcı */
function btn(active: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
    "bg-white/30 dark:bg-white/10 backdrop-blur-md",
    active ? "ring-2 ring-violet-600" : "ring-2 ring-transparent hover:ring-violet-500 active:ring-violet-600",
  ].join(" ");
}

/** Küçük çip buton — blur + hover’da renkli kenarlık */
function chipBtn() {
  return [
    "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition",
    "bg-white/30 dark:bg-white/10 backdrop-blur-md",
    "ring-2 ring-transparent hover:ring-violet-500 active:ring-violet-600",
  ].join(" ");
}

function Pager({
  page, total, pageSize, onPrev, onNext,
}: { page: number; total: number; pageSize: number; onPrev: () => void; onNext: () => void; }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <div className="opacity-70">Toplam <strong>{total}</strong> mesaj • Sayfa <strong>{page}</strong> / {totalPages}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className={[
            "rounded-lg px-3 py-1 transition disabled:opacity-50",
            "bg-white/30 dark:bg-white/10 backdrop-blur-md",
            "ring-2 ring-transparent hover:ring-violet-500 active:ring-violet-600",
          ].join(" ")}
        >
          Önceki
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className={[
            "rounded-lg px-3 py-1 transition disabled:opacity-50",
            "bg-white/30 dark:bg-white/10 backdrop-blur-md",
            "ring-2 ring-transparent hover:ring-violet-500 active:ring-violet-600",
          ].join(" ")}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
