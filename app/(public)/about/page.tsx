import type { Metadata } from "next";
import Image from "next/image";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { getPrograms, getSiteStats, getTeamMembers } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { DrawLine, FadeUp, MaskText, PopIn, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { StatCounter } from "@/components/motion/StatCounter";
import { ValuesPanel } from "@/components/ValuesPanel";
import { ProjectsBand } from "@/components/ProjectsBand";
import { TeamCard } from "@/components/TeamCard";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.about.metaTitle };
}

const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

/** Section heading used down the page: uppercase title with a short rule drawing in under it. */
function SectionHeading({ title, body, className = "" }: { title: string; body?: string; className?: string }) {
  return (
    <StaggerGroup className={className}>
      <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">
        <MaskText>{title}</MaskText>
      </h2>
      <DrawLine className="mt-5 block h-[3px] w-16 bg-current" />
      {body && <FadeUp className="mt-5 max-w-xl text-base leading-relaxed opacity-80 md:text-lg">{body}</FadeUp>}
    </StaggerGroup>
  );
}

export default async function AboutPage() {
  const [team, programs, stats, { dict }] = await Promise.all([
    getTeamMembers(),
    getPrograms(),
    getSiteStats(),
    getDictionary(),
  ]);
  const a = dict.about;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-navy text-white">
        <StaggerGroup className="container-site flex flex-col items-center pb-16 pt-14 text-center md:pb-20 md:pt-20 lg:pb-24">
          <FadeUp className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            <span aria-hidden className="flex gap-1">
              {LOGO_COLORS.map((color) => (
                <span key={color} className="size-2 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </span>
            {a.hero.eyebrow}
          </FadeUp>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-none md:text-6xl xl:text-7xl">
            <MaskText>{a.metaTitle}</MaskText>
          </h1>
          <FadeUp className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-white/85 md:text-xl">
            {a.story.title}
          </FadeUp>
        </StaggerGroup>
      </section>

      {/* Slanted navy tab leading into the story */}
      <div className="relative overflow-x-clip">
        <div className="absolute inset-y-0 left-0 w-full bg-navy sm:w-[70%] sm:tab-slant-bottom lg:w-[45%] lg:[--slant:6rem]" />
        <h2 className="container-site relative py-5 font-display text-2xl font-bold uppercase text-white md:text-3xl">
          {a.story.eyebrow}
        </h2>
      </div>

      {/* Story, with the numbers beside it */}
      <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
        <StaggerGroup>
          <StaggerItem className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.875rem] bg-placeholder">
              <Image
                src="/uploads/STEM-Group.jpg"
                alt="STEMEOC team and students at the Cambodia Robotics Olympiad"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 512px, 480px"
              />
            </div>
            {/* Logo-color bar tucked under the photo's corner */}
            <span aria-hidden className="absolute -bottom-3 left-8 flex h-1.5 w-40 overflow-hidden rounded-full">
              {LOGO_COLORS.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
          </StaggerItem>
        </StaggerGroup>

        <div>
          <StaggerGroup>
            <FadeUp className="text-lg leading-relaxed text-navy/85 md:text-xl">{a.story.body}</FadeUp>
          </StaggerGroup>
          {stats.length > 0 && (
            <StaggerGroup as="ul" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-navy/15 pt-10" stagger={0.08}>
              {stats.map((stat, i) => (
                <StaggerItem as="li" key={stat.id} wave={i}>
                  <p className="font-body text-4xl font-extrabold md:text-5xl">
                    <StatCounter value={stat.value} />
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-navy/70 md:text-base">
                    <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: LOGO_COLORS[i % 4] }} />
                    {stat.label}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-navy text-white">
        <StaggerGroup className="container-site flex flex-col items-center py-20 text-center md:py-28">
          <PopIn className="flex size-16 items-center justify-center rounded-full bg-white text-navy md:size-20">
            <Quotes weight="fill" className="size-8 md:size-10" />
          </PopIn>
          <FadeUp className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/60">{a.mission.eyebrow}</FadeUp>
          <p className="mt-5 max-w-5xl text-balance font-display text-2xl font-bold leading-snug md:text-4xl">
            <MaskText>{a.mission.title}</MaskText>
          </p>
        </StaggerGroup>
      </section>

      {/* Values */}
      <ValuesPanel
        eyebrow={a.values.eyebrow}
        title={dict.home.pillars.title}
        body={dict.home.pillars.body}
        items={dict.home.pillars.items}
      />

      {/* Projects */}
      <ProjectsBand title={dict.home.landing.projectsTitle} detailLabel={dict.home.landing.detail} programs={programs} />

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="container-site scroll-mt-32 py-20 md:py-28">
          <SectionHeading title={a.team.eyebrow} body={a.team.title} />
          <StaggerGroup
            as="ul"
            className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4"
            stagger={0.06}
          >
            {team.map((member, i) => (
              <StaggerItem as="li" key={member.id} wave={Math.floor(i / 4) + (i % 4)}>
                <TeamCard member={member} />
              </StaggerItem>
            ))}
          </StaggerGroup>
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
