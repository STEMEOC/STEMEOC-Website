"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ShareNetwork } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";
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
const SIDEBAR_PER_GROUP = 3;
const EASE = [0.16, 1, 0.3, 1] as const;

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
      className="press relative flex size-10 items-center justify-center rounded-full text-navy hover:bg-navy/5"
    >
      {copied ? <Check size={24} weight="bold" /> : <ShareNetwork size={24} />}
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
 * News list (Figma "News landing page"): category tabs, a sidebar of the
 * latest posts per category, and a feed of large post cards.
 */
export function NewsExplorer({
  posts,
  dict,
  common,
  heading,
  notice,
}: {
  posts: NewsPost[];
  dict: Dictionary["news"];
  common: Dictionary["common"];
  heading: string;
  notice?: ReactNode;
}) {
  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);
  const tabs = [dict.filterAll, ...categories];
  const [active, setActive] = useState(dict.filterAll);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = active === dict.filterAll ? posts : posts.filter((p) => p.category === active);
  const shown = filtered.slice(0, visible);

  // With a single category its name would just repeat the page title.
  const groups = categories.map((category) => ({
    category,
    label: categories.length > 1 ? category : dict.latest,
    posts: posts.filter((p) => p.category === category).slice(0, SIDEBAR_PER_GROUP),
  }));

  function selectTab(tab: string) {
    setActive(tab);
    setVisible(PAGE_SIZE);
  }

  return (
    <>
      {/* Title + category tabs */}
      <div className="flex flex-col gap-6 border-b border-navy/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="font-display text-3xl font-bold uppercase md:text-5xl">{heading}</h1>
        <div role="tablist" className="-mx-1 flex overflow-x-auto px-1">
          {tabs.map((tab, i) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => selectTab(tab)}
                className={`relative shrink-0 whitespace-nowrap border-navy px-5 py-2 text-lg press first:pl-0 not-first:border-l hover:text-navy/70 md:px-7 md:text-xl ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                {tab}
                {isActive && (
                  <motion.span
                    layoutId="news-tab-underline"
                    className={`absolute bottom-0 right-5 h-[3px] rounded-full bg-navy md:right-8 ${i === 0 ? "left-0" : "left-5 md:left-8"}`}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {notice}

      <div className="mt-12 grid gap-16 lg:grid-cols-[28rem_minmax(0,1fr)] xl:gap-24">
        {/* Sidebar: latest posts per category */}
        <aside className="order-last lg:order-first">
          <div className="space-y-10 lg:sticky lg:top-32">
            {groups.map((group) => (
              <div key={group.category}>
                <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">{group.label}</h2>
                <ul className="mt-7 space-y-7">
                  {group.posts.map((post) => (
                    <li key={post.id}>
                      <Link href={`/news/${post.slug}`} className="group flex items-start gap-4">
                        <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-navy">
                          {post.coverImageUrl && (
                            <Image
                              src={post.coverImageUrl}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-navy/70">
                            {post.title}
                          </span>
                          <span className="mt-1.5 line-clamp-2 text-base text-navy/60">{post.excerpt}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Feed */}
        <div className="mx-auto w-full max-w-2xl">
          {filtered.length === 0 ? (
            <p className="text-navy/60">{dict.emptyCategory}</p>
          ) : (
            <ol className="divide-y divide-navy/15">
              {shown.map((post, i) => (
                <li key={post.id} className="py-12 first:pt-0">
                  <Reveal scroll={0}>
                    <article>
                      <Link href={`/news/${post.slug}`} className="group block">
                        <h2 className="font-body text-2xl font-bold leading-snug transition-colors group-hover:text-navy/75 md:text-2xl">
                          {post.title}
                        </h2>
                      </Link>
                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-base leading-relaxed md:text-lg">{post.excerpt}</p>
                      )}
                      <p className="mt-3 flex items-center gap-2 text-xs text-navy/55">
                        <span>{post.category}</span>
                        {post.publishedAt && (
                          <>
                            <span aria-hidden className="h-3 w-px bg-navy/30" />
                            <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
                          </>
                        )}
                      </p>

                      {post.coverImageUrl && (
                        <Link
                          href={`/news/${post.slug}`}
                          tabIndex={-1}
                          aria-hidden
                          className="group mt-5 block overflow-hidden rounded-xl bg-navy/5"
                        >
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={post.coverImageUrl}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 100vw, 672px"
                              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                            />
                          </div>
                        </Link>
                      )}

                      <div className="mt-5 flex items-center justify-between">
                        <ShareButton post={post} labels={{ share: dict.share, linkCopied: dict.linkCopied }} />
                        <Link
                          href={`/news/${post.slug}`}
                          className="group inline-flex items-center gap-2 rounded-full bg-navy py-2.5 pl-6 pr-5 text-sm font-bold uppercase text-white press hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-[0_10px_22px_-10px_rgb(5_19_59/0.7)]"
                        >
                          {common.readMore}
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          )}

          {visible < filtered.length && (
            <div className="flex justify-center border-t border-navy/15 pt-10">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border-2 border-navy px-8 py-3 text-sm font-bold uppercase btn-sweep press [--sweep:var(--color-navy)] hover:text-white"
              >
                {dict.loadMore}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
