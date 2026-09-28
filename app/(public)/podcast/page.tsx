import type { Metadata } from "next";
import { getPodcastEpisodes } from "@/lib/content";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { FadeUp, MaskText, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.podcast.metaTitle };
}

const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

const episodeColor = (order: number) => LOGO_COLORS[(((order - 1) % 4) + 4) % 4];
const pad = (n: number) => String(n).padStart(2, "0");

export default async function PodcastPage() {
  const [episodes, { dict }] = await Promise.all([getPodcastEpisodes(), getDictionary()]);
  const t = dict.podcast;
  // Newest first: the latest episode is also featured in the hero.
  const latest = episodes[0];

  return (
    <PageTransition>
      {/* Hero, with the latest episode ready to play */}
      <section className="bg-navy text-white">
        <div className="container-site grid items-center gap-12 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24">
          <StaggerGroup>
            <FadeUp className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
              <span aria-hidden className="flex gap-1">
                {LOGO_COLORS.map((color) => (
                  <span key={color} className="size-2 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </span>
              {t.hero.eyebrow}
            </FadeUp>
            <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-none md:text-6xl xl:text-7xl">
              <MaskText>{t.hero.title}</MaskText>
            </h1>
            <FadeUp className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/85 md:text-lg">
              {t.hero.body}
            </FadeUp>
            <FadeUp className="mt-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold">
                <span className="size-2 animate-pulse rounded-full bg-red" aria-hidden />
                {episodes.length} {t.episodes}
              </span>
            </FadeUp>
          </StaggerGroup>

          {latest && (
            <StaggerGroup delay={0.15}>
              <StaggerItem>
                <YouTubePlayer
                  videoId={latest.videoId}
                  title={latest.title}
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                />
                <div className="mt-5 flex items-center gap-4">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-white"
                    style={{ backgroundColor: episodeColor(latest.order) }}
                  >
                    {pad(latest.order)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">{t.latest}</p>
                    <p className="truncate font-display text-xl font-bold md:text-2xl">{latest.title}</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerGroup>
          )}
        </div>
      </section>

      {/* Slanted navy tab joining the hero to the archive, holding the section title */}
      <div className="relative overflow-x-clip">
        <div className="absolute inset-y-0 left-0 w-full bg-navy sm:w-[70%] sm:tab-slant-bottom lg:w-[45%] lg:[--slant:6rem]" />
        <div className="container-site relative flex items-baseline gap-4 py-5 text-white">
          <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">{t.archive.eyebrow}</h2>
          <span className="rounded-full bg-white px-3 py-0.5 text-sm font-bold text-navy">{episodes.length}</span>
        </div>
      </div>

      {/* Archive */}
      <section className="container-site pb-24 pt-12 md:pb-32 md:pt-16">
        <p className="max-w-xl text-lg text-navy/70">{t.archive.title}</p>
        <StaggerGroup as="ul" className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {episodes.map((episode, i) => {
            const color = episodeColor(episode.order);
            return (
              <StaggerItem as="li" key={episode.id} wave={Math.floor(i / 3) + (i % 3)}>
                <article
                  id={`episode-${episode.order}`}
                  className="group flex h-full scroll-mt-32 flex-col"
                  style={{ "--accent": color } as React.CSSProperties}
                >
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                    <YouTubePlayer
                      videoId={episode.videoId}
                      title={episode.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color }}>
                      {t.episode} {pad(episode.order)}
                    </span>
                    {episode.tag && (
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold uppercase"
                        style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
                      >
                        {episode.tag}
                      </span>
                    )}
                    <span className="h-px flex-1 bg-navy/15 transition-colors duration-500 group-hover:bg-[var(--accent)]" aria-hidden />
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug md:text-2xl">{episode.title}</h3>
                  <p className="mt-2 line-clamp-3 text-base leading-relaxed text-navy/70">{episode.description}</p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/contact"
      />
    </PageTransition>
  );
}
