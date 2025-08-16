// app/api/admin/teams/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/prisma";

// ADMIN guard
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

// GET /api/admin/teams?q=&page=&pageSize=
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSizeRaw = parseInt(searchParams.get("pageSize") ?? "10", 10) || 10;
  const pageSize = Math.min(Math.max(pageSizeRaw, 1), 50);

  // filtre: takım adı veya üye adı/email/telefon
  const where: any = q
    ? {
        OR: [
          { name: { contains: q } },
          { members: { some: { name: { contains: q } } } },
          { members: { some: { email: { contains: q } } } },
          { members: { some: { phone: { contains: q } } } },
        ],
      }
    : {};

  const [totalTeams, teams] = await Promise.all([
    db.team.count({ where }),
    db.team.findMany({
      where,
      orderBy: { name: "asc" },          // Team'de createdAt yok; ada göre
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            age: true,
            profileRole: true, // takım içi görev
            role: true,        // sistem rolü (gerekirse UI'da kullanmayız)
          },
          orderBy: { name: "asc" },
        },
      },
    }),
  ]);

  // Üye sayısı toplamı (sayfalı sonuçtaki)
  const pageMembersTotal = teams.reduce((acc, t) => acc + t.members.length, 0);

  return NextResponse.json({
    items: teams.map(t => ({
      id: t.id,
      name: t.name,
      membersCount: t.members.length,
      members: t.members,
    })),
    totalTeams,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalTeams / pageSize)),
    pageMembersTotal,
  });
}
