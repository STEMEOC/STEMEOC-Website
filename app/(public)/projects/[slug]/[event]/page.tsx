import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarBlank, DownloadSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { getProgramBySlug, getPrograms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PARTNERS, programLogo } from "@/lib/brand";
import { PROGRAM_PAGES, getProgramEvent } from "@/lib/program-pages";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { StatBoxes } from "@/components/StatBoxes";
import { PastEvents } from "@/components/PastEvents";
import { ChampionTabs } from "@/components/ChampionTabs";
import { PhotoStack } from "@/components/PhotoStack";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { PartnerLogos } from "@/components/PartnerLogos";
import { ProjectsBand } from "@/components/ProjectsBand";
import { QuestionsBand } from "@/components/QuestionsBand";

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
  const sidePhotos = photos.slice(3, 6);
  const maxCount = Math.max(...(event.participation ?? []).map((p) => p.count), 1);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="-mt-(--header-h) bg-navy pt-(--header-h) text-white">
        <div className="container-site grid items-center gap-10 pb-24 pt-10 md:pb-28 md:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <Link
              href={`/projects/${slug}`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
              {e.back}
            </Link>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl">{event.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{event.summary}</p>
            {event.reportUrl && (
              <a
                href={event.reportUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-navy press hover:-translate-y-0.5 hover:bg-paper"
              >
                <DownloadSimple size={18} weight="bold" />
                {e.downloadReport}
              </a>
            )}
          </Reveal>
          {(event.image ?? logo) && (
            <Reveal delay={0.15} className="flex justify-center lg:justify-end">
              <div
                className={`relative w-full overflow-hidden rounded-2xl bg-white ${
                  event.image && !event.imageContain ? "aspect-[4/3] max-w-xl" : "aspect-[4/3] max-w-md"
                }`}
              >
                <Image
                  src={event.image ?? logo!}
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
          <StatBoxes stats={event.stats} className="[&>div]:shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)]" />
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
          <Reveal delay={0.1}>
            <PhotoStack photos={stackPhotos} label={e.nextPhoto} />
          </Reveal>
        )}
      </section>

      {/* Participation */}
      {event.participation && event.participation.length > 0 && (
        <section className="container-site pb-16 md:pb-24">
          <Reveal>
            <p className={`text-sm font-semibold md:text-base ${accent.text}`}>{e.participation}</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{e.whoTookPart}</h2>
          </Reveal>
          <dl className="mt-10 max-w-4xl space-y-5">
            {event.participation.map((row, i) => (
              <Reveal key={row.category} scroll={i * 0.06} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-4 md:grid-cols-[12rem_1fr_3rem]">
                <dt className="text-sm md:text-base">{row.category}</dt>
                <dd className="h-3 overflow-hidden rounded-full bg-navy/10">
                  <span className="block h-full rounded-full bg-navy" style={{ width: `${(row.count / maxCount) * 100}%` }} />
                </dd>
                <dd className="text-right font-bold">{row.count}</dd>
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
      {(event.video || sidePhotos.length > 0) && (
        <section className="container-site py-16 md:py-24">
          <Reveal className="mb-10 text-center md:mb-14">
            <p className="text-sm font-semibold text-red md:text-base">{e.highlight}</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{e.moments}</h2>
          </Reveal>
          <div className={`grid gap-6 ${event.video && sidePhotos.length > 0 ? "lg:grid-cols-[3fr_1fr]" : ""}`}>
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
            {sidePhotos.length > 0 && (
              <ul className={`grid gap-4 ${event.video ? "grid-cols-3 lg:grid-cols-1 lg:content-start" : "sm:grid-cols-3"}`}>
                {sidePhotos.map((photo, i) => (
                  <li key={photo.src}>
                    <Reveal scroll={i * 0.1}>
                      <div className="group relative aspect-video overflow-hidden rounded-xl bg-placeholder">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 1024px) 33vw, 300px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Partners */}
      <section className="container-site pb-16 md:pb-24">
        <Reveal>
          <h2 className="mb-10 text-center text-base font-semibold text-navy/70 md:mb-12 md:text-lg">{e.thanks}</h2>
          <PartnerLogos partners={PARTNERS} />
        </Reveal>
      </section>

      <PastEvents programSlug={slug} events={others} title={t.festival.previousEvents} logo={logo} />

      <div className="pt-8">
        <ProjectsBand
          title={t.moreProjects}
          detailLabel={dict.home.landing.detail}
          programs={programs.filter((p) => p.id !== program.id)}
        />
      </div>

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
