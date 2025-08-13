import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { ApplySchema, ApplyInput } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ApplySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, role, consentKVKK } = parsed.data as ApplyInput;

  await db.application.create({
    data: { name, email, role, consentKVKK },
  });

  return NextResponse.json({ ok: true });
}
