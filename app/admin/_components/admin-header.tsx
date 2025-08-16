// app/admin/_components/admin-header.tsx
export default function AdminHeader({
  title,
  desc,
  right,
  variant = "gradient", // "gradient" | "plain"
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
  variant?: "gradient" | "plain";
}) {
  return (
    <div className="mb-4 flex flex-col items-start gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={
            variant === "plain"
              ? "text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]"
              : "text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent"
          }
        >
          {title}
        </h1>
        {desc ? (
          <p className="mt-1 text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
            {desc}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
