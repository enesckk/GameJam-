"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Role = "developer" | "designer" | "audio" | "pm";
const ROLES: { value: Role; label: string }[] = [
  { value: "developer", label: "Yazılımcı" },
  { value: "designer",  label: "Tasarımcı" },
  { value: "audio",     label: "Ses/Müzik" },
  { value: "pm",        label: "İçerik/PM" },
];

export default function RoleSelect({
  value,
  onChange,
  className = "",
  label = "Rol",
}: {
  value: Role;
  onChange: (r: Role) => void;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = "role-listbox";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const current = ROLES.find(r => r.value === value)?.label ?? "";

  return (
    <div className={className}>
      <label className="text-sm text-[var(--foreground)]">{label}</label>

      <div
        ref={boxRef}
        className={[
          "group relative mt-1 rounded-xl input-frame",
          // Kapalı hâlde hafif belirgin, şeffaf
          "ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
          "bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)]",
          "hover:bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)]",
          "focus-within:ring-transparent",
          "transition",
        ].join(" ")}
        data-open={open ? "true" : "false"}
      >
        {/* KAPALI HAL */}
        <button
          type="button"
          onClick={() => setOpen(s => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-[var(--foreground)]"
        >
          <span className="truncate">{current}</span>
          <ChevronDown
            className={[
              "h-4 w-4 opacity-70 transition-transform group-hover:opacity-100",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* AÇILIR PANEL: cam + blur */}
        {open && (
          <div
            id={listId}
            role="listbox"
            className={[
              "absolute z-50 mt-1 w-full rounded-xl shadow-xl border",
              "border-[color:color-mix(in_oklab,var(--foreground)_18%,transparent)]",
              "glass-panel", // ⬅️ cam + blur (CSS'te)
            ].join(" ")}
          >
            <div className="p-1">
              {ROLES.map((r) => {
                const active = r.value === value;
                return (
                  <div
                    key={r.value}
                    role="option"
                    aria-selected={active}
                    onClick={() => { onChange(r.value); setOpen(false); }}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-lg px-2 py-2",
                      // Tema uyumlu, kontrastlı metin
                      "text-[var(--foreground)]",
                      // Hover ve aktif tonları
                      "hover:bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
                      active ? "bg-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)] font-semibold" : "",
                    ].join(" ")}
                  >
                    <span>{r.label}</span>
                    {active && <Check className="h-4 w-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
