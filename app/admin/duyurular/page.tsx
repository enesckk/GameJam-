// app/admin/duyurular/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, PlusCircle, X, Pin, PinOff, Trash2, Pencil } from "lucide-react";

type A = { id: string; title: string; content: string; pinned: boolean; createdAt: string };

export default function AdminAnnouncementsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<A[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  // Inline "Yeni Duyuru" formu
  const [showCreate, setShowCreate] = useState(false);
  const [cTitle, setCTitle] = useState("");
  const [cContent, setCContent] = useState("");
  const [cPinned, setCPinned] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [showEdit, setShowEdit] = useState<null | A>(null);
  const [eTitle, setETitle] = useState("");
  const [eContent, setEContent] = useState("");
  const [ePinned, setEPinned] = useState(false);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fmt = (iso: string) => { try { return new Date(iso).toLocaleString("tr-TR"); } catch { return iso; } };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q, page, pageSize]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      params.set("pinnedFirst", "1");
      const r = await fetch(`/api/admin/announcements?${params.toString()}`, { credentials: "include", cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Liste alınamadı");
      setItems(j.items ?? []);
      setTotal(j.total ?? 0);
    } catch (e: any) {
      setItems([]); setTotal(0); setMsg(e?.message || "Hata");
    } finally { setLoading(false); }
  }

  async function reloadList() {
    await load();
  }

  // CREATE — inline form
  async function saveCreate() {
    setCreating(true); setMsg(null);
    try {
      const payload = { title: cTitle.trim(), content: cContent.trim(), pinned: cPinned };
      if (payload.title.length < 3 || payload.content.length < 3) {
        setMsg("Başlık ve içerik en az 3 karakter olmalı"); return;
      }
      const r = await fetch("/api/admin/announcements", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Kaydedilemedi");
      // temizle
      setCTitle(""); setCContent(""); setCPinned(false);
      setShowCreate(false);
      await reloadList();
    } catch (e: any) { setMsg(e?.message || "Hata"); }
    finally { setCreating(false); }
  }

  // EDIT — modal
  function openEdit(a: A) { setShowEdit(a); setETitle(a.title); setEContent(a.content); setEPinned(a.pinned); }
  async function saveEdit() {
    if (!showEdit) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/announcements/${showEdit.id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: eTitle.trim(), content: eContent.trim(), pinned: ePinned }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Güncellenemedi");
      setShowEdit(null);
      await reloadList();
    } catch (e: any) { setMsg(e?.message || "Hata"); }
    finally { setBusy(false); }
  }

  // DELETE
  async function removeAnnouncement(id: string) {
    if (!confirm("Duyuruyu silmek istiyor musunuz?")) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE", credentials: "include" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Silinemedi");
      await reloadList();
    } catch (e: any) { setMsg(e?.message || "Hata"); }
    finally { setBusy(false); }
  }

  async function quickTogglePinned(a: A) {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !a.pinned }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Güncellenemedi");
      await reloadList();
    } catch (e: any) { setMsg(e?.message || "Hata"); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Duyurular" variant="plain" desc="Duyuru oluştur, düzenle, sabitle veya sil" />

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          <input
            className="w-80 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
            placeholder="Başlık/İçerik ara…"
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
        >
          <PlusCircle className="h-4 w-4" /> {showCreate ? "Formu Gizle" : "Yeni Duyuru"}
        </button>
        <div className="ml-auto text-sm opacity-75">Toplam: <strong>{total}</strong></div>
      </div>

      {/* Inline Yeni Duyuru Formu */}
      {showCreate && (
        <AdminSectionCard title="Yeni Duyuru">
          <div className="grid gap-3">
            <div>
              <label className="text-sm">Başlık</label>
              <input
                className="w-full rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                value={cTitle}
                onChange={(e)=>setCTitle(e.target.value)}
                placeholder="Duyuru başlığı"
              />
            </div>
            <div>
              <label className="text-sm">İçerik</label>
              <textarea
                className="min-h-[120px] w-full rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                value={cContent}
                onChange={(e)=>setCContent(e.target.value)}
                placeholder="Duyuru içeriği…"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={cPinned} onChange={(e)=>setCPinned(e.target.checked)} />
              Sabit (katılımcı panelinde en üstte)
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setShowCreate(false); setCTitle(""); setCContent(""); setCPinned(false); }}
                className="rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={saveCreate}
                disabled={creating}
                className="rounded-lg px-3 py-2 text-sm text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 disabled:opacity-60"
              >
                {creating ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </AdminSectionCard>
      )}

      {/* Liste */}
      <AdminSectionCard>
        {loading && <div className="py-12 text-center opacity-70">Yükleniyor…</div>}
        {!loading && items.length === 0 && <div className="py-12 text-center opacity-70">Duyuru yok.</div>}

        <div className="grid gap-3">
          {items.map((a) => (
            <div
              key={a.id}
              className={[
                "relative rounded-2xl p-4 ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 transition",
                "group multicolor-hover hover:multicolor-persist hover:scale-[1.01]",
              ].join(" ")}
            >
              {/* renkli şerit: tıklama almasın */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-fuchsia-600 via-violet-600 to-cyan-500 opacity-60 group-hover:opacity-100"
              />

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{a.title}</h3>
                    {a.pinned && <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold">Sabit</span>}
                  </div>
                  <div className="mt-1 text-xs opacity-70">Yayın: <strong>{fmt(a.createdAt)}</strong></div>
                </div>

                {/* Eylemler */}
                <div className="relative z-[1] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quickTogglePinned(a)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                    title={a.pinned ? "Sabitlemeyi kaldır" : "Sabitle"}
                  >
                    {a.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />} {a.pinned ? "Kaldır" : "Sabitle"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(a)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" /> Düzenle
                  </button>

                  <button
                    type="button"
                    onClick={() => removeAnnouncement(a.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" /> Sil
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm">{a.content}</p>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="opacity-70">
            Toplam <strong>{total}</strong> duyuru • Sayfa <strong>{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
            >
              Önceki
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>

        {msg && <div className="mt-3 rounded-lg bg-foreground/10 px-3 py-2 text-sm">{msg}</div>}
      </AdminSectionCard>

      {/* Edit Modal (istersen bunu da inline'a çevirebiliriz) */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4" onClick={()=>setShowEdit(null)}>
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10 dark:bg-neutral-900 dark:text-white"
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Duyuruyu Düzenle</h3>
              <button type="button" className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10" onClick={()=>setShowEdit(null)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">Başlık</label>
                <input
                  className="w-full rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                  value={eTitle}
                  onChange={(e)=>setETitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">İçerik</label>
                <textarea
                  className="min-h-[120px] w-full rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                  value={eContent}
                  onChange={(e)=>setEContent(e.target.value)}
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={ePinned} onChange={(e)=>setEPinned(e.target.checked)} />
                Sabit
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5" onClick={()=>setShowEdit(null)}>Vazgeç</button>
              <button type="button" onClick={saveEdit} disabled={busy} className="rounded-lg px-3 py-2 text-sm text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 disabled:opacity-60">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
