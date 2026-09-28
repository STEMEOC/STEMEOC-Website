import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { getProgramBySlug } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { programLogo, programLogoIsMonochrome } from "@/lib/brand";
import { PROGRAM_PAGES, getProgramEvent } from "@/lib/program-pages";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { ProgramCategories } from "@/components/ProgramCategories";
import { EventCards } from "@/components/EventCards";
import { EventWinners } from "@/components/EventWinners";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]/[event]">): Promise<Metadata> {
  const { slug, event: eventSlug } = await params;
  const event = getProgramEvent(slug, eventSlug);
  if (!event) return {};
  return { title: event.title, description: event.summary };
}

// One edition of a program (CRO 2025, the 18th STEM Festival...). Content
// lives in lib/program-pages.ts next to the program it belongs to.
export default async function ProgramEventPage({ params }: PageProps<"/projects/[slug]/[event]">) {
  const { slug, event: eventSlug } = await params;
  const page = PROGRAM_PAGES[slug];
  const event = getProgramEvent(slug, eventSlug);
  if (!page || !event) notFound();

  const [program, { dict }] = await Promise.all([getProgramBySlug(slug), getDictionary()]);
  if (!program) notFound();

  const t = dict.projects;
  const logo = programLogo(program);
  const programTitle = page.heroTitle ?? program.title;
  const others = (page.events ?? []).filter((e) => e.slug !== event.slug);
  // The hero already shows the main image; don't repeat it below.
  const allPhotos = (event.photos ?? []).filter((p) => p.src !== event.image);
  // Up to three real photos (not posters) sit under the overview text. An
  // edition with none of its own borrows its award-ceremony photos, which the
  // winners section below then leaves out so nothing shows twice.
  const ownPhotos = allPhotos.filter((p) => !p.contain);
  const overviewPhotos = (ownPhotos.length > 0 ? ownPhotos : (event.winners?.photos ?? [])).slice(0, 3);
  const shown = new Set(overviewPhotos.map((p) => p.src));
  const winners = event.winners && { ...event.winners, photos: event.winners.photos?.filter((p) => !shown.has(p.src)) };
  const categoryImages = Object.fromEntries(
    page.sections.flatMap((s) => s.categories).flatMap((c) => (c.image ? [[c.name.toLowerCase(), c.image]] : [])),
  );
  const body = event.body ?? [event.summary];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container-site grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20">
          <Reveal>
            <Link
              href={`/projects/${slug}`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
              {t.backTo} {programTitle}
            </Link>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              {event.title}
            </h1>
            <ul className="mt-6 flex flex-wrap gap-2.5 text-sm font-semibold">
              <li className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5">
                <CalendarBlank size={16} weight="bold" />
                {event.date}
              </li>
              {event.venue && (
                <li className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5">
                  <MapPin size={16} weight="bold" />
                  {event.venue}
                </li>
              )}
            </ul>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{event.summary}</p>
          </Reveal>
          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            {event.image ? (
              <div
                className={`relative w-full max-w-xl overflow-hidden rounded-[1.875rem] ${
                  event.imageContain ? "aspect-square max-w-xs md:max-w-md" : "aspect-[4/3] bg-white/5"
                }`}
              >
                <Image
                  src={event.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className={event.imageContain ? "object-contain" : "object-cover"}
                />
              </div>
            ) : (
              logo && (
                <Image
                  src={logo}
                  alt={program.title}
                  width={900}
                  height={400}
                  priority
                  className={`h-auto max-h-64 w-full max-w-md object-contain ${
                    programLogoIsMonochrome(program) ? "brightness-0 invert" : ""
                  }`}
                />
              )
            )}
          </Reveal>
        </div>
      </section>

      {/* Story + key facts */}
      <section className="container-site grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-20 lg:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t.overview}</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed md:text-lg">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {overviewPhotos.length > 0 && (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {overviewPhotos.map((photo, i) => (
                <li key={photo.src} className={i === 2 ? "col-span-2 sm:col-span-1" : ""}>
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-placeholder">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {event.stats && event.stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-navy/15 pt-10 sm:grid-cols-3">
              {event.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm font-light md:text-base">{stat.label}</dt>
                  <dd className="font-body text-4xl font-extrabold md:text-5xl">
                    <StatCounter value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="rounded-2xl bg-navy p-6 text-white md:p-8 lg:sticky lg:top-32">
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-white/60">{t.date}</dt>
                <dd className="mt-1 text-lg font-semibold">{event.date}</dd>
              </div>
              {event.venue && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-white/60">{t.venue}</dt>
                  <dd className="mt-1 text-lg font-semibold">{event.venue}</dd>
                </div>
              )}
            </dl>
            {event.highlights && event.highlights.length > 0 && (
              <ul className="mt-6 space-y-3 border-t border-white/20 pt-6 text-sm leading-relaxed md:text-base">
                {event.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-white/70" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </Reveal>
      </section>

      {winners && (
        <EventWinners
          winners={winners}
          title={t.winners}
          teamsLabel={t.winningTeams}
          categoryImages={categoryImages}
        />
      )}

      {event.showCategories && (
        <ProgramCategories
          sections={page.sections}
          labels={{ learnMore: dict.common.learnMore, register: t.register }}
          hideLearnMore
        />
      )}

      <EventCards
        programSlug={slug}
        events={others}
        title={t.moreEvents}
        viewLabel={t.viewEvent}
        logo={logo}
      />
    </PageTransition>
  );
}
