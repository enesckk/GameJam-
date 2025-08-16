// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";

type Person = { name: string; email: string; title?: string };
type Message = {
  id: string;
  subject: string;
  body: string;
  from: Person;
  to: Person;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  read: boolean;
};

type Mailbox = { inbox: Message[]; sent: Message[] };

const BOX_COOKIE = "messages";
const PROFILE_COOKIE = "profile";
const SECURE = process.env.NODE_ENV === "production";

const ADMINS: Person[] = [
  { name: "Etkinlik Koordinatörü", email: "admin@gamejam.local", title: "Koordinatör" },
  { name: "Teknik Sorumlu",       email: "tech@gamejam.local",  title: "Teknik Ekip" },
  { name: "İletişim Sorumlusu",   email: "comms@gamejam.local", title: "İletişim" },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

function readCookieJSON<T = any>(req: NextRequest, name: string): T | null {
  const raw = req.cookies.get(name)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function writeMailbox(res: NextResponse, box: Mailbox) {
  res.cookies.set(BOX_COOKIE, JSON.stringify(box), {
    path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365, secure: SECURE,
  });
}

function nowISO() { return new Date().toISOString(); }

function seedMailbox(profile: any): Mailbox {
  const me: Person = {
    name: profile?.fullName || "Katılımcı",
    email: (profile?.email || "user@example.com").toLowerCase(),
    title: "Katılımcı",
  };

  const admin = ADMINS[0];
  const m1: Message = {
    id: uid(),
    subject: "Şehitkamil Game Jam’e Hoş Geldiniz",
    body: "Merhaba, kayıt işleminiz alınmıştır. Program ve kuralları 'Duyurular' bölümünde bulabilirsiniz.",
    from: admin,
    to: me,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    read: false,
  };
  const m2: Message = {
    id: uid(),
    subject: "Teslim Hatırlatması",
    body: "Oyun teslimi son tarihi etkinlik sayfasında yer alıyor. Başarılar!",
    from: ADMINS[1],
    to: me,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    read: false,
  };
  return { inbox: [m1, m2], sent: [] };
}

export async function GET(req: NextRequest) {
  const refresh = new URL(req.url).searchParams.get("refresh") === "1";
  let box = readCookieJSON<Mailbox>(req, BOX_COOKIE);
  if (!box || refresh) {
    const profile = readCookieJSON(req, PROFILE_COOKIE);
    box = seedMailbox(profile);
    const res = NextResponse.json(box, { status: 200 });
    writeMailbox(res, box);
    return res;
  }
  return NextResponse.json(box, { status: 200 });
}

// Yeni mesaj oluştur / Düzenle / Oku işaretle
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  let box = readCookieJSON<Mailbox>(req, BOX_COOKIE) || { inbox: [], sent: [] };
  const profile = readCookieJSON(req, PROFILE_COOKIE) || {};

  if (body.action === "compose") {
    const to: Person = body.to; // {name,email,title}
    const from: Person = { name: profile.fullName || "Katılımcı", email: (profile.email || "user@example.com").toLowerCase(), title: "Katılımcı" };
    const subject = String(body.subject || "").trim();
    const message = String(body.body || "").trim();

    if (!to?.email || !subject) {
      return NextResponse.json({ message: "Alıcı ve konu zorunlu" }, { status: 400 });
    }

    const msg: Message = {
      id: uid(),
      subject,
      body: message,
      from,
      to,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      read: true,
    };

    box.sent.unshift(msg); // en üstte
    const res = NextResponse.json({ ok: true, box }, { status: 201 });
    writeMailbox(res, box);
    return res;
  }

  if (body.action === "edit") {
    const id = String(body.id || "");
    const idx = box.sent.findIndex(m => m.id === id);
    if (idx === -1) return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
    box.sent[idx] = {
      ...box.sent[idx],
      subject: String(body.subject ?? box.sent[idx].subject),
      body: String(body.body ?? box.sent[idx].body),
      updatedAt: nowISO(),
    };
    const res = NextResponse.json({ ok: true, box }, { status: 200 });
    writeMailbox(res, box);
    return res;
  }

  if (body.action === "mark_read") {
    const id = String(body.id || "");
    const msg = box.inbox.find(m => m.id === id);
    if (msg) msg.read = true;
    const res = NextResponse.json({ ok: true, box }, { status: 200 });
    writeMailbox(res, box);
    return res;
  }

  return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  const folder = (url.searchParams.get("box") || "inbox") as "inbox"|"sent";

  let box = readCookieJSON<Mailbox>(req, BOX_COOKIE) || { inbox: [], sent: [] };
  const before = box[folder].length;
  box[folder] = box[folder].filter(m => m.id !== id);
  if (box[folder].length === before) {
    return NextResponse.json({ message: "Mesaj bulunamadı" }, { status: 404 });
  }
  const res = NextResponse.json({ ok: true, box }, { status: 200 });
  writeMailbox(res, box);
  return res;
}
