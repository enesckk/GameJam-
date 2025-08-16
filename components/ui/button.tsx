"use client";

import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

type BaseProps = {
  variant?: "primary" | "outline" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
  href?: string;                       // varsa <Link> olarak render edilir
  loading?: boolean;                   // opsiyonel yükleniyor durumu
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

/** <button> sürümü */
type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};
/** <a> / <Link> sürümü */
type ButtonAsLink = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type Props = ButtonAsButton | ButtonAsLink;

export default function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    href,
    loading,
    leftIcon,
    rightIcon,
    className,
    children,
    ...rest
  } = props as any;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const sizes =
    size === "sm" ? "text-sm px-3 py-1.5" :
    size === "lg" ? "text-base px-5 py-2.5" :
    "text-sm px-4 py-2";

  const variants =
    variant === "outline"
      ? "border border-[color-mix(in_oklab,var(--foreground)_15%,transparent)] " +
        "bg-transparent text-white " +
        "hover:border-[--color-accent] " +
        "hover:shadow-[0_0_18px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
      : variant === "ghost"
      ? "bg-transparent text-white hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
      : variant === "neon"
      ? "text-[var(--background)] bg-[--color-primary] hover:bg-[--color-primary-600] shadow-[var(--shadow-neon)]"
      : "text-[var(--background)] bg-[--color-primary] hover:bg-[--color-primary-600]";

  const classes = cn(base, sizes, variants, className);

  const content = (
    <>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className={cn(loading && "opacity-0")}>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      {loading && (
        <span
          aria-hidden
          className="absolute inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
    </>
  );

  if (href) {
    const { target, rel } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

/* Eğer cn yoksa alternatif:
export function cn(...xs: Array<string | undefined | false | null>) {
  return xs.filter(Boolean).join(" ");
}
*/
