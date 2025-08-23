"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import {
  Search,
  PlusCircle,
  X,
  Pin,
  PinOff,
  Trash2,
  Pencil,
  Megaphone,
  Calendar,
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

  async function reloadList() { await load(); }

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-50"></div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <Megaphone className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Duyurular
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Duyuru oluştur, düzenle, sabitle veya sil
              </p>
            </div>
          </div>

          {/* Search and Create */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-[min(24rem,90vw)]">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:p-3 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-full bg-transparent outline-none text-white placeholder-white/70"
                  placeholder="Başlık/İçerik ara…"
                  value={q}
                  onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate((s) => !s)}
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlusCircle className="h-5 w-5 relative z-10" />
              </div>
              <span className="relative z-10">
                {showCreate ? "Formu Gizle" : "Yeni Duyuru"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
        <div className="text-sm text-slate-600 ">
          Toplam <strong className="text-slate-900 dark:text-white">{total}</strong> duyuru
        </div>
      </div>

      {/* Inline Yeni Duyuru Formu */}
      {showCreate && (
        <AdminSectionCard title="Yeni Duyuru">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700  mb-2 block">
                Başlık
              </label>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 sm:p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-orange-300 group-focus-within:shadow-lg group-focus-within:shadow-orange-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                  <Megaphone className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                  <input
                    className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                    value={cTitle}
                    onChange={(e)=>setCTitle(e.target.value)}
                    placeholder="Duyuru başlığı"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700  mb-2 block">
                İçerik
              </label>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 group-focus-within:border-orange-300 group-focus-within:shadow-lg group-focus-within:shadow-orange-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                  <textarea
                    className="min-h-[120px] w-full bg-transparent outline-none p-3 sm:p-4 text-slate-900 dark:text-white placeholder-slate-500 resize-y"
                    value={cContent}
                    onChange={(e)=>setCContent(e.target.value)}
                    placeholder="Duyuru içeriği…"
                  />
                </div>
              </div>
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 ">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={cPinned}
                  onChange={(e)=>setCPinned(e.target.checked)}
                  className="sr-only"
                />
                <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200 ${
                  cPinned ? "border-orange-500 bg-orange-500" : "border-slate-300 dark:border-slate-600"
                }`}>
                  {cPinned && <Pin className="h-3 w-3 text-white" />}
                </div>
              </div>
              Sabit (katılımcı panelinde en üstte)
            </label>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowCreate(false); setCTitle(""); setCContent(""); setCPinned(false); }}
                className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 "
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={saveCreate}
                disabled={creating}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:shadow-orange-500/25"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Save className="h-4 w-4 relative z-10" />
                </div>
                <span className="relative z-10">
                  {creating ? "Kaydediliyor…" : "Kaydet"}
                </span>
              </button>
            </div>
          </div>
        </AdminSectionCard>
      )}

      {/* Liste */}
      <AdminSectionCard>
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500"></div>
              <span className="text-slate-600  font-medium">Yükleniyor…</span>
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-8 py-6">
              <Megaphone className="h-12 w-12 text-slate-400" />
              <div>
                <div className="text-lg font-semibold text-slate-700 ">Duyuru yok</div>
                <div className="text-sm text-slate-500 ">Henüz hiç duyuru oluşturulmamış</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {items.map((a) => (
            <div
              key={a.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 dark:border-slate-700/60 dark:bg-slate-800/80"
            >
              {/* Pinned indicator */}
              {a.pinned && (
                <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-red-600 text-white px-3 py-1 rounded-bl-2xl text-xs font-bold shadow-lg">
                  <Pin className="h-3 w-3 inline mr-1" />
                  Sabit
                </div>
              )}

              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {a.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500  mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Yayın: <strong>{fmt(a.createdAt)}</strong></span>
                    </div>
                    <p className="text-slate-700  leading-relaxed break-words">
                      {a.content}
                    </p>
                  </div>

                  {/* Eylemler */}
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                    <button
                      type="button"
                      onClick={() => quickTogglePinned(a)}
                      disabled={busy}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 ${
                        a.pinned
                          ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
                          : "bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300"
                      }`}
                      title={a.pinned ? "Sabitlemeyi kaldır" : "Sabitle"}
                    >
                      {a.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      {a.pinned ? "Kaldır" : "Sabitle"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300"
                      title="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </button>

                    <button
                      type="button"
                      onClick={() => removeAnnouncement(a.id)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-600 ">
            Toplam <strong className="text-slate-900 dark:text-white">{total}</strong> duyuru • Sayfa{" "}
            <strong className="text-slate-900 dark:text-white">{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Önceki
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              Sonraki
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {msg && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 sm:p-4 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400">Hata</div>
              <div className="text-sm text-red-600 dark:text-red-300">{msg}</div>
            </div>
          </div>
        )}
      </AdminSectionCard>

      {/* Edit Modal */}
      {showEdit && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm"
          onClick={()=>setShowEdit(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-slate-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Duyuruyu Düzenle</h3>
              <button
                type="button"
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                onClick={()=>setShowEdit(null)}
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Başlık
                </label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 sm:p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-orange-300 group-focus-within:shadow-lg group-focus-within:shadow-orange-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                    <Megaphone className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                    <input
                      className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                      value={eTitle}
                      onChange={(e)=>setETitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  İçerik
                </label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 group-focus-within:border-orange-300 group-focus-within:shadow-lg group-focus-within:shadow-orange-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                    <textarea
                      className="min-h-[120px] w-full bg-transparent outline-none p-3 sm:p-4 text-slate-900 dark:text-white placeholder-slate-500 resize-y"
                      value={eContent}
                      onChange={(e)=>setEContent(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 ">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={ePinned}
                    onChange={(e)=>setEPinned(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200 ${
                    ePinned ? "border-orange-500 bg-orange-500" : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {ePinned && <Pin className="h-3 w-3 text-white" />}
                  </div>
                </div>
                Sabit
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <button
                type="button"
                className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 "
                onClick={()=>setShowEdit(null)}
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={busy}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:shadow-orange-500/25"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Save className="h-4 w-4 relative z-10" />
                </div>
                <span className="relative z-10">Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
