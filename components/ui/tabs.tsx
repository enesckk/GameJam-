// components/ui/tabs.tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs }: { tabs: { key:string; label:string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "text-sm px-3 py-2 rounded-md link-underline",
              active === t.key && "bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
            )}
            aria-current={active === t.key ? "page" : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="card p-5">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}
