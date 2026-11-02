import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Atom,
  Confetti,
  Leaf,
  Robot,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { getPrograms } from "@/lib/content";
import { programLogo } from "@/lib/brand";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import {
  FadeUp,
  MaskText,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/Stagger";
import { QuestionsBand } from "@/components/QuestionsBand";
import { ProgramJumpNav } from "@/components/ProgramJumpNav";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.projects.metaTitle };
}

const PROGRAM_ICONS: Record<string, typeof Confetti> = {
  festival: Confetti,
  robotics: Robot,
  eco: Leaf,
  innovation: Trophy,
  community: UsersThree,
};

// Card back colors, in Figma order.
const CARD_COLORS = ["bg-green", "bg-orange", "bg-red", "bg-blue"];
const ICON_COLORS = ["text-green", "text-orange", "text-red", "text-blue"];
const STORY_VIDEO = "NKvKym71_o0";

export default async function ProjectsPage() {
  const [programs, { dict }] = await Promise.all([
    getPrograms(),
    getDictionary(),
  ]);
  const t = dict.projects;

  return (
    <PageTransition>
      {/* Hero: photo, bottom-right corner cut on a slant for the program list */}
      <section className="relative z-10 -mt-(--header-h) overflow-hidden bg-navy text-white [clip-path:polygon(0_0,100%_0,100%_calc(100%-4.5rem),calc(45%+4.5rem)_calc(100%-4.5rem),45%_100%,0_100%)] lg:[clip-path:polygon(0_0,100%_0,100%_calc(100%-5rem),calc(40%+5rem)_calc(100%-5rem),40%_100%,0_100%)]">
        <Image
          src="/uploads/STEMFest2026-49.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Background video, sized to cover; the photo shows while it loads */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
          style={{ containerType: "size" }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${STORY_VIDEO}?autoplay=1&mute=1&loop=1&playlist=${STORY_VIDEO}&controls=0&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&modestbranding=1`}
            title="STEMEOC story"
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            className="absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        </div>
        {/* Light scrim on the text side only */}
        <div className="absolute inset-0 bg-[linear-gradient(to_left,rgb(5_19_59/0.65),rgb(5_19_59/0.2)_50%,transparent)]" />
        <div className="container-site relative flex min-h-[min(48vw,40rem)] items-center justify-end pb-32 pt-[calc(var(--header-h)+3rem)]">
          <StaggerGroup className="flex max-w-2xl flex-col items-end text-right">
            <FadeUp className="rounded-full bg-red px-4 py-1 text-xs font-bold text-white md:text-sm">
              {dict.header.nav.whatWeDo}
            </FadeUp>
            <h1 className="mt-5 max-w-2xl text-balance font-display text-3xl font-bold leading-tight md:text-4xl xl:text-5xl">
              <MaskText>{t.hero.title}</MaskText>
            </h1>
            <FadeUp className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/90 md:text-lg">
              {t.hero.body}
            </FadeUp>
          </StaggerGroup>
        </div>
      </section>

      {/* Light panel behind the list, under the hero cut */}
      <div className="bg-paper md:mx-6 lg:mx-10">
        {/* Numbered jump links, in the space the hero's slant leaves open */}
        <div className="container-site relative -mt-[4.5rem] flex h-[4.5rem] items-center justify-end lg:-mt-20 lg:h-20">
          <ProgramJumpNav
            label={t.listTitle}
            items={programs.map((p) => ({
              id: `program-${p.slug}`,
              title: p.title,
            }))}
          />
        </div>

        {/* Programs: logo card on a colored back, side alternating */}
        <section className="container-site flex flex-col gap-16 pb-20 pt-12 md:gap-24 md:pb-28 md:pt-16">
          {programs.map((program, i) => {
            const Icon = PROGRAM_ICONS[program.category] ?? Atom;
            const logo = programLogo(program);
            const flip = i % 2 === 1;
            const href = `/projects/${program.slug}`;
            return (
              <StaggerGroup
                key={program.id}
                id={`program-${program.slug}`}
                className={`grid scroll-mt-32 items-center gap-10 md:scroll-mt-36 md:gap-14 lg:gap-20 ${
                  flip
                    ? "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
                    : "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                }`}
              >
                <StaggerItem className={flip ? "md:order-2" : ""}>
                  <Link
                    href={href}
                    aria-label={program.title}
                    className="group relative block pb-3 pr-3"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 left-3 top-3 rounded-2xl ${CARD_COLORS[i % CARD_COLORS.length]}`}
                    />
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgb(5_19_59/0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
                      {logo ? (
                        <Image
                          src={logo}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 520px"
                          className="object-contain p-10 md:p-14"
                        />
                      ) : program.coverImageUrl ? (
                        <Image
                          src={program.coverImageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 520px"
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className={`absolute inset-0 flex items-center justify-center ${ICON_COLORS[i % ICON_COLORS.length]}`}
                        >
                          <Icon size={96} weight="duotone" />
                        </span>
                      )}
                    </span>
                  </Link>
                </StaggerItem>

                <StaggerItem
                  wave={1}
                  className={flip ? "md:order-1 md:text-right" : ""}
                >
                  <h2 className="font-display text-2xl font-bold uppercase leading-tight text-navy md:text-3xl">
                    <Link href={href} className="hover:text-navy/75">
                      {program.title}
                    </Link>
                  </h2>
                  <p className="mt-4 line-clamp-4 text-base leading-relaxed text-navy/80">
                    {program.description}
                  </p>
                  <div
                    className={`mt-6 flex flex-wrap gap-3 ${flip ? "md:flex-row-reverse" : ""}`}
                  >
                    <Link
                      href="/apply"
                      className="inline-flex h-10 items-center rounded-full border border-navy/15 bg-white px-6 text-sm font-bold text-navy press hover:-translate-y-0.5 hover:border-navy"
                    >
                      {t.volunteer}
                    </Link>
                    <Link
                      href={href}
                      className="inline-flex h-10 items-center rounded-full bg-navy px-6 text-sm font-bold text-white press hover:-translate-y-0.5 hover:bg-blue"
                    >
                      {t.register}
                    </Link>
                  </div>
                </StaggerItem>
              </StaggerGroup>
            );
          })}
        </section>
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
