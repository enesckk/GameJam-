// app/admin/mesajlar/page.tsx
"use client";

import type React from "react";
import {
  useEffect,
  useMemo,
  useState,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import {
  Search,
  Send,
  Inbox,
  Mail,
  Trash2,
  Pencil,
  EyeOff,
  Users,
  User,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

/* ==== Tipler ==== */
type InboxItem = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string };
  readAt: string | null;
};
type OutboxItem = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  team: { id: string; name: string } | null;
  recipients: {
    id: string;
    name: string | null;
    email: string;
    readAt: string | null;
  }[];
};
type UserLite = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
};
type TeamLite = { id: string; name: string; members: UserLite[] };

/* ==== Sayfa ==== */
export default function AdminMessagesPage() {
  const [tab, setTab] = useState<"inbox" | "outbox" | "compose">("inbox");

  // liste durumları
  const [q, setQ] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [alert, setAlert] = useState<string | null>(null);

  // compose durumları
  const [mode, setMode] = useState<"users" | "team">("users");
  const [users, setUsers] = useState<UserLite[]>([]);
  const [teams, setTeams] = useState<TeamLite[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedTeam, setSelectedTeam] = useState<TeamLite | null>(null);
  const [teamAll, setTeamAll] = useState(true);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Set<string>>(
    new Set()
  );
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  // outbox satır başına edit taslakları + durum
  const [editDrafts, setEditDrafts] = useState<
    Record<string, { subject: string; body: string }>
  >({});
  const [editState, setEditState] = useState<
    Record<string, { saving: boolean; msg: string | null }>
  >({});

  // in-flight PATCH isteklerini iptal etmek için controller'lar
  const [controllers, setControllers] = useState<
    Record<string, AbortController>
  >({});

  /* ==== Liste yükleme ==== */
  useEffect(() => {
    if (tab === "compose") return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setAlert(null);
      try {
        const params = new URLSearchParams();
        params.set("box", tab);
        if (q) params.set("q", q);
        if (tab === "inbox" && onlyUnread) params.set("unread", "1");
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        const r = await fetch(`/api/admin/messages?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
        });
        const j = await r.json().catch(() => ({}));

        if (!ignore) {
          if (!r.ok) throw new Error(j?.message || "Liste alınamadı");
          setTotal(j.total ?? 0);
          if (tab === "inbox") setInbox(j.items ?? []);
          else setOutbox(j.items ?? []);
        }
      } catch (e: any) {
        if (!ignore) {
          setInbox([]);
          setOutbox([]);
          setTotal(0);
          setAlert(e?.message || "Hata oluştu.");
          console.error(e);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, q, onlyUnread, page, pageSize]);

  /* ==== Compose için kullanıcı & takım listeleri ==== */
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery, mode]);
  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamQuery, mode]);

  async function loadUsers() {
    if (mode !== "users") return;
    try {
      const params = new URLSearchParams();
      if (userQuery) params.set("q", userQuery);
      params.set("page", "1");
      params.set("pageSize", "20");
      const r = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const j = await r.json();
      if (r.ok) setUsers(j.items ?? []);
    } catch (e) {
      console.error(e);
    }
  }
  async function loadTeams() {
    if (mode !== "team") return;
    try {
      const r = await fetch(
        `/api/admin/teams?${new URLSearchParams({
          q: teamQuery,
          page: "1",
          pageSize: "20",
        })}`,
        { credentials: "include", cache: "no-store" }
      );
      const j = await r.json();
      if (r.ok) {
        setTeams(
          (j.items ?? []).map((t: any) => ({
            id: t.id,
            name: t.name,
            members: (t.members ?? []).map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              phone: m.phone,
            })),
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  /* ==== Yardımcılar ==== */
  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("tr-TR");
    } catch {
      return iso;
    }
  };
  const toggleExpand = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  const toggleUser = (id: string) =>
    setSelectedUsers((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleTeamMember = (id: string) =>
    setSelectedTeamMembers((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  /* ==== Inbox: okundu işaretle ==== */
  async function markRead(id: string) {
    try {
      const r = await fetch("/api/admin/messages/read", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: id }),
      });
      if (!r.ok) return;
      setInbox((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, readAt: m.readAt ?? new Date().toISOString() } : m
        )
      );
    } catch (e) {
      console.error(e);
    }
  }

  /* ==== Outbox: düzenle/sil ==== */
  function openEditDraft(m: OutboxItem) {
    setExpanded((s) => {
      const currentlyOpen = s[m.id];
      const willOpen = !currentlyOpen; // Toggle
      if (willOpen) {
        setEditDrafts((d) => ({ ...d, [m.id]: { subject: m.subject, body: m.body } }));
      } else {
        setEditDrafts((d) => {
          const { [m.id]: _, ...rest } = d;
          return rest;
        });
        setEditState((es) => {
          const { [m.id]: _, ...rest } = es;
          return rest;
        });
      }
      return { ...s, [m.id]: willOpen };
    });
    setTab("outbox");
  }

  async function cancelEdit(id: string) {
    const controller = controllers[id];
    if (controller) {
      try {
        controller.abort();
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.log("Controller abort error (normal):", error);
      }
    }
    setControllers((cs) => {
      const { [id]: _, ...rest } = cs;
      return rest;
    });
    setExpanded((s) => ({ ...s, [id]: false }));
    setEditDrafts((d) => {
      const { [id]: _, ...rest } = d;
      return rest;
    });
    setEditState((es) => {
      const { [id]: _, ...rest } = es;
      return rest;
    });
  }

  async function saveEdit(id: string) {
    const current = outbox.find((m) => m.id === id);
    const draft =
      editDrafts[id] ?? { subject: current?.subject ?? "", body: current?.body ?? "" };

    const subject = (draft.subject ?? "").trim();
    const text = (draft.body ?? "").trim();

    if (subject.length < 3 || text.length < 1) {
      setEditState((s) => ({
        ...s,
        [id]: { saving: false, msg: "Konu en az 3, içerik en az 1 karakter" },
      }));
      return;
    }

    const isDirty =
      subject !== (current?.subject ?? "") || text !== (current?.body ?? "");
    if (!isDirty) {
      await cancelEdit(id);
      return;
    }

    setEditState((s) => ({ ...s, [id]: { saving: true, msg: null } }));

    const controller = new AbortController();
    setControllers((cs) => ({ ...cs, [id]: controller }));

    try {
      const r = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body: text }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setEditState((s) => ({
          ...s,
          [id]: { saving: false, msg: j?.message || `Hata (${r.status})` },
        }));
        return;
      }

      setOutbox((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, subject: j?.subject ?? subject, body: j?.body ?? text }
            : m
        )
      );
      setAlert("Mesaj güncellendi.");
      await cancelEdit(id);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        console.log("Request was aborted");
        setEditState((s) => {
          const { [id]: _, ...rest } = s;
          return rest;
        });
        return;
      }
      setEditState((s) => ({
        ...s,
        [id]: { saving: false, msg: e?.message || "Hata" },
      }));
    } finally {
      setControllers((cs) => {
        const { [id]: _, ...rest } = cs;
        return rest;
      });
      if (!controller.signal.aborted) {
        setEditState((s) => ({
          ...s,
          [id]: { ...(s[id] ?? { msg: null }), saving: false },
        }));
      }
    }
  }

  async function deleteOutbox(id: string) {
    if (!confirm("Mesajı silmek istiyor musunuz?")) return;
    try {
      const r = await fetch(`/api/admin/messages/${id}?box=outbox`, {
        method: "DELETE",
        credentials: "include",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Silinemedi");
      setOutbox((prev) => prev.filter((m) => m.id !== id));
      setAlert("Mesaj silindi.");
      await cancelEdit(id);
    } catch (e: any) {
      setAlert(e?.message || "Hata");
    }
  }

  /* ==== Compose: gönder ==== */
  async function send() {
    setSending(true);
    setAlert(null);
    try {
      const payload: any = { subject: subj.trim(), body: body.trim() };
      if (mode === "users") {
        payload.toUserIds = Array.from(selectedUsers);
      } else if (mode === "team" && selectedTeam) {
        payload.teamId = selectedTeam.id;
        if (teamAll) payload.allTeamMembers = true;
        else payload.teamMemberIds = Array.from(selectedTeamMembers);
      }
      const r = await fetch("/api/admin/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Gönderilemedi");

      // temizle
      setSelectedUsers(new Set());
      setSelectedTeam(null);
      setSelectedTeamMembers(new Set());
      setTeamAll(true);
      setSubj("");
      setBody("");
      setAlert("Mesaj gönderildi.");
      setTab("outbox");
      setPage(1);
    } catch (e: any) {
      setAlert(e?.message || "Hata");
    } finally {
      setSending(false);
    }
  }

  /* ==== Render ==== */
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Mesajlar"
        variant="plain"
        desc="Gelen, giden ve yeni mesaj oluşturma"
      />

      {/* Sekmeler */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setTab("inbox");
            setPage(1);
          }}
          className={btn(tab === "inbox")}
        >
          <Inbox className="h-4 w-4" /> Gelen
        </button>
        <button
          onClick={() => {
            setTab("outbox");
            setPage(1);
          }}
          className={btn(tab === "outbox")}
        >
          <Mail className="h-4 w-4" /> Giden
        </button>
        <button onClick={() => setTab("compose")} className={btn(tab === "compose")}>
          <Send className="h-4 w-4" /> Yeni
        </button>
      </div>

      {alert && (
        <div className="rounded-lg bg-foreground/10 px-3 py-2 text-sm">{alert}</div>
      )}

      {/* Araç çubuğu */}
      {tab !== "compose" && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <input
              className="w-80 rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
              placeholder={
                tab === "inbox"
                  ? "Konu/içerik/gönderen ara…"
                  : "Konu/içerik/alıcı ara…"
              }
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {tab === "inbox" && (
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => {
                  setOnlyUnread(e.target.checked);
                  setPage(1);
                }}
              />
              Yalnızca okunmamış
            </label>
          )}
          <div className="ml-auto text-sm opacity-75">
            Toplam: <strong>{total}</strong>
          </div>
        </div>
      )}

      {/* === GELEN === */}
      {tab === "inbox" && (
        <AdminSectionCard>
          {loading && (
            <div className="py-10 text-center opacity-70">Yükleniyor…</div>
          )}
          {!loading && inbox.length === 0 && (
            <div className="py-10 text-center opacity-70">Mesaj yok.</div>
          )}

          <div className="grid gap-3">
            {inbox.map((m) => {
              const open = !!expanded[m.id];
              const unread = !m.readAt;
              return (
                <div
                  key={m.id}
                  className="relative rounded-2xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 transition group multicolor-hover hover:multicolor-persist"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-fuchsia-600 via-violet-600 to-cyan-500 opacity-60 group-hover:opacity-100 z-0"
                  />
                  <div
                    role="button"
                    onClick={() => {
                      toggleExpand(m.id);
                      if (!open && unread) markRead(m.id);
                    }}
                    className="relative z-10 flex w-full items-center justify-between px-4 py-3 text-left hover:bg-foreground/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      {open ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="font-semibold">{m.subject}</div>
                      <span className="text-xs opacity-70">
                        Gönderen: {m.sender.name ?? m.sender.email}
                      </span>
                      {unread && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold">
                          <EyeOff className="h-3 w-3" /> Yeni
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-70">{fmt(m.createdAt)}</div>
                  </div>
                  {open && (
                    <div className="px-4 pb-4 relative z-10">
                      <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pager
            page={page}
            total={total}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </AdminSectionCard>
      )}

      {/* === GİDEN === */}
      {tab === "outbox" && (
        <AdminSectionCard>
          {loading && (
            <div className="py-10 text-center opacity-70">Yükleniyor…</div>
          )}
          {!loading && outbox.length === 0 && (
            <div className="py-10 text-center opacity-70">Mesaj yok.</div>
          )}

          <div className="grid gap-3">
            {outbox.map((m) => {
              const open = !!expanded[m.id];
              const draft = editDrafts[m.id] ?? {
                subject: m.subject,
                body: m.body,
              };
              const subjectTrim = (draft.subject ?? "").trim();
              const bodyTrim = (draft.body ?? "").trim();
              const isValid = subjectTrim.length >= 3 && bodyTrim.length >= 1;
              const isSaving = !!editState[m.id]?.saving;
              const errorMsg = editState[m.id]?.msg;

              return (
                <div
                  key={m.id}
                  className="relative rounded-2xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10 transition group multicolor-hover hover:multicolor-persist"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-fuchsia-600 via-violet-600 to-cyan-500 opacity-60 group-hover:opacity-100 z-0"
                  />
                  <div className="relative z-10 flex items-center justify-between px-4 py-3">
                    <div
                      role="button"
                      onClick={() =>
                        setExpanded((s) => ({ ...s, [m.id]: !s[m.id] }))
                      }
                      className="flex items-center gap-3 text-left hover:opacity-90 select-none"
                    >
                      {open ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="font-semibold">{m.subject}</div>
                      {m.team && (
                        <span className="text-xs opacity-70">
                          Takım: {m.team.name}
                        </span>
                      )}
                      <span className="text-xs opacity-70">
                        Alıcılar:{" "}
                        {m.recipients.map((r) => r.name ?? r.email).join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDraft(m);
                        }}
                        title="Düzenle"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5 disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" /> Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOutbox(m.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                      >
                        <Trash2 className="h-4 w-4" /> Sil
                      </button>
                      <div className="text-xs opacity-70">{fmt(m.createdAt)}</div>
                    </div>
                  </div>

                  {open && (
                    <div
                      className="px-4 pb-4 relative z-10 pointer-events-auto"
                      onClickCapture={(e) => e.stopPropagation()}
                    >
                      {/* inline edit */}
                      <div className="grid gap-2">
                        <label className="text-xs">Konu</label>
                        <input
                          className="rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                          value={draft.subject}
                          onChange={(e) =>
                            setEditDrafts((d) => {
                              const prev = d[m.id] ?? {
                                subject: m.subject,
                                body: m.body,
                              };
                              return {
                                ...d,
                                [m.id]: { ...prev, subject: e.target.value },
                              };
                            })
                          }
                          disabled={isSaving}
                        />
                        <label className="text-xs">İçerik</label>
                        <textarea
                          className="min-h-[120px] rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                          value={draft.body}
                          onChange={(e) =>
                            setEditDrafts((d) => {
                              const prev = d[m.id] ?? {
                                subject: m.subject,
                                body: m.body,
                              };
                              return {
                                ...d,
                                [m.id]: { ...prev, body: e.target.value },
                              };
                            })
                          }
                          disabled={isSaving}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <div className="mr-auto text-xs opacity-75">
                            {isSaving ? "Kaydediliyor…" : errorMsg || ""}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit(m.id);
                            }}
                            className="rounded-lg px-3 py-1 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                            disabled={false}
                          >
                            Vazgeç
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit(m.id);
                            }}
                            disabled={isSaving || !isValid}
                            className="rounded-lg px-3 py-1 text-sm text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 disabled:opacity-60"
                          >
                            {isSaving ? "Kaydediliyor…" : "Kaydet"}
                          </button>
                        </div>
                      </div>

                      {/* orijinal içerik */}
                      <div className="mt-3 rounded-xl bg-foreground/5 p-3 text-xs opacity-80">
                        <div className="mb-1 font-semibold">Gönderilen İçerik</div>
                        <div className="whitespace-pre-wrap">{m.body}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pager
            page={page}
            total={total}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </AdminSectionCard>
      )}

      {/* === YENİ (compose) === */}
      {tab === "compose" && (
        <AdminSectionCard
          title="Yeni Mesaj"
          subtitle="Kullanıcı(lar)a veya bir takımın tüm/özel üyelerine gönderin."
        >
          <div className="grid gap-4">
            {/* alıcı modu */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={mode === "users"}
                  onChange={() => setMode("users")}
                />
                <User className="h-4 w-4" /> Kullanıcılar
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={mode === "team"}
                  onChange={() => setMode("team")}
                />
                <Users className="h-4 w-4" /> Takım
              </label>
            </div>

            {/* kullanıcı seçimi */}
            {mode === "users" && (
              <UserPicker
                users={users}
                userQuery={userQuery}
                setUserQuery={setUserQuery}
                selectedUsers={selectedUsers}
                toggleUser={toggleUser}
              />
            )}

            {/* takım seçimi */}
            {mode === "team" && (
              <TeamPicker
                teams={teams}
                teamQuery={teamQuery}
                setTeamQuery={setTeamQuery}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                teamAll={teamAll}
                setTeamAll={setTeamAll}
                selectedTeamMembers={selectedTeamMembers}
                toggleTeamMember={toggleTeamMember}
                clearSelectedTeamMembers={() => setSelectedTeamMembers(new Set())}
              />
            )}

            {/* konu & içerik */}
            <div className="grid gap-2">
              <label className="text-sm">Konu</label>
              <input
                className="rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                value={subj}
                onChange={(e) => setSubj(e.target.value)}
              />
              <label className="text-sm">İçerik</label>
              <textarea
                className="min-h-[140px] rounded-xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubj("");
                  setBody("");
                }}
                className="rounded-lg px-3 py-2 text-sm ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={send}
                disabled={sending}
                className="rounded-lg px-3 py-2 text-sm text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 disabled:opacity-60"
              >
                {sending ? "Gönderiliyor…" : "Gönder"}
              </button>
            </div>
          </div>
        </AdminSectionCard>
      )}
    </div>
  );
}

/* ==== Parçalar: UserPicker & TeamPicker ==== */
function UserPicker({
  users,
  userQuery,
  setUserQuery,
  selectedUsers,
  toggleUser,
}: {
  users: UserLite[];
  userQuery: string;
  setUserQuery: (s: string) => void;
  selectedUsers: Set<string>;
  toggleUser: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
        <input
          className="w-full rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
          placeholder="İsim/e-posta ara…"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <Th className="w-10"></Th>
              <Th>Ad Soyad</Th>
              <Th>E-posta</Th>
              <Th>Telefon</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const checked = selectedUsers.has(u.id);
              return (
                <tr
                  key={u.id}
                  className="cursor-pointer border-t border-foreground/10 hover:bg-foreground/[0.04]"
                  onClick={() => toggleUser(u.id)}
                >
                  <Td
                    onClick={(e: React.MouseEvent<HTMLTableCellElement>) => {
                      e.stopPropagation();
                      toggleUser(u.id);
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUser(u.id);
                      }}
                      className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                      aria-pressed={checked}
                      aria-label={checked ? "Kullanıcı seçili" : "Kullanıcı seç"}
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </Td>
                  <Td className="font-semibold">{u.name ?? "—"}</Td>
                  <Td>
                    <span className="hover:opacity-80">{u.email}</span>
                  </Td>
                  <Td className="font-semibold">
                    <span className="hover:opacity-80">{u.phone ?? "—"}</span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-xs opacity-70">
        Seçili: <strong>{selectedUsers.size}</strong>
      </div>
    </div>
  );
}

function TeamPicker({
  teams,
  teamQuery,
  setTeamQuery,
  selectedTeam,
  setSelectedTeam,
  teamAll,
  setTeamAll,
  selectedTeamMembers,
  toggleTeamMember,
  clearSelectedTeamMembers,
}: {
  teams: TeamLite[];
  teamQuery: string;
  setTeamQuery: (s: string) => void;
  selectedTeam: TeamLite | null;
  setSelectedTeam: (t: TeamLite | null) => void;
  teamAll: boolean;
  setTeamAll: (b: boolean) => void;
  selectedTeamMembers: Set<string>;
  toggleTeamMember: (id: string) => void;
  clearSelectedTeamMembers: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
        <input
          className="w-full rounded-xl bg-foreground/5 pl-8 pr-3 py-2 text-sm outline-none ring-1 ring-foreground/10"
          placeholder="Takım ara…"
          value={teamQuery}
          onChange={(e) => setTeamQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        {teams.map((t) => {
          const open = selectedTeam?.id === t.id;
          return (
            <div
              key={t.id}
              className="overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-white/50 backdrop-blur dark:bg-white/10"
            >
              <div
                role="button"
                onClick={() => setSelectedTeam(open ? null : t)}
                className="flex w-full items-center justify-between px-3 py-2 hover:bg-foreground/[0.04]"
              >
                <div className="flex items-center gap-2">
                  {open ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <div className="font-semibold">{t.name}</div>
                  <span className="text-xs opacity-70">{t.members.length} üye</span>
                </div>
              </div>

              {open && (
                <div className="space-y-2 border-t border-foreground/10 p-3">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={teamAll}
                      onChange={(e) => {
                        setTeamAll(e.target.checked);
                        if (e.target.checked) clearSelectedTeamMembers();
                      }}
                    />
                    Tüm üyelere gönder
                  </label>

                  {!teamAll && (
                    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <Th className="w-10"></Th>
                            <Th>Ad Soyad</Th>
                            <Th>E-posta</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.members.map((m) => {
                            const checked = selectedTeamMembers.has(m.id);
                            return (
                              <tr
                                key={m.id}
                                className="cursor-pointer border-t border-foreground/10 hover:bg-foreground/[0.04]"
                                onClick={() => toggleTeamMember(m.id)}
                              >
                                <Td
                                  onClick={(
                                    e: React.MouseEvent<HTMLTableCellElement>
                                  ) => {
                                    e.stopPropagation();
                                    toggleTeamMember(m.id);
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTeamMember(m.id);
                                    }}
                                    className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5"
                                    aria-pressed={checked}
                                    aria-label={
                                      checked
                                        ? "Üye seçili"
                                        : "Üyeyi seçime ekle"
                                    }
                                  >
                                    {checked ? (
                                      <CheckSquare className="h-4 w-4" />
                                    ) : (
                                      <Square className="h-4 w-4" />
                                    )}
                                  </button>
                                </Td>
                                <Td className="font-semibold">{m.name ?? "—"}</Td>
                                <Td>
                                  <span className="hover:opacity-80">{m.email}</span>
                                </Td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==== Tablo yardımcıları (tipli) ==== */
function Th({
  children,
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableHeaderCellElement> & {
  children?: React.ReactNode;
}) {
  return (
    <th
      {...props}
      className={["px-3 py-2 text-xs font-semibold uppercase tracking-wide opacity-70", className].join(
        " "
      )}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  children?: React.ReactNode;
}) {
  return (
    <td
      {...props}
      className={["px-3 py-2 align-middle", className].join(" ")}
    >
      {children}
    </td>
  );
}
function btn(active: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
    "ring-1 ring-foreground/15 bg-transparent hover:bg-foreground/5",
    active ? "multicolor-persist" : "multicolor-hover",
  ].join(" ");
}
function Pager({
  page,
  total,
  pageSize,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <div className="opacity-70">
        Toplam <strong>{total}</strong> mesaj • Sayfa <strong>{page}</strong> /{" "}
        {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
        >
          Önceki
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-lg px-3 py-1 ring-1 ring-foreground/15 bg-transparent disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
