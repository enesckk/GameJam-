// app/admin/eslestirme/page.tsx
"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, Users, CheckSquare, Square, ChevronDown, ChevronRight, X, PlusCircle, Trash2 } from "lucide-react";

type RoleLite = "developer" | "designer" | "audio" | "pm" | null;

type Unmatched = {
  id: string; name: string | null; email: string; phone: string | null; age: number | null; profileRole: RoleLite;
};
type Member = Unmatched;

type TeamLite = {
  id: string;
  name: string;
  membersCount: number;
  submissionsCount: number;     // ← eklendi
  capacityLeft: number;
  members: Member[];
};

const ROLE_BADGE: Record<Exclude<RoleLite, null>, string> = {
  developer: "Geliştirici", designer: "Tasarımcı", audio: "Ses / Müzik", pm: "PM",
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
    <div className="space-y-6">
      <AdminHeader title="Takım Eşleşmeleri" variant="plain"
        desc={counts ? `Boşta: ${counts.unmatched} • Kontenjanlı takım: ${counts.teamsWithSlots} • Boş kontenjan: ${counts.totalSlots}` : ""} />

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          <input
            className="w-80 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
            placeholder="İsim, e-posta veya telefon ara…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
        </div>
        <button onClick={selectAllPage} className="rounded-xl px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5">Hepsini Seç</button>
        <button onClick={clearSelection} className="rounded-xl px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5">Temizle</button>
        <div className="ml-auto text-sm opacity-80">Seçili: <strong>{selectedCount}</strong></div>
        <button onClick={()=>setModalOpen(true)} className="rounded-xl px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Yeni Takım
        </button>
      </div>

      {/* Boşta katılımcılar */}
      <AdminSectionCard title="Boşta Katılımcılar" subtitle="Takıma atanmamış">
        {loading ? (
          <div className="py-10 text-center opacity-70">Yükleniyor…</div>
        ) : unmatched.length === 0 ? (
          <div className="py-10 text-center opacity-70">Boşta katılımcı yok.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <Th className="w-10"></Th><Th>#</Th><Th>Ad Soyad</Th><Th>E-posta</Th><Th>Telefon</Th><Th>Yaş</Th><Th>Görev</Th>
                </tr>
              </thead>
              <tbody>
                {unmatched.map((u, i) => {
                  const checked = selected.has(u.id);
                  return (
                    <tr key={u.id}
                        onClick={() => toggleRow(u.id)}
                        className="group border-t border-foreground/10 cursor-pointer hover:bg-foreground/[0.04] multicolor-hover hover:multicolor-persist">
                      <Td onClick={(e)=>e.stopPropagation()}>
                        <button type="button"
                          onClick={(e)=>{ e.stopPropagation(); toggleRow(u.id); }}
                          className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                          title={checked ? "Seçimi kaldır" : "Seç"}>
                          {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                        </button>
                      </Td>
                      <Td className="font-semibold">{i + 1}.</Td>
                      <Td className="font-semibold">{u.name ?? "—"}</Td>
                      <Td><span className="hover:opacity-80">{u.email}</span></Td>
                      <Td className="font-semibold"><span className="hover:opacity-80">{u.phone ?? "—"}</span></Td>
                      <Td className="font-semibold">{Number.isFinite(u.age as any) ? u.age : "—"}</Td>
                      <Td className="font-semibold">{u.profileRole ? ROLE_BADGE[u.profileRole] : "—"}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>

      {/* Var olan takımlar: açılır/kapanır + üye çıkar + takımı sil */}
      <AdminSectionCard title="Var Olan Takımlar" subtitle="Detayları açın; seçili kişileri ekleyin, üyeleri çıkarın veya takımı silin.">
        {loading ? (
          <div className="py-10 text-center opacity-70">Yükleniyor…</div>
        ) : teams.length === 0 ? (
          <div className="py-10 text-center opacity-70">Takım yok.</div>
        ) : (
          <div className="space-y-3">
            {teams.map((t) => {
              const open = !!expanded[t.id];
              const disableDelete = t.submissionsCount > 0; // teslimi varsa silme
              return (
                <div key={t.id} className="rounded-2xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={()=>toggleExpand(t.id)} className="flex items-center gap-3 text-left hover:opacity-90" type="button">
                      {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      <div className="text-base font-semibold">{t.name}</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
                        <Users className="h-3.5 w-3.5" /> {t.membersCount}/4
                      </span>
                      <span className="text-xs opacity-70">Boş Kontenjan: <strong>{t.capacityLeft}</strong></span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={()=>assignToTeam(t)}
                        disabled={busy || selectedCount === 0 || t.capacityLeft === 0}
                        className="rounded-lg px-3 py-1 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                        type="button">
                        Seçilileri Ekle
                      </button>
                      <button
                        onClick={()=>setConfirmDeleteTeam(t)}
                        disabled={disableDelete || busy}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                        title={disableDelete ? "Teslimi olan takım silinemez" : "Takımı Sil"}
                        type="button">
                        <Trash2 className="h-4 w-4" /> Sil
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div className="overflow-x-auto border-t border-foreground/10">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <Th>#</Th><Th>Ad Soyad</Th><Th>E-posta</Th><Th>Telefon</Th><Th>Yaş</Th><Th>Görev</Th><Th className="w-24">İşlem</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.members.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-6 text-center opacity-70">Üye yok.</td></tr>
                          )}
                          {t.members.map((m, i) => (
                            <tr key={m.id} className="border-t border-foreground/10">
                              <Td className="font-semibold">{i + 1}.</Td>
                              <Td className="font-semibold">{m.name ?? "—"}</Td>
                              <Td><span className="hover:opacity-80">{m.email}</span></Td>
                              <Td className="font-semibold"><span className="hover:opacity-80">{m.phone ?? "—"}</span></Td>
                              <Td className="font-semibold">{Number.isFinite(m.age as any) ? m.age : "—"}</Td>
                              <Td className="font-semibold">{m.profileRole ? ROLE_BADGE[m.profileRole] : "—"}</Td>
                              <Td>
                                <button
                                  onClick={()=>removeMember(m.id)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                                  title="Takımdan çıkar"
                                  type="button">
                                  <Trash2 className="h-4 w-4" /> Çıkar
                                </button>
                              </Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {message && <div className="mt-3 rounded-lg bg-foreground/10 px-3 py-2 text-sm">{message}</div>}
      </AdminSectionCard>

      {/* Yeni Takım Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4" onClick={()=>setModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10 dark:bg-neutral-900 dark:text-white" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Yeni Takım Oluştur</h3>
              <button className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10" onClick={()=>setModalOpen(false)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="text-sm">Takım Adı</label>
              <input
                className="w-full rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                placeholder="Örn. Piksel Pekerleri"
                value={newTeamName}
                onChange={(e)=>setNewTeamName(e.target.value)}
              />
              <p className="text-xs opacity-70">Seçili katılımcılardan en fazla <strong>4</strong> kişi eklenecek. (Seçili: <strong>{selectedCount}</strong>)</p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5" onClick={()=>setModalOpen(false)}>Vazgeç</button>
              <button onClick={createTeam} disabled={busy} className="rounded-lg px-3 py-2 text-sm text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 disabled:opacity-60">Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {/* Takım Sil Onayı Modal */}
      {confirmDeleteTeam && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4" onClick={()=>setConfirmDeleteTeam(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10 dark:bg-neutral-900 dark:text-white" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Takımı Sil</h3>
              <button className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10" onClick={()=>setConfirmDeleteTeam(null)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm">
              <strong>{confirmDeleteTeam.name}</strong> takımını silmek üzeresiniz.
              Üyeler boşa alınacak. {confirmDeleteTeam.submissionsCount > 0 && (
                <span className="text-red-600 dark:text-red-300">Bu takımın teslimleri var, silinemez.</span>
              )}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5" onClick={()=>setConfirmDeleteTeam(null)}>Vazgeç</button>
              <button
                onClick={deleteTeamConfirmed}
                disabled={busy || (confirmDeleteTeam.submissionsCount > 0)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={["px-4 py-3 text-xs font-semibold uppercase tracking-wide opacity-70", className].join(" ")}>{children}</th>;
}
function Td({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLTableCellElement> }) {
  return <td onClick={onClick} className={["px-4 py-3 align-middle", className].join(" ")}>{children}</td>;
}
