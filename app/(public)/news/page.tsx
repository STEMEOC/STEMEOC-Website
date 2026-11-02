import type { Metadata } from "next";
import Link from "next/link";
import { getNewsPosts, getPodcastEpisodes } from "@/lib/content";
import { NewsExplorer } from "@/components/NewsExplorer";
import { VideoGallery } from "@/components/VideoGallery";
import { QuestionsBand } from "@/components/QuestionsBand";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";

const VIDEOS = 4;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.news.metaTitle };
}

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const [allPosts, episodes, { dict }, params] = await Promise.all([
    getNewsPosts(),
    getPodcastEpisodes(),
    getDictionary(),
    searchParams,
  ]);

  // ?q= comes from the header search.
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const needle = query.toLowerCase();
  const posts = needle
    ? allPosts.filter((p) => `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(needle))
    : allPosts;
  const videos = episodes.slice(0, VIDEOS);

  return (
    <PageTransition>
      <section className="container-site pb-16 pt-12 md:pb-24 md:pt-16">
        {allPosts.length === 0 ? (
          <>
            <h1 className="text-center font-display text-3xl font-bold md:text-5xl">{dict.news.whatsNew}</h1>
            <p className="mt-8 text-center text-navy/60">{dict.news.empty}</p>
          </>
        ) : (
          <NewsExplorer
            key={query}
            posts={posts}
            dict={dict.news}
            common={dict.common}
            showFeatured={!query}
            notice={
              query && (
                <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-lg">
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

      {videos.length > 0 && (
        <section className="container-site pb-24 md:pb-32">
          <Reveal className="mb-10">
            <p className="text-sm font-semibold text-red md:text-base">{dict.news.watch}</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{dict.news.videos}</h2>
          </Reveal>
          <VideoGallery videos={videos} />
        </section>
      )}

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
