import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProgramPage } from "@/lib/program-pages";
import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { StatBoxes } from "@/components/StatBoxes";
import { PastEvents } from "@/components/PastEvents";
import { AboutTabs } from "@/components/AboutTabs";
import { MoreProjects } from "@/components/MoreProjects";
import { QuestionsBand } from "@/components/QuestionsBand";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { HighlightReel } from "@/components/HighlightReel";
import { CATEGORY_ICONS, externalProps } from "@/components/ProgramCategories";

type Program = { id: string; slug: string; title: string; coverImageUrl: string | null };

const ACCENTS = {
  blue: { bg: "bg-blue", text: "text-blue" },
  red: { bg: "bg-red", text: "text-red" },
};

/**
 * Layout from the "STEM Festival" and "CRO" landing page frames in Figma:
 * hero, overview with stats, program cards, highlight videos, past editions.
 */
export function ProgramLanding({
  program,
  page,
  logo,
  others,
  gallery,
  dict,
}: {
  program: Program;
  page: ProgramPage;
  logo: string | null;
  others: Program[];
  gallery: ReactNode;
  dict: Dictionary;
}) {
  const t = dict.projects;
  const f = t.festival;
  const events = page.events ?? [];
  const accent = ACCENTS[page.accent ?? "blue"];
  const single = page.sections.length === 1;

  const overview = (
    <>
      <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-24">
        <Reveal>
          <p className={`text-sm font-semibold md:text-base ${accent.text}`}>{f.aboutEvent}</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{page.whatIsTitle}</h2>
          <p className="mt-6 text-base leading-relaxed md:text-justify md:text-lg">{page.whatIs}</p>
          <StatBoxes stats={page.stats} className="mt-10" />
        </Reveal>
        <Reveal delay={0.1} className="relative pb-4 pr-4">
          <span aria-hidden className={`absolute inset-0 left-4 top-4 rounded-2xl ${accent.bg}`} />
          <div className="relative">
            {page.video ? (
              <YouTubePlayer videoId={page.video} title={program.title} />
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-placeholder shadow-lg">
                <Image src={page.overviewImage} alt="" fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" />
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {page.sections.some((section) => section.categories.length > 0) && (
        <div id="programs" className="scroll-mt-32 bg-paper py-16 md:mx-6 md:py-24 lg:mx-10">
          {page.sections.map((section, si) => {
            const right = !single && si % 2 === 1;
            return (
              <section key={section.title} className={si > 0 ? "mt-16 md:mt-24" : ""}>
                <Reveal className={`container-site ${single ? "text-center" : right ? "md:text-right" : ""}`}>
                  <h2 className={`font-display text-3xl font-bold md:text-4xl ${single ? "" : "uppercase"}`}>{section.title}</h2>
                  <p className={`mt-4 max-w-2xl text-base text-navy/75 md:text-lg ${single ? "mx-auto" : right ? "md:ml-auto" : ""}`}>
                    {section.intro}
                  </p>
                </Reveal>
                <ul className="container-site mt-10 flex snap-x snap-mandatory scroll-px-(--gutter) gap-5 overflow-x-auto pb-6 scrollbar-rail md:mt-12 md:gap-6">
                  {section.categories.map((item, i) => {
                    const Icon = CATEGORY_ICONS[item.icon];
                    const href = item.registerUrl ?? item.learnMoreUrl;
                    const more = item.registerUrl ? item.learnMoreUrl : undefined;
                    return (
                      <li key={item.name} className="w-72 shrink-0 snap-start md:w-80 lg:w-[calc((100%-3rem)/3)] lg:min-w-80">
                        <Reveal scroll={(i % 4) * 0.12} className="h-full">
                          <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)] ring-1 ring-navy/10">
                            <div className="relative aspect-[4/3.4] overflow-hidden bg-navy/[0.04]">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt=""
                                  fill
                                  sizes="(max-width: 1024px) 320px, 420px"
                                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <Icon size={72} weight="duotone" className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                                </span>
                              )}
                              {item.fee && (
                                <span className="absolute right-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">{item.fee}</span>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                              <h3 className="font-body text-lg font-bold">{item.name}</h3>
                              <p className="mt-1 flex-1 text-sm leading-relaxed text-navy/70">{item.description}</p>
                              {href && (
                                <div className="mt-5 flex items-center justify-between">
                                  <Link
                                    href={href}
                                    {...externalProps(href)}
                                    className="rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white press hover:-translate-y-0.5 hover:bg-blue"
                                  >
                                    {item.registerUrl ? t.register : dict.common.learnMore}
                                  </Link>
                                  {more ? (
                                    <Link
                                      href={more}
                                      {...externalProps(more)}
                                      aria-label={`${dict.common.learnMore}: ${item.name}`}
                                      className="p-1 press"
                                    >
                                      <ArrowUpRight size={20} weight="bold" className="rotate-90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                                    </Link>
                                  ) : (
                                    <ArrowUpRight aria-hidden size={20} weight="bold" className="rotate-90" />
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        </Reveal>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {events.some((e) => e.video) && (
        <section className={`bg-navy py-16 text-white md:py-24 ${page.sections.some((section) => section.categories.length > 0) ? "mt-16 md:mt-24" : ""}`}>
          <div className="container-site">
            <Reveal className="mb-10 text-center md:mb-14">
              <p className="text-sm font-semibold text-orange md:text-base">{f.watch}</p>
              <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{f.highlight}</h2>
            </Reveal>
            <HighlightReel
              items={events.filter((e) => e.video).slice(0, 4).map((e) => ({ year: e.year, title: e.title, image: (e.imageContain && e.photos?.find((p) => !p.contain)?.src) || e.image, video: e.video }))}
            />
          </div>
        </section>
      )}

      <PastEvents programSlug={program.slug} events={events} title={f.previousEvents} logo={logo} />
    </>
  );

  return (
    <>
      {/* Hero */}
      <section className="-mt-(--header-h) bg-paper pt-(--header-h) text-navy">
        <div className="container-site grid items-center gap-10 pb-32 pt-14 md:pb-36 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <Reveal>
            <h1 className="max-w-2xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              {page.heroTitle ?? program.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy/85 md:text-lg">{page.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-navy/20 bg-white px-6 text-sm font-bold text-navy press hover:-translate-y-0.5"
              >
                {dict.home.landing.exploreAllPrograms}
                <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex h-11 items-center rounded-full bg-blue px-6 text-sm font-bold text-white press hover:-translate-y-0.5 hover:bg-blue-deep"
              >
                {dict.common.getInvolved}
              </Link>
            </div>
          </Reveal>
          {logo && (
            <Reveal delay={0.15} className="flex justify-center lg:justify-end">
              <Image src={logo} alt={program.title} width={900} height={400} priority className="h-auto max-h-56 w-full max-w-md object-contain" />
            </Reveal>
          )}
        </div>
      </section>

      {/* Tab strip pulled up into the hero */}
      <div className="relative z-10 -mt-20 md:-mt-24">
        <AboutTabs
          light
          activeTone={accent.bg}
          tabs={[
            { id: "overview", label: f.eventOverview, content: overview },
            { id: "gallery", label: f.gallery, content: gallery },
          ]}
        />
      </div>

      <MoreProjects title={t.moreProjects} detailLabel={dict.home.landing.detail} labels={{ prev: dict.home.landing.prevPrograms, next: dict.home.landing.nextPrograms }} programs={others} />

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </>
  );
}
