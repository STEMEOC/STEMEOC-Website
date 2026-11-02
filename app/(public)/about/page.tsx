import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Flask, Handshake, Lightbulb, Target, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { getSiteStats, getTeamMembers } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PARTNERS } from "@/lib/brand";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { Magnetic } from "@/components/interactive/Magnetic";
import { PartnerLogos } from "@/components/PartnerLogos";
import { TeamCard } from "@/components/TeamCard";
import { Timeline } from "@/components/Timeline";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.about.metaTitle };
}

// Logo colors, in Figma order.
const STAT_COLORS = ["bg-green", "bg-orange", "bg-blue"];
const STAND_FOR = [
  { icon: Flask, color: "bg-blue", photo: "/uploads/about/values.webp" },
  { icon: Lightbulb, color: "bg-red", photo: "/uploads/about/workshop.webp" },
  { icon: UsersThree, color: "bg-orange", photo: "/uploads/about/collage-2.webp" },
  { icon: Handshake, color: "bg-green", photo: "/uploads/about/collage-3.webp" },
];

export default async function AboutPage() {
  const [team, stats, { dict }] = await Promise.all([getTeamMembers(), getSiteStats(), getDictionary()]);
  const a = dict.about;
  const t = dict.home.landing;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="-mt-(--header-h) bg-navy pt-(--header-h) text-white">
        <div className="container-site grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24">
          <Reveal>
            <h1 className="font-display text-4xl font-bold md:text-6xl">{a.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg md:text-justify">{a.hero.body}</p>

            {stats.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-4">
                {stats.slice(0, 3).map((stat, i) => (
                  <div
                    key={stat.id}
                    className="flex min-w-32 flex-col-reverse items-center rounded-[1.25rem] bg-white px-4 py-4 text-navy"
                  >
                    <dt className={`mt-2 rounded-full px-3 py-0.5 text-xs font-medium text-white ${STAT_COLORS[i]}`}>
                      {stat.label}
                    </dt>
                    <dd className="font-body text-3xl font-extrabold md:text-4xl">
                      <StatCounter value={stat.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-2.5 font-display text-navy text-base font-bold press hover:-translate-y-0.5"
              >
                {t.exploreAllPrograms}
                <ArrowRight size={20} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Magnetic strength={0.25}>
                <Link
                  href="/apply"
                  className="inline-flex items-center rounded-full bg-blue px-7 py-2.5 font-display text-base font-bold text-white press hover:-translate-y-0.5 hover:bg-blue-deep"
                >
                  {t.getInvolved}
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          {/* Photo collage */}
          <Reveal delay={0.15} className="relative mx-auto aspect-[670/780] w-full max-w-xl">
            <div className="absolute left-[1.5%] top-0 h-[34%] w-[64.6%] overflow-hidden rounded-2xl shadow-lg">
              <Image src="/uploads/about/collage-2.webp" alt="Students presenting a project at the STEM Festival" fill priority className="object-cover" sizes="(max-width: 1024px) 60vw, 380px" />
            </div>
            <div className="absolute right-0 top-[13.3%] h-[76.7%] w-[67.6%] overflow-hidden rounded-2xl shadow-lg">
              <Image src="/uploads/about/collage-3.webp" alt="Visitors at the STEM Festival exhibition" fill priority className="object-cover" sizes="(max-width: 1024px) 65vw, 400px" />
            </div>
            <div className="absolute bottom-0 left-0 h-[36.5%] w-[67.6%] overflow-hidden rounded-2xl shadow-lg">
              <Image src="/uploads/about/collage-4.webp" alt="Participants of the Cambodia Robotics Olympiad 2024 on stage" fill className="object-cover" sizes="(max-width: 1024px) 65vw, 400px" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Story, on a white tab rising out of the hero */}
      <section className="relative">
        <div className="absolute bottom-full left-0 h-10 w-[85%] bg-white tab-slant-top [--slant:3rem] md:h-14 md:w-[55%] md:[--slant:5rem]" />
        <div className="container-site py-12 md:py-16">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-5xl">{a.story.title}</h2>
            <p className="mt-4 text-base md:text-lg md:text-justify">{a.story.body}</p>
          </Reveal>

          <Timeline items={a.timeline} />
        </div>
      </section>

      {/* Mission and vision */}
      <section className="container-site py-12 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem]">
          <Image src="/uploads/about/mission.webp" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(245_247_250/0.95),rgb(245_247_250/0.4))]" />
          <div className="relative grid gap-6 px-5 pb-5 pt-28 md:grid-cols-2 md:gap-8 md:px-12 md:pb-12 md:pt-44">
            {[
              { label: a.mission.label, body: a.mission.body, icon: Target, color: "bg-blue" },
              { label: a.vision.label, body: a.vision.body, icon: Compass, color: "bg-green" },
            ].map(({ label, body, icon: Icon, color }, i) => (
              <Reveal key={label} delay={i * 0.12} className="relative min-h-72 overflow-hidden rounded-[1.5rem] bg-white p-8 shadow-[0_8px_40px_-12px_rgb(5_19_59/0.25)] md:min-h-80 md:p-12">
                <Image
                  src="/brand/logo-mark.png"
                  alt=""
                  width={400}
                  height={395}
                  className="pointer-events-none absolute -bottom-16 -right-16 w-52 opacity-[0.07] md:-bottom-20 md:-right-20 md:w-64"
                />
                <span className={`absolute right-6 top-6 flex size-9 items-center justify-center rounded-full text-white ${color}`}>
                  <Icon size={20} weight="bold" />
                </span>
                <p className="relative text-base">{a.our}</p>
                <h2 className="relative font-display text-3xl font-bold md:text-4xl">{label}</h2>
                <p className="relative mt-6 text-base leading-relaxed md:text-lg md:text-justify">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we stand for */}
      <section className="container-site py-12 md:py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">{a.standFor.title}</h2>
          <p className="mt-4 text-base md:text-lg">{a.standFor.body}</p>
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {a.standFor.items.map((item, i) => {
            const { icon: Icon, color, photo } = STAND_FOR[i % STAND_FOR.length];
            return (
              <li key={item.title}>
                <Reveal scroll={(i % 2) * 0.12} className="relative flex h-full items-center gap-6 rounded-[1.5rem] bg-paper p-5 md:gap-8 md:p-6">
                  <span className={`absolute right-5 top-5 flex size-8 items-center justify-center rounded-full text-white ${color}`}>
                    <Icon size={18} weight="bold" />
                  </span>
                  <div className="relative aspect-[4/3.6] w-2/5 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={photo} alt="" fill className="object-cover" sizes="(max-width: 768px) 40vw, 260px" />
                  </div>
                  <div className="pr-8">
                    <h3 className="font-body text-lg font-bold md:text-xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#6a6a6a] md:text-base">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 text-center">
          <Link
            href="/child-protection-policy"
            className="inline-flex items-center rounded-full bg-red px-8 py-3 font-display text-base font-bold text-white underline underline-offset-4 press hover:-translate-y-0.5 md:text-lg"
          >
            {a.childPolicy}
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="container-site py-12 md:py-16">
        <h2 className="text-center font-body text-xl font-semibold text-[#6a6a6a] md:text-2xl">{t.partnersTitle}</h2>
        <div className="mt-10">
          <PartnerLogos partners={PARTNERS} />
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="scroll-mt-32 bg-paper py-16 md:py-24">
          <div className="container-site">
            <Reveal className="text-center">
              <p className="text-base md:text-lg">{a.team.eyebrow}</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{a.team.title}</h2>
            </Reveal>
            <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
              {team.map((member, i) => (
                <li key={member.id}>
                  <Reveal scroll={(i % 4) * 0.12}>
                    <TeamCard member={member} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
