import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // basitçe her seferinde yenile
export default async function Duyurular(){
  const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-4">
      <h1 className="text-3xl font-bold">Duyurular</h1>
      {items.length === 0 && <p className="text-slate-500">Henüz duyuru yok.</p>}
      {items.map(a => (
        <article key={a.id} className="rounded-xl border p-5 bg-white dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold">{a.title}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{a.content}</p>
          {a.pinned && <span className="mt-3 inline-block rounded border px-2 py-0.5 text-xs">Sabit</span>}
        </article>
      ))}
    </div>
  )
}
