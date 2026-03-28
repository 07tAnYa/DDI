import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { Severity } from "@/types/interaction";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Severity;
};

export function Badge({ className, tone = "Low", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        tone === "High" && "bg-rose-500/15 text-rose-600 dark:text-rose-300",
        tone === "Moderate" &&
          "bg-amber-500/15 text-amber-600 dark:text-amber-300",
        tone === "Low" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        className,
      )}
      {...props}
    />
  );
}
