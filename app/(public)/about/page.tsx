import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTeamMembers, getPrograms } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { TeamCard } from "@/components/TeamCard";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.about.metaTitle };
}

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

const INITIATIVE_SLUGS = ["cambodia-robotics-olympiad", "eco-stem", "stem-sisters", "annual-stem-festivals"];

export default async function AboutPage() {
  const [team, programs, { dict }] = await Promise.all([getTeamMembers(), getPrograms(), getDictionary()]);

  const initiatives = INITIATIVE_SLUGS.map((slug) => programs.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <PageTransition>
      {/* Hero: dark navy backdrop matching the homepage */}
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.about.hero.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.about.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {dict.about.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-paper py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <Reveal className="relative aspect-[5/3] w-full overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/uploads/STEM-Group.jpg"
              alt="STEMEOC team and students at the Cambodia Robotics Olympiad 2024"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 560px"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono-label text-xs uppercase text-ink/40">{dict.about.story.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
              {dict.about.story.title}
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              {dict.about.story.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-blue py-20 text-paper">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-paper/60">{dict.about.mission.eyebrow}</p>
            <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
              {dict.about.mission.title}
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Values: our initiatives */}
      {initiatives.length > 0 && (
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center">
              <p className="font-mono-label text-xs uppercase text-ink/40">{dict.about.values.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {dict.about.values.title}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {initiatives.map((program, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <Reveal key={program.id} delay={i * 0.06} className="h-full">
                    <Link
                      href={`/projects/${program.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-paper p-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="relative h-36 w-full overflow-hidden rounded-xl">
                        {program.coverImageUrl && (
                          <Image
                            src={program.coverImageUrl}
                            alt={program.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 260px"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
                      </div>
                      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                        <h3 className="font-display text-base font-semibold leading-tight">
                          {program.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink/60">
                          {program.description}
                        </p>
                        <span
                          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold"
                          style={{ color }}
                        >
                          {dict.common.learnMore}
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            &rarr;
                          </span>
                        </span>
                      </div>
                      <div
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ backgroundColor: color }}
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Meet the team */}
      {team.length > 0 && (
        <section id="team" className="scroll-mt-16 bg-[#0b1f3d] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center">
              <p className="font-mono-label text-xs uppercase text-white/50">{dict.about.team.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {dict.about.team.title}
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {team.map((member, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <Reveal key={member.id} delay={i * 0.04} className="h-full">
                    <TeamCard member={member} color={color} />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
