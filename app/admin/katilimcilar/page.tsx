// app/admin/katilimcilar/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, ChevronDown } from "lucide-react";

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

// ---- Blur & Şeffaf custom dropdown
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
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
          "ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20 transition",
          "backdrop-blur-md bg-white/30 dark:bg-white/10 supports-[backdrop-filter]:bg-white/15",
        ].join(" ")}
      >
        {value}/sayfa
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          className={[
            "absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl",
            "ring-1 ring-foreground/10 shadow-lg",
            "backdrop-blur-xl bg-white/25 dark:bg-white/10 supports-[backdrop-filter]:bg-white/12",
          ].join(" ")}
        >
          <ul className="py-1">
            {options.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 text-sm",
                    "hover:bg-white/30 dark:hover:bg-white/15 transition",
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
    <div className="space-y-6">
      <AdminHeader
        title="Katılımcılar" variant="plain"
        desc={`Toplam ${total} katılımcı`}
        right={
          <div className="flex items-center gap-2">
            {/* Arama */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                className="w-64 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                placeholder="İsim, e-posta veya telefon ara…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Blur + şeffaf custom select */}
            <PageSizeSelect
              value={pageSize}
              onChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </div>
        }
      />

      <AdminSectionCard>
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10">
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
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center opacity-70">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center opacity-70">
                    Yükleniyor…
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((r, i) => {
                  const n = startIndex + i + 1; // 1., 2., 3. …
                  return (
                    <tr
                      key={r.id}
                      className={[
                        "group border-t border-foreground/10",
                        "hover:bg-foreground/[0.04] hover:border-l-4 hover:border-transparent",
                        "multicolor-hover hover:multicolor-persist",
                      ].join(" ")}
                    >
                      {/* # sütunu: kalın */}
                      <Td className="relative font-semibold">
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full opacity-0 group-hover:opacity-100 
                                     bg-gradient-to-b from-fuchsia-600 via-violet-600 to-cyan-500"
                        />
                        {n}.
                      </Td>
                      {/* Ad Soyad: kalın */}
                      <Td className="font-semibold">{r.name ?? "—"}</Td>
                      {/* E-posta: kalın + alt çizgi yok */}
                      <Td className="font-semibold">
                        <a href={`mailto:${r.email}`} className="no-underline hover:opacity-80">
                          {r.email}
                        </a>
                      </Td>
                      {/* Telefon: kalın + alt çizgi yok */}
                      <Td className="font-semibold">
                        {r.phone ? (
                          <a href={`tel:${r.phone}`} className="no-underline hover:opacity-80">
                            {r.phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </Td>
                      {/* Yaş: kalın */}
                      <Td className="font-semibold">
                        {Number.isFinite(r.age as any) ? r.age : "—"}
                      </Td>
                      {/* Görev: kalın */}
                      <Td className="font-semibold">
                        {r.profileRole ? ROLE_BADGE[r.profileRole] : "—"}
                      </Td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Sayfalama: şeffaf butonlar */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="opacity-70">
            Toplam <strong>{total}</strong> katılımcı • Sayfa <strong>{page}</strong> / {totalPages}
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
