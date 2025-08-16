import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ROLES = new Set(["developer", "designer", "audio", "pm"]);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

type Member = {
  name: string;
  email: string;
  phone: string;
  age: number;
  role: string;
};

const MAX_TEAM = 4;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function inviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ message: "Geçersiz gövde" }, { status: 400 });

    const type: "individual" | "team" = body.type === "team" ? "team" : "individual";
    const role = String(body.role ?? "");
    const consentKVKK = Boolean(body.consentKVKK);

    // Lider (zorunlu)
    const leadName = String(body.name ?? "").trim();
    const leadEmail = String(body.email ?? "").toLowerCase().trim();
    const leadPhone = String(body.phone ?? "").replace(/\s/g, "");
    const leadAge = Number(body.age ?? NaN);
    const password = String(body.password ?? "");

    // Team alanları
    const teamName = type === "team" ? String(body.teamName ?? "").trim() : undefined;
    const members: Member[] = Array.isArray(body.members) ? body.members : [];

    // ---- Validasyonlar ----
    const commonOk =
      leadName.length >= 3 &&
      emailRe.test(leadEmail) &&
      phoneRe.test(leadPhone) &&
      Number.isInteger(leadAge) && leadAge >= 14 &&
      ROLES.has(role) &&
      consentKVKK;

    if (!commonOk) {
      return NextResponse.json({ message: "Lider bilgileri/formatı hatalı" }, { status: 400 });
    }

    if (type === "individual") {
      if (password.length < 6) {
        return NextResponse.json({ message: "Şifre en az 6 karakter olmalı" }, { status: 400 });
      }
    } else if (type === "team") {
      if (!teamName) {
        return NextResponse.json({ message: "Takım adı zorunlu" }, { status: 400 });
      }

      // Üye sayısı (lider + diğerleri) en fazla 4
      const allEmails = new Set<string>([leadEmail]);
      if (!Array.isArray(members) || members.length > MAX_TEAM - 1) {
        return NextResponse.json({ message: "Takım en fazla 4 kişi olabilir" }, { status: 400 });
      }

      // Her üye doğrulaması
      for (const m of members) {
        const r = String(m?.role ?? "");
        const n = String(m?.name ?? "").trim();
        const e = String(m?.email ?? "").toLowerCase().trim();
        const p = String(m?.phone ?? "").replace(/\s/g, "");
        const a = Number(m?.age ?? NaN);

        const ok =
          n.length >= 3 &&
          emailRe.test(e) &&
          phoneRe.test(p) &&
          Number.isInteger(a) && a >= 14 &&
          ROLES.has(r); // ⬅️ NOKTALI VİRGÜL HATASI DÜZELTİLDİ

        if (!ok) {
          return NextResponse.json({ message: `Üye bilgisi hatalı: ${n || e || "bilinmiyor"}` }, { status: 400 });
        }
        if (allEmails.has(e)) {
          return NextResponse.json({ message: "Takım içinde aynı e-posta iki kez olamaz" }, { status: 400 });
        }
        allEmails.add(e);
      }

      // Lider için şifre zorunlu
      if (password.length < 6) {
        return NextResponse.json({ message: "Lider için şifre en az 6 karakter olmalı" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Geçersiz başvuru tipi" }, { status: 400 });
    }

    // Ön kontrol: sistemde aynı e-postalar var mı?
    const checkEmails = [leadEmail, ...members.map(m => String(m.email).toLowerCase().trim())];

    const [existingUsers, existingApps] = await Promise.all([
      db.user.findMany({ where: { email: { in: checkEmails } }, select: { email: true } }),
      db.application.findMany({ where: { email: { in: checkEmails } }, select: { email: true } }),
    ]);
    const existingSet = new Set([...existingUsers, ...existingApps].map(x => x.email));
    if (existingSet.size > 0) {
      const clash = checkEmails.find(e => existingSet.has(e));
      return NextResponse.json(
        { message: `Bu e-posta ile kayıt/başvuru zaten var: ${clash}` },
        { status: 409 }
      );
    }

    // ---- Kayıt (transaction) ----
    const passwordHash = await bcrypt.hash(password, 10);

    await db.$transaction(async (tx) => {
      // 1) Team (sadece team tipinde)
      const team = type === "team"
        ? await tx.team.create({ data: { name: teamName! } })
        : null;

      // 2) Lider User
      await tx.user.create({
        data: {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          age: leadAge,
          passwordHash,
          canLogin: true,
          profileRole: role, // lider rolü
          ...(team ? { teamId: team.id } : {}),
        },
      });

      // 3) Takım üyeleri (şifresiz, login pasif)
      if (team && members.length) {
        for (const m of members) {
          await tx.user.create({
            data: {
              name: String(m.name).trim(),
              email: String(m.email).toLowerCase().trim(),
              phone: String(m.phone).replace(/\s/g, ""),
              age: Number(m.age),
              passwordHash: null,
              canLogin: false,
              teamId: team.id,
              profileRole: String(m.role),
            },
          });
        }
      }

      // 4) Application (lider)
      await tx.application.create({
        data: {
          name: leadName,
          email: leadEmail,
          role,
          phone: leadPhone,
          age: leadAge,
          consentKVKK,
          type,
          teamName: team?.name,
        },
      });
    });

    // ---- PANEL İÇİN COOKIE’LER ----
    const invCode = inviteCode();

    const leaderCookieMember = {
      id: uid(),
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      age: leadAge,
      role,
      status: "active" as const,
      isLeader: true,
    };
    const memberCookieMembers = (members || []).map((m) => ({
      id: uid(),
      name: String(m.name).trim(),
      email: String(m.email).toLowerCase().trim(),
      phone: String(m.phone).replace(/\s/g, ""),
      age: Number(m.age),
      role: String(m.role),
      status: "form_applied" as const,   // ← formdan geldi
    }));

    const res = NextResponse.json({ ok: true }, { status: 201 });

    // profile (server kullanımı için)
    res.cookies.set("profile", JSON.stringify({
      fullName: leadName,
      email: leadEmail,
      phone: leadPhone,
      role,
    }), { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });

    // team (panelin /api/team GET'i bunu okuyabiliyor)
    res.cookies.set("team", JSON.stringify({
      type,
      teamName: type === "team" ? teamName : "Takımım",
      inviteCode: invCode,
      members: [leaderCookieMember, ...memberCookieMembers],
    }), { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });

    // üst bardaki isim için (client tarafı okuyacaksa httpOnly:false olmalı)
    res.cookies.set("displayName", encodeURIComponent(leadName), {
      path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365, httpOnly: false
    });

    return res;
  } catch (e: any) {
    if (e?.code === "P2002" && Array.isArray(e?.meta?.target) && e.meta.target.includes("email")) {
      return NextResponse.json({ message: "Bu e-posta ile kayıt/başvuru zaten var" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
