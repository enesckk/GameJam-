// components/ui/card.tsx
import { cn } from "@/lib/utils";

export default function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}
