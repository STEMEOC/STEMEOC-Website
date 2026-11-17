import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quotes } from "@phosphor-icons/react/dist/ssr";
import { getPrograms, getPublishedForms, getSiteStats, getTeamMembers } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PARTNERS } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { PageTransition } from "@/components/motion/PageTransition";
import { AboutTabs } from "@/components/AboutTabs";
import { QuestionsBand } from "@/components/QuestionsBand";
import { ValuesPanel } from "@/components/ValuesPanel";
import { Magnetic } from "@/components/interactive/Magnetic";
import { PartnerLogos } from "@/components/PartnerLogos";
import { ProgramCards } from "@/components/ProgramCards";

// Logo colors, in Figma order, for stat labels.
const STAT_COLORS = ["bg-green", "bg-orange", "bg-red", "bg-blue"];

export default async function HomePage() {
  const [programs, team, stats, forms, { dict }] = await Promise.all([
    getPrograms(),
    getTeamMembers(),
    getSiteStats(),
    getPublishedForms(),
    getDictionary(),
  ]);
  const t = dict.home.landing;
  const featured = team[0];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative -mt-(--header-h) overflow-hidden bg-navy text-white">
        <Image
          src="/uploads/stemfest-hero.webp"
          alt=""
          fill
          priority
          // no re-encode
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        {/* Scrim so the white text reads over the photo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(5_19_59/0.75),rgb(5_19_59/0.35)_45%,rgb(5_19_59/0.1))]" />
        <div className="container-site relative grid min-h-svh items-center gap-10 pb-32 pt-[calc(var(--header-h)+3rem)] md:pb-36 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl xl:text-6xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed md:text-lg md:text-justify">{t.heroBody}</p>
            <Magnetic className="mt-8" strength={0.25}>
              <Link
                href="/apply"
                className="inline-flex h-12 items-center rounded-full bg-blue px-8 font-display text-lg font-bold press hover:-translate-y-0.5 hover:bg-blue-deep md:text-xl"
              >
                {t.getInvolved}
              </Link>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.15} className="hidden justify-end lg:flex">
            <Image
              src="/brand/stem-cambodia-logo.png"
              alt="STEM Education Organization for Cambodia"
              width={1104}
              height={440}
              className="h-auto w-full max-w-xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Story / Mission / Values, with the tab strip pulled up into the hero */}
      <div className="relative z-10 -mt-20 md:-mt-24">
        <AboutTabs
          nextLabel={t.nextTab}
          tabs={[
            {
              id: "story",
              label: t.tabs.story,
              content: (
                <section className="relative grid min-h-[36rem] bg-navy text-white [--gutter:clamp(1.25rem,13vw_-_3.1rem,12.5rem)] lg:min-h-[min(48vw,52rem)] lg:grid-cols-2">
                  <Image
                    src="/uploads/STEM-Group.jpg"
                    alt={t.storyTitleLine1 + " " + t.storyTitleLine2}
                    fill
                    className="object-cover object-bottom"
                    sizes="100vw"
                  />
                  {/* scrim */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_left,rgb(5_19_59/0.85),rgb(5_19_59/0.55)_55%,rgb(5_19_59/0.2))]" />
                  <Reveal className="relative self-center px-(--gutter) py-16 lg:col-start-2 lg:py-24 lg:pl-16 xl:pl-24">
                    <h2 className="font-display text-3xl font-bold md:text-5xl">
                      {t.storyTitleLine1}{" "}
                      <span className="inline-block bg-blue px-2">{t.storyTitleLine2}</span>
                    </h2>
                    <p className="mt-8 text-base leading-relaxed md:text-xl md:text-justify">{t.storyBody}</p>
                  </Reveal>
                </section>
              ),
            },
            {
              id: "mission",
              label: t.tabs.mission,
              content: (
                <section className="flex min-h-[min(48vw,52rem)] flex-col items-center justify-center bg-navy px-(--gutter) py-20 text-center text-white [--gutter:clamp(1.25rem,13vw_-_3.1rem,12.5rem)]">
                  <Quotes size={96} weight="fill" aria-hidden />
                  <p className="mt-6 max-w-6xl font-body text-2xl font-bold leading-snug md:text-4xl">
                    {dict.about.mission.title}
                  </p>
                </section>
              ),
            },
            {
              id: "values",
              label: t.tabs.values,
              content: (
                <div className="bg-navy">
                  <ValuesPanel items={dict.home.pillars.items} />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="container-site section-y">
          <dl className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.id}
                scroll={(i % 4) * 0.12}
                className="flex flex-col-reverse items-center rounded-[1.75rem] border border-[#6a6a6a]/50 px-3 py-7 text-center md:py-9"
              >
                <dt className={`mt-4 rounded-full px-4 py-1 text-xs font-medium text-white md:text-base ${STAT_COLORS[i % 4]}`}>
                  {stat.label}
                </dt>
                <dd className="font-body text-4xl font-extrabold md:text-6xl">
                  <StatCounter value={stat.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      {/* Programs */}
      {programs.length > 0 && (
        <section className="container-site">
          <div className="rounded-[2rem] bg-paper px-5 py-12 md:rounded-[3rem] md:p-16 lg:p-20">
            <Reveal className="grid gap-4 md:grid-cols-2 md:items-center md:gap-12">
              <h2 className="font-display text-3xl font-bold md:text-5xl">{t.programsTitle}</h2>
              <p className="text-base md:text-lg md:text-justify">{t.programsBody}</p>
            </Reveal>
            <ProgramCards
              programs={programs}
              detailLabel={t.detail}
              labels={{ prev: t.prevPrograms, next: t.nextPrograms }}
              className="mt-12"
            />
            <div className="mt-8 flex justify-center">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-4 rounded-full border border-placeholder bg-white px-8 py-3 font-display text-lg font-bold press hover:-translate-y-0.5 md:text-xl"
              >
                {t.exploreAllPrograms}
                <ArrowRight size={22} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Current opportunities */}
      {forms.length > 0 && (
        <section className="container-site section-y">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold md:text-5xl">{t.opportunitiesTitle}</h2>
              <p className="mt-4 text-base md:text-lg md:text-justify">{t.opportunitiesBody}</p>
            </div>
            <Link
              href="/apply"
              className="group inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-navy px-7 py-3 font-display text-base font-bold text-white press hover:-translate-y-0.5 md:text-lg"
            >
              {t.exploreOpportunities}
              <ArrowRight size={20} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {forms.slice(0, 3).map((form, i) => (
              <li key={form.id}>
                <Reveal scroll={(i % 3) * 0.1} className="h-full">
                  <Link
                    href={`/apply/${form.slug}`}
                    className="group flex h-full min-h-56 flex-col rounded-[1.5rem] border border-navy/15 bg-white p-7 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white md:p-8"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-2 rounded-full bg-red/10 px-3 py-1 text-xs font-semibold text-red transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
                        <span aria-hidden className="size-1.5 rounded-full bg-current" />
                        {t.opportunityTag}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-full border border-current transition-transform duration-300 group-hover:-rotate-45">
                        <ArrowRight size={18} weight="bold" />
                      </span>
                    </span>
                    <span className="mt-6 font-body text-xl font-bold leading-snug md:text-2xl">{form.title}</span>
                    {form.description && (
                      <span className="mt-3 line-clamp-2 text-sm leading-relaxed opacity-70">{form.description}</span>
                    )}
                    <span className="mt-auto pt-6 text-sm font-bold underline-offset-4 group-hover:underline">
                      {dict.common.applyNow}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Featured team member */}
      {featured && (
        <section className="relative flex min-h-[44rem] items-center overflow-hidden bg-navy py-20 text-white md:py-32 lg:py-40">
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={400}
            height={395}
            className="pointer-events-none absolute -bottom-40 -right-40 w-[32rem] animate-[spin_60s_linear_infinite] opacity-10 motion-reduce:animate-none md:-bottom-56 md:-right-56 md:w-[44rem]"
          />
          <div className="container-site relative grid items-center justify-center gap-12 md:grid-cols-[minmax(0,18rem)_minmax(0,42rem)] md:gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,46rem)] lg:gap-24">
            <Reveal className="relative mx-auto w-full max-w-xs md:max-w-none">
              <div className="relative">
                <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-b-[1.5rem] rounded-t-full border-2 border-white/25 md:translate-x-5 md:translate-y-5" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-b-[1.5rem] rounded-t-full bg-placeholder">
                  {featured.photoUrl && (
                    <Image
                      src={featured.photoUrl}
                      alt={featured.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 320px, 420px"
                    />
                  )}
                </div>
              </div>
              <span aria-hidden className="relative mx-auto mt-10 flex h-1.5 w-2/3 overflow-hidden rounded-full">
                <span className="flex-1 bg-green" />
                <span className="flex-1 bg-orange" />
                <span className="flex-1 bg-red" />
                <span className="flex-1 bg-blue" />
              </span>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="font-display text-4xl font-bold leading-[1.05] md:text-5xl">{featured.name}</h2>
              <p className="mt-3 text-lg font-medium text-orange md:text-xl">{featured.role}</p>
              <span aria-hidden className="mt-8 block h-0.5 w-16 bg-white/30" />
              <p className="mt-8 text-base leading-relaxed text-white/85 md:text-lg">{featured.bio}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Partners */}
      <section className="container-site pt-[clamp(4rem,8vw,9rem)]">
        <h2 className="text-center font-body text-xl font-semibold text-[#6a6a6a] md:text-2xl">{t.partnersTitle}</h2>
        <div className="mt-10">
          <PartnerLogos partners={PARTNERS} />
        </div>
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
