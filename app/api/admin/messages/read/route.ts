// app/api/admin/messages/read/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (payload?.role !== "ADMIN" || !payload?.sub) throw new Error("forbidden");
    return { userId: String(payload.sub) };
  } catch {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const me = auth.userId;

  const { messageId } = (await req.json().catch(() => ({}))) as { messageId?: string };
  if (!messageId) return NextResponse.json({ message: "messageId zorunlu" }, { status: 400 });

  const res = await db.messageRecipient.updateMany({
    where: { messageId, userId: me, readAt: null, deletedByRecipientAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true, updated: res.count });
}
