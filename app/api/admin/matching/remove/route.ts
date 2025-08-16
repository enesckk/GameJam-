// app/api/admin/matching/remove/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/prisma";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const sec = process.env.AUTH_SECRET;
  if (!token || !sec || sec.length < 16) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sec), { clockTolerance: 5 });
    if (payload?.role !== "ADMIN") throw new Error("forbidden");
    return null;
  } catch {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => null) as { userIds?: string[] } | null;
  const userIds = Array.isArray(body?.userIds) ? body!.userIds.filter(Boolean) : [];
  if (userIds.length === 0) {
    return NextResponse.json({ message: "userIds zorunlu" }, { status: 400 });
  }

  const res = await db.user.updateMany({
    where: { id: { in: userIds }, teamId: { not: null } },
    data: { teamId: null },
  });

  return NextResponse.json({ removed: res.count });
}
