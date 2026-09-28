import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProgramBySlug, getPrograms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { programLogo, programLogoIsMonochrome } from "@/lib/brand";
import { PROGRAM_PAGES } from "@/lib/program-pages";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { AboutTabs } from "@/components/AboutTabs";
import { ProjectsBand } from "@/components/ProjectsBand";
import { ProgramCategories, externalProps } from "@/components/ProgramCategories";
import { EventCards } from "@/components/EventCards";

const pillButton =
  "inline-flex h-12 items-center justify-center rounded-3xl border-[3px] border-white px-7 font-body text-sm font-bold uppercase press md:h-13 md:min-w-48 md:text-base";

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** First sentence or two of a description, for the hero. */
function summarize(text: string, max = 240) {
  const first = paragraphs(text)[0] ?? "";
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const end = cut.lastIndexOf(". ");
  return end > 80 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [program, { dict }] = await Promise.all([getProgramBySlug(slug), getDictionary()]);
  if (!program) return { title: dict.projects.metaTitle };
  const page = PROGRAM_PAGES[slug];
  return { title: page?.heroTitle ?? program.title, description: page?.summary ?? summarize(program.description, 160) };
}

// Layout follows the "CRO landing page" frame in Figma. Program-specific
// sections (stats, categories, photos) come from lib/program-pages.ts.
export default async function ProgramPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [program, programs, { dict }] = await Promise.all([getProgramBySlug(slug), getPrograms(), getDictionary()]);
  if (!program) notFound();

  const page = PROGRAM_PAGES[slug];
  const t = dict.projects;
  const logo = programLogo(program);
  const title = page?.heroTitle ?? program.title;
  const summary = page?.summary ?? summarize(program.description);
  const whatIs = page ? [page.whatIs] : paragraphs(program.description);
  const overviewImage = page?.overviewImage ?? program.coverImageUrl;
  const photos = page?.photos ?? [];
  const others = programs.filter((p) => p.id !== program.id);

  const overview = (
    <section className="container-site grid items-center gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
      <Reveal className="relative aspect-[672/686] overflow-hidden rounded-[1.875rem] bg-placeholder">
        {overviewImage && (
          <Image
            src={overviewImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        )}
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{page?.whatIsTitle ?? t.aboutProgram}</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed md:text-justify md:text-lg">
          {whatIs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {page && page.stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-3 gap-4 text-center">
            {page.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-xs font-light md:text-base">{stat.label}</dt>
                <dd className="font-body text-4xl font-extrabold md:text-5xl">
                  <StatCounter value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Reveal>
    </section>
  );

  const gallery = (
    <section className="container-site py-16 lg:py-24">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <Reveal scroll={(i % 3) * 0.16}>
              <div className={`group relative aspect-[4/3] overflow-hidden rounded-2xl ${photo.contain ? "bg-paper" : "bg-placeholder"}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
                  className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                    photo.contain ? "object-contain p-2" : "object-cover"
                  }`}
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container-site grid items-center gap-10 pb-12 pt-14 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-24">
          <Reveal>
            <h1 className="max-w-2xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">{summary}</p>
          </Reveal>
          {logo && (
            <Reveal delay={0.15} className="flex justify-center lg:justify-end">
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
            </Reveal>
          )}
        </div>
      </section>

      <AboutTabs
        side="right"
        actions={
          <>
            {page?.preRegisterUrl && (
              <Link
                href={page.preRegisterUrl}
                {...externalProps(page.preRegisterUrl)}
                className={`${pillButton} bg-white text-navy hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.6)]`}
              >
                {t.preRegister}
              </Link>
            )}
            <Link href="/apply" className={`${pillButton} btn-sweep text-white hover:text-navy`}>
              {dict.common.getInvolved}
            </Link>
          </>
        }
        tabs={[
          { id: "overview", label: t.overview, content: overview },
          ...(photos.length > 0 ? [{ id: "photos", label: t.photos, content: gallery }] : []),
        ]}
      />

      {page && (
        <ProgramCategories
          sections={page.sections}
          labels={{ learnMore: dict.common.learnMore, register: t.register }}
        />
      )}

      {page?.events && (
        <EventCards
          programSlug={program.slug}
          events={page.events}
          title={t.events}
          intro={t.eventsIntro}
          viewLabel={t.viewEvent}
          logo={logo}
        />
      )}

      <div className={page && page.sections.length > 0 ? "pt-8" : "pt-4"}>
        <ProjectsBand title={t.moreProjects} detailLabel={dict.home.landing.detail} programs={others} />
      </div>
    </PageTransition>
  );
}
