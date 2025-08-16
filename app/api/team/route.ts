import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";

type Role = "developer" | "designer" | "audio" | "pm";
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  role: Role;
  status: "active" | "invited" | "admin_added" | "form_applied";
  isLeader?: boolean;
};
type TeamState = {
  type: "individual" | "team";
  teamName: string;
  inviteCode?: string;
  members: Member[];
};

const TEAM_COOKIE = "team";
const PROFILE_COOKIE = "profile";
const MAX_TEAM = 4;
const ROLES: Role[] = ["developer", "designer", "audio", "pm"];
const SECURE = process.env.NODE_ENV === "production";

/* ------------------ helpers ------------------ */
function uid() { return Math.random().toString(36).slice(2, 10); }
function newInvite() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function readCookieJSON(req: NextRequest, name: string) {
  const raw = req.cookies.get(name)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function writeTeamCookie(res: NextResponse, team: TeamState) {
  res.cookies.set(TEAM_COOKIE, JSON.stringify(team), {
    path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365, secure: SECURE,
  });
}
function isPlaceholder(t: TeamState | null) {
  if (!t) return true;
  if (!t.teamName) return true;
  if (!t.members?.length) return true;
  if (t.members[0]?.email === "leader@example.com") return true;
  return false;
}
function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}
function originFrom(req: NextRequest) {
  return req.headers.get("origin") ?? new URL(req.url).origin;
}
function rawToken() {
  return crypto.randomBytes(32).toString("hex");
}

/** Cookie yoksa profilden DB'ye bakarak TeamState üretir ve cookie'yi senkronlar */
async function buildFromDBOrBootstrap(req: NextRequest): Promise<TeamState> {
  const prof = readCookieJSON(req, PROFILE_COOKIE) || {};
  const email = String(prof.email || "").toLowerCase().trim();

  // Profile yoksa minimal bootstrap
  if (!email) {
    const leader: Member = {
      id: uid(), name: prof.fullName || "Lider", email: "leader@example.com",
      phone: prof.phone || "", age: 18,
      role: (ROLES.includes(prof.role) ? prof.role : "developer") as Role,
      status: "active", isLeader: true,
    };
    return { type: "individual", teamName: "Takımım", inviteCode: newInvite(), members: [leader] };
  }

  // DB'de kullanıcı + takımını oku
  try {
    const me = await db.user.findUnique({
      where: { email },
      include: { team: { include: { members: true } } },
    });

    if (me?.team) {
      const t = me.team;

      // "invited" durumunu doğru göstermek için geçerli (kullanılmamış & süresi geçmemiş) reset token'ları çek
      const userIds = t.members.map(m => m.id);
      const now = new Date();
      const tokens = await db.passwordResetToken.findMany({
        where: { userId: { in: userIds }, usedAt: null, expiresAt: { gt: now } },
        select: { userId: true },
      });
      const invitedSet = new Set(tokens.map(x => x.userId));

      const members: Member[] = t.members.map((m) => {
        const canLogin = !!m.canLogin;
        const invited = !canLogin && invitedSet.has(m.id);
        return {
          id: m.id,
          name: m.name || "",
          email: (m.email || "").toLowerCase(),
          phone: m.phone || "",
          age: Number.isFinite(m.age as any) ? Number(m.age) : 18,
          role: (ROLES.includes(m.profileRole as Role) ? (m.profileRole as Role) : "developer"),
          status: canLogin ? "active" : (invited ? "invited" : "admin_added"),
          isLeader: m.id === me.id,
        };
      });
      if (!members.some(x => x.isLeader) && members.length > 0) {
        const i = members.findIndex(x => x.email === email);
        if (i >= 0) members[i].isLeader = true, members[i].status = "active";
      }
      return { type: "team", teamName: t.name || "Takımım", inviteCode: newInvite(), members };
    }

    const leader: Member = {
      id: me?.id || uid(),
      name: me?.name || prof.fullName || "Lider",
      email,
      phone: me?.phone || prof.phone || "",
      age: Number.isFinite(me?.age as any) ? Number(me?.age) : 18,
      role: (ROLES.includes(me?.profileRole as Role) ? (me?.profileRole as Role) : (ROLES.includes(prof.role) ? prof.role : "developer")) as Role,
      status: "active", isLeader: true,
    };
    return { type: "individual", teamName: "Takımım", inviteCode: newInvite(), members: [leader] };
  } catch {
    const leader: Member = {
      id: uid(), name: prof.fullName || "Lider", email, phone: prof.phone || "",
      age: Number.isFinite(prof.age) ? Number(prof.age) : 18,
      role: (ROLES.includes(prof.role) ? prof.role : "developer") as Role,
      status: "active", isLeader: true,
    };
    return { type: "individual", teamName: "Takımım", inviteCode: newInvite(), members: [leader] };
  }
}

/* ------------------ GET ------------------ */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get("refresh") === "1";
  let team = readCookieJSON(req, TEAM_COOKIE) as TeamState | null;

  if (!team || force || isPlaceholder(team)) {
    const built = await buildFromDBOrBootstrap(req);
    const res = NextResponse.json(built, { status: 200 });
    writeTeamCookie(res, built);
    return res;
  }
  return NextResponse.json(team, { status: 200 });
}

/* ------------------ PATCH ------------------ */
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  let team = readCookieJSON(req, TEAM_COOKIE) as TeamState | null;
  if (!team) team = await buildFromDBOrBootstrap(req);

  // Temel alanlar
  if (typeof body.teamName === "string") {
    const tn = body.teamName.trim().slice(0, 64);
    team.teamName = tn.length ? tn : "Takımım";
    // DB senkron
    try {
      const prof = readCookieJSON(req, PROFILE_COOKIE) || {};
      const me = await db.user.findUnique({
        where: { email: String(prof.email || "").toLowerCase().trim() },
        select: { teamId: true },
      });
      if (me?.teamId) {
        await db.team.update({ where: { id: me.teamId }, data: { name: team.teamName } });
      }
    } catch {}
  }

  if (body.type === "individual" || body.type === "team") {
    if (body.type === "team" && team.type !== "team" && !team.inviteCode) {
      team.inviteCode = newInvite();
    }
    team.type = body.type;
  }

  // Aksiyonlar
  if (body.action === "regen_code") {
    team.inviteCode = newInvite();
  }

  if (body.action === "to_individual") {
    const leader = team.members.find(m => m.isLeader);
    if (leader) {
      // Cookie: yalnızca lider kalsın
      team.members = [leader];
      team.type = "individual";

      // DB: lider dışındakileri ayır
      try {
        const prof = readCookieJSON(req, PROFILE_COOKIE) || {};
        const me = await db.user.findUnique({
          where: { email: String(prof.email || "").toLowerCase().trim() },
          select: { teamId: true, email: true },
        });
        if (me?.teamId) {
          await db.user.updateMany({
            where: { teamId: me.teamId, email: { not: String(me.email).toLowerCase() } },
            data: { teamId: null },
          });
        }
      } catch {}
    }
  }

  const res = NextResponse.json(team, { status: 200 });
  writeTeamCookie(res, team);
  return res;
}

/* ------------------ POST (add_member + invite) ------------------ */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.action !== "add_member") {
    return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
  }

  let team = readCookieJSON(req, TEAM_COOKIE) as TeamState | null;
  if (!team) team = await buildFromDBOrBootstrap(req);
  if (team.type !== "team") {
    return NextResponse.json({ message: "Üye eklemek için türü 'Takım' yapın." }, { status: 400 });
  }

  const m = body.member || {};
  const sendInvite = body.sendInvite !== false; // varsayılan true
  const name = String(m.name || "").trim();
  const email = String(m.email || "").toLowerCase().trim();
  const phone = String(m.phone || "").replace(/\s/g, "");
  const age = Number(m.age);
  const roleStr = String(m.role || "developer");
  const role: Role = ROLES.includes(roleStr as Role) ? (roleStr as Role) : (null as any);

  if (name.length < 3) return NextResponse.json({ message: "Ad Soyad 3+ olmalı" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: "Geçerli e-posta girin" }, { status: 400 });
  if (!/^\+?\d{10,14}$/.test(phone)) return NextResponse.json({ message: "Geçerli telefon girin" }, { status: 400 });
  if (!Number.isInteger(age) || age < 14) return NextResponse.json({ message: "Yaş 14 ve üzeri olmalı" }, { status: 400 });
  if (!role) return NextResponse.json({ message: "Geçerli bir rol seçin" }, { status: 400 });

  // Cookie tarafında aynı e-posta var mı?
  if (team.members.some(x => x.email.toLowerCase() === email)) {
    return NextResponse.json({ message: "Bu e-posta zaten ekipte" }, { status: 409 });
  }
  if (team.members.length >= MAX_TEAM) {
    return NextResponse.json({ message: "Maksimum 4 kişi" }, { status: 400 });
  }

  let inviteResetUrl = "";
  let existingCanLogin = false;
  let willInvite = sendInvite;

  // ---- DB kontrol / ekle-ata / token üret
  try {
    const prof = readCookieJSON(req, PROFILE_COOKIE) || {};
    const me = await db.user.findUnique({
      where: { email: String(prof.email || "").toLowerCase().trim() },
      select: { teamId: true },
    });

    const currentTeamId = me?.teamId || null;

    const existing = await db.user.findUnique({ where: { email } });
    existingCanLogin = !!existing?.canLogin;

    if (existing) {
      if (existing.teamId && currentTeamId && existing.teamId === currentTeamId) {
        return NextResponse.json({ message: "Bu e-posta zaten ekipte" }, { status: 409 });
      }
      if (existing.teamId && (!currentTeamId || existing.teamId !== currentTeamId)) {
        return NextResponse.json({ message: "Bu e-posta başka bir takımda", code: "IN_OTHER_TEAM" }, { status: 409 });
      }

      // Takımsız mevcut kullanıcı → takıma ata / rol güncelle
      if (currentTeamId) {
        await db.user.update({
          where: { email },
          data: {
            teamId: currentTeamId,
            profileRole: role,
            // canLogin mevcut neyse o kalsın
          },
        });
      }

      // Zaten aktif kullanıcıyı davet etme
      if (existing.canLogin) {
        willInvite = false;
      }
    } else {
      // Yeni kullanıcı oluştur (login pasif)
      if (currentTeamId) {
        await db.user.create({
          data: {
            name, email, phone, age,
            passwordHash: null,
            canLogin: false,
            teamId: currentTeamId,
            profileRole: role,
          },
        });
      }
    }

    // Davet: yalnızca giriş yapamayanlar için token üret
    if (willInvite) {
      const target = await db.user.findUnique({ where: { email }, select: { id: true } });
      if (target) {
        await db.passwordResetToken.deleteMany({ where: { userId: target.id } });
        const raw = rawToken();
        const tokenHash = sha256(raw);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 saat
        await db.passwordResetToken.create({
          data: { userId: target.id, tokenHash, expiresAt },
        });
        const link = `${originFrom(req)}/reset-password?token=${raw}`;
        inviteResetUrl = link;
        console.log("[INVITE LINK:add_member]", link);
      }
    }
  } catch (e) {
    console.error("[team:add_member] error:", e);
    // DB erişilemezse cookie üzerinden devam (demo)
  }

  // Cookie’ye eklenecek status
  const status: Member["status"] = existingCanLogin
    ? "active"
    : (willInvite ? "invited" : "admin_added");

  // Cookie’ye ekle
  const id = uid();
  const newMember: Member = { id, name, email, phone, age, role, status };
  team.members.push(newMember);

  const res = NextResponse.json({ ok: true, team, inviteResetUrl }, { status: 200 });
  writeTeamCookie(res, team);
  return res;
}

/* ------------------ DELETE (remove member) ------------------ */
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").toLowerCase().trim();
  if (!email) return NextResponse.json({ message: "email gerekli" }, { status: 400 });

  let team = readCookieJSON(req, TEAM_COOKIE) as TeamState | null;
  if (!team) team = await buildFromDBOrBootstrap(req);

  const leader = team.members.find(x => x.isLeader);
  const targetIsLeader = leader && leader.email.toLowerCase() === email;

  if (targetIsLeader) {
    team.members = [leader!];
    team.type = "individual";
    const res = NextResponse.json({ ok: true, team }, { status: 200 });
    writeTeamCookie(res, team);

    // DB: lider dışındakileri ayır
    try {
      const prof = readCookieJSON(req, PROFILE_COOKIE) || {};
      const me = await db.user.findUnique({
        where: { email: String(prof.email || "").toLowerCase().trim() },
        select: { teamId: true, email: true },
      });
      if (me?.teamId) {
        await db.user.updateMany({
          where: { teamId: me.teamId, email: { not: String(me.email).toLowerCase() } },
          data: { teamId: null },
        });
      }
    } catch {}
    return res;
  }

  // Cookie’den çıkar
  const before = team.members.length;
  team.members = team.members.filter(x => x.email.toLowerCase() !== email);
  if (team.members.length === before) {
    return NextResponse.json({ message: "Üye bulunamadı" }, { status: 404 });
  }
  if (team.members.length === 1) team.type = "individual";

  const res = NextResponse.json({ ok: true, team }, { status: 200 });
  writeTeamCookie(res, team);

  // DB’den de çıkar (opsiyonel)
  try { await db.user.updateMany({ where: { email }, data: { teamId: null } }); } catch {}
  return res;
}
