import type { Metadata } from "next";
import Link from "next/link";
import { getNewsPosts } from "@/lib/content";
import { NewsExplorer } from "@/components/NewsExplorer";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.news.metaTitle };
}

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const [allPosts, { dict }, params] = await Promise.all([getNewsPosts(), getDictionary(), searchParams]);

  // ?q= comes from the header search.
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const needle = query.toLowerCase();
  const posts = needle
    ? allPosts.filter((p) => `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(needle))
    : allPosts;

  return (
    <PageTransition>
      <section className="container-site pb-24 pt-12 md:pb-32 md:pt-16">
        {allPosts.length === 0 ? (
          <>
            <h1 className="font-display text-4xl font-bold uppercase md:text-6xl">{dict.news.metaTitle}</h1>
            <p className="mt-8 text-navy/60">{dict.news.empty}</p>
          </>
        ) : (
          <NewsExplorer
            key={query}
            posts={posts}
            dict={dict.news}
            common={dict.common}
            heading={dict.news.metaTitle}
            notice={
              query && (
                <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-lg">
                  <span>
                    {posts.length > 0 ? dict.news.searchResults : dict.news.searchEmpty} “<strong>{query}</strong>”
                  </span>
                  <Link href="/news" className="link-underline text-sm font-bold">
                    {dict.news.clearSearch}
                  </Link>
                </p>
              )
            }
          />
        )}
      </section>
    </PageTransition>
  );
}
