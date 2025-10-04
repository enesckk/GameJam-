// lib/mailer.ts
import sg from "@sendgrid/mail";

type AccessArgs = {
  to: string;
  name?: string;
  link: string;       // /reset?token=rawToken
  reason?: "invite" | "reset"; // opsiyonel; sadece metinde kullanacağız
};

const PROVIDER = (process.env.MAIL_PROVIDER || "").trim().toLowerCase();
const FROM = (process.env.MAIL_FROM || "no-reply@example.com").trim();

if (PROVIDER === "sendgrid") {
  const key = (process.env.SENDGRID_API_KEY || "").trim();
  if (!key) console.warn("SENDGRID_API_KEY missing; falling back to dev logger.");
  else sg.setApiKey(key);
}

/* ---------- TEMPLATE (tek mail) ---------- */
const css = 'font-family:Inter,Arial,sans-serif;line-height:1.6;';
const aCss = 'display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;background:#16a34a;color:#fff;';
const wrap = (title: string, body: string) =>
  `<div style="${css}">
     <h2>${title}</h2>
     ${body}
     <hr/>
     <small>Şehitkamil Game Jam</small>
   </div>`;

function accessHTML(name: string | undefined, link: string, reason?: "invite" | "reset") {
  const intro =
    reason === "invite"
      ? "Hesabını etkinleştirip panele giriş yapman için aşağıdaki bağlantıyı kullanabilirsin."
      : reason === "reset"
      ? "Hesabına yeniden erişim sağlamak için aşağıdaki bağlantıdan yeni şifre belirleyebilirsin."
      : "Hesabına erişim için aşağıdaki bağlantıdan yeni şifre belirleyebilirsin.";
  return wrap(
    "Hesabına Erişim / Şifre Belirleme",
    `<p>Merhaba ${name || "katılımcı"},</p>
     <p>${intro} Bağlantı <strong>1 saat</strong> geçerlidir.</p>
     <p><a style="${aCss}" href="${link}">Şifre Belirle ve Giriş Yap</a></p>
     <p style="color:#666;word-break:break-all">${link}</p>
     <p style="color:#666">Eğer bu talebi sen oluşturmadıysan, bu e-postayı yok sayabilirsin.</p>`
  );
}

/* ---------- DEV fallback ---------- */
async function devLog({ to, name, link, reason }: AccessArgs) {
  console.log("=== ACCESS EMAIL (DEV) ===\nTo:", to, "\nName:", name, "\nReason:", reason, "\nLink:", link, "\n==========================");
  return { ok: true, stub: true };
}

/* ---------- SEND ---------- */
export async function sendAccessEmail(args: AccessArgs) {
  if (PROVIDER !== "sendgrid" || !process.env.SENDGRID_API_KEY) {
    return devLog(args);
  }
  const subject = "Hesabına Erişim: Şifre Belirleme";
  const html = accessHTML(args.name, args.link, args.reason);
  try {
    const [res] = await sg.send({
      to: args.to,
      from: { email: FROM, name: "Şehitkamil Game Jam" }, // from doğrulanmış olmalı
      subject,
      html,
    });
    return { ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode };
  } catch (err: any) {
    const body = err?.response?.body;
    console.error("SendGrid error:", body || err?.message || err);
    return { ok: false, error: body || err?.message || "unknown_error" };
  }
}

/* ---------- Geriye dönük uyumluluk (opsiyonel) ---------- */
export const sendInviteEmail = (p: Omit<AccessArgs, "reason">) =>
  sendAccessEmail({ ...p, reason: "invite" });
export const sendResetEmail = (p: Omit<AccessArgs, "reason">) =>
  sendAccessEmail({ ...p, reason: "reset" });

// Genel email gönderme fonksiyonu
export async function sendEmail(args: { to: string; subject: string; html: string }) {
  if (PROVIDER === "sendgrid") {
    try {
      await sg.send({
        from: FROM,
        to: args.to,
        subject: args.subject,
        html: args.html,
      });
      console.log(`✅ Mail gönderildi: ${args.to}`);
    } catch (error) {
      console.error("SendGrid hatası:", error);
      throw error;
    }
  } else {
    // Dev mode - sadece log
    console.log("📧 DEV MODE - Mail gönderilecek:");
    console.log(`To: ${args.to}`);
    console.log(`Subject: ${args.subject}`);
    console.log(`HTML: ${args.html.substring(0, 200)}...`);
  }
}
