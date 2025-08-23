// app/admin/_components/admin-sectioncard.tsx
export default function AdminSectionCard({
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
        rounded-xl p-4 md:p-5
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        shadow-sm
      "
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>}
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
