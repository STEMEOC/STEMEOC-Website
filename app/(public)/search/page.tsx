import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarBlank,
  FolderSimple,
  Lightbulb,
  Microphone,
  Newspaper,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getDictionary } from "@/lib/i18n";
import {
  SEARCH_TYPES,
  highlightTerms,
  parseQuery,
  searchSite,
  sortResults,
  type SearchSort,
  type SearchType,
} from "@/lib/search";
import { PageTransition } from "@/components/motion/PageTransition";
import { SearchBox } from "@/components/search/SearchBox";
import { Highlight } from "@/components/search/Highlight";
import {
  FilterLink,
  SearchPendingProvider,
  SearchResultsArea,
} from "@/components/search/SearchPending";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.search.metaTitle, robots: { index: false } };
}

const TYPE_STYLE: Record<SearchType, { icon: Icon; color: string }> = {
  news: { icon: Newspaper, color: "var(--color-blue)" },
  projects: { icon: FolderSimple, color: "var(--color-red)" },
  events: { icon: CalendarBlank, color: "var(--color-green)" },
  podcast: { icon: Microphone, color: "var(--color-orange)" },
  team: { icon: UsersThree, color: "var(--color-blue-deep)" },
};

const SORTS: SearchSort[] = ["relevance", "newest", "oldest"];
const POPULAR = [
  "Robotics",
  "STEM Festival",
  "Eco-STEM",
  "ICIA",
  "STEM Sisters",
  "Podcast",
];

type Params = {
  q: string;
  type: SearchType | "all";
  sort: SearchSort;
  year: string;
};

function hrefWith(current: Params, change: Partial<Params>) {
  const next = { ...current, ...change };
  const sp = new URLSearchParams();
  if (next.q) sp.set("q", next.q);
  if (next.type !== "all") sp.set("type", next.type);
  if (next.sort !== "relevance") sp.set("sort", next.sort);
  if (next.year) sp.set("year", next.year);
  return `/search?${sp.toString()}`;
}

const chip =
  "press inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold whitespace-nowrap";
const chipOn = "border-navy bg-navy text-white";
const chipOff = "border-navy/20 text-navy/70 hover:border-navy hover:text-navy";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [raw, { dict }] = await Promise.all([searchParams, getDictionary()]);
  const s = dict.search;
  const categoryLabels = dict.projects.categories as Record<string, string>;

  const str = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : "";
  const params: Params = {
    q: str(raw.q).trim().slice(0, 100),
    type: (SEARCH_TYPES as readonly string[]).includes(str(raw.type))
      ? (str(raw.type) as SearchType)
      : "all",
    sort: (SORTS as string[]).includes(str(raw.sort))
      ? (str(raw.sort) as SearchSort)
      : "relevance",
    year: /^\d{4}$/.test(str(raw.year)) ? str(raw.year) : "",
  };

  const all = params.q ? await searchSite(params.q) : [];
  const terms = highlightTerms(parseQuery(params.q));

  // Counts per type ignore the type filter, so each tab shows what it would hold.
  const byYear = params.year ? all.filter((r) => r.year === params.year) : all;
  const counts = Object.fromEntries(
    SEARCH_TYPES.map((t) => [t, byYear.filter((r) => r.type === t).length]),
  ) as Record<SearchType, number>;
  const years = [
    ...new Set(all.map((r) => r.year).filter((y): y is string => Boolean(y))),
  ]
    .sort()
    .reverse();
  const results = sortResults(
    params.type === "all"
      ? byYear
      : byYear.filter((r) => r.type === params.type),
    params.sort,
  );
  const filtered =
    params.type !== "all" || params.year !== "" || params.sort !== "relevance";

  return (
    <PageTransition>
      <SearchPendingProvider>
        {/* Hero with the search field */}
        <section className="bg-navy text-white">
          <div className="container-site flex flex-col items-center pb-14 pt-12 text-center md:pb-16 md:pt-16">
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
              <span aria-hidden className="flex gap-1">
                {["bg-blue", "bg-red", "bg-green", "bg-orange"].map((c) => (
                  <span key={c} className={`size-2 rounded-full ${c}`} />
                ))}
              </span>
              {s.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              {s.title}
            </h1>
            <div className="mt-8 w-full max-w-3xl">
              <Suspense>
                <SearchBox
                  initial={params.q}
                  labels={{
                    placeholder: s.placeholder,
                    clear: s.clear,
                    search: dict.header.search,
                  }}
                />
              </Suspense>
            </div>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-white/60 md:text-sm">
              {s.tips.map((tip) => (
                <li key={tip} className="flex items-center gap-1.5">
                  <Lightbulb
                    size={14}
                    weight="fill"
                    className="text-orange"
                    aria-hidden
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-site pb-24 pt-10 md:pb-32 md:pt-12">
          {!params.q ? (
            /* Nothing typed yet */
            <div className="mx-auto max-w-2xl py-10 text-center">
              <p className="text-lg text-navy/70">{s.noQuery}</p>
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-navy/50">
                {s.popular}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {POPULAR.map((term) => (
                  <FilterLink
                    key={term}
                    href={hrefWith(params, { q: term })}
                    className={`${chip} ${chipOff}`}
                  >
                    {term}
                  </FilterLink>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col gap-5 border-b border-navy/15 pb-6">
                <nav
                  aria-label={s.sortLabel}
                  className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
                >
                  {(["all", ...SEARCH_TYPES] as const).map((type) => {
                    const on = params.type === type;
                    const count = type === "all" ? byYear.length : counts[type];
                    const TypeIcon =
                      type === "all" ? null : TYPE_STYLE[type].icon;
                    return (
                      <FilterLink
                        key={type}
                        href={hrefWith(params, { type })}
                        aria-current={on ? "page" : undefined}
                        className={`${chip} ${on ? chipOn : chipOff} ${count === 0 && !on ? "opacity-40" : ""}`}
                      >
                        {TypeIcon && <TypeIcon size={16} weight="bold" />}
                        {s.types[type]}
                        <span
                          className={`rounded-full px-2 text-xs ${on ? "bg-white/20" : "bg-navy/10"}`}
                        >
                          {count}
                        </span>
                      </FilterLink>
                    );
                  })}
                </nav>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold uppercase tracking-[0.15em] text-navy/50">
                      {s.sortLabel}
                    </span>
                    {SORTS.map((sort) => (
                      <FilterLink
                        key={sort}
                        href={hrefWith(params, { sort })}
                        aria-current={params.sort === sort ? "true" : undefined}
                        className={`link-underline px-1 ${params.sort === sort ? "font-bold" : "text-navy/60 hover:text-navy"}`}
                      >
                        {s.sort[sort]}
                      </FilterLink>
                    ))}
                  </div>
                  {years.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold uppercase tracking-[0.15em] text-navy/50">
                        {s.yearLabel}
                      </span>
                      {["", ...years].map((year) => (
                        <FilterLink
                          key={year || "any"}
                          href={hrefWith(params, { year })}
                          aria-current={
                            params.year === year ? "true" : undefined
                          }
                          className={`link-underline px-1 tabular-nums ${
                            params.year === year
                              ? "font-bold"
                              : "text-navy/60 hover:text-navy"
                          }`}
                        >
                          {year || s.anyYear}
                        </FilterLink>
                      ))}
                    </div>
                  )}
                  {filtered && (
                    <FilterLink
                      href={hrefWith(params, {
                        type: "all",
                        sort: "relevance",
                        year: "",
                      })}
                      className="ml-auto font-bold text-red hover:underline"
                    >
                      {s.clearFilters}
                    </FilterLink>
                  )}
                </div>
              </div>

              <SearchResultsArea label={s.searching}>
                <p className="mt-6 text-navy/70" aria-live="polite">
                  <strong className="text-navy">{results.length}</strong>{" "}
                  {results.length === 1 ? s.result : s.results} “
                  <strong className="text-navy">{params.q}</strong>”
                </p>

                {results.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-display text-2xl font-bold">
                      {s.noResults} “{params.q}”
                    </p>
                    <p className="mt-3 text-navy/70">{s.noResultsHint}</p>
                    {filtered && (
                      <Link
                        href={hrefWith(params, {
                          type: "all",
                          sort: "relevance",
                          year: "",
                        })}
                        className="press mt-6 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-bold uppercase text-white"
                      >
                        {s.clearFilters}
                      </Link>
                    )}
                  </div>
                ) : (
                  <ul
                    key={`${params.q}|${params.type}|${params.sort}|${params.year}`}
                    className="mt-4"
                  >
                    {results.slice(0, 60).map((r, i) => {
                      const { icon: TypeIcon, color } = TYPE_STYLE[r.type];
                      const meta =
                        r.type === "projects"
                          ? (categoryLabels[r.meta] ?? r.meta)
                          : r.meta;
                      return (
                        <li
                          key={r.id}
                          className="animate-item-in"
                          style={
                            { "--i": Math.min(i, 10) } as React.CSSProperties
                          }
                        >
                          <Link
                            href={r.href}
                            className="group relative flex gap-5 border-b border-navy/10 py-6 transition-[background-color,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-paper md:gap-7 md:hover:px-5"
                            style={{ "--accent": color } as React.CSSProperties}
                          >
                            <span
                              aria-hidden
                              className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                            />
                            <div
                              className={`relative size-20 shrink-0 overflow-hidden bg-paper ring-1 ring-navy/5 md:size-28 ${
                                r.type === "team"
                                  ? "rounded-full"
                                  : "rounded-xl"
                              }`}
                            >
                              {r.image ? (
                                <Image
                                  src={r.image}
                                  alt=""
                                  fill
                                  sizes="112px"
                                  className={`transition-transform duration-500 group-hover:scale-105 ${
                                    r.type === "projects"
                                      ? "object-contain p-2"
                                      : "object-cover"
                                  }`}
                                />
                              ) : (
                                <span
                                  className="absolute inset-0 flex items-center justify-center"
                                  style={{ color }}
                                >
                                  <TypeIcon size={32} weight="duotone" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.15em]">
                                <span
                                  className="inline-flex items-center gap-1.5"
                                  style={{ color }}
                                >
                                  <TypeIcon size={14} weight="bold" />
                                  {s.types[r.type]}
                                </span>
                                {meta && (
                                  <span className="text-navy/50">{meta}</span>
                                )}
                              </p>
                              <h2 className="mt-2 font-display text-xl font-bold leading-snug md:text-2xl">
                                <Highlight text={r.title} terms={terms} />
                              </h2>
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/70 md:text-base">
                                <Highlight text={r.snippet} terms={terms} />
                              </p>
                            </div>
                            <ArrowRight
                              size={20}
                              weight="bold"
                              aria-hidden
                              className="hidden shrink-0 self-center text-navy/30 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)] md:block"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </SearchResultsArea>
            </>
          )}
        </section>
      </SearchPendingProvider>
    </PageTransition>
  );
}
