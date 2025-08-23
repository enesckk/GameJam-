"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Dış tık + ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { 
      if (e.key === "Escape") setOpen(false); 
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = ROLES.find(r => r.value === value)?.label ?? "";
  const listId = "role-listbox";

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-purple-200 mb-2">{label}</label>
      )}

      <div className="relative">
        <div
          className={[
            "group relative rounded-xl transition-all duration-200",
            "bg-white/20 backdrop-blur-sm border border-white/20",
            "hover:bg-white/30 hover:border-white/30",
            "focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20",
          ].join(" ")}
        >
          <button
            ref={triggerRef}
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
        </div>

        {/* Dropdown Menu - Basit ve Sabit */}
        {open && (
          <div
            id={listId}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl shadow-2xl border-2 bg-white/95 backdrop-blur-xl border-purple-500/30"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
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
                    onClick={() => { 
                      onChange(r.value); 
                      setOpen(false); 
                    }}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
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
