import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { Prisma } from "@prisma/client";

type JWTPayload = {
  sub: string;
  email: string;
  role?: string | null;
  name?: string | null;
  profileRole?: string | null;
};

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET eksik veya çok kısa");
  return new TextEncoder().encode(s);
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  if (!token) return { ok: false as const };
  try {
    const { payload } = await jwtVerify<JWTPayload>(token, getSecret());
    const me = await db.user.findUnique({
      where: { id: String(payload.sub) },
      select: { id: true, email: true, role: true, teamId: true, name: true },
    });
    if (!me) return { ok: false as const };
    const isAdmin = me.role === "ADMIN" || payload.role === "ADMIN";
    return { ok: true as const, user: me, isAdmin };
  } catch {
    return { ok: false as const };
  }
}

const normTag = (x: string) =>
  x.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 32);

async function upsertTags(tx: Prisma.TransactionClient, names: string[]) {
  const rows = await Promise.all(
    names.map((name) =>
      tx.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  return rows.map((r) => r.id);
}

async function linkTagIds(tx: Prisma.TransactionClient, submissionId: string, tagIds: string[]) {
  const unique = Array.from(new Set(tagIds));
  for (const tagId of unique) {
    try {
      await tx.submissionTag.create({ data: { submissionId, tagId } });
    } catch (e: any) {
      if (e?.code !== "P2002") throw e;
    }
  }
}

async function unlinkTagNames(tx: Prisma.TransactionClient, submissionId: string, names: string[]) {
  if (!names.length) return;
  const tagRows = await tx.tag.findMany({ where: { name: { in: names } }, select: { id: true } });
  if (!tagRows.length) return;
  await tx.submissionTag.deleteMany({
    where: { submissionId, tagId: { in: tagRows.map((t) => t.id) } },
  });
}

function okJson(data: any, init: number = 200) {
  return NextResponse.json(data, { status: init });
}
function errJson(message: string, code: number) {
  return NextResponse.json({ message }, { status: code });
}

// -------------------------- GET --------------------------
export async function GET(req: NextRequest) {
  try {
    const ses = await getSession(req);
    if (!ses.ok) return errJson("Yetkisiz", 401);

    const url = new URL(req.url);
    const scope = url.searchParams.get("scope") || "auto";
    const q = (url.searchParams.get("q") || "").trim();

    const parseNum = (v: string | null, d: number) => {
      const n = parseInt(v ?? "", 10);
      return Number.isFinite(n) ? n : d;
    };
    const take = Math.min(Math.max(parseNum(url.searchParams.get("take"), 50), 1), 100);
    const skip = Math.max(parseNum(url.searchParams.get("skip"), 0), 0);

    const where: any = {};
    if (!(scope === "all" && ses.isAdmin)) {
      if (ses.user.teamId) where.teamId = ses.user.teamId;
      else where.userId = ses.user.id;
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { note: { contains: q, mode: "insensitive" } },
        { team: { is: { name: { contains: q, mode: "insensitive" } } } },
        { user: { is: { name: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const [items, total] = await Promise.all([
      db.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          team: { select: { name: true } },
          tags: { include: { tag: true } },
        },
        take,
        skip,
      }),
      db.submission.count({ where }),
    ]);

    return okJson({
      isAdmin: ses.isAdmin,
      total,
      items: items.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        itchUrl: s.itchUrl,
        githubUrl: s.githubUrl,
        buildUrl: s.buildUrl,
        videoUrl: s.videoUrl,
        note: s.note,
        createdAt: s.createdAt,
        user: s.user,
        team: s.team,
        tags: s.tags.map((st) => st.tag.name),
        repoUrl: s.githubUrl ?? null,
      })),
    });
  } catch (e) {
    console.error("GET /api/submissions", e);
    return errJson("Sunucu hatası", 500);
  }
}

// -------------------------- POST --------------------------
export async function POST(req: NextRequest) {
  try {
    const ses = await getSession(req);
    if (!ses.ok) return errJson("Yetkisiz", 401);

    const body = await req.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    const description = (body.description ?? "").toString().trim() || null;
    const itchUrl = String(body.itchUrl || "").trim() || null;
    const githubUrl = String(body.githubUrl || "").trim() || null;
    const buildUrl = String(body.buildUrl || "").trim() || null;
    const videoUrl = String(body.videoUrl || "").trim() || null;
    const note = (body.note ?? "").toString().trim() || null;

    const rawTags: string[] = Array.isArray(body.tags) ? body.tags : [];
    const tags = Array.from(new Set(rawTags.map(normTag))).filter(Boolean).slice(0, 20);

    if (title.length < 3) return errJson("Başlık en az 3 karakter olmalı", 400);
    if (!itchUrl && !githubUrl && !buildUrl && !videoUrl)
      return errJson("En az bir bağlantı (itch/github/build/video) gerekli", 400);

    const created = await db.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          title,
          description,
          itchUrl,
          githubUrl,
          buildUrl,
          videoUrl,
          note,
          userId: ses.user.id,
          teamId: ses.user.teamId ?? null,
        },
        include: {
          user: { select: { name: true, email: true } },
          team: { select: { name: true } },
        },
      });

      if (tags.length) {
        const tagIds = await upsertTags(tx, tags);
        await linkTagIds(tx, sub.id, tagIds);
      }

      return await tx.submission.findUnique({
        where: { id: sub.id },
        include: {
          tags: { include: { tag: true } },
          user: { select: { name: true, email: true } },
          team: { select: { name: true } },
        },
      });
    });

    return okJson(
      {
        ok: true,
        item: {
          id: created!.id,
          title: created!.title,
          description: created!.description,
          itchUrl: created!.itchUrl,
          githubUrl: created!.githubUrl,
          buildUrl: created!.buildUrl,
          videoUrl: created!.videoUrl,
          note: created!.note,
          createdAt: created!.createdAt,
          user: created!.user,
          team: created!.team,
          tags: created!.tags.map((st) => st.tag.name),
        },
      },
      201
    );
  } catch (e) {
    console.error("POST /api/submissions", e);
    return errJson("Sunucu hatası", 500);
  }
}

// -------------------------- PATCH --------------------------
export async function PATCH(req: NextRequest) {
  try {
    const ses = await getSession(req);
    if (!ses.ok) return errJson("Yetkisiz", 401);

    const body = await req.json().catch(() => ({}));
    const id = String(body.id || "");
    if (!id) return errJson("id gerekli", 400);

    const sub = await db.submission.findUnique({ where: { id }, select: { userId: true } });
    if (!sub) return errJson("Bulunamadı", 404);
    if (!ses.isAdmin && sub.userId !== ses.user.id) return errJson("Yetkiniz yok", 403);

    const patch: any = {};

    if ("title" in body) {
      const v = String(body.title ?? "").trim();
      if (v.length === 0) return errJson("Başlık boş olamaz", 400);
      if (v.length < 3) return errJson("Başlık en az 3 karakter", 400);
      patch.title = v;
    }
    if ("description" in body) patch.description = (body.description ?? "").toString().trim() || null;
    if ("itchUrl" in body) patch.itchUrl = String(body.itchUrl || "").trim() || null;
    if ("githubUrl" in body) patch.githubUrl = String(body.githubUrl || "").trim() || null;
    if ("buildUrl" in body) patch.buildUrl = String(body.buildUrl || "").trim() || null;
    if ("videoUrl" in body) patch.videoUrl = String(body.videoUrl || "").trim() || null;
    if ("note" in body) patch.note = (body.note ?? "").toString().trim() || null;

    const tagsAdd: string[] = Array.isArray(body.tagsAdd) ? body.tagsAdd : [];
    const tagsRemove: string[] = Array.isArray(body.tagsRemove) ? body.tagsRemove : [];
    const tagsReplace: string[] = Array.isArray(body.tagsReplace) ? body.tagsReplace : [];

    const result = await db.$transaction(async (tx) => {
      if (Object.keys(patch).length) {
        await tx.submission.update({ where: { id }, data: patch });
      }

      if (tagsReplace.length) {
        const desired = Array.from(new Set(tagsReplace.map(normTag))).filter(Boolean).slice(0, 30);
        const current = await tx.submissionTag.findMany({ where: { submissionId: id }, include: { tag: true } });
        const currentNames = current.map((r) => r.tag.name);
        const toRemove = currentNames.filter((n) => !desired.includes(n));
        const toAdd = desired.filter((n) => !currentNames.includes(n));

        if (toRemove.length) await unlinkTagNames(tx, id, toRemove);
        if (toAdd.length) {
          const addIds = await upsertTags(tx, toAdd);
          await linkTagIds(tx, id, addIds);
        }
      } else {
        if (tagsRemove.length) {
          const rm = Array.from(new Set(tagsRemove.map(normTag))).filter(Boolean);
          await unlinkTagNames(tx, id, rm);
        }
        if (tagsAdd.length) {
          const add = Array.from(new Set(tagsAdd.map(normTag))).filter(Boolean).slice(0, 30);
          const addIds = await upsertTags(tx, add);
          await linkTagIds(tx, id, addIds);
        }
      }

      return await tx.submission.findUnique({
        where: { id },
        include: {
          tags: { include: { tag: true } },
          user: { select: { name: true, email: true } },
          team: { select: { name: true } },
        },
      });
    });

    return okJson({
      ok: true,
      item: {
        id: result!.id,
        title: result!.title,
        description: result!.description,
        itchUrl: result!.itchUrl,
        githubUrl: result!.githubUrl,
        buildUrl: result!.buildUrl,
        videoUrl: result!.videoUrl,
        note: result!.note,
        createdAt: result!.createdAt,
        user: result!.user,
        team: result!.team,
        tags: result!.tags.map((st) => st.tag.name),
      },
    });
  } catch (e) {
    console.error("PATCH /api/submissions", e);
    return errJson("Sunucu hatası", 500);
  }
}

// -------------------------- DELETE --------------------------
export async function DELETE(req: NextRequest) {
  try {
    const ses = await getSession(req);
    if (!ses.ok) return errJson("Yetkisiz", 401);

    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!id) return errJson("id gerekli", 400);

    const sub = await db.submission.findUnique({ where: { id }, select: { userId: true } });
    if (!sub) return errJson("Bulunamadı", 404);
    if (!ses.isAdmin && sub.userId !== ses.user.id) return errJson("Yetkiniz yok", 403);

    await db.submission.delete({ where: { id } });
    return okJson({ ok: true });
  } catch (e) {
    console.error("DELETE /api/submissions", e);
    return errJson("Sunucu hatası", 500);
  }
}
