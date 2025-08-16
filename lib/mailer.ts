// lib/mailer.ts
import sg from "@sendgrid/mail";

type InviteArgs = { to: string; name?: string; link: string };
type ResetArgs  = { to: string; name?: string; link: string };

const PROVIDER = (process.env.MAIL_PROVIDER || "").toLowerCase(); // "sendgrid" | ""(dev)
const FROM = process.env.MAIL_FROM || "Şehitkamil Game Jam <no-reply@example.com>";

if (PROVIDER === "sendgrid") {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY missing; falling back to dev logger.");
  } else {
    sg.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

/* ---------- TEMPLATES ---------- */
const css = 'font-family:Inter,Arial,sans-serif;line-height:1.6;';
const aCss = 'display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;background:#16a34a;color:#fff;';
const wrap = (title: string, body: string) =>
  `<div style="${css}"><h2>${title}</h2>${body}<hr/><small>Şehitkamil Game Jam</small></div>`;

const resetHTML = (name: string | undefined, link: string) =>
  wrap("Şifre Sıfırlama",
       `<p>Merhaba ${name || "katılımcı"},</p>
        <p>Aşağıdaki bağlantı ile şifreni sıfırlayabilirsin (1 saat geçerli):</p>
        <p><a style="${aCss}" href="${link}">Şifremi Sıfırla</a></p>
        <p style="color:#666">Bağlantı: ${link}</p>`);

const inviteHTML = (name: string | undefined, link: string) =>
  wrap("Şifre Belirleme / Davet",
       `<p>Merhaba ${name || "katılımcı"},</p>
        <p>Game Jam hesabını etkinleştirmek için aşağıdaki bağlantıyı kullan:</p>
        <p><a style="${aCss}" href="${link}">Daveti Kabul Et</a></p>
        <p style="color:#666">Bağlantı: ${link}</p>`);

/* ---------- DEV (console) ---------- */
export async function sendInviteEmailDev({ to, name, link }: InviteArgs) {
  console.log("=== INVITE EMAIL (DEV) ===\nTo:", to, "\nName:", name, "\nLink:", link, "\n==========================");
}
export async function sendResetEmailDev({ to, name, link }: ResetArgs) {
  console.log("=== RESET EMAIL (DEV) ===\nTo:", to, "\nName:", name, "\nLink:", link, "\n=========================");
}

/* ---------- SENDGRID SENDER ---------- */
async function sendSendGrid(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) {
    // provider seçili ama key yoksa dev'e düş
    console.warn("SENDGRID missing API key; printing to console.");
    console.log(`[DEV EMAIL] to=${to} subject=${subject}\n${html}`);
    return { ok: true, stub: true };
  }
  const [res] = await sg.send({ to, from: FROM, subject, html });
  return { ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode };
}

/* ---------- PUBLIC API (ENV'e göre seçim) ---------- */
export async function sendInviteEmail(args: InviteArgs) {
  if (PROVIDER === "sendgrid") {
    return sendSendGrid(args.to, "Şifre Belirleme Daveti", inviteHTML(args.name, args.link));
  }
  return sendInviteEmailDev(args);
}

export async function sendResetEmail(args: ResetArgs) {
  if (PROVIDER === "sendgrid") {
    return sendSendGrid(args.to, "Şifre Sıfırlama", resetHTML(args.name, args.link));
  }
  return sendResetEmailDev(args);
}
