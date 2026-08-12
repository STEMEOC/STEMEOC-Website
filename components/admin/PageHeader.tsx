import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  cta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string; icon?: ReactNode };
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-1.5 font-mono-label text-xs uppercase text-ink/40">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-ink/60">{description}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="shadow-pop-hover flex items-center gap-2 rounded-2xl bg-blue px-5 py-3 text-sm font-bold text-paper shadow-pop-sm"
        >
          {cta.icon}
          {cta.label}
        </Link>
      )}
    </div>
  );
}
