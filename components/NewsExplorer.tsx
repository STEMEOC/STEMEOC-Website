"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

const CATEGORY_COLORS: Record<string, string> = {
  Competition: "var(--color-orange)",
  Events: "var(--color-green)",
  News: "var(--color-blue)",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsExplorer({
  posts,
  dict,
  common,
}: {
  posts: NewsPost[];
  dict: Dictionary["news"];
  common: Dictionary["common"];
}) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category)));
    return [dict.filterAll, ...unique];
  }, [posts, dict.filterAll]);

  const [active, setActive] = useState(dict.filterAll);

  const filtered = active === dict.filterAll ? posts : posts.filter((p) => p.category === active);
  const [featured, ...remaining] = filtered;
  const sideList = remaining.slice(0, 3);
  const rest = remaining.slice(3);

  return (
    <>
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const isActive = cat === active;
          const color = CATEGORY_COLORS[cat] ?? "var(--color-blue)";
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className="rounded-full border-2 px-4 py-2 text-sm font-bold transition-all duration-200"
              style={
                isActive
                  ? { backgroundColor: color, borderColor: color, color: "var(--color-paper)" }
                  : { backgroundColor: "transparent", borderColor: "rgba(23,24,43,0.12)", color: "var(--color-ink)" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink/60">{dict.emptyCategory}</p>
      ) : (
        <>
          {/* Featured post + next up list */}
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Reveal key={featured.id}>
              <Link
                href={`/news/${featured.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-paper-dim p-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl md:h-[420px] md:flex-row"
              >
                {featured.coverImageUrl && (
                  <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-[1.5rem] bg-paper md:h-full md:w-1/2">
                    <Image
                      src={featured.coverImageUrl}
                      alt=""
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 480px"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                  <span
                    className="font-mono-label text-xs font-bold uppercase tracking-wide"
                    style={{ color: CATEGORY_COLORS[featured.category] ?? "var(--color-blue)" }}
                  >
                    {featured.category}
                    {featured.publishedAt && ` · ${formatDate(featured.publishedAt)}`}
                  </span>
                  <h2 className="mt-3 line-clamp-3 font-display text-2xl font-semibold leading-snug tracking-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 text-base leading-relaxed text-ink/65">{featured.excerpt}</p>
                  <span
                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-bold"
                    style={{ color: CATEGORY_COLORS[featured.category] ?? "var(--color-blue)" }}
                  >
                    {common.readMore}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {sideList.length > 0 && (
              <div className="flex flex-col gap-4">
                {sideList.map((post, i) => {
                  const color = ACCENT_COLORS[(i + 1) % ACCENT_COLORS.length];
                  return (
                    <Reveal key={post.id} delay={i * 0.06} className="h-full">
                      <Link
                        href={`/news/${post.slug}`}
                        className="group flex h-full items-center gap-4 rounded-2xl bg-paper-dim p-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {post.coverImageUrl && (
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                            <Image
                              src={post.coverImageUrl}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span
                            className="font-mono-label text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: CATEGORY_COLORS[post.category] ?? color }}
                          >
                            {post.category}
                            {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
                          </span>
                          <h3 className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-tight">
                            {post.title}
                          </h3>
                          <span
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold"
                            style={{ color: CATEGORY_COLORS[post.category] ?? color }}
                          >
                            {common.readMore}
                            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>

          {/* Rest of the posts */}
          {rest.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {rest.map((post, i) => {
                const color = CATEGORY_COLORS[post.category] ?? ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <Reveal key={post.id} delay={Math.min(i, 8) * 0.05} className="h-full">
                    <Link
                      href={`/news/${post.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-paper p-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      {post.coverImageUrl && (
                        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                          <Image
                            src={post.coverImageUrl}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
                        <span
                          className="font-mono-label text-[11px] font-bold uppercase tracking-wide"
                          style={{ color: CATEGORY_COLORS[post.category] ?? color }}
                        >
                          {post.category}
                          {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
                        </span>
                        <h2 className="mt-1.5 font-display text-xl font-semibold leading-tight">{post.title}</h2>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/60">
                          {post.excerpt}
                        </p>
                        <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold" style={{ color }}>
                          {common.readMore}
                          <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                        </span>
                      </div>
                      <div
                        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ backgroundColor: color }}
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
