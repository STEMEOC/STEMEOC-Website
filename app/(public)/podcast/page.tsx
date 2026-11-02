import type { Metadata } from "next";
import Link from "next/link";
import { getPodcastEpisodes } from "@/lib/content";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { EpisodePager } from "@/components/EpisodePager";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.podcast.metaTitle };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Layout follows the "Media Library" frame in Figma.
export default async function PodcastPage() {
  const [episodes, { dict }] = await Promise.all([getPodcastEpisodes(), getDictionary()]);
  const t = dict.podcast;
  // Newest first: the latest episode is featured at the top.
  const [latest, ...rest] = episodes;

  return (
    <PageTransition>
      <section className="container-site pb-16 pt-12 md:pb-24 md:pt-16">
        <Reveal className="text-center">
          <span className="inline-block rounded-full bg-orange px-4 py-1 text-xs font-bold text-white md:text-sm">{t.badge}</span>
          <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">{t.title}</h1>
        </Reveal>

        {latest && (
          <Reveal delay={0.1}>
            <article className="mt-12 grid items-center gap-8 rounded-3xl bg-white p-5 shadow-[0_30px_60px_-36px_rgb(5_19_59/0.55)] ring-1 ring-navy/10 md:mt-16 md:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div className="order-last lg:order-first">
                <span className="inline-block rounded-full bg-red px-3 py-0.5 text-xs font-bold text-white">
                  {t.episode} {pad(latest.order)}
                </span>
                <h2 className="mt-4 font-body text-xl font-bold md:text-2xl">{latest.title}</h2>
                <p className="mt-4 text-sm leading-relaxed md:text-justify md:text-base">{latest.description}</p>
              </div>
              <YouTubePlayer videoId={latest.videoId} title={latest.title} priority sizes="(max-width: 1024px) 100vw, 620px" />
            </article>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="mt-20 md:mt-24">
            <Reveal>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{t.moreEpisodes}</h2>
            </Reveal>
            <EpisodePager
              episodes={rest}
              labels={{ episode: t.episode, page: t.page, previous: t.previous, next: t.next }}
            />
          </div>
        )}
      </section>

      {/* Invite to be a guest */}
      <section className="container-site pb-24 md:pb-32">
        <Reveal className="relative mx-auto max-w-2xl pb-3 pr-3">
          <span aria-hidden className="absolute inset-0 left-3 top-3 rounded-3xl bg-navy" />
          <div className="relative rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-navy/10 md:px-12">
            <h2 className="font-display text-2xl font-bold">{t.guest.title}</h2>
            <p className="mx-auto mt-4 max-w-md text-base text-navy/70">{t.guest.body}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-10 items-center rounded-full bg-navy px-6 text-sm font-bold uppercase text-white press hover:-translate-y-0.5 hover:bg-blue"
            >
              {t.guest.cta}
            </Link>
          </div>
        </Reveal>
      </section>

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
