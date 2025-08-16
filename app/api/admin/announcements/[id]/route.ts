// app/api/admin/announcements/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (payload?.role !== "ADMIN") throw new Error("forbidden");
    return null;
  } catch {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const id = params.id;
  const body = await req.json().catch(() => null) as { title?: string; content?: string; pinned?: boolean } | null;
  if (!id || !body) return NextResponse.json({ message: "Geçersiz istek" }, { status: 400 });

  const data: any = {};
  if (typeof body.title === "string")  data.title = body.title.trim();
  if (typeof body.content === "string") data.content = body.content.trim();
  if (typeof body.pinned === "boolean") data.pinned = body.pinned;

  const a = await db.announcement.update({ where: { id }, data, select: { id: true, title: true, content: true, pinned: true, createdAt: true } });
  return NextResponse.json(a);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const id = params.id;
  if (!id) return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });

  await db.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
