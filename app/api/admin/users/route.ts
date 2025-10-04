// app/api/admin/users/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/prisma";
import crypto from "crypto";
import { sendInviteEmailDev } from "@/lib/mailer";

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const secretStr = process.env.AUTH_SECRET;
  if (!token || !secretStr || secretStr.length < 16) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 5 });
    if (payload?.role !== "ADMIN") throw new Error("forbidden");
    return null;
  } catch {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}

function originFrom(req: NextRequest) {
  return req.headers.get("origin") ?? new URL(req.url).origin;
}

// ================== GET (senin mevcut kodun, ufak ek)
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSizeRaw = parseInt(searchParams.get("pageSize") ?? "24", 10) || 24;
  const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);

  const where: any = {
    role: "PARTICIPANT",
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        profileRole: true,
        canLogin: true,              // 👈 ekledim: UI’da aktif/pasif gör
      },
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

// ================== POST (yeni: admin daveti)
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").toLowerCase().trim();
    const name = String(body.name ?? "").trim() || null;
    const phone = String(body.phone ?? "");
    const age = Number.isFinite(body.age) ? Number(body.age) : 18;
    const profileRole = String(body.profileRole ?? "developer");

    if (!email) {
      return NextResponse.json({ message: "E-posta zorunlu" }, { status: 400 });
    }

    // 1) Kullanıcı var mı?
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          phone,
          age,
          profileRole,
          passwordHash: null,
          canLogin: false, // davet tamamlanınca true olacak
        },
      });
    } else {
      // aktif kullanıcıya tekrar davet atmayalım
      if (user.passwordHash && user.canLogin) {
        return NextResponse.json({ message: "Kullanıcı zaten aktif." }, { status: 409 });
      }
    }

    // ---- Davet sistemi kaldırıldı ----
    // Artık sadece admin onayı ile kullanıcılar sisteme girebilir
    // Admin panelinden başvurular onaylandığında otomatik şifre oluşturulur ve mail gönderilir

    return NextResponse.json({ ok: true, message: "Davet oluşturuldu" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
