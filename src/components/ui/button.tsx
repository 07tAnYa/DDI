import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200",
        variant === "primary" &&
          "text-[var(--primary-foreground)] shadow-lg hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "secondary" &&
          "border text-[var(--secondary-foreground)] hover:brightness-[0.99]",
        variant === "ghost" &&
          "text-[var(--text-main)] hover:bg-[var(--accent)]",
        className,
      )}
      style={
        variant === "primary"
          ? {
              backgroundColor: "var(--primary)",
              boxShadow: "0 12px 24px rgba(74, 91, 170, 0.18)",
            }
          : variant === "secondary"
            ? {
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border)",
              }
            : {
                backgroundColor: "transparent",
              }
      }
      type={type}
      {...props}
    />
  );
}
