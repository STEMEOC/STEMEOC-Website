import { ViewTransition } from "react";
import { getDictionary } from "@/lib/i18n";
import { SearchingAnimation } from "@/components/search/SearchingAnimation";

// Arriving at /search (e.g. from the header bar) shows the searching
// animation while the results are worked out.
export default async function Loading() {
  const { dict } = await getDictionary();
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <SearchingAnimation className="size-48" label={dict.search.searching} />
        <p aria-hidden className="-mt-2 text-sm font-bold uppercase tracking-[0.2em] text-navy/50">
          {dict.search.searching}
        </p>
      </div>
    </ViewTransition>
  );
}
