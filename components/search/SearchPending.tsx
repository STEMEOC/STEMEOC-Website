"use client";

import { createContext, use, useTransition, type ReactNode, type TransitionStartFunction } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchingAnimation } from "@/components/search/SearchingAnimation";

type PendingState = { pending: boolean; startTransition: TransitionStartFunction };

const PendingContext = createContext<PendingState | null>(null);

/**
 * Shares one transition between everything on /search that changes the URL
 * (the search box and the filter links), so the results area can show the
 * searching animation while the server works out the new results.
 */
export function SearchPendingProvider({ children }: { children: ReactNode }) {
  const [pending, startTransition] = useTransition();
  return <PendingContext value={{ pending, startTransition }}>{children}</PendingContext>;
}

export function useSearchPending() {
  const ctx = use(PendingContext);
  if (!ctx) throw new Error("useSearchPending must be used inside SearchPendingProvider");
  return ctx;
}

/** Shows `children`, or the searching animation while new results load. */
export function SearchResultsArea({ label, children }: { label: string; children: ReactNode }) {
  const { pending } = useSearchPending();
  if (!pending) return <>{children}</>;
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <SearchingAnimation className="size-40 md:size-48" label={label} />
      <p aria-hidden className="-mt-2 text-sm font-bold uppercase tracking-[0.2em] text-navy/50">
        {label}
      </p>
    </div>
  );
}

/** A filter link that updates the results in place and shows the searching state. */
export function FilterLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-current"?: "page" | "true";
}) {
  const router = useRouter();
  const { startTransition } = useSearchPending();
  return (
    <Link
      href={href}
      scroll={false}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        startTransition(() => router.replace(href, { scroll: false }));
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
