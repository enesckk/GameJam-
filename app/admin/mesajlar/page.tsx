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
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
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
        })}}`,
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
        setAlert(j?.message || `Kaydedilemedi (${r.status})`);
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
      try {
        const r2 = await fetch(`/api/admin/messages/${id}`, {
          credentials: "include",
          cache: "no-store",
        });
        const j2 = await r2.json().catch(() => ({}));
        if (r2.ok) {
          setOutbox((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, subject: j2.subject, body: j2.body } : m
            )
          );
        }
      } catch {}
      await cancelEdit(id);
    } catch (e: any) {
      if (e?.name === "AbortError") {
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
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-40 sm:opacity-50"></div>
        <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-lg opacity-60 sm:opacity-75"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <MessageSquare className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Mesajlar
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Gelen, giden ve yeni mesaj oluşturma
              </p>
            </div>
          </div>

          {/* Search (compose dışı) */}
          {tab !== "compose" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 sm:px-3 sm:py-3 backdrop-blur-sm">
                  <Search className="h-5 w-5 text-white/70" />
                  <input
                    className="w-full sm:w-72 md:w-80 bg-transparent outline-none text-white placeholder-white/70 text-sm sm:text-base"
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
                    inputMode="search"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setTab("inbox");
            setPage(1);
          }}
          className={btn(tab === "inbox")}
        >
          <Inbox className="h-4 w-4" /> <span>Gelen</span>
        </button>
        <button
          onClick={() => {
            setTab("outbox");
            setPage(1);
          }}
          className={btn(tab === "outbox")}
        >
          <Mail className="h-4 w-4" /> <span>Giden</span>
        </button>
        <button onClick={() => setTab("compose")} className={btn(tab === "compose")}>
          <Send className="h-4 w-4" /> <span>Yeni</span>
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className="flex items-start sm:items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-3 sm:p-4 backdrop-blur-sm">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <div>
                          <div className="font-semibold text-green-400">
              Bilgi
            </div>
                          <div className="text-sm text-green-300">
              {alert}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {tab !== "compose" && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between rounded-2xl bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {tab === "inbox" && (
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyUnread}
                  onChange={(e) => {
                    setOnlyUnread(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Yalnızca okunmamış
              </label>
            )}
          </div>
          <div className="text-sm text-slate-400">
            Toplam:{" "}
            <strong className="text-white">{total}</strong>
          </div>
        </div>
      )}

      {/* === GELEN === */}
      {tab === "inbox" && (
        <AdminSectionCard>
          {loading ? (
            <LoadingBox />
          ) : inbox.length === 0 ? (
            <EmptyBox icon={Inbox} title="Mesaj yok" desc="Henüz hiç mesaj alınmamış" />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {inbox.map((m) => {
                const open = !!expanded[m.id];
                const unread = !m.readAt;

                return (
                  <div
                    key={m.id}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 ${
                      unread
                        ? "border-indigo-600 bg-indigo-950/20"
                        : "border-slate-700/60 bg-slate-800/80"
                    } backdrop-blur-sm`}
                  >
                    <button
                      onClick={() => {
                        toggleExpand(m.id);
                        if (!open && unread) markRead(m.id);
                      }}
                      className="relative flex w-full items-start sm:items-center justify-between gap-4 p-4 sm:p-6 text-left hover:bg-slate-700/80 transition-colors duration-200"
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shrink-0">
                          {open ? (
                            <ChevronDown className="h-5 w-5 text-white" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <h3
                              className={`text-base sm:text-lg font-bold truncate ${
                                unread
                                  ? "text-indigo-100"
                                  : "text-white"
                              } max-w-[16rem] sm:max-w-none`}
                              title={m.subject}
                            >
                              {m.subject}
                            </h3>
                            {unread && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                                <EyeOff className="h-3.5 w-3.5" />
                                Yeni
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1.5 sm:gap-4 text-xs sm:text-sm text-slate-400">
                            <div className="truncate">
                              <span className="font-medium">Gönderen: </span>
                              <span className="truncate">
                                {m.sender.name ?? m.sender.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <time dateTime={m.createdAt} title={m.createdAt}>
                                {fmt(m.createdAt)}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 p-3 sm:p-4">
                          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {m.body}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

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
          {loading ? (
            <LoadingBox />
          ) : outbox.length === 0 ? (
            <EmptyBox icon={Mail} title="Mesaj yok" desc="Henüz hiç mesaj gönderilmemiş" />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {outbox.map((m) => {
                const open = !!expanded[m.id];
                const draft = editDrafts[m.id] ?? {
                  subject: m.subject,
                  body: m.body,
                };
                const subjectTrim = (draft.subject ?? "").trim();
                const bodyTrim = (draft.body ?? "").trim();
                const isValid =
                  subjectTrim.length >= 3 && bodyTrim.length >= 1;
                const isDirty =
                  subjectTrim !== (m.subject ?? "") ||
                  bodyTrim !== (m.body ?? "");
                const isSaving = !!editState[m.id]?.saving;
                const errorMsg = editState[m.id]?.msg;

                return (
                  <div
                    key={m.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <button
                          onClick={() =>
                            setExpanded((s) => ({ ...s, [m.id]: !s[m.id] }))
                          }
                          className="flex items-start sm:items-center gap-3 sm:gap-4 text-left hover:opacity-90 select-none"
                        >
                          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shrink-0">
                            {open ? (
                              <ChevronDown className="h-5 w-5 text-white" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 truncate max-w-[17rem] sm:max-w-none" title={m.subject}>
                              {m.subject}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4 text-xs sm:text-sm text-slate-300">
                              {m.team && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>Takım: {m.team.name}</span>
                                </div>
                              )}
                              <div className="min-w-0 truncate">
                                <span className="font-medium">Alıcılar: </span>
                                <span className="truncate">
                                  {m.recipients.map((r) => r.name ?? r.email).join(", ")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <time dateTime={m.createdAt} title={m.createdAt}>
                                  {fmt(m.createdAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDraft(m);
                            }}
                            title="Düzenle"
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden xs:inline">Düzenle</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOutbox(m.id);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-red-900/30 hover:bg-red-900/50 text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden xs:inline">Sil</span>
                          </button>
                        </div>
                      </div>

                      {open && (
                        <div
                          className="mt-4 sm:mt-6 border-t border-slate-700/60 pt-4 sm:pt-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* inline edit */}
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                Konu
                              </label>
                              <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10">
                                  <input
                                    className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
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
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                İçerik
                              </label>
                              <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative rounded-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-sm transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10">
                                  <textarea
                                    className="min-h-[120px] w-full bg-transparent outline-none p-3 sm:p-4 text-white placeholder-slate-500 resize-y"
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
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <div className="text-sm text-slate-300">
                                {isSaving
                                  ? "Kaydediliyor…"
                                  : errorMsg ||
                                    (!isDirty
                                      ? "Değişiklik yok"
                                      : !isValid
                                      ? "Başlık ≥ 3, içerik ≥ 1 karakter olmalı"
                                      : "")}
                              </div>
                              <div className="flex items-center gap-2 sm:ml-auto">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEdit(m.id);
                                  }}
                                  className="rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 bg-slate-700 hover:bg-slate-600 text-slate-300"
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
                                  disabled={isSaving || !isValid || !isDirty}
                                  className="group relative inline-flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
                                >
                                  <CheckCircle className="h-4 w-4 relative z-10" />
                                  <span className="relative z-10">
                                    {isSaving ? "Kaydediliyor…" : "Kaydet"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* orijinal içerik */}
                          <div className="mt-4 sm:mt-6 rounded-2xl bg-slate-900/80 p-3 sm:p-4">
                            <div className="mb-2 text-sm font-semibold text-slate-300">
                              Gönderilen İçerik
                            </div>
                            <div className="text-sm text-slate-400 whitespace-pre-wrap">
                              {m.body}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
          <div className="space-y-6">
            {/* alıcı modu */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <label className="inline-flex items-center gap-2 sm:gap-3 text-sm font-medium text-slate-300">
                <input
                  type="radio"
                  checked={mode === "users"}
                  onChange={() => setMode("users")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <User className="h-5 w-5" />
                <span>Kullanıcılar</span>
              </label>
              <label className="inline-flex items-center gap-2 sm:gap-3 text-sm font-medium text-slate-300">
                <input
                  type="radio"
                  checked={mode === "team"}
                  onChange={() => setMode("team")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <Users className="h-5 w-5" />
                <span>Takım</span>
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
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  Konu
                </label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10">
                    <input
                      className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
                      value={subj}
                      onChange={(e) => setSubj(e.target.value)}
                      placeholder="Mesaj konusu..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  İçerik
                </label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative rounded-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-sm transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10">
                    <textarea
                      className="min-h-[120px] w-full bg-transparent outline-none p-3 sm:p-4 text-white placeholder-slate-500 resize-y"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Mesaj içeriği..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSubj("");
                  setBody("");
                }}
                className="rounded-xl px-3 sm:px-4 py-2.5 text-sm font-medium transition-all duration-300 bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={send}
                disabled={sending}
                className="group relative inline-flex items-center gap-2 rounded-2xl px-3 sm:px-4 py-2.5 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
              >
                <Send className="h-4 w-4 relative z-10" />
                <span className="relative z-10">
                  {sending ? "Gönderiliyor…" : "Gönder"}
                </span>
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
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full sm:w-80 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 pl-8 pr-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-0 focus:ring-2 focus:ring-violet-500 transition"
          placeholder="İsim/e-posta ara…"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          inputMode="search"
        />
      </div>

      {/* Mobile Card List */}
      <ul className="grid gap-2 md:hidden">
        {users.map((u) => {
          const checked = selectedUsers.has(u.id);
          return (
            <li
              key={u.id}
              className="rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur p-3 flex items-start justify-between"
            >
              <div className="min-w-0">
                <div className="font-semibold truncate text-white" title={u.name ?? "—"}>
                  {u.name ?? "—"}
                </div>
                <div className="text-xs text-slate-300 truncate">{u.email}</div>
                <div className="text-xs text-slate-300">{u.phone ?? "—"}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleUser(u.id)}
                className="ml-3 inline-flex items-center justify-center rounded-md p-2 ring-1 ring-slate-600 hover:bg-slate-700/50"
                aria-pressed={checked}
              >
                {checked ? <CheckSquare className="h-4 w-4 text-indigo-400" /> : <Square className="h-4 w-4 text-slate-400" />}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Desktop Table */}
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur hidden md:block">
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
                  className="cursor-pointer border-t border-slate-700/60 hover:bg-slate-700/50"
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
                      className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-slate-600 bg-transparent hover:bg-slate-700/50"
                      aria-pressed={checked}
                      aria-label={checked ? "Kullanıcı seçili" : "Kullanıcıyı seçime ekle"}
                    >
                      {checked ? <CheckSquare className="h-4 w-4 text-indigo-400" /> : <Square className="h-4 w-4 text-slate-400" />}
                    </button>
                  </Td>
                  <Td className="font-semibold text-white">{u.name ?? "—"}</Td>
                  <Td className="max-w-[320px] truncate text-slate-300" title={u.email}>
                    <span className="hover:opacity-80">{u.email}</span>
                  </Td>
                  <Td className="text-slate-300">{u.phone ?? "—"}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full sm:w-80 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 pl-8 pr-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-0 focus:ring-2 focus:ring-violet-500 transition"
          placeholder="Takım ara…"
          value={teamQuery}
          onChange={(e) => setTeamQuery(e.target.value)}
          inputMode="search"
        />
      </div>

      <div className="grid gap-2">
        {teams.map((t) => {
          const open = selectedTeam?.id === t.id;
          return (
            <div
              key={t.id}
              className="overflow-hidden rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur"
            >
              <button
                onClick={() => setSelectedTeam(open ? null : t)}
                className="flex w-full items-center justify-between px-3 py-2 hover:bg-slate-700/50 text-white"
              >
                <div className="flex items-center gap-2">
                  {open ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <div className="font-semibold">{t.name}</div>
                  <span className="text-xs text-slate-300">{t.members.length} üye</span>
                </div>
              </button>

              {open && (
                <div className="space-y-2 border-t border-slate-700/60 p-3">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
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
                    <>
                      {/* Mobile cards */}
                      <ul className="grid gap-2 md:hidden">
                        {t.members.map((m) => {
                          const checked = selectedTeamMembers.has(m.id);
                          return (
                            <li
                              key={m.id}
                              className="rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur p-3 flex items-start justify-between"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold truncate text-white" title={m.name ?? "—"}>
                                  {m.name ?? "—"}
                                </div>
                                <div className="text-xs text-slate-300 truncate">{m.email}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleTeamMember(m.id)}
                                className="ml-3 inline-flex items-center justify-center rounded-md p-2 ring-1 ring-slate-600 hover:bg-slate-700/50"
                                aria-pressed={checked}
                              >
                                {checked ? (
                                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                                ) : (
                                  <Square className="h-4 w-4 text-slate-400" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Desktop table */}
                      <div className="overflow-x-auto rounded-xl ring-1 ring-slate-700/60 bg-slate-800/80 backdrop-blur hidden md:block">
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
                                  className="cursor-pointer border-t border-slate-700/60 hover:bg-slate-700/50"
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
                                      className="inline-flex items-center justify-center rounded-md p-1 ring-1 ring-slate-600 bg-transparent hover:bg-slate-700/50"
                                      aria-pressed={checked}
                                      aria-label={
                                        checked ? "Üye seçili" : "Üyeyi seçime ekle"
                                      }
                                    >
                                      {checked ? (
                                        <CheckSquare className="h-4 w-4 text-indigo-400" />
                                      ) : (
                                        <Square className="h-4 w-4 text-slate-400" />
                                      )}
                                    </button>
                                  </Td>
                                  <Td className="font-semibold text-white">{m.name ?? "—"}</Td>
                                  <Td className="max-w-[320px] truncate text-slate-300" title={m.email}>
                                    <span className="hover:opacity-80">{m.email}</span>
                                  </Td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
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
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
    "bg-white/30 dark:bg-white/10 backdrop-blur-md",
    active
      ? "ring-2 ring-violet-600"
      : "ring-0 hover:ring-2 hover:ring-violet-500 active:ring-2 active:ring-violet-600",
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
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm relative z-10">
      <div className="opacity-70">
        Toplam <strong>{total}</strong> mesaj • Sayfa <strong>{page}</strong> / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-foreground/15 bg-white/70 dark:bg-white/10 backdrop-blur disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Önceki</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-foreground/15 bg-white/70 dark:bg-white/10 backdrop-blur disabled:opacity-50"
        >
          <span className="hidden xs:inline">Sonraki</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ==== Küçük yardımcı kutular ==== */
function LoadingBox() {
  return (
    <div className="py-12 sm:py-16 text-center">
      <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-800 px-5 sm:px-6 py-3 sm:py-4">
        <div className="h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500"></div>
        <span className="text-slate-400 font-medium">Yükleniyor…</span>
      </div>
    </div>
  );
}
function EmptyBox({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="py-12 sm:py-16 text-center">
      <div className="inline-flex flex-col items-center gap-3 sm:gap-4 rounded-2xl bg-slate-800 px-6 sm:px-8 py-5 sm:py-6">
        <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
        <div>
          <div className="text-base sm:text-lg font-semibold text-slate-300">
            {title}
          </div>
          <div className="text-sm text-slate-400">{desc}</div>
        </div>
      </div>
    </div>
  );
}
