"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, ChevronDown, IdCard, Mail, Phone, Calendar, UserCheck, ArrowLeft, ArrowRight, Filter } from "lucide-react";

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
          "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
          "ring-1 ring-slate-200/60 focus:ring-2 focus:ring-indigo-500/20",
          "backdrop-blur-md bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/80",
          "border border-white/20 dark:border-slate-700/50 shadow-sm hover:shadow-md",
        ].join(" ")}
      >
        <Filter className="h-4 w-4" />
        {value}/sayfa
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          className={[
            "absolute right-0 z-[9999] mt-2 w-40 overflow-hidden rounded-2xl",
            "ring-1 ring-slate-200/60 shadow-xl border border-white/20 dark:border-slate-700/50",
            "backdrop-blur-xl bg-white/95 dark:bg-slate-800/95",
          ].join(" ")}
          style={{
            top: '100%',
            marginTop: '0.5rem',
          }}
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
                    "hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300",
                  ].join(" ")}
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-50"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
                <IdCard className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Katılımcılar
              </h1>
              <p className="text-slate-300 text-lg">
                Toplam <strong>{total}</strong> katılımcı kayıtlı
              </p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  className="w-80 bg-transparent outline-none text-white placeholder-white/70"
                  placeholder="İsim, e-posta veya telefon ara…"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

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

      {/* Participants Table */}
      <AdminSectionCard>
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Yükleniyor…</span>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 px-8 py-6">
              <IdCard className="h-12 w-12 text-slate-400" />
              <div>
                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">Kayıt bulunamadı</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Arama kriterlerinizi değiştirmeyi deneyin</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200/60 bg-white/80 backdrop-blur-sm dark:ring-slate-700/60 dark:bg-slate-800/80">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
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
                      className="group border-b border-slate-200/40 dark:border-slate-700/40 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-700/80"
                    >
                      {/* # sütunu */}
                      <Td className="relative font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
                            {n}
                          </div>
                        </div>
                      </Td>
                      
                      {/* Ad Soyad */}
                      <Td className="font-semibold text-slate-900 dark:text-white">{r.name ?? "—"}</Td>
                      
                      {/* E-posta */}
                      <Td>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <a 
                            href={`mailto:${r.email}`} 
                            className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            {r.email}
                          </a>
                        </div>
                      </Td>
                      
                      {/* Telefon */}
                      <Td>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {r.phone ? (
                            <a 
                              href={`tel:${r.phone}`} 
                              className="font-semibold text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                            >
                              {r.phone}
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                      </Td>
                      
                      {/* Yaş */}
                      <Td>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {Number.isFinite(r.age as any) ? r.age : "—"}
                          </span>
                        </div>
                      </Td>
                      
                      {/* Görev */}
                      <Td>
                        {r.profileRole ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${ROLE_COLORS[r.profileRole]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                            {ROLE_BADGE[r.profileRole]}
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

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Toplam <strong className="text-slate-900 dark:text-white">{total}</strong> katılımcı • Sayfa{" "}
            <strong className="text-slate-900 dark:text-white">{page}</strong> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md"
            >
              Sonraki
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </AdminSectionCard>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-6 py-4 align-middle", className].join(" ")}>{children}</td>;
}