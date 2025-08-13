import { db } from "@/lib/prisma";

export async function GET(){
  const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(items);
}

export async function POST(req: Request){
  const { title, content, pinned } = await req.json();
  const item = await db.announcement.create({ data: { title, content, pinned: !!pinned } });
  return Response.json(item);
}
