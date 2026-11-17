import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, DownloadSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { getProgramBySlug, getPrograms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { programLogo } from "@/lib/brand";
import { PROGRAM_PAGES, getProgramEvent } from "@/lib/program-pages";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { StatBoxes } from "@/components/StatBoxes";
import { PastEvents } from "@/components/PastEvents";
import { ChampionTabs } from "@/components/ChampionTabs";
import { PhotoStack } from "@/components/PhotoStack";
import { PhotoScroller } from "@/components/PhotoScroller";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { EventSponsors } from "@/components/EventSponsors";
import { MoreProjects } from "@/components/MoreProjects";
import { QuestionsBand } from "@/components/QuestionsBand";

// participation bars, logo colors
const BAR_COLORS = ["bg-red", "bg-green", "bg-orange", "bg-blue"];

const ACCENTS = {
  blue: { bg: "bg-blue", text: "text-blue" },
  red: { bg: "bg-red", text: "text-red" },
};

export async function generateMetadata({ params }: PageProps<"/projects/[slug]/[event]">): Promise<Metadata> {
  const { slug, event: eventSlug } = await params;
  const event = getProgramEvent(slug, eventSlug);
  if (!event) return {};
  return { title: event.title, description: event.summary };
}

// One edition of a program (CRO 2026, the 18th STEM Festival...), laid out
// like the "Annual Report landing page" frame in Figma. Content lives in
// lib/program-pages.ts; sections without data are left out.
export default async function ProgramEventPage({ params }: PageProps<"/projects/[slug]/[event]">) {
  const { slug, event: eventSlug } = await params;
  const page = PROGRAM_PAGES[slug];
  const event = getProgramEvent(slug, eventSlug);
  if (!page || !event) notFound();

  const [program, programs, { dict }] = await Promise.all([getProgramBySlug(slug), getPrograms(), getDictionary()]);
  if (!program) notFound();

  const t = dict.projects;
  const e = t.event;
  const accent = ACCENTS[page.accent ?? "blue"];
  const logo = programLogo(program);
  const others = (page.events ?? []).filter((x) => x.slug !== event.slug);
  const body = event.body ?? [event.summary];
  // Real photos (not posters), falling back to the award-ceremony ones.
  const photos = [...(event.photos ?? []), ...(event.winners?.photos ?? [])].filter(
    (p) => !p.contain && p.src !== event.image,
  );
  const stackPhotos = photos.slice(0, 3);
  // hero images
  const heroPhoto = event.hero ?? (event.image && !event.imageContain ? event.image : photos[0]?.src);
  const heroCard = heroPhoto ? (event.imageContain ? event.image : undefined) : (event.image ?? logo);
  const maxCount = Math.max(...(event.participation ?? []).map((p) => p.count), 1);
  const totalCount = Math.max((event.participation ?? []).reduce((sum, p) => sum + p.count, 0), 1);

  return (
    <PageTransition>
      {/* Hero */}
      <section
        className={`relative -mt-(--header-h) overflow-hidden pt-(--header-h) ${heroPhoto ? "bg-navy text-white" : "bg-paper text-navy"}`}
      >
        {heroPhoto && (
          <>
            <Image src={heroPhoto} alt="" fill priority sizes="100vw" className="object-cover" />
            {/* scrim */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(5_19_59/0.88),rgb(5_19_59/0.6)_55%,rgb(5_19_59/0.35))]" />
          </>
        )}
        <div
          className={`container-site relative grid items-center gap-10 pb-24 pt-10 md:pb-28 md:pt-14 lg:gap-16 ${
            heroCard ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
          } ${heroPhoto ? "min-h-[min(75svh,46rem)]" : ""}`}
        >
          <Reveal>
            <Link
              href={`/projects/${slug}`}
              className={`group inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                heroPhoto ? "text-white/80 hover:text-white" : "text-navy/70 hover:text-navy"
              }`}
            >
              <ArrowLeft size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
              {e.back}
            </Link>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl">{event.title}</h1>
            <p className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${heroPhoto ? "text-white/90" : "text-navy/85"}`}>
              {event.summary}
            </p>
            {event.reportUrl && (
              <a
                href={event.reportUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-8 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold press hover:-translate-y-0.5 ${
                  heroPhoto ? "bg-white text-navy hover:bg-white/90" : "bg-navy text-white hover:bg-blue"
                }`}
              >
                <DownloadSimple size={18} weight="bold" />
                {e.downloadReport}
              </a>
            )}
          </Reveal>
          {heroCard && (
            <Reveal delay={0.15} className="flex justify-center lg:justify-end">
              <div
                className={`relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_50px_-30px_rgb(5_19_59/0.5)] ${
                  event.image && !event.imageContain ? "aspect-[4/3] max-w-xl" : "aspect-square max-w-md"
                }`}
              >
                <Image
                  src={heroCard}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className={event.image && !event.imageContain ? "object-cover" : "object-contain p-3"}
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Key numbers, pulled up over the hero */}
      {event.stats && event.stats.length > 0 && (
        <div className="container-site relative z-10 -mt-14">
          <StatBoxes stats={event.stats} className="max-w-3xl [&>div]:shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)]" />
        </div>
      )}

      {/* Overview */}
      <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-24">
        <Reveal>
          <p className={`text-sm font-semibold md:text-base ${accent.text}`}>{t.festival.aboutEvent}</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{t.overview}</h2>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold md:text-sm">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 px-3 py-1">
              <CalendarBlank size={14} weight="bold" className={accent.text} />
              {event.date}
            </li>
            {event.venue && (
              <li className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 px-3 py-1">
                <MapPin size={14} weight="bold" className="text-green" />
                {event.venue}
              </li>
            )}
          </ul>
          <div className="mt-6 space-y-4 text-base leading-relaxed md:text-justify md:text-lg">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
        {stackPhotos.length > 0 && (
          <Reveal delay={0.1} className="mx-auto w-full max-w-md lg:mr-0">
            <PhotoStack photos={stackPhotos} label={e.nextPhoto} />
          </Reveal>
        )}
      </section>

      {/* Participation */}
      {event.participation && event.participation.length > 0 && (
        <section className="container-site grid gap-10 pb-16 md:pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <p className={`text-sm font-semibold md:text-base ${accent.text}`}>{e.participation}</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{e.whoTookPart}</h2>
            <p className="mt-8 font-display text-6xl font-extrabold tabular-nums md:text-7xl">{totalCount.toLocaleString("en-US")}</p>
            {event.participationUnit && (
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-navy/60">{e.countUnits[event.participationUnit]}</p>
            )}
          </Reveal>
          <dl className="border-b border-navy/15">
            {event.participation.map((row, i) => (
              <Reveal key={row.category} scroll={i * 0.06} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t border-navy/15 py-5">
                <dt className="font-semibold md:text-lg">{row.category}</dt>
                <dd className="flex items-baseline gap-3">
                  <span className="text-sm tabular-nums text-navy/50">{Math.round((row.count / totalCount) * 100)}%</span>
                  <span className="font-display text-2xl font-extrabold tabular-nums md:text-3xl">{row.count.toLocaleString("en-US")}</span>
                </dd>
                <div aria-hidden className="col-span-2 mt-3 h-2 bg-navy/[0.06]">
                  <span className={`block h-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${(row.count / maxCount) * 100}%` }} />
                </div>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      {/* Champions */}
      {event.winners && (
        <section className="bg-paper py-16 md:mx-6 md:py-24 lg:mx-10">
          <div className="container-site">
            <Reveal className="mb-10 text-center">
              <p className="text-sm font-semibold text-red md:text-base">{e.winners}</p>
              <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{e.champions}</h2>
            </Reveal>
            <ChampionTabs groups={event.winners.groups} />
            {event.winners.awards && (
              <Reveal className="mx-auto mt-16 max-w-4xl">
                <h3 className="font-display text-xl font-bold md:text-2xl">{e.awardsPresented}</h3>
                <dl className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
                  {event.winners.awards.map((award) => (
                    <div key={award.name} className="grid gap-1 py-4 md:grid-cols-[1fr_1fr] md:gap-8">
                      <dt className="font-bold">{award.name}</dt>
                      <dd className="text-navy/75">{award.presenter}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </section>
      )}
      {event.winners?.intro && (
        <Reveal className="container-site pt-12">
          <p className="mx-auto max-w-2xl rounded-2xl border-2 border-red px-6 py-4 text-center text-sm font-medium md:text-base">
            {event.winners.intro}
          </p>
        </Reveal>
      )}

      {/* Moments */}
      {(event.video || photos.length > 0) && (
        <section className="container-site py-16 md:py-24">
          <Reveal className="mb-10 text-center md:mb-14">
            <p className="text-sm font-semibold text-red md:text-base">{e.highlight}</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{e.moments}</h2>
          </Reveal>
          <div className={`grid gap-6 ${event.video && photos.length > 0 ? "lg:grid-cols-[3fr_1fr]" : ""}`}>
            {event.video && (
              <Reveal>
                <div className="relative pb-3 pl-3">
                  <span aria-hidden className={`absolute inset-0 right-3 top-3 rounded-2xl ${accent.bg}`} />
                  <div className="relative">
                    <YouTubePlayer videoId={event.video} title={event.title} sizes="(max-width: 1024px) 100vw, 900px" />
                  </div>
                </div>
                <p className="mt-4 font-bold">{event.title}</p>
              </Reveal>
            )}
            <PhotoScroller
              photos={photos}
              vertical={Boolean(event.video)}
              labels={{ open: e.openPhoto, prev: e.prevPhoto, next: e.nextPhoto, close: e.closePhoto }}
            />
          </div>
        </section>
      )}

      {/* Partners */}
      {event.sponsors && event.sponsors.length > 0 && (
        <section className="container-site pb-16 md:pb-24">
          <Reveal>
            <h2 className="mx-auto mb-12 max-w-2xl text-center font-display text-3xl font-bold md:mb-16 md:text-4xl">{e.thanks}</h2>
            <EventSponsors groups={event.sponsors} />
          </Reveal>
        </section>
      )}

      <PastEvents programSlug={slug} events={others} title={t.festival.previousEvents} logo={logo} />

      <MoreProjects
        title={t.moreProjects}
        detailLabel={dict.home.landing.detail}
        labels={{ prev: dict.home.landing.prevPrograms, next: dict.home.landing.nextPrograms }}
        programs={programs.filter((p) => p.id !== program.id)}
      />

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
