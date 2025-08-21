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
  showLabel = true,
  placeholder = "Rol seçin",
}: {
  value: Role;
  onChange: (r: Role) => void;
  className?: string;
  label?: string;
  showLabel?: boolean;
  placeholder?: string;
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
      {showLabel && (
        <label className="block text-sm font-medium text-purple-200 mb-2">{label}</label>
      )}

      <div
        ref={boxRef}
        className={[
          "group relative rounded-xl transition-all duration-200",
          // Takım sayfasındaki diğer input'larla uyumlu stil
          "bg-white/20 backdrop-blur-sm border border-white/20",
          "hover:bg-white/30 hover:border-white/30",
          "focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20",
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
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-white"
        >
          <span className={`truncate text-sm ${!current ? "text-purple-200/60" : ""}`}>
            {current || placeholder}
          </span>
          <ChevronDown
            className={[
              "h-4 w-4 text-purple-200 transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* AÇILIR PANEL: Daha net ve tam görünür */}
        {open && (
          <div
            id={listId}
            role="listbox"
            className={[
              "absolute z-[9999] mt-1 w-full rounded-xl shadow-2xl border-2",
              "bg-white/95 backdrop-blur-xl border-purple-500/30",
              "max-h-48 overflow-y-auto",
            ].join(" ")}
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
            }}
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
                      "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                      // Daha net renkler ve kontrast
                      "text-slate-800 font-medium",
                      "hover:bg-purple-500/20 hover:text-purple-900",
                      active ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-900 font-semibold" : "",
                    ].join(" ")}
                  >
                    <span>{r.label}</span>
                    {active && <Check className="h-4 w-4 text-purple-600" />}
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