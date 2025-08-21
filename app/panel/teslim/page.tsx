"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Plus, Save, X, Edit3, Trash2, Link2, Tag, Loader2, Upload, Gamepad2, Code, Video, FileText, ExternalLink } from "lucide-react";

type SubmissionItem = {
  id: string;
  title: string;
  description: string | null;
  itchUrl: string | null;
  githubUrl: string | null;
  buildUrl: string | null;
  videoUrl: string | null;
  note: string | null;
  createdAt: string;
  user?: { name: string | null; email: string };
  team?: { name: string } | null;
  tags: string[];
};

const normTag = (x: string) =>
  x.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 32);

export default function TeslimPage() {
  const [items, setItems] = useState<SubmissionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<SubmissionItem>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const formOk = useMemo(() => {
    if (title.trim().length < 3) return false;
    const anyLink = [itchUrl, githubUrl, buildUrl, videoUrl].some((u) => u.trim().length > 0);
    return anyLink;
  }, [title, itchUrl, githubUrl, buildUrl, videoUrl]);

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
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Oyun Teslimi</h2>
              <p className="text-sm sm:text-base text-purple-200/80">Projenizi yükleyin ve jüriye sunun</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Oyun Projesi</div>
                <div className="text-xs text-purple-200/80">Başlık ve açıklama</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Bağlantılar</div>
                <div className="text-xs text-blue-200/80">En az bir link gerekli</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Tag className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Etiketler</div>
                <div className="text-xs text-green-200/80">Kategorilendirme</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yeni Teslim Oluştur */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Yeni Teslim</h3>
            <p className="text-sm text-purple-200/80">Başlık ve en az bir bağlantı zorunlu</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-200 mb-2">Başlık</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn. Space Runner"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-200 mb-2">Açıklama (opsiyonel)</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg"></div>
              <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
                <textarea
                  className="w-full min-h-[84px] resize-y bg-transparent outline-none px-3 py-3 text-white placeholder:text-blue-200/60"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kısa bir açıklama..."
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
            <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-purple-200 mb-1">Itch.io URL</label>
                <input 
                  className="w-full bg-transparent outline-none text-white placeholder:text-purple-200/60" 
                  value={itchUrl} 
                  onChange={(e) => setItchUrl(e.target.value)} 
                  placeholder="https://itch.io/..." 
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg"></div>
            <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-blue-200 mb-1">GitHub URL</label>
                <input 
                  className="w-full bg-transparent outline-none text-white placeholder:text-blue-200/60" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                  placeholder="https://github.com/..." 
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg"></div>
            <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-green-200 mb-1">Build URL</label>
                <input 
                  className="w-full bg-transparent outline-none text-white placeholder:text-green-200/60" 
                  value={buildUrl} 
                  onChange={(e) => setBuildUrl(e.target.value)} 
                  placeholder="https://drive/zip/..." 
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg"></div>
            <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-yellow-500/50 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200 p-1">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-yellow-200 mb-1">Video URL</label>
                <input 
                  className="w-full bg-transparent outline-none text-white placeholder:text-yellow-200/60" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  placeholder="https://youtube.com/..." 
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-200 mb-2">Not (opsiyonel)</label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
              <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                <textarea
                  className="w-full min-h-[84px] resize-y bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Jüriye kısa not..."
                />
              </div>
            </div>
          </div>

          {/* Etiketler */}
          <div className="md:col-span-2">
            <label className=" text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Etiketler
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg"></div>
              <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200"
                    >
                      {t}
                      <button
                        onClick={() => removeTag(i)}
                        className="rounded-full p-0.5 hover:bg-green-500/20 transition-colors"
                        aria-label="etiketi kaldır"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  className="w-full bg-transparent outline-none text-white placeholder:text-green-200/60"
                  placeholder="etiket yaz & enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={tryPushTagFromInput}
                />
                <p className="mt-2 text-xs text-green-200/60">
                  Örn: platform, puzzle, multiplayer…
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={createSubmission}
              disabled={!formOk || creating}
              className="group relative inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
            >
              {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {creating ? "Oluşturuluyor..." : "Teslimi Oluştur"}
            </button>
          </div>
        </div>
      </div>

      {/* Mevcut Teslimler */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Teslimlerim</h3>
            <p className="text-sm text-purple-200/80">Toplam {total}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-purple-200/80">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm font-medium">Teslimler yükleniyor...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-purple-300" />
            </div>
            <p className="text-purple-200/80">Henüz teslim yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => {
              const isEditing = editingId === it.id;
              return (
                <div
                  key={it.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-[1.02] transition-all duration-300"
                >
                  {!isEditing ? (
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{it.title}</h3>
                          <div className="text-sm text-purple-200/80">
                            {(it.team?.name ? `${it.team.name} • ` : "")}
                            {new Date(it.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(it)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
                          >
                            <Edit3 className="h-4 w-4" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => removeSubmission(it.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </button>
                        </div>
                      </div>

                      {it.description && (
                        <p className="text-sm text-purple-200/90 mb-4 leading-relaxed">{it.description}</p>
                      )}

                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                        {it.itchUrl && <LinkRow label="Itch.io" href={it.itchUrl} icon={<Gamepad2 className="h-4 w-4" />} />}
                        {it.githubUrl && <LinkRow label="GitHub" href={it.githubUrl} icon={<Code className="h-4 w-4" />} />}
                        {it.buildUrl && <LinkRow label="Build" href={it.buildUrl} icon={<FileText className="h-4 w-4" />} />}
                        {it.videoUrl && <LinkRow label="Video" href={it.videoUrl} icon={<Video className="h-4 w-4" />} />}
                      </div>

                      {it.note && (
                        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-yellow-200">Not:</span>
                          </div>
                          <p className="text-sm text-yellow-200/80">{it.note}</p>
                        </div>
                      )}

                      {it.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {it.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-3 py-1 text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-purple-200 mb-2">Başlık</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                              <input
                                className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                                value={String(edit.title ?? "")}
                                onChange={(e) => updateEdit("title", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-purple-200 mb-2">Açıklama</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
                              <textarea
                                className="w-full min-h-[84px] resize-y bg-transparent outline-none px-3 py-3 text-white placeholder:text-blue-200/60"
                                value={String(edit.description ?? "")}
                                onChange={(e) => updateEdit("description", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Itch.io</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                              <input
                                className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                                value={String(edit.itchUrl ?? "")}
                                onChange={(e) => updateEdit("itchUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-blue-200 mb-2">GitHub</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
                              <input
                                className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-blue-200/60"
                                value={String(edit.githubUrl ?? "")}
                                onChange={(e) => updateEdit("githubUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-green-200 mb-2">Build</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-1">
                              <input
                                className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-green-200/60"
                                value={String(edit.buildUrl ?? "")}
                                onChange={(e) => updateEdit("buildUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-yellow-200 mb-2">Video</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-yellow-500/50 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200 p-1">
                              <input
                                className="w-full bg-transparent outline-none px-3 py-3 text-white placeholder:text-yellow-200/60"
                                value={String(edit.videoUrl ?? "")}
                                onChange={(e) => updateEdit("videoUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-purple-200 mb-2">Not</label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                              <textarea
                                className="w-full min-h-[84px] resize-y bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                                value={String(edit.note ?? "")}
                                onChange={(e) => updateEdit("note", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Etiketler (replace) */}
                        <div className="md:col-span-2">
                          <label className=" text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Etiketler
                          </label>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg"></div>
                            <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-3">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {(edit.tags || []).map((t, i) => (
                                  <span
                                    key={`${t}-${i}`}
                                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200"
                                  >
                                    {t}
                                    <button
                                      onClick={() =>
                                        updateEdit(
                                          "tags",
                                          (edit.tags || []).filter((_, idx) => idx !== i)
                                        )
                                      }
                                      className="rounded-full p-0.5 hover:bg-green-500/20 transition-colors"
                                      aria-label="etiketi kaldır"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <input
                                className="w-full bg-transparent outline-none text-white placeholder:text-green-200/60"
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
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          onClick={saveEdit}
                          disabled={savingEdit}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-white font-semibold shadow-lg w-full sm:w-auto"
                        >
                          {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {savingEdit ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 border border-gray-500/30 hover:border-gray-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto"
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
      </div>

      {/* Notifications */}
      {(msg || err) && (
        <div className="space-y-3" aria-live="polite">
          {msg && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-sm text-green-200">{msg}</span>
            </div>
          )}
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <span className="text-sm text-red-200">{err}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LinkRow({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
            {label}
          </div>
          <div className="text-xs text-purple-200/60 truncate">
            {href}
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-purple-300 group-hover:text-purple-200 transition-colors flex-shrink-0" />
      </div>
    </a>
  );
}