import Link from "next/link";
import Image from "next/image";
import { ArrowCircleRight, Quotes } from "@phosphor-icons/react/dist/ssr";
import { getPrograms, getSiteStats, getTeamMembers } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { PageTransition } from "@/components/motion/PageTransition";
import { AboutTabs } from "@/components/AboutTabs";
import { TeamCard } from "@/components/TeamCard";
import { QuestionsBand } from "@/components/QuestionsBand";
import { ProjectsBand } from "@/components/ProjectsBand";
import { ValuesPanel } from "@/components/ValuesPanel";

// The partners table still holds seed placeholders, so the logo row uses the
// real logos in /public/uploads/partners (as the previous home page did).
const PARTNERS = [
  { name: "Ministry of Education, Youth and Sport", logoUrl: "/uploads/partners/MOEYS.png" },
  { name: "Ministry of Environment", logoUrl: "/uploads/partners/MOE.png" },
  { name: "P.T.C", logoUrl: "/uploads/partners/PTC.png" },
  { name: "Ministry of Industry, Science, Technology & Innovation", logoUrl: "/uploads/partners/MISTI.png" },
  { name: "Cambodia STEM Compass", logoUrl: "/uploads/partners/Cambodia-Compass.png" },
  { name: "British Embassy Phnom Penh", logoUrl: "/uploads/partners/British-Embassy.png" },
  { name: "WCS", logoUrl: "/uploads/partners/WCS-Logo.jpg" },
  { name: "Kilat Events", logoUrl: "/uploads/partners/Kilat-Logo.png" },
  { name: "Smart", logoUrl: "/uploads/partners/Smart-Logo.png" },
  { name: "AEON Mall Mean Chey", logoUrl: "/uploads/partners/AEON-Mall.jpg" },
];

const pillButton =
  "inline-flex h-12 items-center justify-center rounded-3xl border-[3px] border-white px-7 font-body text-sm font-bold uppercase press md:h-13 md:min-w-48 md:text-base";

export default async function HomePage() {
  const [programs, team, stats, { dict }] = await Promise.all([
    getPrograms(),
    getTeamMembers(),
    getSiteStats(),
    getDictionary(),
  ]);
  const t = dict.home.landing;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container-site grid items-center gap-12 pb-12 pt-14 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-16 lg:pt-24">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl xl:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg md:text-justify">
              {dict.home.hero.body}
            </p>
            <Link
              href="/apply"
              className="group mt-8 inline-flex items-center gap-3 font-body text-lg font-bold uppercase md:text-xl"
            >
              <span className="border-b-4 border-white pb-1">{t.currentOpportunities}</span>
              <ArrowCircleRight
                size={34}
                weight="fill"
                className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-rotate-12 group-active:scale-90"
              />
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <Image
              src="/brand/stem-cambodia-logo.png"
              alt="STEM Education Organization for Cambodia"
              width={1104}
              height={440}
              priority
              className="h-auto w-full max-w-xl"
            />
          </Reveal>
        </div>
      </section>

      <AboutTabs
        actions={
          <>
            <Link href="/apply" className={`${pillButton} bg-white text-navy hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.6)]`}>
              {t.getInvolved}
            </Link>
            <Link href="/projects" className={`${pillButton} btn-sweep text-white hover:text-navy`}>
              {t.projects}
            </Link>
          </>
        }
        tabs={[
          {
            id: "story",
            label: t.tabs.story,
            content: (
              <section className="container-site grid items-center gap-10 py-16 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16 lg:py-24">
                <Reveal className="relative mx-auto aspect-[672/651] w-full max-w-md overflow-hidden rounded-[1.875rem] bg-placeholder lg:max-w-none">
                  <Image
                    src="/uploads/STEM-Group.jpg"
                    alt="STEMEOC team and students at the Cambodia Robotics Olympiad"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 448px, 420px"
                  />
                </Reveal>
                <Reveal delay={0.12}>
                  <h2 className="font-display text-4xl font-bold uppercase leading-[1.05] md:text-5xl xl:text-6xl">
                    {t.storyTitleLine1}
                    <br />
                    {t.storyTitleLine2}
                  </h2>
                  <p className="mt-8 text-lg leading-relaxed md:text-justify md:text-lg">{dict.about.story.body}</p>
                </Reveal>
              </section>
            ),
          },
          {
            id: "mission",
            label: t.tabs.mission,
            content: (
              <section className="container-site flex flex-col items-center py-16 text-center lg:py-28">
                <Quotes size={72} weight="fill" aria-hidden />
                <p className="mt-6 max-w-5xl font-body text-2xl font-bold leading-snug md:text-3xl">
                  {dict.about.mission.title}
                </p>
              </section>
            ),
          },
          {
            id: "values",
            label: t.tabs.values,
            content: (
              <ValuesPanel
                eyebrow={t.tabs.values}
                title={dict.home.pillars.title}
                body={dict.home.pillars.body}
                items={dict.home.pillars.items}
              />
            ),
          },
        ]}
      />

      {/* Stats */}
      {stats.length > 0 && (
        <section className="container-site pb-20 lg:pb-28">
          <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 text-center md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.id} scroll={(i % 4) * 0.12} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm font-light md:text-lg">{stat.label}</dt>
                <dd className="font-body text-4xl font-extrabold md:text-5xl">
                  <StatCounter value={stat.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      <ProjectsBand title={t.projectsTitle} detailLabel={t.detail} programs={programs} />

      {/* Partners */}
      <section className="container-site py-12 md:py-16">
        <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-5 xl:grid-cols-10">
          {PARTNERS.map((partner, i) => (
            <li key={partner.name} className="h-12 w-full max-w-28 md:h-16">
              <Reveal scroll={(i % 5) * 0.08} className="relative h-full w-full">
                <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" sizes="128px" />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="container-site pb-24 pt-4 text-black md:pb-32">
          <Reveal className="mx-auto max-w-3xl text-center text-navy">
            <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">{t.teamTitle}</h2>
            <p className="mt-3 text-base md:text-lg">{t.teamBody}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.id} scroll={(i % 4) * 0.12}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/contact"
      />
    </PageTransition>
  );
}
