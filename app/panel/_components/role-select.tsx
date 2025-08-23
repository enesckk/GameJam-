"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const popRef = useRef<HTMLDivElement>(null);

  // portal root
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-role-select-portal", "true");
    document.body.appendChild(el);
    setPortalEl(el);
    return () => { document.body.removeChild(el); };
  }, []);

  // dış tık + ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // konum + flip + maxHeight
  const [pos, setPos] = useState<{
    top: number; left: number; width: number; placement: "top" | "bottom"; maxH: number;
  } | null>(null);

  const reposition = () => {
    const btn = triggerRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const sx = window.scrollX || document.documentElement.scrollLeft || 0;
    const sy = window.scrollY || document.documentElement.scrollTop || 0;

    const below = window.innerHeight - r.bottom;
    const above = r.top;
    const placement: "top" | "bottom" = (below >= 200 || below >= above) ? "bottom" : "top";

    const leftRaw = r.left + sx;
    const leftMax = sx + window.innerWidth - r.width - 8;
    const left = Math.min(leftRaw, leftMax);

    const maxH = Math.max(160, (placement === "bottom" ? below : above) - 8);
    const top = placement === "bottom" ? r.bottom + sy + 4 : r.top + sy - 4;

    setPos({ top, left, width: r.width, placement, maxH });
  };

  // Sadece dropdown açılırken konumlandır
  useEffect(() => {
    if (open) {
      // Kısa bir gecikme ile konumlandır (DOM güncellemesi için)
      const timer = setTimeout(() => {
        reposition();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [open]);

  const current = ROLES.find(r => r.value === value)?.label ?? "";
  const listId = "role-listbox";

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-purple-200 mb-2">{label}</label>
      )}

      <div
        className={[
          "group relative rounded-xl transition-all duration-200",
          "bg-white/20 backdrop-blur-sm border border-white/20",
          "hover:bg-white/30 hover:border-white/30",
          "focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20",
        ].join(" ")}
        data-open={open ? "true" : "false"}
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

      {/* PORTAL */}
      {open && portalEl && pos && createPortal(
        <div
          ref={popRef}
          id={listId}
          role="listbox"
          className="fixed z-[99999] rounded-xl shadow-2xl border-2 bg-white/95 backdrop-blur-xl border-purple-500/30 overflow-y-auto"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxHeight: pos.maxH,
            transform: pos.placement === "top" ? "translateY(-100%)" : "none",
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
                  onClick={() => { onChange(r.value); setOpen(false); }}
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
        </div>,
        portalEl
      )}
    </div>
  );
}
