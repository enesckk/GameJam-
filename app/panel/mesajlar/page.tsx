// app/panel/mesajlar/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Mail, Send, PlusCircle, Trash2, Edit2, Save, X, ExternalLink, Search } from "lucide-react";

type Person = { name: string; email: string; title?: string };
type Message = {
  id: string;
  subject: string;
  body: string;
  from: Person;
  to: Person;
  createdAt: string;
  updatedAt: string;
  read: boolean;
};
type Box = { inbox: Message[]; sent: Message[] };

const ADMINS: Person[] = [
  { name: "Etkinlik Koordinatörü", email: "admin@gamejam.local", title: "Koordinatör" },
  { name: "Teknik Sorumlu",       email: "tech@gamejam.local",  title: "Teknik Ekip" },
  { name: "İletişim Sorumlusu",   email: "comms@gamejam.local", title: "İletişim" },
];

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
  } catch { return s; }
}

export default function MessagesPage() {
  const [tab, setTab] = useState<"inbox" | "sent" | "compose">("inbox");
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // detail/edit state
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  // compose state
  const [toEmail, setToEmail] = useState(ADMINS[0].email);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // filters
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch("/api/messages", { cache: "no-store" });
        const j = await r.json();
        if (mounted) setBox(j);
      } catch {
        if (mounted) setErr("Mesajlar alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const inbox = box?.inbox || [];
  const sent = box?.sent || [];

  const unreadCount = useMemo(() => inbox.filter(m => !m.read).length, [inbox]);

  function match(m: Message, q: string) {
    if (!q) return true;
    const hay = [
      m.subject, m.body,
      m.from?.name, m.from?.email, m.from?.title,
      m.to?.name, m.to?.email, m.to?.title,
    ].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
    return hay.includes(q.toLocaleLowerCase("tr-TR"));
  }

  const filteredInbox = useMemo(
    () => inbox.filter(m => match(m, query)).filter(m => !unreadOnly || !m.read),
    [inbox, query, unreadOnly]
  );
  const filteredSent = useMemo(
    () => sent.filter(m => match(m, query)),
    [sent, query]
  );

  async function refresh() {
    const r = await fetch("/api/messages?refresh=1", { cache: "no-store" });
    if (r.ok) setBox(await r.json());
  }

  async function markRead(id: string) {
    // optimistik
    setBox(prev => prev ? ({ ...prev, inbox: prev.inbox.map(m => m.id === id ? { ...m, read: true } : m) }) : prev);
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mark_read", id }) });
  }

  async function remove(id: string, folder: "inbox"|"sent") {
    const r = await fetch(`/api/messages?id=${id}&box=${folder}`, { method: "DELETE" });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) { setErr(j?.message || "Silinemedi"); return; }
    setBox(j.box || j);
    setMsg("Mesaj silindi.");
  }

  function startEdit(m: Message) {
    setEditId(m.id);
    setEditSubject(m.subject);
    setEditBody(m.body);
  }
  async function saveEdit() {
    if (!editId) return;
    const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "edit", id: editId, subject: editSubject, body: editBody }) });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) { setErr(j?.message || "Kaydedilemedi"); return; }
    setBox(j.box || j);
    setMsg("Mesaj güncellendi.");
    setEditId(null);
  }

  const toPerson = useMemo(() => {
    const admin = ADMINS.find(a => a.email === toEmail) || ADMINS[0];
    return admin;
  }, [toEmail]);

  async function send() {
    setErr(null); setMsg(null);
    if (!subject.trim()) { setErr("Konu zorunlu."); return; }
    const r = await fetch("/api/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "compose", to: toPerson, subject: subject.trim(), body: body.trim() }),
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) { setErr(j?.message || "Gönderilemedi"); return; }
    setBox(j.box || j);
    setSubject(""); setBody("");
    setTab("sent");
    setMsg("Mesaj gönderildi.");
  }

  return (
    <div className="space-y-6">
      {/* Başlık: tema uyumlu siyah/beyaz */}
      <PageHeader title="Mesajlar" desc="Gelen kutusu, gönderilenler ve yeni mesaj oluştur" variant="plain" />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "inbox",  label: `Gelen (${inbox.length}${unreadCount ? ` / ${unreadCount} okunmamış` : ""})`,  icon: Mail },
          { key: "sent",   label: `Gönderilen (${sent.length})`, icon: Send },
          { key: "compose",label: "Yeni Oluştur", icon: PlusCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={[
              "rounded-xl px-3 py-2 text-sm font-medium transition backdrop-blur",
              tab === key ? "bg-foreground/10" : "bg-foreground/5 hover:bg-foreground/10",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
          </button>
        ))}

        {/* Arama kutusu */}
        {tab !== "compose" && (
          <div className="ml-auto flex items-center gap-2">
            <div className="group relative rounded-xl ring-1 ring-foreground/15 bg-foreground/5 focus-within:ring-foreground/25">
              <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 opacity-70">
                <Search className="h-4 w-4" />
              </div>
              <input
                value={query}
                onChange={(e)=> setQuery(e.target.value)}
                placeholder="Ara (konu, içerik, kişi, e-posta)…"
                className="w-64 bg-transparent pl-8 pr-3 py-2 outline-none text-sm"
              />
            </div>

            {/* Okunmamış filtresi (yalnız Gelen) */}
            {tab === "inbox" && (
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={unreadOnly} onChange={(e)=> setUnreadOnly(e.target.checked)} />
                Sadece okunmamış
              </label>
            )}
          </div>
        )}
      </div>

      {/* GELEN */}
      {tab === "inbox" && (
        <SectionCard title="Gelen" subtitle="Yönetimden size ulaşan mesajlar">
          <div className="space-y-2">
            {filteredInbox.map(m => (
              <div key={m.id} className="rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{m.subject}</div>
                    <div className="truncate text-xs opacity-80">
                      {m.from.name} • {m.from.email} {m.from.title ? `• ${m.from.title}` : ""} • {fmtDate(m.createdAt)}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!m.read && (
                      <button
                        onClick={()=>markRead(m.id)}
                        className="rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/20 hover:bg-foreground/10"
                      >
                        Okundu
                      </button>
                    )}
                    <button
                      onClick={()=>remove(m.id,"inbox")}
                      className="rounded-lg px-2 py-1 text-xs bg-red-600/85 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm leading-relaxed opacity-95">
                  {openId === m.id ? m.body : (m.body.length > 180 ? m.body.slice(0,180) + "…" : m.body)}
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setOpenId(openId === m.id ? null : m.id);
                      if (!m.read) markRead(m.id);
                    }}
                    className="text-xs underline underline-offset-4 hover:opacity-90"
                  >
                    {openId === m.id ? "Kapat" : "Devamını oku"}
                  </button>
                </div>
              </div>
            ))}
            {filteredInbox.length === 0 && (
              <p className="text-sm opacity-75">
                {inbox.length === 0 ? "Gelen mesaj yok." : "Aramanızla eşleşen okunmamış/mesaj bulunamadı."}
              </p>
            )}
          </div>
        </SectionCard>
      )}

      {/* GÖNDERİLEN */}
      {tab === "sent" && (
        <SectionCard title="Gönderilen" subtitle="Yönetime gönderdiğiniz mesajlar">
          {/* Admin kısayolları (ileride panel linki) */}
          <div className="mb-3 flex flex-wrap gap-2">
            {ADMINS.map(a => (
              <span key={a.email} className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 ring-foreground/20 bg-foreground/5">
                {a.name} {a.title ? `• ${a.title}` : ""}
                <button className="inline-flex items-center gap-1 rounded px-1 text-[10px] opacity-70 cursor-not-allowed" title="Yakında">
                  Panel <ExternalLink className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {filteredSent.map(m => {
              const isEdit = editId === m.id;
              return (
                <div key={m.id} className="rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {isEdit ? (
                          <input value={editSubject} onChange={e=>setEditSubject(e.target.value)}
                            className="w-full rounded-md bg-background/60 px-2 py-1 text-sm outline-none" />
                        ) : m.subject}
                      </div>
                      <div className="truncate text-xs opacity-80">
                        {m.to.name} • {m.to.email} {m.to.title ? `• ${m.to.title}` : ""} • {fmtDate(m.createdAt)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {isEdit ? (
                        <>
                          <button onClick={saveEdit} className="rounded-lg px-2 py-1 text-xs bg-emerald-600/90 text-white hover:bg-emerald-600">
                            <Save className="h-4 w-4" />
                          </button>
                          <button onClick={()=>setEditId(null)} className="rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/20 hover:bg-foreground/10">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(m)} className="rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/20 hover:bg-foreground/10">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={()=>remove(m.id,"sent")} className="rounded-lg px-2 py-1 text-xs bg-red-600/85 text-white hover:bg-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-sm leading-relaxed opacity-95">
                    {isEdit ? (
                      <textarea value={editBody} onChange={e=>setEditBody(e.target.value)}
                        rows={4} className="w-full rounded-md bg-background/60 px-2 py-2 outline-none" />
                    ) : (
                      <>{openId === m.id ? m.body : (m.body.length > 220 ? m.body.slice(0,220) + "…" : m.body)}</>
                    )}
                  </div>
                  {!isEdit && (
                    <div className="mt-2">
                      <button onClick={()=> setOpenId(openId === m.id ? null : m.id)} className="text-xs underline underline-offset-4 hover:opacity-90">
                        {openId === m.id ? "Kapat" : "Devamını oku"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredSent.length === 0 && (
              <p className="text-sm opacity-75">
                {sent.length === 0 ? "Gönderilmiş mesaj yok." : "Aramanızla eşleşen gönderilmiş mesaj bulunamadı."}
              </p>
            )}
          </div>
        </SectionCard>
      )}

      {/* YENİ OLUŞTUR */}
      {tab === "compose" && (
        <SectionCard title="Yeni Mesaj" subtitle="Yöneticiye mesaj gönderin">
          <div className="grid gap-3">
            {/* Admin seçimi */}
            <div>
              <label className="text-sm">Alıcı</label>
              <div className="group relative rounded-xl ring-1 ring-foreground/15 bg-foreground/5 focus-within:ring-foreground/25">
                <select
                  className="w-full bg-transparent px-3 py-2 outline-none"
                  value={toEmail}
                  onChange={(e)=> setToEmail(e.target.value)}
                >
                  {ADMINS.map(a => (
                    <option key={a.email} value={a.email}>
                      {a.name} {a.title ? `• ${a.title}` : ""} — {a.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Konu */}
            <div>
              <label className="text-sm">Konu</label>
              <div className="group relative rounded-xl ring-1 ring-foreground/15 bg-foreground/5 focus-within:ring-foreground/25">
                <input
                  className="w-full bg-transparent px-3 py-2 outline-none"
                  placeholder="Konu"
                  value={subject}
                  onChange={(e)=> setSubject(e.target.value)}
                />
              </div>
            </div>

            {/* Mesaj */}
            <div>
              <label className="text-sm">Mesaj</label>
              <div className="group relative rounded-xl ring-1 ring-foreground/15 bg-foreground/5 focus-within:ring-foreground/25">
                <textarea
                  rows={6}
                  className="w-full bg-transparent px-3 py-2 outline-none"
                  placeholder="Mesajınızı yazın…"
                  value={body}
                  onChange={(e)=> setBody(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={send}
                className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 hover:shadow-[0_8px_24px_rgba(99,102,241,.35)] active:scale-[0.99]"
              >
                Gönder
              </button>
              {err && <span className="text-sm text-red-300">{err}</span>}
              {msg && <span className="text-sm text-emerald-300">{msg}</span>}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
