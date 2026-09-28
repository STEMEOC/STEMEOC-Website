import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/lib/i18n";
import { getHallOfFame } from "@/lib/hall-of-fame";
import { PageTransition } from "@/components/motion/PageTransition";
import { FadeUp, MaskText, PopIn, StaggerGroup } from "@/components/motion/Stagger";
import { HallOfFameExplorer } from "@/components/HallOfFameExplorer";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.hallOfFame.metaTitle, description: dict.hallOfFame.body };
}

const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export default async function HallOfFamePage() {
  const [{ entries, stage }, { dict }] = await Promise.all([getHallOfFame(), getDictionary()]);
  const h = dict.hallOfFame;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <StaggerGroup className="container-site relative flex flex-col items-center pb-12 pt-14 text-center md:pb-14 md:pt-20">
          <PopIn className="flex size-16 items-center justify-center rounded-full bg-orange text-navy shadow-[0_12px_30px_-10px_rgb(244_148_35/0.8)] md:size-20">
            <Trophy weight="fill" className="size-8 md:size-10" />
          </PopIn>
          <FadeUp className="mt-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            <span aria-hidden className="flex gap-1">
              {LOGO_COLORS.map((color) => (
                <span key={color} className="size-2 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </span>
            {h.eyebrow}
          </FadeUp>
          <h1 className="mt-5 max-w-5xl text-balance font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
            <MaskText>{h.title}</MaskText>
          </h1>
          <FadeUp className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">{h.body}</FadeUp>
        </StaggerGroup>

        {/* Winners on stage: award-ceremony photos drifting past. Hover to pause. */}
        {stage.length > 0 && (
          <div className="relative pb-14 md:pb-16" aria-label={h.onStage} role="region">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy to-transparent md:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy to-transparent md:w-32" />
            <ul
              className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused] md:gap-5"
              // About 4s per photo, so the strip drifts at the same pace however many there are.
              style={{ "--marquee-duration": `${stage.length * 4}s` } as React.CSSProperties}
            >
              {[...stage, ...stage].map((photo, i) => (
                <li key={`${photo.src}-${i}`} aria-hidden={i >= stage.length || undefined}>
                  <Link
                    href={photo.href}
                    tabIndex={i >= stage.length ? -1 : undefined}
                    className="group relative block h-44 w-64 overflow-hidden rounded-2xl bg-white/5 md:h-56 md:w-80"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="320px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent px-4 pb-3 pt-8 text-left text-xs font-bold uppercase tracking-wide text-white">
                      {photo.event}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Slanted navy tab leading into the winners */}
      <div className="relative overflow-x-clip">
        <div className="absolute inset-y-0 left-0 w-full bg-navy sm:w-[70%] sm:tab-slant-bottom lg:w-[45%] lg:[--slant:6rem]" />
        <div className="container-site relative flex items-baseline gap-4 py-5 text-white">
          <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">{h.timelineTitle}</h2>
          <span className="rounded-full bg-white px-3 py-0.5 text-sm font-bold text-navy">{entries.length}</span>
        </div>
      </div>

      <section className="container-site pb-20 pt-10 md:pb-28 md:pt-12">
        <HallOfFameExplorer
          entries={entries}
          labels={{
            program: h.program,
            year: h.year,
            all: h.all,
            allYears: h.allYears,
            teams: h.teams,
            viewEvent: h.viewEvent,
            empty: h.empty,
          }}
        />
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
