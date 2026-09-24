import type { Metadata } from "next";
import { getPodcastEpisodes } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.podcast.metaTitle };
}

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export default async function PodcastPage() {
  const [episodes, { dict }] = await Promise.all([getPodcastEpisodes(), getDictionary()]);

  return (
    <PageTransition>
      {/* Hero: dark navy backdrop matching the rest of the site */}
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.podcast.hero.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.podcast.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {dict.podcast.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Archive: alternating rows, most recent first */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="font-mono-label text-xs uppercase text-ink/40">{dict.podcast.archive.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {dict.podcast.archive.title}
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {episodes.map((episode, i) => {
              const color = ACCENT_COLORS[(episode.order - 1) % ACCENT_COLORS.length];
              const reversed = episode.order % 2 === 1;
              return (
                <Reveal key={episode.id} delay={i * 0.04}>
                  <div
                    className="rounded-[2rem] bg-paper p-4 md:p-6"
                    style={{ boxShadow: `inset 0 0 0 1.5px color-mix(in srgb, ${color} 35%, transparent)` }}
                  >
                    <div
                      className={`grid items-center gap-8 md:grid-cols-2 ${
                        reversed ? "md:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      <YouTubePlayer videoId={episode.videoId} title={episode.title} />
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-paper"
                            style={{ backgroundColor: color }}
                          >
                            {String(episode.order).padStart(2, "0")}
                          </span>
                          {episode.tag && (
                            <span
                              className="font-mono-label rounded-full px-3 py-1 text-[10px] uppercase"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                                color,
                              }}
                            >
                              {episode.tag}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight md:text-2xl">
                          {episode.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink/65">{episode.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
