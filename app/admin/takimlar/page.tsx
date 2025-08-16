// app/admin/takimlar/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Search, ChevronDown, ChevronRight, Users } from "lucide-react";

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

// ---- Katılımcılar sayfasındaki blur & şeffaf custom dropdown
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
    <div className="space-y-6">
      <AdminHeader
        title="Takımlar"
        variant="plain"
        desc={`Toplam ${totalTeams} takım`}
        right={
          <div className="flex items-center gap-2">
            {/* Arama */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                className="w-72 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                placeholder="Takım adı, üye adı, e-posta veya telefon ara…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* (Opsiyonel) sayfa boyutu seçici — katılımcılardakiyle aynı */}
            <PageSizeSelect
              value={pageSize}
              onChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
              options={[5, 10, 20, 50]}
            />
          </div>
        }
      />

      <AdminSectionCard>
        {loading && <div className="py-12 text-center opacity-70">Yükleniyor…</div>}
        {!loading && rows.length === 0 && (
          <div className="py-12 text-center opacity-70">Takım bulunamadı.</div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((t, idx) => {
              const open = !!expanded[t.id];
              return (
                <div
                  key={t.id}
                  className="rounded-2xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 overflow-hidden"
                >
                  {/* Team header row */}
                  <button
                    onClick={() => toggle(t.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-foreground/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      {open ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <div className="text-base font-semibold">{t.name}</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
                        <Users className="h-3.5 w-3.5" />
                        {t.membersCount}
                      </span>
                    </div>
                    <div className="text-xs opacity-70">
                      #{idx + 1 + (page - 1) * pageSize}
                    </div>
                  </button>

                  {/* Members table */}
                  {open && (
                    <div className="overflow-x-auto border-top border-foreground/10">
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
                            <tr>
                              <td colSpan={6} className="px-4 py-6 text-center opacity-70">
                                Üye yok.
                              </td>
                            </tr>
                          )}
                          {t.members.map((m, i) => (
                            <tr
                              key={m.id}
                              className={[
                                "group border-t border-foreground/10",
                                "hover:bg-foreground/[0.04] multicolor-hover hover:multicolor-persist",
                              ].join(" ")}
                            >
                              {/* # */}
                              <Td className="relative font-semibold">
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full opacity-0 group-hover:opacity-100 bg-gradient-to-b from-fuchsia-600 via-violet-600 to-cyan-500"
                                />
                                {i + 1}.
                              </Td>

                              {/* Ad Soyad */}
                              <Td className="font-semibold">{m.name ?? "—"}</Td>

                              {/* E-posta (altı çizgisiz) */}
                              <Td>
                                <span className="hover:opacity-80">{m.email}</span>
                              </Td>

                              {/* Telefon (kalın, altı çizgisiz) */}
                              <Td className="font-semibold">
                                <span className="hover:opacity-80">{m.phone ?? "—"}</span>
                              </Td>

                              {/* Yaş (kalın) */}
                              <Td className="font-semibold">
                                {Number.isFinite(m.age as any) ? m.age : "—"}
                              </Td>

                              {/* Görev (kalın) */}
                              <Td className="font-semibold">
                                {m.profileRole ? ROLE_BADGE[m.profileRole] : "—"}
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

        {/* Sayfalama: şeffaf butonlar */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="opacity-70">
            Toplam <strong>{totalTeams}</strong> takım • Sayfa{" "}
            <strong>{page}</strong> / {totalPages}
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
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide opacity-70">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-4 py-3 align-middle", className].join(" ")}>{children}</td>;
}
