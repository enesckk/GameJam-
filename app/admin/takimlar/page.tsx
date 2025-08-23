"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  Filter,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  UserCheck,
} from "lucide-react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  age: number | null;
  profileRole: "developer" | "designer" | "audio" | "pm" | null;
};
type TeamRow = { id: string; name: string; membersCount: number; members: Member[] };

const ROLE_BADGE: Record<NonNullable<Member["profileRole"]>, string> = {
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

function PageSizeSelect({
  value,
  onChange,
  options = [5, 10, 20, 50],
}: {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
          "ring-1 ring-slate-700/60 focus:ring-2 focus:ring-indigo-500/20",
          "backdrop-blur-md bg-slate-800/80 hover:bg-slate-700/80",
          "border border-slate-700/50 shadow-sm hover:shadow-md",
          "text-white",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">{value}/sayfa</span>
        <span className="sm:hidden">{value}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-40 z-[9999] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"
          role="menu"
        >
          <ul className="py-2">
            {options.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:bg-indigo-500/10 hover:text-indigo-300",
                    "text-white",
                  ].join(" ")}
                  role="menuitem"
                >
                  {n}/sayfa
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdminTeamsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      const r = await fetch(`/api/admin/teams?${params.toString()}`, {
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

  const toggle = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-40 sm:opacity-50"></div>
        <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-lg opacity-60 sm:opacity-75"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Takımlar
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Toplam <strong>{totalTeams}</strong> takım kayıtlı
              </p>
            </div>
          </div>

          {/* Search & Page size */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:px-3 sm:py-3 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-full sm:w-72 md:w-80 bg-transparent outline-none text-white placeholder-white/70 text-sm sm:text-base"
                  placeholder="Takım adı, üye adı, e‑posta veya telefon ara…"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  inputMode="search"
                />
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <PageSizeSelect
                value={pageSize}
                onChange={(n) => {
                  setPageSize(n);
                  setPage(1);
                }}
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <AdminSectionCard>
        {loading && (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-800 px-5 sm:px-6 py-3 sm:py-4">
              <div className="h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500"></div>
              <span className="text-slate-300 font-medium">Yükleniyor…</span>
            </div>
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4 rounded-2xl bg-slate-800 px-6 sm:px-8 py-5 sm:py-6">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
              <div>
                <div className="text-base sm:text-lg font-semibold text-slate-700 ">
                  Takım bulunamadı
                </div>
                <div className="text-sm text-slate-500 ">
                  Arama kriterlerinizi değiştirmeyi deneyin
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {rows.map((t, idx) => {
              const open = !!expanded[t.id];
              return (
                <div
                  key={t.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggle(t.id)}
                    className="flex w-full items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left transition-colors duration-200 hover:bg-slate-700/80"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shrink-0">
                        {open ? (
                          <ChevronDown className="h-5 w-5 text-white" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-white">
                          {t.name}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                            <Users className="h-4 w-4" />
                            {t.membersCount} üye
                          </span>
                          <span className="text-xs sm:text-sm text-slate-500 ">
                            #{idx + 1 + (page - 1) * pageSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Members */}
                  {open && (
                    <div className="border-t border-slate-700/60 bg-slate-900/40">
                      {/* Mobile: cards */}
                      <ul className="grid gap-2 p-3 sm:hidden">
                        {t.members.length === 0 && (
                          <li className="rounded-xl bg-slate-800/70 p-4 text-center">
                            <div className="inline-flex flex-col items-center gap-2 text-slate-500 ">
                              <UserCheck className="h-7 w-7" />
                              <span className="text-sm font-medium">Üye yok</span>
                            </div>
                          </li>
                        )}
                        {t.members.map((m, i) => (
                          <li
                            key={m.id}
                            className="rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 p-3 flex items-start gap-3"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300 shrink-0">
                              {i + 1}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="font-semibold text-white truncate">
                                {m.name ?? "—"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700  min-w-0">
                                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                                            <span className="truncate text-white" title={m.email}>
                              {m.email}
                            </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700 ">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="truncate text-white">{m.phone ?? "—"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700 ">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-white">{Number.isFinite(m.age as any) ? m.age : "—"}</span>
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

                      {/* Desktop: table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-slate-700/60">
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
                                    <UserCheck className="h-8 w-8" />
                                    <span className="text-sm font-medium">Üye yok</span>
                                  </div>
                                </td>
                              </tr>
                            )}
                            {t.members.map((m, i) => (
                              <tr
                                key={m.id}
                                className="group border-b border-slate-700/40 transition-all duration-200 hover:bg-slate-800/60"
                              >
                                <Td className="font-semibold">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                                    {i + 1}
                                  </div>
                                </Td>
                                <Td className="font-semibold text-white">
                                  {m.name ?? "—"}
                                </Td>
                                <Td>
                                  <div className="flex items-center gap-2 max-w-[320px]">
                                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                                                <span className="text-white truncate" title={m.email}>
                              {m.email}
                            </span>
                                  </div>
                                </Td>
                                <Td>
                                  <div className="flex items-center gap-2 max-w-[220px]">
                                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                                                <span className="font-semibold text-white truncate" title={m.phone ?? "—"}>
                              {m.phone ?? "—"}
                            </span>
                                  </div>
                                </Td>
                                <Td>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                                <span className="font-semibold text-white">
                              {Number.isFinite(m.age as any) ? m.age : "—"}
                            </span>
                                  </div>
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
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between rounded-2xl bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-300">
            Toplam{" "}
            <strong className="text-white">{totalTeams}</strong> takım • Sayfa{" "}
            <strong className="text-white">{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-700/80 hover:bg-slate-700 border border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Önceki</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-700/80 hover:bg-slate-700 border border-slate-600/60 shadow-sm hover:shadow-md"
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
