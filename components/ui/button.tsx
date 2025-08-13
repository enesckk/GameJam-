import { cn } from "../../lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
};

export default function Button({ className, variant="primary", size="md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  }[size];

  const variants = {
    primary: "text-[var(--background)] bg-[--color-primary] hover:bg-[--color-primary-600]",
    outline: "border border-[color-mix(in_oklab,var(--foreground)_15%,transparent)] hover:border-[--color-accent] hover:shadow-[0_0_18px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]",
    ghost: "hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]",
    neon: "text-[var(--background)] bg-[--color-primary] hover:bg-[--color-primary-600] shadow-[var(--shadow-neon)]",
  }[variant];

  return <button className={cn(base, sizes, variants, className)} {...props} />;
}

/* Eğer cn yoksa:
export function cn(...xs: (string | undefined | false)[]){ return xs.filter(Boolean).join(" "); }
*/
