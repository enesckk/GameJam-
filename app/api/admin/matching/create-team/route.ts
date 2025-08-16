// app/api/admin/matching/create-team/route.ts
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

function slug(n = 4) {
  return Math.random().toString(36).slice(2, 2 + n).toUpperCase();
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => null) as { name?: string; memberIds?: string[] } | null;
  let name = (body?.name ?? "").trim();
  const memberIds = Array.isArray(body?.memberIds) ? body!.memberIds.filter(Boolean) : [];
  const take = Math.min(memberIds.length, 4);

  if (!name) name = `Takım-${slug(5)}`;

  try {
    const res = await db.$transaction(async (tx) => {
      const team = await tx.team.create({ data: { name } });

      let assigned: string[] = [];
      if (take > 0) {
        const upd = await tx.user.updateMany({
          where: { id: { in: memberIds.slice(0, take) }, teamId: null, role: "PARTICIPANT" },
          data: { teamId: team.id },
        });
        assigned = memberIds.slice(0, upd.count);
      }

      return { team, assigned, skipped: memberIds.slice(assigned.length) };
    });

    return NextResponse.json(res, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Takım oluşturulamadı" }, { status: 500 });
  }
}
