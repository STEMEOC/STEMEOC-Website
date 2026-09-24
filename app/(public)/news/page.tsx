import type { Metadata } from "next";
import { getNewsPosts } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { NewsExplorer } from "@/components/NewsExplorer";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.news.metaTitle };
}

export default async function NewsPage() {
  const [posts, { dict }] = await Promise.all([getNewsPosts(), getDictionary()]);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.news.hero.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.news.hero.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-20 pt-6">
        <div className="mx-auto max-w-6xl px-6">
          {posts.length === 0 ? (
            <p className="text-ink/60">{dict.news.empty}</p>
          ) : (
            <NewsExplorer posts={posts} dict={dict.news} common={dict.common} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}
