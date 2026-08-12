import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Atom, Confetti, Robot, Leaf, Trophy, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { getPrograms } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";

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

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export default async function ProjectsPage() {
  const [programs, { dict }] = await Promise.all([getPrograms(), getDictionary()]);
  const PROGRAM_LABELS = dict.projects.categories;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.projects.hero.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.projects.hero.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            {programs.map((program, i) => {
              const Icon = PROGRAM_ICONS[program.category] ?? Atom;
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <Reveal key={program.id} delay={i * 0.06}>
                  <Link
                    href={`/projects/${program.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-paper p-3 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:flex-row"
                  >
                    <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:w-80">
                      {program.coverImageUrl ? (
                        <Image
                          src={program.coverImageUrl}
                          alt={program.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, 320px"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                      <div
                        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-paper shadow-md ring-2 ring-white/40"
                        style={{ backgroundColor: color }}
                      >
                        <Icon size={24} weight="bold" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-8">
                      <span
                        className="font-mono-label text-xs font-bold uppercase tracking-wide"
                        style={{ color }}
                      >
                        {(PROGRAM_LABELS as Record<string, string>)[program.category] ?? program.category}
                      </span>
                      <h2 className="mt-2 font-display text-2xl font-semibold">{program.title}</h2>
                      <p className="mt-3 line-clamp-3 text-base leading-relaxed text-ink/60">
                        {program.description}
                      </p>
                      <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold" style={{ color }}>
                        {dict.common.learnMore}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </span>
                    </div>
                    <div
                      className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: color }}
                    />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
