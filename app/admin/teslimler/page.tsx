"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import {
  Search,
  Users,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Inbox,
  Calendar,
  Tag,
  FileText,
  Play,
  Code,
  Globe,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
} from "lucide-react";

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
const ROLE_COLORS = {
  developer: "from-blue-500 to-cyan-500",
  designer: "from-purple-500 to-pink-500",
  audio: "from-orange-500 to-red-500",
  pm: "from-green-500 to-emerald-500",
};

export default function AdminSubmissionsTeamsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalTeams / pageSize)),
    [totalTeams, pageSize]
  );

  // debounce search
  const [dq, setDq] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dq) params.set("q", dq);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const r = await fetch(`/api/admin/submissions/teams?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const fmt = (iso?: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("tr-TR");
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-40 sm:opacity-50"></div>
        <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 rounded-2xl blur-lg opacity-60 sm:opacity-75"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-blue-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <Inbox className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Teslim Eden Takımlar
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Toplam <strong>{totalTeams}</strong> takım teslim yapmış
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:px-3 sm:py-3 backdrop-blur-sm">
              <Search className="h-5 w-5 text-white/70" />
              <input
                className="w-full sm:w-80 bg-transparent outline-none text-white placeholder-white/70 text-sm sm:text-base"
                placeholder="Takım / üye / teslim başlığı ara…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                inputMode="search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <AdminSectionCard>
        {loading ? (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 sm:px-6 py-3 sm:py-4">
              <div className="h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500"></div>
              <span className="text-slate-600  font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 sm:px-8 py-5 sm:py-6">
              <Inbox className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
              <div>
                <div className="text-base sm:text-lg font-semibold text-slate-700 ">
                  Teslim yapan takım bulunamadı
                </div>
                <div className="text-sm text-slate-500 ">
                  Arama kriterlerinizi değiştirmeyi deneyin
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {rows.map((t, idx) => {
              const open = !!expanded[t.id];
              const latest = t.latest;

              return (
                <div
                  key={t.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 dark:border-slate-700/60 dark:bg-slate-800/80"
                >
                  {/* Team header */}
                  <button
                    onClick={() => toggle(t.id)}
                    className="flex w-full items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left hover:bg-slate-50/80 dark:hover:bg-slate-700/80 transition-colors duration-200"
                    type="button"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shrink-0">
                        {open ? (
                          <ChevronDown className="h-5 w-5 text-white" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {t.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
                            <Users className="h-4 w-4" />
                            {t.membersCount} üye
                          </span>
                          <span className="text-xs sm:text-sm text-slate-600 ">
                            Teslim:{" "}
                            <strong className="text-slate-900 dark:text-white">
                              {t.submissionsCount}
                            </strong>
                          </span>
                          {latest && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 ">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Son:{" "}
                                <strong className="text-slate-900 dark:text-white">
                                  {latest.title || "—"}
                                </strong>
                              </span>
                              <span>({fmt(latest.createdAt)})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 ">
                      #{idx + 1 + (page - 1) * pageSize}
                    </div>
                  </button>

                  {/* Details */}
                  {open && (
                    <div className="border-t border-slate-200/60 dark:border-slate-700/60">
                      {/* Latest submission summary */}
                      {latest && (
                        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-900/50">
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <FileText className="h-5 w-5 text-teal-600" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              Son Teslim
                            </h3>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                                {latest.title || "—"}
                              </div>
                              {latest.description && (
                                <p className="text-slate-700  leading-relaxed">
                                  {latest.description}
                                </p>
                              )}
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-2">
                              {latest.itchUrl && (
                                <a
                                  href={latest.itchUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300"
                                >
                                  <Globe className="h-4 w-4" />
                                  itch.io
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.githubUrl && (
                                <a
                                  href={latest.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 "
                                >
                                  <Code className="h-4 w-4" />
                                  GitHub
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.buildUrl && (
                                <a
                                  href={latest.buildUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300"
                                >
                                  <FileText className="h-4 w-4" />
                                  Build
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {latest.videoUrl && (
                                <a
                                  href={latest.videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
                                >
                                  <Play className="h-4 w-4" />
                                  Video
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>

                            {/* Tags */}
                            {latest.tags && latest.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-slate-500" />
                                <div className="flex flex-wrap gap-2">
                                  {latest.tags.map((tt) => (
                                    <span
                                      key={tt.tag.id}
                                      className="rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 "
                                    >
                                      {tt.tag.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Members */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <Users className="h-5 w-5 text-teal-600" />
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Takım Üyeleri
                          </h3>
                        </div>

                        {/* Mobile cards */}
                        <ul className="grid gap-2 sm:hidden">
                          {t.members.length === 0 && (
                            <li className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-4 text-center">
                              <div className="inline-flex flex-col items-center gap-2 text-slate-500 ">
                                <Users className="h-7 w-7" />
                                <span className="text-sm font-medium">Üye yok</span>
                              </div>
                            </li>
                          )}
                          {t.members.map((m, i) => (
                            <li
                              key={m.id}
                              className="rounded-xl ring-1 ring-slate-200/70 dark:ring-slate-700/60 bg-white/90 dark:bg-slate-800/80 p-3 flex items-start gap-3"
                            >
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600  shrink-0">
                                {i + 1}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="font-semibold text-slate-900 dark:text-white truncate">
                                  {m.name ?? "—"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700  min-w-0">
                                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                  <span className="truncate" title={m.email}>
                                    {m.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700 ">
                                  <Phone className="h-4 w-4 text-slate-400" />
                                  <span className="truncate">{m.phone ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700 ">
                                  <Calendar className="h-4 w-4 text-slate-400" />
                                  <span>
                                    {Number.isFinite(m.age as any) ? m.age : "—"}
                                  </span>
                                </div>
                                <div>
                                  {m.profileRole ? (
                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[m.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
                                    >
                                      {ROLE_BADGE[m.profileRole]}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-sm">—</span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto rounded-2xl ring-1 ring-slate-200/60 bg-slate-50/80 dark:ring-slate-700/60 dark:bg-slate-900/80">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
                                <Th>#</Th>
                                <Th>Ad Soyad</Th>
                                <Th>E‑posta</Th>
                                <Th>Telefon</Th>
                                <Th>Yaş</Th>
                                <Th>Görev</Th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.members.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="px-6 py-8 text-center">
                                    <div className="inline-flex flex-col items-center gap-2 text-slate-500 ">
                                      <Users className="h-8 w-8" />
                                      <span className="text-sm font-medium">Üye yok</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {t.members.map((m, i) => (
                                <tr
                                  key={m.id}
                                  className="border-b border-slate-200/40 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                  <Td className="font-semibold">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 ">
                                      {i + 1}
                                    </div>
                                  </Td>
                                  <Td className="font-semibold text-slate-900 dark:text-white">
                                    {m.name ?? "—"}
                                  </Td>
                                  <Td>
                                    <div className="max-w-[320px] truncate" title={m.email}>
                                      {m.email}
                                    </div>
                                  </Td>
                                  <Td>
                                    <div className="max-w-[220px] truncate" title={m.phone ?? "—"}>
                                      {m.phone ?? "—"}
                                    </div>
                                  </Td>
                                  <Td className="font-semibold text-slate-700 ">
                                    {Number.isFinite(m.age as any) ? m.age : "—"}
                                  </Td>
                                  <Td>
                                    {m.profileRole ? (
                                      <span
                                        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[m.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
                                      >
                                        {ROLE_BADGE[m.profileRole]}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">—</span>
                                    )}
                                  </Td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Submissions list (if >1) */}
                      {t.submissions.length > 1 && (
                        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <FileText className="h-5 w-5 text-teal-600" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              Son Teslimler
                            </h3>
                          </div>
                          <div className="grid gap-2 sm:gap-3">
                            {t.submissions.map((s, i) => (
                              <div
                                key={s.id}
                                className="rounded-2xl border border-slate-200/60 bg-white/80 dark:border-slate-700/60 dark:bg-slate-800/80 p-3 sm:p-4"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    {i === 0 ? "En Güncel" : `#${i + 1}`} • {s.title || "—"}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 ">
                                    <Calendar className="h-3 w-3" />
                                    {fmt(s.createdAt)}
                                  </div>
                                </div>
                                {s.note && (
                                  <div className="text-xs sm:text-sm text-slate-600  bg-slate-100 dark:bg-slate-700 rounded-lg p-2">
                                    Not: {s.note}
                                  </div>
                                )}
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

        {/* Pagination */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-600 ">
            Toplam{" "}
            <strong className="text-slate-900 dark:text-white">{totalTeams}</strong> takım • Sayfa{" "}
            <strong className="text-slate-900 dark:text-white">{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Önceki</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <span className="hidden xs:inline">Sonraki</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-4 sm:px-6 py-3 sm:py-4 align-middle", className].join(" ")}>{children}</td>;
}
