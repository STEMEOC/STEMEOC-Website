"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleNotch, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useSearchPending } from "@/components/search/SearchPending";

/**
 * The big search field on /search. Results update as you type (debounced),
 * keeping the current type, sort and year filters; the page itself does the
 * searching on the server.
 */
export function SearchBox({
  initial,
  labels,
}: {
  initial: string;
  labels: { placeholder: string; clear: string; search: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(initial);
  const { pending, startTransition } = useSearchPending();
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow the URL when it changes from elsewhere (header search, popular chips).
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setValue(initial);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  function push(next: string) {
    const sp = new URLSearchParams(params.toString());
    if (next.trim()) sp.set("q", next.trim());
    else sp.delete("q");
    // A new query starts from the first page of results with any year.
    sp.delete("year");
    startTransition(() => router.replace(`${pathname}?${sp.toString()}`, { scroll: false }));
  }

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => push(next), 300);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        push(value);
      }}
      className="group/box flex h-16 w-full items-center gap-2 rounded-full bg-white pl-6 pr-2 text-navy shadow-[0_24px_60px_-28px_rgb(0_0_0/0.8)] ring-2 ring-transparent transition-[box-shadow] duration-300 focus-within:ring-orange md:h-[4.5rem] md:pl-7"
    >
      {pending ? (
        <CircleNotch size={26} weight="bold" className="shrink-0 animate-spin text-navy/50" />
      ) : (
        <MagnifyingGlass size={26} weight="bold" className="shrink-0 text-navy/50" />
      )}
      <input
        ref={input}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={labels.placeholder}
        aria-label={labels.search}
        autoFocus={!initial}
        className="h-full min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-navy/45 md:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            input.current?.focus();
          }}
          aria-label={labels.clear}
          className="animate-icon-swap press flex size-10 shrink-0 items-center justify-center rounded-full text-navy/60 hover:bg-navy/5 hover:text-navy"
        >
          <X size={18} weight="bold" />
        </button>
      )}
      <button
        type="submit"
        className="press hidden h-12 shrink-0 items-center rounded-full bg-navy px-7 text-sm font-bold uppercase text-white hover:bg-navy/90 sm:flex md:h-14"
      >
        {labels.search}
      </button>
    </form>
  );
}
