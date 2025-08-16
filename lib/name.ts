// lib/name.ts
export function normalizeDisplayNameTR(input: string | null | undefined) {
  if (!input) return "Kullanıcı";

  // Trim + ayıraçları boşluğa çevir
  let s = String(input).trim()
    .replace(/[_\.]+/g, " ")
    .replace(/[-+]+/g, " ")
    .replace(/\s+/g, " ");

  // CamelCase (MehmetYilmaz) => "Mehmet Yilmaz"
  s = s.replace(/([a-zğıüşöç])([A-ZĞÜŞİÖÇ])/g, "$1 $2");

  // Her kelimeyi TR dilinde Title-Case yap
  s = s
    .split(" ")
    .filter(Boolean)
    .map((w) => {
      const chars = [...w];
      if (chars.length === 0) return "";
      const head = chars[0].toLocaleUpperCase("tr-TR");
      const tail = chars.slice(1).join("").toLocaleLowerCase("tr-TR");
      return head + tail;
    })
    .join(" ");

  return s;
}
