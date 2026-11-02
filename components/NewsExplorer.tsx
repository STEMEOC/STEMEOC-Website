"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CalendarBlank, Check, ShareNetwork } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";
import { Pagination } from "@/components/Pagination";
import type { Dictionary } from "@/lib/i18n";

type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string;
  publishedAt: Date | null;
};

const PAGE_SIZE = 6;
const FEATURED = 4;
const EASE = [0.16, 1, 0.3, 1] as const;
// Category badge colors, in Figma order.
const BADGE_COLORS = ["bg-green", "bg-orange", "bg-blue", "bg-red"];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Shares the post with the native share sheet, or copies its link. */
function ShareButton({ post, labels }: { post: NewsPost; labels: { share: string; linkCopied: string } }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/news/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed or clipboard blocked; nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={labels.share}
      className="press relative flex size-9 items-center justify-center rounded-full text-navy hover:bg-navy/5"
    >
      {copied ? <Check size={20} weight="bold" /> : <ShareNetwork size={20} />}
      <AnimatePresence>
        {copied && (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white"
          >
            {labels.linkCopied}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/**
 * News list (Figma "News landing page"): a slider of the newest posts, then
 * category pills over a paged grid of post cards.
 */
export function NewsExplorer({
  posts,
  dict,
  common,
  notice,
  showFeatured = true,
}: {
  posts: NewsPost[];
  dict: Dictionary["news"];
  common: Dictionary["common"];
  notice?: ReactNode;
  showFeatured?: boolean;
}) {
  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);
  const badge = (category: string) => BADGE_COLORS[categories.indexOf(category) % BADGE_COLORS.length];
  const [active, setActive] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [slide, setSlide] = useState(0);
  const shareLabels = { share: dict.share, linkCopied: dict.linkCopied };
  const listTop = useRef<HTMLDivElement>(null);

  const featured = showFeatured ? posts.slice(0, FEATURED) : [];
  const filtered = active ? posts.filter((p) => p.category === active) : posts;
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const shown = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const current = featured[slide];

  function goToPage(next: number) {
    setPage(next);
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectTab(tab: string | null) {
    setActive(tab);
    setPage(0);
  }

  function pill(label: string, value: string | null) {
    const isActive = active === value;
    return (
      <button
        key={label}
        role="tab"
        type="button"
        aria-selected={isActive}
        onClick={() => selectTab(value)}
        className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold press ${
          isActive ? "border-navy bg-navy text-white" : "border-navy/25 bg-white hover:border-navy"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <>
      {/* Title */}
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue px-4 py-1 text-xs font-bold uppercase text-white md:text-sm">
          {dict.badge}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">{dict.whatsNew}</h1>
      </div>

      {notice}

      {/* Featured slider */}
      {current && (
        <div className="mx-auto mt-12 max-w-5xl md:mt-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } }}
              exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
              className="relative grid gap-6 rounded-3xl bg-white p-5 shadow-[0_30px_60px_-36px_rgb(5_19_59/0.55)] ring-1 ring-navy/10 md:grid-cols-[1fr_1.1fr] md:gap-10 md:p-8"
            >
              <Link href={`/news/${current.slug}`} tabIndex={-1} aria-hidden className="group relative block aspect-square overflow-hidden rounded-2xl bg-paper">
                {current.coverImageUrl && (
                  <Image
                    src={current.coverImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </Link>
              <div className="flex flex-col justify-center">
                <span className="absolute right-5 top-5 rounded-full bg-red px-3 py-0.5 text-xs font-bold text-white md:right-8 md:top-8">
                  {dict.feature}
                </span>
                <span className={`self-start rounded-full px-3 py-0.5 text-xs font-bold text-white ${badge(current.category)}`}>
                  {current.category}
                </span>
                <h2 className="mt-4 font-body text-xl font-bold uppercase leading-snug md:text-2xl">
                  <Link href={`/news/${current.slug}`} className="hover:text-navy/75">
                    {current.title}
                  </Link>
                </h2>
                {current.excerpt && <p className="mt-4 line-clamp-4 text-base leading-relaxed">{current.excerpt}</p>}
                {current.publishedAt && (
                  <time dateTime={new Date(current.publishedAt).toISOString()} className="mt-4 text-xs text-navy/55">
                    {formatDate(current.publishedAt)}
                  </time>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <ShareButton post={current} labels={shareLabels} />
                  <Link
                    href={`/news/${current.slug}`}
                    className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold uppercase text-white press hover:-translate-y-0.5 hover:bg-blue"
                  >
                    {common.readMore}
                  </Link>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          {featured.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {featured.map((post, i) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={post.title}
                  aria-current={i === slide}
                  className={`h-2 rounded-full transition-all duration-300 ${i === slide ? "w-6 bg-navy" : "w-2 bg-navy/25 hover:bg-navy/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Latest news */}
      <div ref={listTop} className="mt-20 flex scroll-mt-32 flex-col gap-6 md:mt-24 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-display text-3xl font-bold md:text-4xl">{dict.latestNews}</h2>
        {categories.length > 1 && (
          <div role="tablist" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:gap-3">
            {pill(dict.filterAll, null)}
            {categories.map((c) => pill(c, c))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-navy/60">{dict.emptyCategory}</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {shown.map((post, i) => (
            <li key={post.id}>
              <Reveal scroll={(i % 3) * 0.12} className="h-full">
                <article className="group flex h-full flex-col rounded-2xl bg-white p-3 shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)] ring-1 ring-navy/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1">
                  <Link href={`/news/${post.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden rounded-xl bg-paper">
                    {post.coverImageUrl && (
                      <Image
                        src={post.coverImageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    <span className={`absolute right-3 top-3 rounded-full px-3 py-0.5 text-xs font-bold text-white ${badge(post.category)}`}>
                      {post.category}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    {post.publishedAt && (
                      <p className="flex items-center gap-1.5 text-xs text-navy/60">
                        <CalendarBlank size={14} className="text-red" />
                        <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
                      </p>
                    )}
                    <h3 className="mt-2 font-body text-base font-bold uppercase leading-snug">
                      <Link href={`/news/${post.slug}`} className="hover:text-navy/75">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/70">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <ShareButton post={post} labels={shareLabels} />
                      <Link
                        href={`/news/${post.slug}`}
                        className="rounded-full bg-navy px-4 py-1.5 text-xs font-bold uppercase text-white press hover:-translate-y-0.5 hover:bg-blue"
                      >
                        {common.readMore}
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        pages={pages}
        onChange={goToPage}
        labels={{ page: dict.page, previous: dict.previous, next: dict.next }}
      />
    </>
  );
}
