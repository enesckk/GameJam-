// app/api/admin/matching/route.ts
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

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  const whereUnmatched: any = {
    role: "PARTICIPANT",
    teamId: null,
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] } : {}),
  };

  const [unmatched, teamsRaw] = await Promise.all([
    db.user.findMany({
      where: whereUnmatched,
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, phone: true, age: true, profileRole: true },
    }),
    db.team.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { members: true, submissions: true } }, // ← submissions eklendi
        members: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, email: true, phone: true, age: true, profileRole: true },
        },
      },
    }),
  ]);

  const teams = teamsRaw.map((t) => ({
    id: t.id,
    name: t.name,
    membersCount: t._count.members,
    submissionsCount: t._count.submissions,             // ← eklendi
    capacityLeft: Math.max(0, 4 - t._count.members),
    members: t.members,
  }));

  const withSlots = teams.filter((t) => t.capacityLeft > 0);
  const totalSlots = withSlots.reduce((a, t) => a + t.capacityLeft, 0);

  return NextResponse.json({
    unmatched,
    teams,
    counts: {
      unmatched: unmatched.length,
      teamsWithSlots: withSlots.length,
      totalSlots,
    },
  });
}
