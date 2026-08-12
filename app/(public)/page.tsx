import Link from "next/link";
import Image from "next/image";
import { Atom, GearSix, MathOperations, CirclesFour, BookOpen, ClipboardText, Briefcase, Quotes } from "@phosphor-icons/react/dist/ssr";
import { getPrograms, getTeamMembers, getNewsPosts } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { GrowIn } from "@/components/motion/GrowIn";
import { ProgramsCarousel } from "@/components/ProgramsCarousel";
import { getDictionary } from "@/lib/i18n";

const NEWS_CATEGORY_COLORS: Record<string, string> = {
  Competition: "var(--color-orange)",
  Events: "var(--color-green)",
  News: "var(--color-blue)",
};

function formatNewsDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const PILLAR_STYLES = [
  { color: "var(--color-orange)", icon: Atom },
  { color: "var(--color-red)", icon: GearSix },
  { color: "var(--color-blue)", icon: MathOperations },
  { color: "var(--color-green)", icon: CirclesFour },
];

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

const ABOUT_CARD_STYLES = [
  { color: "var(--color-blue)", icon: BookOpen },
  { color: "var(--color-green)", icon: ClipboardText },
  { color: "var(--color-orange)", icon: Briefcase },
];

const SUPPORTERS = [
  { name: "Ministry of Education, Youth and Sport", src: "/uploads/partners/MOEYS.png", scale: "scale-110" },
  { name: "Ministry of Environment", src: "/uploads/partners/MOE.png", scale: "scale-125" },
  { name: "P.T.C", src: "/uploads/partners/PTC.png", scale: "" },
  { name: "Ministry of Industry, Science, Technology & Innovation", src: "/uploads/partners/MISTI.png", scale: "scale-150" },
  { name: "Cambodia STEM Compass", src: "/uploads/partners/Cambodia-Compass.png", scale: "" },
  { name: "British Embassy Phnom Penh", src: "/uploads/partners/British-Embassy.png", scale: "scale-110" },
  { name: "WCS", src: "/uploads/partners/WCS-Logo.jpg", scale: "" },
  { name: "Kilat Events", src: "/uploads/partners/Kilat-Logo.png", scale: "" },
  { name: "Smart", src: "/uploads/partners/Smart-Logo.png", scale: "" },
  { name: "AEON Mall Mean Chey", src: "/uploads/partners/AEON-Mall.jpg", scale: "" },
];

export default async function HomePage() {
  const [programs, team, newsPosts, { dict }] = await Promise.all([
    getPrograms(),
    getTeamMembers(),
    getNewsPosts(),
    getDictionary(),
  ]);
  const [latestNews, ...otherNews] = newsPosts;
  const secondaryNews = otherNews.slice(0, 3);

  const ABOUT_CARDS = dict.home.aboutCards.map((card, i) => ({ ...card, ...ABOUT_CARD_STYLES[i] }));
  const PILLARS = dict.home.pillars.items.map((pillar, i) => ({ ...pillar, ...PILLAR_STYLES[i] }));
  const GET_INVOLVED = dict.home.getInvolved.items.map((item, i) => ({
    ...item,
    number: String(i + 1).padStart(2, "0"),
  }));

  return (
    <>
      {/* Hero: dark navy backdrop with soft wave bands, circular photo */}
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto grid min-h-[65vh] max-w-6xl items-center gap-12 px-6 pt-14 pb-20 md:min-h-[70vh] md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div>
            <Reveal duration={1.1}>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper md:text-6xl">
                {dict.home.hero.titleLine1}{" "}
                <span style={{ color: "var(--color-blue)" }}>{dict.home.hero.titleCambodia}</span>{" "}
                {dict.home.hero.titleLine2}{" "}
                <span>
                  <span style={{ color: "var(--color-green)" }}>S</span>
                  <span style={{ color: "var(--color-orange)" }}>T</span>
                  <span style={{ color: "var(--color-red)" }}>E</span>
                  <span style={{ color: "var(--color-blue)" }}>M</span>
                </span>{" "}
                {dict.home.hero.titleEducation}
              </h1>
            </Reveal>
            <Reveal delay={0.35} duration={1.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
                {dict.home.hero.body}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-blue px-7 py-3.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5"
                >
                  {dict.home.hero.ctaContact}
                </Link>
                <Link
                  href="/projects"
                  className="rounded-full px-2 py-3.5 text-sm font-bold text-paper underline decoration-blue decoration-2 underline-offset-8 transition-colors hover:text-blue"
                >
                  {dict.home.hero.ctaProjects}
                </Link>
              </div>
            </Reveal>
          </div>

          <GrowIn delay={0.3} duration={1.4} className="relative mx-auto flex w-full items-center justify-center">
            <Image
              src="/STEM-logo.png"
              alt="STEMEOC logo"
              width={800}
              height={800}
              priority
              className="h-auto w-full max-w-lg"
            />
          </GrowIn>
        </div>
      </section>

      {/* About: STEM / STEMEOC / Why cards */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {ABOUT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={i * 0.08} className="h-full">
                  <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-[2rem] border border-ink/5 bg-paper p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div
                      className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: card.color }}
                    />
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${card.color} 12%, transparent)` }}
                    >
                      <Icon size={30} weight="bold" style={{ color: card.color }} />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold">{card.title}</h3>
                    <span
                      className="mt-3 h-1 w-8 rounded-full"
                      style={{ backgroundColor: card.color }}
                    />
                    <p className="mt-4 text-sm leading-relaxed text-ink/65">{card.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supporters: logo wall */}
      <section className="bg-[#0b1f3d] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="flex flex-col items-center text-center">
            <p className="font-mono-label text-xs uppercase text-paper/50">{dict.home.supporters.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              {dict.home.supporters.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {SUPPORTERS.map((supporter, i) => (
              <Reveal key={supporter.name} delay={i * 0.04}>
                <div className="group flex h-32 items-center justify-center rounded-2xl bg-paper p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={`relative h-full w-full ${supporter.scale}`}>
                    <Image
                      src={supporter.src}
                      alt={supporter.name}
                      fill
                      className="object-contain"
                      sizes="200px"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News: full-width banner spotlight + compact row */}
      {latestNews && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono-label text-xs uppercase text-ink/40">{dict.home.news.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {dict.home.news.title}
                </h2>
              </div>
              <Link href="/news" className="text-sm font-bold text-blue hover:underline">
                {dict.home.news.viewAll}
              </Link>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <Link
                href={`/news/${latestNews.slug}`}
                className="group relative flex h-72 w-full flex-col justify-end overflow-hidden rounded-[1.75rem] shadow-xl md:h-96"
              >
                {latestNews.coverImageUrl && (
                  <Image
                    src={latestNews.coverImageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="1152px"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
                <div className="relative p-8 md:p-12">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-paper shadow-md"
                    style={{ backgroundColor: NEWS_CATEGORY_COLORS[latestNews.category] ?? "var(--color-blue)" }}
                  >
                    {latestNews.category}
                  </span>
                  <h3 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-paper md:text-4xl">
                    {latestNews.title}
                  </h3>
                  {latestNews.publishedAt && (
                    <p className="mt-3 text-sm font-semibold text-paper/70">
                      {formatNewsDate(latestNews.publishedAt)}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>

            {secondaryNews.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {secondaryNews.map((post, i) => {
                  const color = NEWS_CATEGORY_COLORS[post.category] ?? "var(--color-blue)";
                  return (
                    <Reveal key={post.id} delay={0.12 + i * 0.06}>
                      <Link
                        href={`/news/${post.slug}`}
                        className="group flex items-center gap-4 rounded-2xl bg-paper-dim p-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {post.coverImageUrl && (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                            <Image
                              src={post.coverImageUrl}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-mono-label text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
                            {post.category}
                          </span>
                          <h4 className="line-clamp-2 font-display text-sm font-semibold leading-tight">
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Programs: colorful icon-badge cards */}
      <section className="bg-[#0b1f3d] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.home.programs.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.home.programs.title}
            </h2>
          </Reveal>

          <div className="mt-12">
            <ProgramsCarousel
              programs={programs}
              labels={{ learnMore: dict.common.learnMore }}
              categories={dict.projects.categories}
            />
          </div>
        </div>
      </section>

      {/* Strategic Priorities: pillars list */}
      <section className="bg-paper-dim py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {dict.home.pillars.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--color-blue)" }}>
              {dict.home.pillars.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 0.06} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                    <div
                      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${pillar.color} 14%, transparent)` }}
                    >
                      <Icon size={26} weight="bold" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{pillar.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team: card-style portraits */}
      {team.length > 0 && (
        <section className="bg-[#0b1f3d] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center">
              <p className="font-mono-label text-xs uppercase text-white/50">{dict.home.team.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {dict.home.team.title}
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {team.map((member, i) => {
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <Reveal key={member.id} delay={i * 0.04} className="h-full">
                    <div className="group relative flex h-full aspect-[4/5] w-full items-end justify-center overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                      {member.photoUrl && (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 220px"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="relative p-4 text-center">
                        <h3 className="font-display text-sm font-semibold leading-tight text-paper">
                          {member.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold" style={{ color }}>
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* The Importance of STEM Education: quote + copy */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {dict.home.importance.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--color-blue)" }}>
              {dict.home.importance.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <div className="grid overflow-hidden rounded-3xl bg-paper-dim shadow-lg md:grid-cols-2">
              <div className="relative flex flex-col justify-center bg-blue p-10 md:p-12">
                <Quotes size={40} weight="fill" className="text-paper/30" />
                <p className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-paper md:text-3xl">
                  {dict.home.importance.quote}
                </p>
                <p className="mt-5 text-sm font-bold uppercase tracking-wide text-paper/70">
                  {dict.home.importance.quoteAuthor}
                </p>
              </div>
              <div className="relative flex flex-col justify-center p-10 md:p-12">
                <div className="absolute inset-x-0 top-0 grid grid-cols-4">
                  {ACCENT_COLORS.map((c) => (
                    <div key={c} className="h-1.5" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="font-mono-label text-xs uppercase text-ink/40">{dict.home.importance.whyItMatters}</p>
                <p className="mt-4 text-base leading-relaxed text-ink/65">
                  {dict.home.importance.whyBody}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Get Involved: numbered cards */}
      <section className="bg-[#0b1f3d] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.home.getInvolved.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {dict.home.getInvolved.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {GET_INVOLVED.map((item, i) => {
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <Reveal key={item.number} delay={i * 0.06} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-paper p-8 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                    <div
                      className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold text-paper"
                        style={{ backgroundColor: color }}
                      >
                        {item.number}
                      </span>
                      <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/65">{item.body}</p>
                    <Link
                      href="/contact"
                      className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: color }}
                    >
                      {dict.home.getInvolved.moreInfo}
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
