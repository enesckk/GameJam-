// lib/mailer.ts
type InviteArgs = { to: string; name?: string; link: string };
type ResetArgs = { to: string; name?: string; link: string };

// Local/dev: gerçek mail atmaz, konsola basar.
// İleride gerçek SMTP'ye geçersen aynı imzayı kullanıp alttaki fonksiyonların içini değiştirirsin.
export async function sendInviteEmailDev({ to, name, link }: InviteArgs) {
  console.log("=== INVITE EMAIL (DEV) ===");
  console.log("To:", to);
  if (name) console.log("Name:", name);
  console.log("Subject:", "Şifre Belirleme Daveti");
  console.log("Link:", link);
  console.log("==========================");
}

export async function sendResetEmailDev({ to, name, link }: ResetArgs) {
  console.log("=== RESET EMAIL (DEV) ===");
  console.log("To:", to);
  if (name) console.log("Name:", name);
  console.log("Subject:", "Şifre Sıfırlama");
  console.log("Link:", link);
  console.log("=========================");
}
