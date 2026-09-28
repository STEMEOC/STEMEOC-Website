"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";

export type HelpTopic = {
  id: string;
  group: string;
  title: string;
  summary: string;
  keywords: string;
  stepCount: number;
  icon: ReactNode;
};

type Group = { id: string; title: string; tint: string };

function matches(topic: HelpTopic, query: string) {
  const haystack = `${topic.title} ${topic.summary} ${topic.keywords}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Searchable topic index for the admin Help page. */
export function HelpIndex({ topics, groups, intro }: { topics: HelpTopic[]; groups: Group[]; intro: ReactNode[] }) {
  const [query, setQuery] = useState("");
  const visible = topics.filter((t) => matches(t, query));
  const start = visible.find((t) => t.group === "basics");
  const searching = query.trim() !== "";

  return (
    <div id="top" className="mt-10 scroll-mt-8 space-y-6">
      <label className="relative block max-w-2xl">
        <span className="sr-only">Search the guides</span>
        <MagnifyingGlass size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-navy/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides, e.g. photo, password, YouTube"
          className="h-14 w-full rounded-full bg-white pl-13 pr-12 text-base text-navy ring-1 ring-navy/10 outline-none transition-shadow placeholder:text-navy/40 focus:ring-2 focus:ring-blue [&::-webkit-search-cancel-button]:hidden"
        />
        {searching && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy/50 hover:bg-navy/5 hover:text-navy"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </label>

      {start && (
        <a
          href={`#${start.id}`}
          className="group grid gap-8 overflow-hidden rounded-3xl bg-navy p-8 text-white transition-shadow hover:shadow-xl hover:shadow-navy/20 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:p-10"
        >
          <div className="flex flex-col">
            <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-orange">New here? Start here</p>
            <h2 className="mt-3 font-display text-3xl font-bold">{start.title}</h2>
            <p className="mt-2 text-base text-white/70">{start.summary}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-semibold">
              Read the basics
              <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {intro.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-white/[0.07] p-4 text-sm leading-relaxed text-white/80 [&_strong]:text-white">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-navy">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </a>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-3">
        {groups.map((group) => {
          const items = visible.filter((t) => t.group === group.id);
          if (items.length === 0) return null;
          return (
            <section key={group.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-navy/10">
              <header className="flex items-baseline justify-between px-6 pb-2 pt-6">
                <h2 className="font-display text-xl font-bold text-navy">{group.title}</h2>
                <span className="text-sm text-navy/40">
                  {items.length} guide{items.length === 1 ? "" : "s"}
                </span>
              </header>
              <ul className="px-3 pb-3">
                {items.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-paper-dim"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${group.tint}`}>
                        {t.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-navy">{t.title}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-navy/55">{t.summary}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-navy/35 group-hover:text-navy">
                        {t.stepCount} steps
                        <CaretRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {searching && visible.length === 0 && (
        <div className="rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-navy/10">
          <p className="text-base text-navy/60">No guides match “{query}”.</p>
          <button type="button" onClick={() => setQuery("")} className="mt-3 text-base font-semibold text-blue hover:text-navy">
            Show all guides
          </button>
        </div>
      )}
    </div>
  );
}
