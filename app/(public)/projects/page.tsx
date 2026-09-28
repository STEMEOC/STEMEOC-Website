import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Atom, Confetti, Leaf, Robot, Trophy, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { getPrograms } from "@/lib/content";
import { programLogo } from "@/lib/brand";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { FadeUp, MaskText, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
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

const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export default async function ProjectsPage() {
  const [programs, { dict }] = await Promise.all([getPrograms(), getDictionary()]);
  const t = dict.projects;
  const categoryLabels = t.categories as Record<string, string>;

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
            {t.hero.eyebrow}
          </FadeUp>
          <h1 className="mt-6 max-w-6xl text-balance font-display text-3xl font-bold uppercase leading-tight md:text-4xl xl:text-5xl">
            <MaskText>{t.hero.title}</MaskText>
          </h1>
          <FadeUp className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
            {t.hero.body}
          </FadeUp>
        </StaggerGroup>
      </section>

      {/* Slanted navy tab joining the hero to the list, holding the section
          title; numbered jump links to each program sit on the white beside it. */}
      <div className="relative overflow-x-clip">
        <div className="absolute inset-y-0 left-0 w-full bg-navy lg:w-[45%] lg:tab-slant-bottom lg:[--slant:6rem]" />
        <div className="container-site relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-baseline gap-4 py-5 text-white">
            <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">{t.listTitle}</h2>
            <span className="rounded-full bg-white px-3 py-0.5 text-sm font-bold text-navy">{programs.length}</span>
          </div>
          <div className="-mx-(--gutter) flex justify-center bg-white px-(--gutter) py-4 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-5">
            <ProgramJumpNav
              label={t.listTitle}
              items={programs.map((p) => ({ id: `program-${p.slug}`, title: p.title }))}
            />
          </div>
        </div>
      </div>

      {/* Programs: large rows, image side alternating */}
      <section className="container-site flex flex-col gap-14 pb-20 pt-12 md:gap-20 md:pb-28 md:pt-16">
        {programs.map((program, i) => {
          const Icon = PROGRAM_ICONS[program.category] ?? Atom;
          const color = LOGO_COLORS[i % LOGO_COLORS.length];
          const logo = programLogo(program);
          const src = logo ?? program.coverImageUrl;
          const flip = i % 2 === 1;
          return (
            <StaggerGroup key={program.id} id={`program-${program.slug}`} className="scroll-mt-32 md:scroll-mt-36">
              <Link
                href={`/projects/${program.slug}`}
                className={`group grid items-center gap-8 md:gap-10 lg:gap-16 ${
                  // The image column is the narrower one on both sides.
                  flip ? "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]" : "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                }`}
                style={{ "--accent": color } as React.CSSProperties}
              >
                <StaggerItem className={flip ? "md:order-2" : ""}>
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-navy/5 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_32px_70px_-34px_rgb(5_19_59/0.5)]">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 520px"
                        className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                          logo ? "object-contain p-8 md:p-12" : "object-cover"
                        }`}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center" style={{ color }}>
                        <Icon size={96} weight="duotone" />
                      </span>
                    )}
                    <span
                      className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-full text-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-12 group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      <Icon size={24} weight="bold" />
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem wave={1} className={flip ? "md:order-1" : ""}>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-3xl font-bold text-navy/15 transition-colors duration-500 group-hover:text-[var(--accent)] md:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-navy/15" aria-hidden />
                    <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color }}>
                      {categoryLabels[program.category] ?? program.category}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight md:text-3xl">
                    {program.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 text-base leading-relaxed text-navy/75">
                    {program.description}
                  </p>
                  {/* Hovering the row lifts the button; hovering the button itself
                      sweeps in the program's color and cycles the arrow through. */}
                  <span className="group/btn press btn-sweep mt-6 inline-flex items-center gap-3 rounded-full bg-navy py-3 pl-6 pr-4 text-sm font-bold uppercase text-white [--sweep:var(--accent)] group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_24px_-12px_rgb(5_19_59/0.7)] hover:shadow-[0_16px_30px_-12px_var(--accent)]">
                    {dict.common.learnMore}
                    <span className="relative flex size-7 items-center justify-center overflow-hidden rounded-full bg-white/15 transition-[background-color,color] duration-300 group-hover/btn:bg-white group-hover/btn:text-[var(--accent)]">
                      <ArrowRight
                        size={15}
                        weight="bold"
                        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-7"
                      />
                      <ArrowRight
                        size={15}
                        weight="bold"
                        aria-hidden
                        className="absolute -translate-x-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
                      />
                    </span>
                  </span>
                </StaggerItem>
              </Link>
            </StaggerGroup>
          );
        })}
      </section>

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/contact"
      />
    </PageTransition>
  );
}
