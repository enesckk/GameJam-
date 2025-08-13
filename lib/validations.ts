import { z } from "zod";

// 1) Enum değerlerini "as const" ile sabitle
export const ROLE_VALUES = ["developer", "designer", "audio", "pm"] as const;

export const ApplySchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e‑posta girin"),
  // 2) z.enum'a sadece sabit dizi ver, ekstra parametre verme
  role: z.enum(ROLE_VALUES),
  // 3) KVKK: boolean kalsın, true olmasını refine ile zorunlu tut
  consentKVKK: z.boolean().refine((v) => v === true, {
    message: "KVKK onayı zorunlu.",
  }),
});

export type ApplyInput = z.infer<typeof ApplySchema>;
