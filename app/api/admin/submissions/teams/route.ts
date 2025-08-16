// app/api/admin/submissions/teams/route.ts
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

// GET /api/admin/submissions/teams?q=&page=&pageSize=
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSizeRaw = parseInt(searchParams.get("pageSize") ?? "10", 10) || 10;
  const pageSize = Math.min(Math.max(pageSizeRaw, 1), 50);

  // arama: takım adı + üye adı/email/telefon + teslim başlığı
  const where: any = {
    submissions: { some: {} }, // sadece teslimi olan takımlar
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { members: { some: { name: { contains: q } } } },
            { members: { some: { email: { contains: q } } } },
            { members: { some: { phone: { contains: q } } } },
            { submissions: { some: { title: { contains: q } } } },
          ],
        }
      : {}),
  };

  const [totalTeams, teams] = await Promise.all([
    db.team.count({ where }),
    db.team.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { submissions: true, members: true } },
        members: {
          orderBy: { name: "asc" },
          select: {
            id: true, name: true, email: true, phone: true, age: true, profileRole: true,
          },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 5, // detayda son 5 teslimi gösterelim; istersen artır
          select: {
            id: true, createdAt: true, updatedAt: true,
            title: true, description: true,
            itchUrl: true, githubUrl: true, buildUrl: true, videoUrl: true, note: true,
            tags: { select: { tag: { select: { id: true, name: true } } } },
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    items: teams.map((t) => ({
      id: t.id,
      name: t.name,
      membersCount: t._count.members,
      submissionsCount: t._count.submissions,
      latest: t.submissions[0] ?? null,
      submissions: t.submissions,
      members: t.members,
    })),
    totalTeams,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalTeams / pageSize)),
  });
}
