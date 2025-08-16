// app/api/admin/matching/team/[id]/route.ts
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const id = params.id;
  if (!id) return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });

  // teslimi olan takımı silmeyi engelle
  const t = await db.team.findUnique({
    where: { id },
    include: { _count: { select: { submissions: true, members: true } } },
  });
  if (!t) return NextResponse.json({ message: "Takım bulunamadı" }, { status: 404 });
  if (t._count.submissions > 0) {
    return NextResponse.json({ message: "Bu takımın teslimleri var, silinemez." }, { status: 409 });
  }

  const result = await db.$transaction(async (tx) => {
    const unlinked = await tx.user.updateMany({ where: { teamId: id }, data: { teamId: null } });
    await tx.team.delete({ where: { id } });
    return { unlinked: unlinked.count };
  });

  return NextResponse.json({ ok: true, ...result });
}
