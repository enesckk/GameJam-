// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";        // <-- senin export ismin db
import bcrypt from "bcryptjs";            // npm i bcryptjs && npm i -D @types/bcryptjs
// import { Role } from "@prisma/client"; // (opsiyonel) role: Role.PARTICIPANT vermek istersen aç

export async function POST(req: Request) {
  try {
    const { name, email, phone, age, password } = await req.json();

    // Sunucu validasyonu
    if (
      !name || !email || !phone || !password ||
      typeof age !== "number" || age < 18
    ) {
      return NextResponse.json({ message: "Eksik veya hatalı bilgi." }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Aynı e‑posta kontrolü
    const exists = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) {
      return NextResponse.json({ message: "E-posta zaten kayıtlı." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // role alanını göndermiyoruz -> schema default(PARTICIPANT) devreye girer
    await db.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).replace(/\s/g, ""),
        age,
        passwordHash,
        // role: Role.PARTICIPANT, // (alternatif) enum kullanmak istersen bu satırı aç
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}
