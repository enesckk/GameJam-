// app/api/admin/matching/assign/route.ts
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

  const body = await req.json().catch(() => null) as { teamId?: string; userIds?: string[] } | null;
  const teamId = body?.teamId ?? "";
  const userIds = Array.isArray(body?.userIds) ? (body!.userIds as string[]).filter(Boolean) : [];

  if (!teamId || userIds.length === 0) {
    return NextResponse.json({ message: "teamId ve userIds zorunlu" }, { status: 400 });
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const countNow = await tx.user.count({ where: { teamId } });
      const capacity = Math.max(0, 4 - countNow);
      if (capacity <= 0) {
        return { assigned: [], skipped: userIds, capacityLeft: 0 };
      }

      const candidates = userIds.slice(0, capacity);
      const updateRes = await tx.user.updateMany({
        where: {
          id: { in: candidates },
          teamId: null,
          role: "PARTICIPANT",
        },
        data: { teamId },
      });

      // updateMany; gerçekten atanmış sayıyı dönelim
      const assignedCount = updateRes.count;
      return {
        assigned: candidates.slice(0, assignedCount),
        skipped: userIds.slice(assignedCount),
        capacityLeft: Math.max(0, capacity - assignedCount),
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Atama sırasında hata" }, { status: 500 });
  }
}
