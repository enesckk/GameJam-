"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { targetDate: Date };

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function Countdown({ targetDate }: Props) {
  // SSR/CSR farkını önlemek için mount edildikten sonra saymaya başla
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = useMemo(() => {
    const delta = Math.max(0, targetDate.getTime() - now);
    const s = Math.floor(delta / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return { days, hours, mins, secs };
  }, [now, targetDate]);

  if (!mounted) {
    // SSR uyumu için basit bir placeholder
    return <div className="text-sm opacity-70">Geri sayım yükleniyor…</div>;
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-xl px-4 py-2 neon-border">
      <TimeBox label="Gün"  value={diff.days} />
      <Sep />
      <TimeBox label="Saat" value={diff.hours} />
      <Sep />
      <TimeBox label="Dak"  value={diff.mins} />
      <Sep />
      <TimeBox label="Sn"   value={diff.secs} />
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
        {pad(value)}
      </div>
      <div className="text-[11px] uppercase opacity-70">{label}</div>
    </div>
  );
}

function Sep() { return <span className="opacity-40">•</span>; }
