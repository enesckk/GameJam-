"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, Users, CheckSquare, Square, ChevronDown, ChevronRight, X, PlusCircle, Trash2, Link2, UserPlus, UserMinus, AlertTriangle, CheckCircle } from "lucide-react";

type RoleLite = "developer" | "designer" | "audio" | "pm" | null;

type Unmatched = {
  id: string; name: string | null; email: string; phone: string | null; age: number | null; profileRole: RoleLite;
};
type Member = Unmatched;

type TeamLite = {
  id: string;
  name: string;
  membersCount: number;
  submissionsCount: number;
  capacityLeft: number;
  members: Member[];
};

const ROLE_BADGE: Record<Exclude<RoleLite, null>, string> = {
  developer: "Geliştirici", designer: "Tasarımcı", audio: "Ses / Müzik", pm: "PM",
};

const ROLE_COLORS = {
  developer: "from-blue-500 to-cyan-500",
  designer: "from-purple-500 to-pink-500",
  audio: "from-orange-500 to-red-500",
  pm: "from-green-500 to-emerald-500",
};

export default function MatchingPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [unmatched, setUnmatched] = useState<Unmatched[]>([]);
  const [teams, setTeams] = useState<TeamLite[]>([]);
  const [counts, setCounts] = useState<{ unmatched: number; teamsWithSlots: number; totalSlots: number } | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // modal: yeni takım
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  // modal: takım sil onayı
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState<TeamLite | null>(null);

  useEffect(() => { const t = setTimeout(() => load(q), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function load(query = "") {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      const r = await fetch(`/api/admin/matching?${params.toString()}`, { credentials: "include", cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Veri alınamadı.");
      setUnmatched(j.unmatched ?? []);
      setTeams(j.teams ?? []);
      setCounts(j.counts ?? null);
      // seçim senkron
      setSelected(prev => {
        const ids = new Set<string>([...(j.unmatched ?? []).map((u: any) => u.id)]);
        const keep = new Set<string>(); prev.forEach(id => { if (ids.has(id)) keep.add(id); });
        return keep;
      });
    } catch (e) {
      setUnmatched([]); setTeams([]); setCounts(null); setSelected(new Set());
    } finally { setLoading(false); }
  }

  const toggleRow = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleExpand = (teamId: string) => setExpanded(s => ({ ...s, [teamId]: !s[teamId] }));
  const selectAllPage = () => setSelected(new Set(unmatched.map(u => u.id)));
  const clearSelection = () => setSelected(new Set());

  async function assignToTeam(team: TeamLite) {
    if (selected.size === 0) return;
    setBusy(true); setMessage(null);
    try {
      const userIds = unmatched.filter(u => selected.has(u.id)).map(u => u.id);
      const r = await fetch("/api/admin/matching/assign", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id, userIds }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Atama hatası");
      setMessage(`Atanan: ${j.assigned?.length || 0}${(j.skipped?.length||0) ? ` • Sığmayan: ${j.skipped.length}` : ""}`);
      await load(q); clearSelection();
    } catch (e: any) { setMessage(e?.message || "Atama yapılamadı"); }
    finally { setBusy(false); }
  }

  async function removeMember(userId: string) {
    setBusy(true); setMessage(null);
    try {
      const r = await fetch("/api/admin/matching/remove", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [userId] }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Üye çıkarılamadı");
      setMessage(`Takımdan çıkarıldı: ${j.removed ?? 0} üye`);
      await load(q);
    } catch (e: any) { setMessage(e?.message || "İşlem başarısız"); }
    finally { setBusy(false); }
  }

  async function deleteTeamConfirmed() {
    const t = confirmDeleteTeam;
    if (!t) return;
    setBusy(true); setMessage(null);
    try {
      const r = await fetch(`/api/admin/matching/team/${t.id}`, { method: "DELETE", credentials: "include" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Takım silinemedi");
      setMessage(`Takım silindi: ${t.name} • Boşa alınan üye: ${j.unlinked ?? 0}`);
      setConfirmDeleteTeam(null);
      await load(q);
    } catch (e: any) {
      setMessage(e?.message || "Silme başarısız");
    } finally { setBusy(false); }
  }

  async function createTeam() {
    setBusy(true); setMessage(null);
    try {
      const userIds = unmatched.filter(u => selected.has(u.id)).slice(0, 4).map(u => u.id);
      const r = await fetch("/api/admin/matching/create-team", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName.trim() || undefined, memberIds: userIds }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Takım oluşturulamadı");
      setMessage(`Takım oluşturuldu: ${j.team?.name}. Eklenen üye: ${j.assigned?.length || 0}`);
      setModalOpen(false); setNewTeamName("");
      await load(q); clearSelection();
    } catch (e: any) { setMessage(e?.message || "İşlem başarısız"); }
    finally { setBusy(false); }
  }

  const selectedCount = selected.size;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-50"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                <Link2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Takım Eşleşmeleri
              </h1>
              <p className="text-slate-300 text-lg">
                {counts ? `Boşta: ${counts.unmatched} • Kontenjanlı takım: ${counts.teamsWithSlots} • Boş kontenjan: ${counts.totalSlots}` : ""}
              </p>
            </div>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-80 bg-transparent outline-none text-white placeholder-white/70"
                  placeholder="İsim, e-posta veya telefon ara…"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={()=>setModalOpen(true)} 
              className="group relative inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white transition-all duration-300 active:scale-[0.98] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlusCircle className="h-5 w-5 relative z-10" />
              </div>
              <span className="relative z-10">Yeni Takım</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={selectAllPage} 
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
          >
            <CheckSquare className="h-4 w-4" />
            Hepsini Seç
          </button>
          <button 
            onClick={clearSelection} 
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
          >
            <Square className="h-4 w-4" />
            Temizle
          </button>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Seçili: <strong className="text-slate-900 dark:text-white">{selectedCount}</strong>
        </div>
      </div>

      {/* Boşta katılımcılar */}
      <AdminSectionCard title="Boşta Katılımcılar" subtitle="Takıma atanmamış">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-green-500"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : unmatched.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-8 py-6">
              <Users className="h-12 w-12 text-slate-400" />
              <div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">Boşta katılımcı yok</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Tüm katılımcılar takımlara atanmış</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200/60 bg-white/80 backdrop-blur-sm dark:ring-slate-700/60 dark:bg-slate-800/80">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
                  <Th className="w-12"></Th>
                  <Th>#</Th>
                  <Th>Ad Soyad</Th>
                  <Th>E-posta</Th>
                  <Th>Telefon</Th>
                  <Th>Yaş</Th>
                  <Th>Görev</Th>
                </tr>
              </thead>
              <tbody>
                {unmatched.map((u, i) => {
                  const checked = selected.has(u.id);
                  return (
                    <tr key={u.id}
                        onClick={() => toggleRow(u.id)}
                        className="group border-b border-slate-200/40 dark:border-slate-700/40 cursor-pointer transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-700/80">
                      <Td onClick={(e)=>e.stopPropagation()}>
                        <button type="button"
                          onClick={(e)=>{ e.stopPropagation(); toggleRow(u.id); }}
                          className={`inline-flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 ${
                            checked 
                              ? 'bg-green-500 text-white shadow-lg' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                          title={checked ? "Seçimi kaldır" : "Seç"}>
                          {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                        </button>
                      </Td>
                      <Td className="font-semibold">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
                          {i + 1}
                        </div>
                      </Td>
                      <Td className="font-semibold text-slate-900 dark:text-white">{u.name ?? "—"}</Td>
                      <Td className="text-slate-700 dark:text-slate-300">{u.email}</Td>
                      <Td className="font-semibold text-slate-700 dark:text-slate-300">{u.phone ?? "—"}</Td>
                      <Td className="font-semibold text-slate-700 dark:text-slate-300">
                        {Number.isFinite(u.age as any) ? u.age : "—"}
                      </Td>
                      <Td>
                        {u.profileRole ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[u.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                            {ROLE_BADGE[u.profileRole]}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>

      {/* Var olan takımlar */}
      <AdminSectionCard title="Var Olan Takımlar" subtitle="Detayları açın; seçili kişileri ekleyin, üyeleri çıkarın veya takımı silin.">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-green-500"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-8 py-6">
              <Link2 className="h-12 w-12 text-slate-400" />
              <div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">Takım yok</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Henüz hiç takım oluşturulmamış</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((t) => {
              const open = !!expanded[t.id];
              const disableDelete = t.submissionsCount > 0;
              return (
                <div key={t.id} className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <button onClick={()=>toggleExpand(t.id)} className="flex items-center gap-4 text-left hover:opacity-90 transition-opacity duration-200" type="button">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                          {open ? (
                            <ChevronDown className="h-5 w-5 text-white" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{t.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-300">
                              <Users className="h-4 w-4" />
                              {t.membersCount}/4
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              Boş Kontenjan: <strong className="text-slate-700 dark:text-slate-300">{t.capacityLeft}</strong>
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={()=>assignToTeam(t)}
                          disabled={busy || selectedCount === 0 || t.capacityLeft === 0}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300"
                          type="button">
                          <UserPlus className="h-4 w-4" />
                          Seçilileri Ekle
                        </button>
                        <button
                          onClick={()=>setConfirmDeleteTeam(t)}
                          disabled={disableDelete || busy}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
                          title={disableDelete ? "Teslimi olan takım silinemez" : "Takımı Sil"}
                          type="button">
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </button>
                      </div>
                    </div>

                    {open && (
                      <div className="mt-6 border-t border-slate-200/60 dark:border-slate-700/60 pt-6">
                        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200/60 bg-slate-50/80 dark:ring-slate-700/60 dark:bg-slate-900/80">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
                                <Th>#</Th>
                                <Th>Ad Soyad</Th>
                                <Th>E-posta</Th>
                                <Th>Telefon</Th>
                                <Th>Yaş</Th>
                                <Th>Görev</Th>
                                <Th className="w-24">İşlem</Th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.members.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="px-6 py-8 text-center">
                                    <div className="inline-flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                                      <Users className="h-8 w-8" />
                                      <span className="text-sm font-medium">Üye yok</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {t.members.map((m, i) => (
                                <tr key={m.id} className="border-b border-slate-200/40 dark:border-slate-700/40">
                                  <Td className="font-semibold">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
                                      {i + 1}
                                    </div>
                                  </Td>
                                  <Td className="font-semibold text-slate-900 dark:text-white">{m.name ?? "—"}</Td>
                                  <Td className="text-slate-700 dark:text-slate-300">{m.email}</Td>
                                  <Td className="font-semibold text-slate-700 dark:text-slate-300">{m.phone ?? "—"}</Td>
                                  <Td className="font-semibold text-slate-700 dark:text-slate-300">
                                    {Number.isFinite(m.age as any) ? m.age : "—"}
                                  </Td>
                                  <Td>
                                    {m.profileRole ? (
                                      <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[m.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                                        {ROLE_BADGE[m.profileRole]}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">—</span>
                                    )}
                                  </Td>
                                  <Td>
                                    <button
                                      onClick={()=>removeMember(m.id)}
                                      disabled={busy}
                                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
                                      title="Takımdan çıkar"
                                      type="button">
                                      <UserMinus className="h-4 w-4" />
                                      Çıkar
                                    </button>
                                  </Td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400">Başarılı</div>
              <div className="text-sm text-green-600 dark:text-green-300">{message}</div>
            </div>
          </div>
        )}
      </AdminSectionCard>

      {/* Yeni Takım Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={()=>setModalOpen(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-700/50" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Yeni Takım Oluştur</h3>
              <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200" onClick={()=>setModalOpen(false)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Takım Adı
                </label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-green-300 group-focus-within:shadow-lg group-focus-within:shadow-green-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                    <Link2 className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors duration-300" />
                    <input
                      className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                      placeholder="Örn. Piksel Pekerleri"
                      value={newTeamName}
                      onChange={(e)=>setNewTeamName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Seçili katılımcılardan en fazla <strong>4</strong> kişi eklenecek. (Seçili: <strong>{selectedCount}</strong>)
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300" onClick={()=>setModalOpen(false)}>
                Vazgeç
              </button>
              <button 
                onClick={createTeam} 
                disabled={busy} 
                className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <PlusCircle className="h-4 w-4 relative z-10" />
                </div>
                <span className="relative z-10">Oluştur</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Takım Sil Onayı Modal */}
      {confirmDeleteTeam && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={()=>setConfirmDeleteTeam(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-700/50" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Takımı Sil</h3>
              <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200" onClick={()=>setConfirmDeleteTeam(null)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <div className="font-semibold text-red-700 dark:text-red-400">
                    <strong>{confirmDeleteTeam.name}</strong> takımını silmek üzeresiniz.
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-300">
                    Üyeler boşa alınacak.
                  </div>
                  {confirmDeleteTeam.submissionsCount > 0 && (
                    <div className="text-sm text-red-600 dark:text-red-300 font-semibold mt-1">
                      Bu takımın teslimleri var, silinemez.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300" onClick={()=>setConfirmDeleteTeam(null)}>
                Vazgeç
              </button>
              <button
                onClick={deleteTeamConfirmed}
                disabled={busy || (confirmDeleteTeam.submissionsCount > 0)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300">
                <Trash2 className="h-4 w-4" />
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={["px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", className].join(" ")}>{children}</th>;
}

function Td({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLTableCellElement> }) {
  return <td onClick={onClick} className={["px-6 py-4 align-middle", className].join(" ")}>{children}</td>;
}