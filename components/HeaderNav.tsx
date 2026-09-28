"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarBlank,
  FolderSimple,
  Globe,
  List,
  MagnifyingGlass,
  Microphone,
  Newspaper,
  UsersThree,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/shared";
import { SearchingAnimation } from "@/components/search/SearchingAnimation";

type NavLink = { href: string; label: string; external?: boolean };

type SuggestionType = "news" | "projects" | "events" | "podcast" | "team";
type Suggestion = { id: string; type: SuggestionType; title: string; href: string; image: string | null; meta: string };

const TYPE_ICONS: Record<SuggestionType, { icon: Icon; color: string }> = {
  news: { icon: Newspaper, color: "var(--color-blue)" },
  projects: { icon: FolderSimple, color: "var(--color-red)" },
  events: { icon: CalendarBlank, color: "var(--color-green)" },
  podcast: { icon: Microphone, color: "var(--color-orange)" },
  team: { icon: UsersThree, color: "var(--color-blue-deep)" },
};

/** Quick matches from /api/search for what's typed, fetched after a short pause. */
function useSuggestions(query: string, enabled: boolean) {
  const [data, setData] = useState<{ q: string; results: Suggestion[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!enabled || q.length < 2) return;
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const json = await res.json();
        setData({ q, results: json.results ?? [], total: json.total ?? 0 });
      } catch {
        // Aborted or offline: keep what's showing.
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [query, enabled]);

  return { data, loading };
}

type HeaderNavProps = {
  locale: Locale;
  links: NavLink[];
  labels: {
    search: string;
    searchPlaceholder: string;
    closeSearch: string;
    seeAll: string;
    searching: string;
    noSuggestions: string;
    types: Record<SuggestionType, string>;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
};

const LANGUAGES: { value: Locale; label: string; className?: string }[] = [
  { value: "en", label: "English" },
  { value: "km", label: "ខ្មែរ", className: "font-khmer" },
];

/** Closes a popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
}

function externalProps(link: NavLink) {
  return link.external ? { target: "_blank", rel: "noreferrer" } : {};
}

/** Navy dropdown panel for the language menu. */
function Panel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div
      id={id}
      className="animate-pop-in absolute right-0 top-full z-50 mt-3 min-w-64 overflow-hidden rounded-md border border-white/30 bg-navy/95 shadow-xl backdrop-blur"
    >
      {children}
    </div>
  );
}

export function HeaderNav({ locale, links, labels }: HeaderNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState<"language" | "mobile" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const searchInput = useRef<HTMLInputElement>(null);
  const searchForm = useRef<HTMLFormElement>(null);
  const suggestBox = useRef<HTMLDivElement>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ids = useId();
  const { data: suggestions, loading: suggesting } = useSuggestions(query, searchOpen);
  // The panel opens as soon as a search starts, showing the searching animation until results arrive.
  const showSuggestions =
    searchOpen && suggestOpen && query.trim().length >= 2 && (suggestions !== null || suggesting);
  const suggestionList = suggestions?.results ?? [];

  // Hide the suggestions on a click anywhere else.
  useEffect(() => {
    if (!showSuggestions) return;
    function onPointer(e: PointerEvent) {
      const t = e.target as Node;
      if (!searchForm.current?.contains(t) && !suggestBox.current?.contains(t)) setSuggestOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [showSuggestions]);

  const close = useCallback(() => setMenu(null), []);
  const languageRef = useDismiss(menu === "language", close);

  // Close any open menu when the route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenu(null);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  function toggle(name: NonNullable<typeof menu>) {
    setMenu((m) => (m === name ? null : name));
  }

  function setLocale(next: Locale) {
    setMenu(null);
    if (next === locale) return;
    writeLocaleCookie(next);
    startTransition(() => router.refresh());
  }

  function openSearch() {
    setMenu(null);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSuggestOpen(false);
    setQuery("");
  }

  function searchAll() {
    const q = query.trim();
    if (!q) {
      searchInput.current?.focus();
      return;
    }
    setSuggestOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const picked = showSuggestions && activeIndex >= 0 ? suggestionList[activeIndex] : undefined;
    if (picked) {
      setSuggestOpen(false);
      router.push(picked.href);
    } else {
      searchAll();
    }
  }

  // Arrow keys move through the suggestions; the last option is "See all results".
  function onSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      if (showSuggestions) setSuggestOpen(false);
      else closeSearch();
      return;
    }
    if (!showSuggestions || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    const last = suggestionList.length;
    setActiveIndex((i) => {
      const next = i + (e.key === "ArrowDown" ? 1 : -1);
      if (next < -1) return last;
      if (next > last) return -1;
      return next;
    });
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex items-center gap-3 md:gap-5">
      {/* Desktop links and the search bar that expands over them */}
      <div className="relative flex items-center">
        <nav
          aria-label="Main"
          inert={searchOpen}
          className={`hidden items-center transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
            searchOpen ? "pointer-events-none -translate-y-1 opacity-0" : ""
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...externalProps(link)}
              aria-current={!link.external && isActive(link.href) ? "page" : undefined}
              className={`link-underline px-6 text-base leading-7 first:pl-0 not-first:border-l not-first:border-white hover:text-white/75 ${
                !link.external && isActive(link.href) ? "font-bold" : "font-medium"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Holds the collapsed search button's place in the row */}
        <span aria-hidden className="size-11 shrink-0 lg:ml-6" />

        <form
          ref={searchForm}
          role="search"
          onSubmit={submitSearch}
          onKeyDown={onSearchKeyDown}
          onBlur={(e) => {
            // Collapse when focus leaves the bar with nothing typed.
            if (!query && !searchForm.current?.contains(e.relatedTarget as Node)) setSearchOpen(false);
          }}
          className={`absolute right-0 top-1/2 z-10 flex h-11 -translate-y-1/2 items-center overflow-hidden rounded-full transition-[width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            searchOpen
              ? "w-[calc(100vw-10rem)] bg-white text-navy shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)] sm:w-80 lg:w-full lg:min-w-80"
              : "w-11 bg-transparent text-white"
          }`}
        >
          <button
            type={searchOpen ? "submit" : "button"}
            onClick={searchOpen ? undefined : openSearch}
            aria-label={labels.search}
            aria-expanded={searchOpen}
            className={`group press flex size-11 shrink-0 items-center justify-center rounded-full ${
              searchOpen ? "hover:bg-navy/5" : "hover:bg-white/10"
            }`}
          >
            <MagnifyingGlass
              size={searchOpen ? 22 : 26}
              weight="bold"
              className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            />
          </button>
          <input
            ref={searchInput}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setSuggestOpen(true)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.search}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls={`${ids}-suggest`}
            aria-activedescendant={showSuggestions && activeIndex >= 0 ? `${ids}-opt-${activeIndex}` : undefined}
            autoComplete="off"
            tabIndex={searchOpen ? 0 : -1}
            className={`h-full min-w-0 flex-1 bg-transparent pr-2 text-sm font-medium outline-none transition-opacity duration-300 placeholder:text-navy/50 [&::-webkit-search-cancel-button]:hidden ${
              searchOpen ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
            }`}
          />
          {searchOpen && (
            <button
              type="button"
              onClick={closeSearch}
              aria-label={labels.closeSearch}
              className="animate-icon-swap press mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-navy/10"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </form>
      </div>

      {/* Live suggestions under the search bar */}
      {showSuggestions && (
        <div
          ref={suggestBox}
          id={`${ids}-suggest`}
          role="listbox"
          aria-label={labels.search}
          className="animate-pop-in absolute inset-x-4 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white text-navy shadow-[0_28px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-navy/10 md:inset-x-10 lg:left-auto lg:w-[30rem] xl:right-16"
        >
          {suggesting ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <SearchingAnimation className="size-14 shrink-0" label={labels.searching} />
              <p aria-hidden className="text-sm font-bold uppercase tracking-[0.15em] text-navy/50">
                {labels.searching}
              </p>
            </div>
          ) : suggestionList.length === 0 ? (
            <p className="px-5 py-4 text-sm text-navy/60">{labels.noSuggestions}</p>
          ) : (
            <ul className="max-h-[min(26rem,60vh)] overflow-y-auto py-2">
              {suggestionList.map((item, i) => {
                const { icon: TypeIcon, color } = TYPE_ICONS[item.type];
                const active = i === activeIndex;
                return (
                  <li key={item.id} className="animate-item-in" style={{ "--i": i } as React.CSSProperties}>
                    <Link
                      id={`${ids}-opt-${i}`}
                      role="option"
                      aria-selected={active}
                      href={item.href}
                      onClick={() => setSuggestOpen(false)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${active ? "bg-paper" : ""}`}
                    >
                      <span
                        className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-paper ${
                          item.type === "team" ? "rounded-full" : "rounded-lg"
                        }`}
                        style={{ color }}
                      >
                        {item.image ? (
                          // Plain img: the thumbnails are tiny and some come from YouTube.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className={`size-full ${item.type === "projects" ? "object-contain p-1" : "object-cover"}`}
                          />
                        ) : (
                          <TypeIcon size={20} weight="duotone" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{item.title}</span>
                        <span className="flex min-w-0 items-center gap-1.5 text-xs text-navy/55">
                          <TypeIcon size={12} weight="bold" className="shrink-0" style={{ color }} />
                          <span className="shrink-0">{labels.types[item.type]}</span>
                          {item.meta && <span className="truncate">· {item.meta}</span>}
                        </span>
                      </span>
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className={`shrink-0 transition-[opacity,translate] duration-200 ${
                          active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            id={`${ids}-opt-${suggestionList.length}`}
            role="option"
            aria-selected={activeIndex === suggestionList.length}
            onClick={searchAll}
            onMouseEnter={() => setActiveIndex(suggestionList.length)}
            className={`group flex w-full items-center justify-between border-t border-navy/10 px-5 py-3.5 text-sm font-bold transition-colors ${
              activeIndex === suggestionList.length ? "bg-navy text-white" : "bg-paper/60"
            }`}
          >
            <span>
              {labels.seeAll}
              {!suggesting && suggestions && suggestions.total > 0 && (
                <span className="ml-1.5 opacity-60">({suggestions.total})</span>
              )}
            </span>
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {/* Language */}
      <div ref={languageRef} className="relative">
        <button
          type="button"
          onClick={() => toggle("language")}
          aria-expanded={menu === "language"}
          aria-controls={`${ids}-language`}
          aria-label={labels.language}
          aria-busy={pending}
          className="group press flex size-10 items-center justify-center rounded-full hover:bg-white/10"
        >
          <Globe
            size={28}
            weight="regular"
            className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[30deg] ${
              menu === "language" ? "rotate-[30deg]" : ""
            } ${pending ? "animate-pulse" : ""}`}
          />
        </button>
        {menu === "language" && (
          <Panel id={`${ids}-language`}>
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLocale(lang.value)}
                aria-pressed={locale === lang.value}
                style={{ "--i": i } as React.CSSProperties}
                className={`block w-full border-b border-white/40 px-4 py-2.5 text-left text-base text-white animate-item-in transition-[background-color,padding] duration-300 last:border-b-0 hover:bg-white/10 hover:pl-6 ${
                  locale === lang.value ? "font-bold" : "font-light"
                } ${lang.className ?? ""}`}
              >
                {lang.label}
              </button>
            ))}
          </Panel>
        )}
      </div>

      {/* Mobile menu */}
      <button
        type="button"
        onClick={() => toggle("mobile")}
        aria-expanded={menu === "mobile"}
        aria-controls={`${ids}-mobile`}
        aria-label={menu === "mobile" ? labels.closeMenu : labels.openMenu}
        className="press flex size-10 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
      >
        {menu === "mobile" ? (
          <X key="close" size={26} weight="bold" className="animate-icon-swap" />
        ) : (
          <List key="open" size={26} weight="bold" className="animate-icon-swap" />
        )}
      </button>

      {menu === "mobile" && (
        <nav
          id={`${ids}-mobile`}
          aria-label="Main"
          className="animate-pop-in absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/20 bg-navy px-6 pb-8 pt-4 shadow-xl lg:hidden"
        >
          <ul>
            {links.map((link, i) => (
              <li key={link.href} className="animate-item-in" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={link.href}
                  {...externalProps(link)}
                  aria-current={!link.external && isActive(link.href) ? "page" : undefined}
                  className={`block border-b border-white/15 py-4 text-lg ${
                    !link.external && isActive(link.href) ? "font-bold" : "font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
