import { ShieldPlus } from "lucide-react";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-[0_10px_20px_rgba(74,91,170,0.18)] sm:h-11 sm:w-11">
        <ShieldPlus className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className={compact ? "hidden" : ""}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)] sm:text-sm sm:tracking-[0.3em]">
          SafeRx
        </p>
        <p className="text-xs text-[var(--text-muted)] sm:text-sm">
          Drug interaction intelligence
        </p>
      </div>
    </div>
  );
}
