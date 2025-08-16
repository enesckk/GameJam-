// app/panel/_components/section-card.tsx
export default function SectionCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      className="
        rounded-2xl p-4 md:p-5
        bg-white/10 dark:bg-black/10 backdrop-blur-md
        shadow-[0_10px_30px_rgba(0,0,0,.12)]
      "
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {subtitle && (
            <p className="mt-1 text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
              {subtitle}
            </p>
          )}
        </header>
      )}
      <div className="space-y-4">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}
