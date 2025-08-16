// app/api/announcements/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// GET ?limit=
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const limit = Math.min(Math.max(parseInt(sp.get("limit") ?? "0", 10) || 0, 0), 100);

  const items = await db.announcement.findMany({
    orderBy: [{ pinned: "desc" as const }, { createdAt: "desc" as const }],
    take: limit || undefined,
    select: { id: true, title: true, content: true, pinned: true, createdAt: true },
  });

  return NextResponse.json({ items });
}
