"use client";

import Button from "@/components/ui/button";
import Link from "next/link";

type Milestone = { label: string; date: string };

export default function SchedulePreview({
  items = [
    { label: "Son Başvuru", date: "?? • (Takvimde belirtilen saat)" },
    { label: "Başlangıç", date: "12 Ekim 2025 • 23:59 (TSİ)" },
    { label: "Teslim", date: "?? • (Takvimde belirtilen saat)" },
    { label: "Ödül Töreni", date: "?? • (Takvimde belirtilen saat)" },
  ] as Milestone[],
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-6 flex items-end justify-between">
        <div
          className="
            text-xl font-extrabold uppercase tracking-wide
            text-neon-blue drop-shadow-[0_0_8px_#00ffff]
          "
        >
          Takvim
        </div>

        <Link href="/(public)/takvim">
          <Button
            variant="neon"
            className="px-5 py-2 text-base font-semibold hover:scale-105 hover:shadow-[0_0_15px_#ff00ff] transition-all"
          >
            Tüm Takvimi Gör
          </Button>
        </Link>
      </div>

      <ol className="grid gap-6 md:grid-cols-4">
        {items.map((m) => (
          <li
            key={m.label}
            className="
              group relative rounded-2xl
              bg-white/[0.04] p-5 backdrop-blur-md shadow-lg
              transition-all duration-300 ease-out
              hover:scale-[1.05] hover:rounded-3xl
              hover:shadow-[0_0_15px_#ff00ff,0_0_20px_#8000ff,0_0_25px_#00ffff]

              /* Hover'da görünen gradient kenarlık (köşeler birebir uyumlu) */
              before:content-[''] before:absolute before:inset-0
              before:pointer-events-none before:opacity-0
              before:rounded-2xl group-hover:before:rounded-3xl
              group-hover:before:opacity-100 group-hover:before:p-[3px]
              group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
              group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
              group-hover:before:[-webkit-mask-composite:xor]
              group-hover:before:[mask-composite:exclude]
            "
          >
            <div 
  className="font-semibold transition-colors duration-300 group-hover:text-neon-pink"
  style={{ color: 'var(--foreground)' }}
>{m.label}</div>
            <div 
  className="text-sm"
  style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
>
              {m.date}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
