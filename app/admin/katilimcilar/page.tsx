"use client";

import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Search, ChevronDown, IdCard, Mail, Phone,
  ArrowLeft, ArrowRight, Filter, Calendar
} from "lucide-react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";

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

const ROLE_COLORS: Record<NonNullable<Row["profileRole"]>, string> = {
  developer: "from-blue-500 to-cyan-500",
  designer: "from-purple-500 to-pink-500",
  audio: "from-orange-500 to-red-500",
  pm: "from-green-500 to-emerald-500",
};

/* ---------- Page Size Select (memo) ---------- */
const PageSizeSelect = memo(function PageSizeSelect({
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

  const handlePick = useCallback((n: number) => {
    onChange(n);
    setOpen(false);
  }, [onChange]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={[
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
          "ring-1 ring-slate-200/60 focus:ring-2 focus:ring-indigo-500/20",
          "backdrop-blur-md bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/80",
          "border border-white/20 dark:border-slate-700/50 shadow-sm hover:shadow-md",
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
          className="absolute top-full right-0 mt-2 w-40 z-[60] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          role="menu"
        >
          <ul className="py-2">
            {options.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => handlePick(n)}
                  className={[
                    "w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300",
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
});

/* ---------- Cells (memo) ---------- */
const Th = memo(function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
    </th>
  );
});
const Td = memo(function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-6 py-4 align-middle", className].join(" ")}>{children}</td>;
});

/* ---------- Mobile Card (memo) ---------- */
const MobileRowCard = memo(function MobileRowCard({ r, index }: { r: Row; index: number }) {
  return (
    <li className="rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-700/60 bg-white/90 dark:bg-slate-800/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            {index}
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {r.name ?? "—"}
          </h3>
        </div>
        {r.profileRole ? (
          <span className={`ml-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${ROLE_COLORS[r.profileRole]} px-3 py-1 text-xs font-semibold text-white`}>
            {ROLE_BADGE[r.profileRole]}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <a href={`mailto:${r.email}`} className="text-slate-700 dark:text-slate-300 underline-offset-2 hover:underline truncate" title={r.email}>
            {r.email}
          </a>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          {r.phone ? (
            <a href={`tel:${r.phone}`} className="text-slate-700 dark:text-slate-300 truncate" title={r.phone}>
              {r.phone}
            </a>
          ) : (<span className="text-slate-400">—</span>)}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">
            {Number.isFinite(r.age as any) ? r.age : "—"}
          </span>
        </div>
      </div>
    </li>
  );
});

/* ---------- Page ---------- */
export default function AdminParticipantsListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  // debounce search
  const [dq, setDq] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Abortable fetch (yarışları engelle)
  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (dq) params.set("q", dq);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        const r = await fetch(`/api/admin/users?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
          signal: ac.signal,
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.message || "Liste alınamadı.");
        if (!alive) return;
        setRows(j.items ?? []);
        setTotal(j.total ?? 0);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [dq, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const startIndex = (page - 1) * pageSize;

  /* --------- Virtualization setups --------- */
  // Mobile list
  const mobileParentRef = useRef<HTMLUListElement>(null);
  const mobileRowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => 120, // kart yüksekliği tahmini
    overscan: 6,
  });

  // Desktop table body
  const tableParentRef = useRef<HTMLDivElement>(null);
  const tableRowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableParentRef.current,
    estimateSize: () => 56, // satır yüksekliği tahmini
    overscan: 8,
  });

  return (
    <div className="space-y-6 sm:space-y-8" style={{ contentVisibility: "auto", contain: "paint layout" }}>
      {/* Hero Section (hafifletildi) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 text-white shadow-2xl">
        {/* statik pattern; blur ve ağır overlay yok */}
        <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 sm:p-4 rounded-2xl shadow-lg" />
              <IdCard className="absolute inset-0 m-auto h-7 w-7 sm:h-8 sm:w-8 text-white pointer-events-none" />
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

          {/* Search & Page size */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:px-3 sm:py-3">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-full sm:w-72 md:w-80 bg-transparent outline-none text-white placeholder-white/70 text-sm sm:text-base"
                  placeholder="İsim, e-posta veya telefon ara…"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  inputMode="search"
                />
              </div>
            </div>
            <div className="self-start sm:self-auto">
              <PageSizeSelect value={pageSize} onChange={(n) => { setPageSize(n); setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      <AdminSectionCard>
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 sm:px-8 py-5 sm:py-6">
              <IdCard className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
              <div>
                <div className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">Kayıt bulunamadı</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Arama kriterlerinizi değiştirmeyi deneyin</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile (virtualized list) */}
            <div className="md:hidden">
              <ul
                ref={mobileParentRef}
                className="space-y-0 overflow-auto max-h-[65vh] rounded-2xl ring-1 ring-slate-200/60 dark:ring-slate-700/60 bg-white/70 dark:bg-slate-800/60"
                style={{ WebkitOverflowScrolling: "touch", contain: "paint layout" }}
              >
                <div style={{ height: mobileRowVirtualizer.getTotalSize() }} />
                {mobileRowVirtualizer.getVirtualItems().map((vi) => {
                  const r = rows[vi.index];
                  const n = startIndex + vi.index + 1;
                  return (
                    <div
                      key={r.id}
                      className="absolute left-0 right-0"
                      style={{ transform: `translateY(${vi.start}px)` }}
                    >
                      <MobileRowCard r={r} index={n} />
                    </div>
                  );
                })}
              </ul>
            </div>

            {/* Desktop (virtualized table) */}
            <div
              ref={tableParentRef}
              className="hidden md:block overflow-auto rounded-2xl ring-1 ring-slate-200/60 bg-white/80 backdrop-blur-[2px] dark:ring-slate-700/60 dark:bg-slate-800/80 max-h-[65vh]"
              style={{ WebkitOverflowScrolling: "touch", contain: "paint layout" }}
            >
              <table className="min-w-full text-sm relative">
                <thead className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                  <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
                    <Th>#</Th><Th>Ad Soyad</Th><Th>E-posta</Th><Th>Telefon</Th><Th>Yaş</Th><Th>Görev</Th>
                  </tr>
                </thead>

                <tbody style={{ height: tableRowVirtualizer.getTotalSize(), position: "relative" }}>
                  {tableRowVirtualizer.getVirtualItems().map((vi) => {
                    const r = rows[vi.index];
                    const n = startIndex + vi.index + 1;
                    return (
                      <tr
                        key={r.id}
                        className="group border-b border-slate-200/40 dark:border-slate-700/40 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/80 absolute left-0 right-0"
                        style={{ transform: `translateY(${vi.start}px)` }}
                      >
                        <Td className="font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">{n}</div>
                          </div>
                        </Td>
                        <Td className="font-semibold text-slate-900 dark:text-white">{r.name ?? "—"}</Td>
                        <Td>
                          <div className="flex items-center gap-2 max-w-[280px]">
                            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                            <a href={`mailto:${r.email}`} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate" title={r.email}>
                              {r.email}
                            </a>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2 max-w-[200px]">
                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                            {r.phone ? (
                              <a href={`tel:${r.phone}`} className="font-semibold text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors truncate" title={r.phone}>
                                {r.phone}
                              </a>
                            ) : (<span className="text-slate-400">—</span>)}
                          </div>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {Number.isFinite(r.age as any) ? r.age : "—"}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          {r.profileRole ? (
                            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[r.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                              {ROLE_BADGE[r.profileRole]}
                            </span>
                          ) : (<span className="text-slate-400">—</span>)}
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
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-3 sm:p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Toplam <strong className="text-slate-900 dark:text-white">{total}</strong> katılımcı •
            Sayfa <strong className="text-slate-900 dark:text-white">{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Önceki</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
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
