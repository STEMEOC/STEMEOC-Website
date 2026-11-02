"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

/** Arrows plus numbered page buttons. `page` is zero-based. */
export function Pagination({
  page,
  pages,
  onChange,
  labels,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  labels: { page: string; previous: string; next: string };
}) {
  if (pages < 2) return null;
  return (
    <nav className="mt-12 flex items-center justify-center gap-6" aria-label={labels.page}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label={labels.previous}
        className="press p-1 disabled:opacity-30"
      >
        <ArrowLeft size={28} />
      </button>
      <ol className="flex gap-2">
        {Array.from({ length: pages }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onChange(i)}
              aria-current={i === page ? "page" : undefined}
              aria-label={`${labels.page} ${i + 1}`}
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold press ${
                i === page ? "bg-navy text-white" : "text-navy/35 hover:text-navy"
              }`}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages - 1}
        aria-label={labels.next}
        className="press p-1 disabled:opacity-30"
      >
        <ArrowRight size={28} />
      </button>
    </nav>
  );
}
