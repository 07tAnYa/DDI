import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
