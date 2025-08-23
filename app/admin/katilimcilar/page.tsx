"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import {
  Search,
  ChevronDown,
  IdCard,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Filter,
  UserCheck,
} from "lucide-react";

type Row = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  age: number | null;
  profileRole: "developer" | "designer" | "audio" | "pm" | null;
};

const ROLE_BADGE: Record<NonNullable<Row["profileRole"]>, string> = {
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
  options = [10, 20, 50, 100],
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
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
          "ring-1 ring-slate-700/60 focus:ring-2 focus:ring-indigo-500/20",
          "backdrop-blur-md bg-slate-800/80 hover:bg-slate-700/80",
          "border border-slate-700/50 shadow-sm hover:shadow-md",
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
          className="absolute top-full right-0 mt-2 w-40 z-[60] rounded-2xl shadow-2xl border border-slate-700 bg-slate-800"
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

export default function AdminParticipantsListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

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

      const r = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || "Liste alınamadı.");
      setRows(j.items ?? []);
      setTotal(j.total ?? 0);
    } catch (e) {
      console.error(e);
      setRows([]);
      setTotal(0);
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

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-40 sm:opacity-50" />
        <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl blur-lg opacity-60 sm:opacity-75" />
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <IdCard className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Katılımcılar
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Toplam <strong>{total}</strong> katılımcı kayıtlı
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-slate-800/50 px-3 py-2 sm:px-3 sm:py-3 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-full sm:w-72 md:w-80 bg-transparent outline-none text-white placeholder-white/70 text-sm sm:text-base"
                  placeholder="İsim, e-posta veya telefon ara…"
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Participants: Table on md+, Cards on mobile */}
      <AdminSectionCard>
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-blue-500" />
              <span className="text-slate-300 font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-800 px-6 sm:px-8 py-5 sm:py-6">
              <IdCard className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300" />
              <div>
                <div className="text-base sm:text-lg font-semibold text-slate-300">Kayıt bulunamadı</div>
                <div className="text-sm text-slate-300">Arama kriterlerinizi değiştirmeyi deneyin</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <ul className="md:hidden space-y-3">
              {rows.map((r, i) => {
                const n = startIndex + i + 1;
                return <MobileRowCard key={r.id} r={r} index={n} />;
              })}
            </ul>

            {/* Desktop Table */}
            <div
              className="hidden md:block overflow-x-auto rounded-2xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur-sm"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    <Th>#</Th>
                    <Th>Ad Soyad</Th>
                    <Th>E-posta</Th>
                    <Th>Telefon</Th>
                    <Th>Yaş</Th>
                    <Th>Görev</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const n = startIndex + i + 1;
                    return (
                      <tr
                        key={r.id}
                        className="group border-b border-slate-700/40 transition-all duration-200 hover:bg-slate-700/80"
                      >
                        <Td className="font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                              {n}
                            </div>
                          </div>
                        </Td>

                        <Td className="font-semibold text-white">
                          {r.name ?? "—"}
                        </Td>

                        <Td>
                          <div className="flex items-center gap-2 max-w-[280px]">
                            <Mail className="h-4 w-4 text-slate-300 shrink-0" />
                            <a
                              href={`mailto:${r.email}`}
                              className="text-white hover:text-blue-400 transition-colors duration-200 truncate"
                              title={r.email}
                            >
                              {r.email}
                            </a>
                          </div>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-2 max-w-[200px]">
                            <Phone className="h-4 w-4 text-slate-300 shrink-0" />
                            {r.phone ? (
                              <a
                                href={`tel:${r.phone}`}
                                className="font-semibold text-white hover:text-green-400 transition-colors duration-200 truncate"
                                title={r.phone}
                              >
                                {r.phone}
                              </a>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </div>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-300" />
                            <span className="font-semibold text-white">
                              {Number.isFinite(r.age as any) ? r.age : "—"}
                            </span>
                          </div>
                        </Td>

                        <Td>
                          {r.profileRole ? (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[r.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
                            >
                              {ROLE_BADGE[r.profileRole]}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between rounded-2xl bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-300">
            Toplam{" "}
            <strong className="text-white">{total}</strong>{" "}
            katılımcı • Sayfa{" "}
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

/* ------- Helpers ------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-6 py-4 align-middle", className].join(" ")}>{children}</td>;
}

function MobileRowCard({ r, index }: { r: Row; index: number }) {
  return (
    <li className="rounded-2xl ring-1 ring-slate-700/60 bg-slate-800/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">
            {index}
          </div>
          <h3 className="text-base font-semibold text-white">
            {r.name ?? "—"}
          </h3>
        </div>
        {r.profileRole ? (
          <span
            className={`ml-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${ROLE_COLORS[r.profileRole]} px-3 py-1 text-xs font-semibold text-white`}
          >
            {ROLE_BADGE[r.profileRole]}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        {/* Email */}
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <a
            href={`mailto:${r.email}`}
            className="text-slate-300 underline-offset-2 hover:underline truncate"
            title={r.email}
          >
            {r.email}
          </a>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 min-w-0">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          {r.phone ? (
            <a
              href={`tel:${r.phone}`}
              className="text-slate-300 truncate"
              title={r.phone}
            >
              {r.phone}
            </a>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>

        {/* Age */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300">
            {Number.isFinite(r.age as any) ? r.age : "—"}
          </span>
        </div>
      </div>
    </li>
  );
}
