// app/panel/teslim/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Plus, Save, X, Edit3, Trash2, Link2, Tag, Loader2 } from "lucide-react";

type SubmissionItem = {
  id: string;
  title: string;
  description: string | null;
  itchUrl: string | null;
  githubUrl: string | null;   // eski repoUrl yerine
  buildUrl: string | null;
  videoUrl: string | null;
  note: string | null;
  createdAt: string;
  user?: { name: string | null; email: string };
  team?: { name: string } | null;
  tags: string[];
};

const wrap =
  "group relative rounded-xl transition input-frame ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)] focus-within:ring-transparent";
const input =
  "w-full bg-transparent outline-none px-3 py-2 text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]";
const ta =
  "w-full min-h-[84px] resize-y bg-transparent outline-none px-3 py-2 text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]";

const normTag = (x: string) =>
  x.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 32);

export default function TeslimPage() {
  // Liste
  const [items, setItems] = useState<SubmissionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Yeni teslim formu
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itchUrl, setItchUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [buildUrl, setBuildUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [note, setNote] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // Düzenleme
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<SubmissionItem>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Basit validasyon
  const formOk = useMemo(() => {
    if (title.trim().length < 3) return false;
    const anyLink = [itchUrl, githubUrl, buildUrl, videoUrl].some((u) => u.trim().length > 0);
    return anyLink;
  }, [title, itchUrl, githubUrl, buildUrl, videoUrl]);

  // İlk yükleme
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/submissions?take=100&skip=0`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        if (!r.ok) {
          setErr(j?.message || "Teslimler alınamadı");
          return;
        }
        setItems(j.items || []);
        setTotal(j.total || 0);
      } catch {
        if (mounted) setErr("Bağlantı hatası");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Etiket girişine boşluk/virgül/enter ile ekleme
  function tryPushTagFromInput() {
    const t = normTag(tagInput);
    if (!t) return;
    if (!tags.includes(t)) setTags((s) => [...s, t]);
    setTagInput("");
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      tryPushTagFromInput();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length) {
      // son tag'i geri al
      setTags((s) => s.slice(0, -1));
    }
  }

  function removeTag(i: number) {
    setTags((s) => s.filter((_, idx) => idx !== i));
  }

  async function createSubmission() {
    setMsg(null);
    setErr(null);
    if (!formOk) {
      setErr("Başlık en az 3 karakter olmalı ve en az bir bağlantı boş olmamalı.");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        itchUrl: itchUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        buildUrl: buildUrl.trim() || null,
        videoUrl: videoUrl.trim() || null,
        note: note.trim() || null,
        tags,
      };
      const r = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j?.message || "Teslim oluşturulamadı.");
        return;
      }
      setItems((s) => [j.item as SubmissionItem, ...s]);
      setTotal((n) => n + 1);
      // Formu sıfırla
      setTitle("");
      setDescription("");
      setItchUrl("");
      setGithubUrl("");
      setBuildUrl("");
      setVideoUrl("");
      setNote("");
      setTags([]);
      setTagInput("");
      setMsg("Teslim oluşturuldu.");
    } catch {
      setErr("Bağlantı hatası");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(it: SubmissionItem) {
    setEditingId(it.id);
    setEdit({
      id: it.id,
      title: it.title,
      description: it.description ?? "",
      itchUrl: it.itchUrl ?? "",
      githubUrl: it.githubUrl ?? "",
      buildUrl: it.buildUrl ?? "",
      videoUrl: it.videoUrl ?? "",
      note: it.note ?? "",
      tags: it.tags ?? [],
    });
  }
  function cancelEdit() {
    setEditingId(null);
    setEdit({});
  }
  function updateEdit<K extends keyof SubmissionItem>(key: K, v: any) {
    setEdit((s) => ({ ...s, [key]: v }));
  }

  async function saveEdit() {
    if (!editingId) return;
    setSavingEdit(true);
    setMsg(null);
    setErr(null);
    try {
      const payload: any = {
        id: editingId,
        title: (edit.title || "").toString().trim(),
        description: (edit.description || "").toString().trim(),
        itchUrl: (edit.itchUrl || "").toString().trim(),
        githubUrl: (edit.githubUrl || "").toString().trim(),
        buildUrl: (edit.buildUrl || "").toString().trim(),
        videoUrl: (edit.videoUrl || "").toString().trim(),
        note: (edit.note || "").toString().trim(),
        // etiketleri komple değiştir
        tagsReplace: Array.isArray(edit.tags)
          ? Array.from(new Set(edit.tags.map(normTag))).filter(Boolean).slice(0, 30)
          : [],
      };
      const r = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j?.message || "Güncellenemedi");
        return;
      }
      setItems((list) => list.map((x) => (x.id === editingId ? (j.item as SubmissionItem) : x)));
      setMsg("Güncellendi.");
      cancelEdit();
    } catch {
      setErr("Bağlantı hatası");
    } finally {
      setSavingEdit(false);
    }
  }

  async function removeSubmission(id: string) {
    if (!confirm("Bu teslimi silmek istediğinize emin misiniz?")) return;
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(j?.message || "Silinemedi");
        return;
      }
      setItems((s) => s.filter((x) => x.id !== id));
      setTotal((n) => Math.max(0, n - 1));
      setMsg("Teslim silindi.");
    } catch {
      setErr("Bağlantı hatası");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Oyun Teslimi"
        desc="Projeni yükle, bağlantılarını ekle ve etiketle. Adminler tüm teslimleri görebilir."
        variant="plain"
      />

      {/* Yeni Teslim Oluştur */}
      <SectionCard
        title="Yeni Teslim"
        subtitle="Başlık ve en az bir bağlantı zorunlu"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm">Başlık</label>
            <div className={wrap}>
              <input
                className={input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. Space Runner"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Açıklama (opsiyonel)</label>
            <div className={wrap}>
              <textarea
                className={ta}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kısa bir açıklama..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" /> Itch.io URL</label>
            <div className={wrap}>
              <input className={input} value={itchUrl} onChange={(e) => setItchUrl(e.target.value)} placeholder="https://itch.io/..." />
            </div>
          </div>
          <div>
            <label className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" /> GitHub URL</label>
            <div className={wrap}>
              <input className={input} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
          </div>
          <div>
            <label className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" /> Build URL</label>
            <div className={wrap}>
              <input className={input} value={buildUrl} onChange={(e) => setBuildUrl(e.target.value)} placeholder="https://drive/zip/..." />
            </div>
          </div>
          <div>
            <label className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" /> Video URL</label>
            <div className={wrap}>
              <input className={input} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Not (opsiyonel)</label>
            <div className={wrap}>
              <textarea
                className={ta}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Jüriye kısa not..."
              />
            </div>
          </div>

          {/* Etiketler */}
          <div className="md:col-span-2">
            <label className="text-sm flex items-center gap-2"><Tag className="h-4 w-4" /> Etiketler</label>
            <div className={[wrap, "flex flex-wrap items-center gap-2 p-2"].join(" ")}>
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] bg-background/50"
                >
                  {t}
                  <button
                    onClick={() => removeTag(i)}
                    className="rounded p-0.5 hover:bg-foreground/10"
                    aria-label="etiketi kaldır"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              <input
                className="min-w-[160px] flex-1 bg-transparent outline-none px-2 py-1 text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]"
                placeholder="etiket yaz & enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={tryPushTagFromInput}
              />
            </div>
            <p className="mt-1 text-xs text-[color:color-mix(in_oklab,var(--foreground)_65%,transparent)]">
              Örn: platform, puzzle, multiplayer…
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={createSubmission}
              disabled={!formOk || creating}
              className={[
                "group relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold",
                "text-[color:var(--background)] transition active:scale-[0.99]",
                "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500",
                "shadow-[0_8px_24px_rgba(99,102,241,.25)] hover:shadow-[0_10px_30px_rgba(99,102,241,.35)]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {creating ? "Oluşturuluyor..." : "Teslimi Oluştur"}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Mevcut Teslimler */}
      <SectionCard title="Teslimlerim" subtitle={`Toplam ${total}`}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm opacity-80">Henüz teslim yok.</p>
        ) : (
          <div className="grid gap-3">
            {items.map((it) => {
              const isEditing = editingId === it.id;
              return (
                <div
                  key={it.id}
                  className={[
                    "rounded-xl p-4 backdrop-blur",
                    "bg-white/10 dark:bg-black/10",
                    "ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
                    "hover:ring-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)] transition",
                  ].join(" ")}
                >
                  {!isEditing ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold">{it.title}</h3>
                          <div className="text-xs opacity-80">
                            {(it.team?.name ? `${it.team.name} • ` : "")}
                            {new Date(it.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(it)}
                            className="rounded-lg px-3 py-1.5 text-xs ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] hover:bg-background/70 inline-flex items-center gap-1"
                          >
                            <Edit3 className="h-4 w-4" /> Düzenle
                          </button>
                          <button
                            onClick={() => removeSubmission(it.id)}
                            className="rounded-lg px-3 py-1.5 text-xs bg-red-600/85 text-white hover:bg-red-600 inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Sil
                          </button>
                        </div>
                      </div>

                      {it.description && (
                        <p className="mt-2 text-sm opacity-90">{it.description}</p>
                      )}

                      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {it.itchUrl && <LinkRow label="Itch.io" href={it.itchUrl} />}
                        {it.githubUrl && <LinkRow label="GitHub" href={it.githubUrl} />}
                        {it.buildUrl && <LinkRow label="Build" href={it.buildUrl} />}
                        {it.videoUrl && <LinkRow label="Video" href={it.videoUrl} />}
                      </div>

                      {it.note && (
                        <p className="mt-2 text-xs opacity-75">Not: {it.note}</p>
                      )}

                      {it.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {it.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-2 py-0.5 text-[11px] ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] bg-background/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // EDIT MODE
                    <div className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="text-sm">Başlık</label>
                          <div className={wrap}>
                            <input
                              className={input}
                              value={String(edit.title ?? "")}
                              onChange={(e) => updateEdit("title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm">Açıklama</label>
                          <div className={wrap}>
                            <textarea
                              className={ta}
                              value={String(edit.description ?? "")}
                              onChange={(e) => updateEdit("description", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm">Itch.io</label>
                          <div className={wrap}>
                            <input
                              className={input}
                              value={String(edit.itchUrl ?? "")}
                              onChange={(e) => updateEdit("itchUrl", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm">GitHub</label>
                          <div className={wrap}>
                            <input
                              className={input}
                              value={String(edit.githubUrl ?? "")}
                              onChange={(e) => updateEdit("githubUrl", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm">Build</label>
                          <div className={wrap}>
                            <input
                              className={input}
                              value={String(edit.buildUrl ?? "")}
                              onChange={(e) => updateEdit("buildUrl", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm">Video</label>
                          <div className={wrap}>
                            <input
                              className={input}
                              value={String(edit.videoUrl ?? "")}
                              onChange={(e) => updateEdit("videoUrl", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm">Not</label>
                          <div className={wrap}>
                            <textarea
                              className={ta}
                              value={String(edit.note ?? "")}
                              onChange={(e) => updateEdit("note", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Etiketler (replace) */}
                        <div className="md:col-span-2">
                          <label className="text-sm flex items-center gap-2"><Tag className="h-4 w-4" /> Etiketler</label>
                          <div className={[wrap, "flex flex-wrap items-center gap-2 p-2"].join(" ")}>
                            {(edit.tags || []).map((t, i) => (
                              <span
                                key={`${t}-${i}`}
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] bg-background/50"
                              >
                                {t}
                                <button
                                  onClick={() =>
                                    updateEdit(
                                      "tags",
                                      (edit.tags || []).filter((_, idx) => idx !== i)
                                    )
                                  }
                                  className="rounded p-0.5 hover:bg-foreground/10"
                                  aria-label="etiketi kaldır"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </span>
                            ))}
                            <input
                              className="min-w-[160px] flex-1 bg-transparent outline-none px-2 py-1 text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]"
                              placeholder="etiket yaz & enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "," || e.key === " ") {
                                  e.preventDefault();
                                  const val = normTag((e.currentTarget.value || ""));
                                  if (val && !(edit.tags || []).includes(val)) {
                                    updateEdit("tags", [...(edit.tags || []), val]);
                                  }
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveEdit}
                          disabled={savingEdit}
                          className={[
                            "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold",
                            "text-[color:var(--background)]",
                            "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500",
                            "shadow-[0_8px_24px_rgba(99,102,241,.25)] hover:shadow-[0_10px_30px_rgba(99,102,241,.35)]",
                          ].join(" ")}
                        >
                          {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {savingEdit ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-xl px-4 py-2 ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] hover:bg-background/70"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {(msg || err) && (
        <div className="text-sm">
          {msg && (
            <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[color:color-mix(in_oklab,green_85%,white_15%)]">
              {msg}
            </span>
          )}
          {err && (
            <span className="ml-2 rounded-lg bg-red-500/15 px-2 py-1 text-[color:color-mix(in_oklab,crimson_85%,white_15%)]">
              {err}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "multicolor-hover rounded-lg p-2 text-sm flex items-center gap-2",
        "ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_15%,transparent)] hover:ring-[color:color-mix(in_oklab,var(--foreground)_40%,transparent)]",
        "bg-white/10 dark:bg-black/10 backdrop-blur",
      ].join(" ")}
    >
      <Link2 className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </a>
  );
}
