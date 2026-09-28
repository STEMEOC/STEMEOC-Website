"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, Newspaper } from "@phosphor-icons/react/dist/ssr";
import { deleteNews } from "@/lib/actions/news";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string | null;
  published: boolean;
  /** ISO strings: dates can't cross the server/client boundary as Date objects. */
  publishedAt: string | null;
  updatedAt: string;
};

type Filter = "all" | "published" | "draft";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

function relative(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return dateFormat.format(new Date(iso));
}

function Thumb({ src }: { src: string | null }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy/5 text-navy/25">
      {src && !broken ? (
        // Plain <img>: cover URLs may be on any host, which next/image would reject.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      ) : (
        <Newspaper size={20} weight="duotone" />
      )}
    </span>
  );
}

export function NewsTable({ posts }: { posts: NewsRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.published).length,
      draft: posts.filter((p) => !p.published).length,
    }),
    [posts]
  );

  const q = query.trim().toLowerCase();
  const shown = posts.filter(
    (p) =>
      (filter === "all" || (filter === "published") === p.published) &&
      (!q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );

  const tabs: [Filter, string][] = [
    ["all", "All"],
    ["published", "Published"],
    ["draft", "Drafts"],
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-3 border-b border-ink/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-1 self-start rounded-full bg-ink/5 p-1" role="tablist" aria-label="Filter by status">
          {tabs.map(([key, label]) => {
            const on = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors sm:px-4 ${
                  on ? "bg-white text-navy shadow-sm" : "text-ink/55 hover:text-ink"
                }`}
              >
                {label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${on ? "bg-navy text-white" : "bg-ink/10"}`}>
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search posts</span>
          <MagnifyingGlass size={16} weight="bold" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or category…"
            className="h-10 w-full rounded-full bg-white pl-10 pr-4 text-sm ring-1 ring-ink/10 outline-none transition-shadow placeholder:text-ink/40 focus:ring-2 focus:ring-blue"
          />
        </label>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink/45">
          <tr>
            <th className="py-3 pl-4 font-bold sm:px-6">Post</th>
            <th className="hidden px-4 py-3 font-bold md:table-cell">Status</th>
            <th className="hidden px-4 py-3 font-bold lg:table-cell">Date</th>
            <th className="px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.map((post) => {
            const editHref = `/admin/news/${post.id}/edit`;
            return (
              <tr key={post.id} className="group border-t border-ink/5 transition-colors hover:bg-blue/[0.04]">
                <td className="max-w-0 py-3 pl-4 pr-2 sm:px-6">
                  <Link href={editHref} className="flex items-center gap-3 sm:gap-4">
                    <Thumb src={post.coverImageUrl} />
                    <span className="min-w-0">
                      <span className="line-clamp-2 font-bold leading-snug text-ink transition-colors group-hover:text-blue md:line-clamp-none md:truncate">
                        {post.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-ink/50">
                        <span className="shrink-0 rounded-md bg-ink/5 px-1.5 py-0.5 font-semibold text-ink/60">
                          {post.category}
                        </span>
                        <span className="hidden truncate sm:inline">{post.excerpt}</span>
                      </span>
                      <span className="mt-1.5 block md:hidden">
                        <StatusPill active={post.published} onLabel="Published" offLabel="Draft" />
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="hidden w-36 px-4 py-3 md:table-cell">
                  <StatusPill active={post.published} onLabel="Published" offLabel="Draft" />
                </td>
                <td className="hidden w-44 px-4 py-3 lg:table-cell">
                  <span className="block font-semibold text-ink/75 tabular-nums">
                    {post.publishedAt ? dateFormat.format(new Date(post.publishedAt)) : "Not published"}
                  </span>
                  <span className="block text-xs text-ink/45">Edited {relative(post.updatedAt)}</span>
                </td>
                <td className="w-px py-3 pl-0 pr-3 sm:px-6">
                  <RowActions
                    editHref={editHref}
                    onDelete={deleteNews.bind(null, post.id)}
                    copyPath={post.published ? `/news/${post.slug}` : undefined}
                    deleteLabel={post.title}
                  />
                </td>
              </tr>
            );
          })}
          {shown.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-14 text-center text-ink/50">
                {posts.length === 0 ? "No news posts yet." : "No posts match your search."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
