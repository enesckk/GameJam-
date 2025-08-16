// app/admin/teslimler/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, Users, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

type RoleLite = "developer" | "designer" | "audio" | "pm" | null;

type Member = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  age: number | null;
  profileRole: RoleLite;
};

type Submission = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string | null;
  itchUrl: string | null;
  githubUrl: string | null;
  buildUrl: string | null;
  videoUrl: string | null;
  note: string | null;
  tags?: { tag: { id: string; name: string } }[];
};

type TeamRow = {
  id: string;
  name: string;
  membersCount: number;
  submissionsCount: number;
  latest: Submission | null;
  submissions: Submission[];
  members: Member[];
};

const ROLE_BADGE: Record<Exclude<RoleLite, null>, string> = {
  developer: "Geliştirici",
  designer: "Tasarımcı",
  audio: "Ses / Müzik",
  pm: "PM",
};

export default function AdminSubmissionsTeamsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // sabit; istersen custom seçici ekleriz
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalTeams / pageSize)), [totalTeams, pageSize]);

  // debounce search
  const [dq, setDq] = useState(q);
  useEffect(() => { const t = setTimeout(()=>setDq(q), 300); return ()=>clearTimeout(t); }, [q]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dq) params.set("q", dq);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const r = await fetch(`/api/admin/submissions/teams?${params.toString()}`, { credentials: "include", cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Liste alınamadı.");
      setRows(j.items ?? []);
      setTotalTeams(j.totalTeams ?? 0);
    } catch (e) {
      console.error(e);
      setRows([]);
      setTotalTeams(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [dq, page, pageSize]);
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const toggle = (id: string) => setExpanded(s => ({ ...s, [id]: !s[id] }));

  const fmt = (iso?: string | null) => {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleString("tr-TR"); } catch { return iso; }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Teslim Eden Takımlar"
        variant="plain"
        desc={`Toplam ${totalTeams} takım teslim yapmış`}
      />

      {/* Arama çubuğu */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          <input
            className="w-80 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
            placeholder="Takım adı, üye adı/e-posta/telefon veya teslim başlığı…"
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <AdminSectionCard>
        {loading && <div className="py-12 text-center opacity-70">Yükleniyor…</div>}
        {!loading && rows.length === 0 && (
          <div className="py-12 text-center opacity-70">Teslim yapan takım bulunamadı.</div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((t, idx) => {
              const open = !!expanded[t.id];
              const latest = t.latest;

              return (
                <div key={t.id} className="rounded-2xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 overflow-hidden">
                  {/* Team header */}
                  <button
                    onClick={()=>toggle(t.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-foreground/[0.04]"
                    type="button"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      <div className="text-base font-semibold">{t.name}</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
                        <Users className="h-3.5 w-3.5" /> {t.membersCount}
                      </span>
                      <span className="text-xs opacity-70">Teslim: <strong>{t.submissionsCount}</strong></span>
                      {latest && (
                        <span className="text-xs opacity-70">
                          • Son: <strong>{latest.title || "—"}</strong> ({fmt(latest.createdAt)})
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-70">#{idx + 1 + (page - 1) * pageSize}</div>
                  </button>

                  {/* Details: Latest + Members + (optional) Recent submissions */}
                  {open && (
                    <div className="divide-y divide-foreground/10">
                      {/* Son teslim özeti */}
                      {latest && (
                        <div className="p-4">
                          <div className="text-sm font-semibold mb-1">Son Teslim</div>
                          <div className="text-sm">
                            <div className="font-semibold">{latest.title || "—"}</div>
                            {latest.description && (
                              <p className="mt-1 opacity-80 line-clamp-3">{latest.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              {latest.itchUrl && (
                                <a href={latest.itchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-foreground/15 no-underline hover:bg-foreground/5">
                                  itch.io <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.githubUrl && (
                                <a href={latest.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-foreground/15 no-underline hover:bg-foreground/5">
                                  GitHub <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.buildUrl && (
                                <a href={latest.buildUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-foreground/15 no-underline hover:bg-foreground/5">
                                  Build <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.videoUrl && (
                                <a href={latest.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 ring-1 ring-foreground/15 no-underline hover:bg-foreground/5">
                                  Video <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {latest.tags && latest.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {latest.tags.map((tt) => (
                                  <span key={tt.tag.id} className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-semibold">
                                    {tt.tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Üyeler tablosu */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left">
                              <Th>#</Th>
                              <Th>Ad Soyad</Th>
                              <Th>E-posta</Th>
                              <Th>Telefon</Th>
                              <Th>Yaş</Th>
                              <Th>Görev</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {t.members.length === 0 && (
                              <tr><td colSpan={6} className="px-4 py-6 text-center opacity-70">Üye yok.</td></tr>
                            )}
                            {t.members.map((m, i) => (
                              <tr key={m.id} className="border-t border-foreground/10">
                                <Td className="font-semibold">{i + 1}.</Td>
                                <Td className="font-semibold">{m.name ?? "—"}</Td>
                                {/* e-posta/telefon altı çizgisiz */}
                                <Td><span className="hover:opacity-80">{m.email}</span></Td>
                                <Td className="font-semibold"><span className="hover:opacity-80">{m.phone ?? "—"}</span></Td>
                                <Td className="font-semibold">{Number.isFinite(m.age as any) ? m.age : "—"}</Td>
                                <Td className="font-semibold">{m.profileRole ? ROLE_BADGE[m.profileRole] : "—"}</Td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Son 5 teslim (opsiyonel görünüm) */}
                      {t.submissions.length > 1 && (
                        <div className="p-4">
                          <div className="text-sm font-semibold mb-2">Son Teslimler</div>
                          <div className="grid gap-2">
                            {t.submissions.map((s, i) => (
                              <div key={s.id} className="rounded-xl ring-1 ring-foreground/10 p-3 bg-white/50 dark:bg-white/10">
                                <div className="text-sm font-semibold">
                                  {i === 0 ? "En Güncel" : `#${i + 1}`} • {s.title || "—"} <span className="opacity-70">({fmt(s.createdAt)})</span>
                                </div>
                                {s.note && <div className="text-xs opacity-80 mt-1">Not: {s.note}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Sayfalama: şeffaf butonlar */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="opacity-70">
            Toplam <strong>{totalTeams}</strong> takım • Sayfa <strong>{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
            >
              Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide opacity-70">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-4 py-3 align-middle", className].join(" ")}>{children}</td>;
}
