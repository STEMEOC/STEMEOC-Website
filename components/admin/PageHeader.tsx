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
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="font-mono-label text-sm uppercase tracking-[0.15em] text-navy/50">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy lg:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-navy/65">{description}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="flex h-13 items-center gap-2 rounded-full bg-navy px-6 text-base font-bold text-white transition-colors hover:bg-blue-deep"
        >
          {cta.icon}
          {cta.label}
        </Link>
      )}
    </div>
  );
}
