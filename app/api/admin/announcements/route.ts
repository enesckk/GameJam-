// app/api/admin/announcements/route.ts
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

// GET ?q=&page=&pageSize=&pinnedFirst=1
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(Math.max(parseInt(sp.get("pageSize") ?? "10", 10) || 10, 1), 50);
  const pinnedFirst = sp.get("pinnedFirst") === "1";

  const where: any = q
    ? { OR: [{ title: { contains: q } }, { content: { contains: q } }] }
    : {};

  const [total, items] = await Promise.all([
    db.announcement.count({ where }),
    db.announcement.findMany({
      where,
      orderBy: pinnedFirst
        ? [{ pinned: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, title: true, content: true, pinned: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

// POST { title, content, pinned? }
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => null) as { title?: string; content?: string; pinned?: boolean } | null;
  const title = (body?.title ?? "").trim();
  const content = (body?.content ?? "").trim();
  const pinned = Boolean(body?.pinned);

  if (title.length < 3 || content.length < 3) {
    return NextResponse.json({ message: "Başlık ve içerik en az 3 karakter olmalı" }, { status: 400 });
  }

  const a = await db.announcement.create({ data: { title, content, pinned } });
  return NextResponse.json(a, { status: 201 });
}
