// app/api/auth/reset/request/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { sendAccessEmail } from "@/lib/mailer";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    const norm = String(email ?? "").toLowerCase().trim();
    if (!norm) return NextResponse.json({ message: "E-posta gerekli" }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: norm } });

    if (user) {
      await db.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

      const raw = crypto.randomBytes(32).toString("hex");
      const tokenHash = sha256(raw);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await db.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

      const base = (process.env.APP_URL || "").trim() || new URL(req.url).origin;
      const link = `${base}/reset-password?token=${encodeURIComponent(raw)}`;

      const r: any = await sendAccessEmail({ to: user.email, name: user.name ?? undefined, link, reason: "reset" });
      if (r?.error) console.error("ACCESS_EMAIL_ERROR", r.error);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("RESET_REQUEST_500", e?.response?.body || e?.message || e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
