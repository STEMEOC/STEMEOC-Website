import Link from "next/link";
import Image from "next/image";
import {
  ArrowsLeftRight,
  FlagCheckered,
  Lightbulb,
  SoccerBall,
  SteeringWheel,
  Target,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { CategoryIcon, ProgramCategory, ProgramPage } from "@/lib/program-pages";
import { Reveal } from "@/components/motion/Reveal";

const CATEGORY_ICONS: Record<CategoryIcon, Icon> = {
  tug: ArrowsLeftRight,
  sumo: Target,
  soccer: SoccerBall,
  innovator: Lightbulb,
  engineer: SteeringWheel,
  mission: FlagCheckered,
};

export function externalProps(href: string) {
  return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noreferrer" } : {};
}

type Labels = { learnMore: string; register: string };

function CategoryCard({ category, labels }: { category: ProgramCategory; labels: Labels }) {
  const Icon = CATEGORY_ICONS[category.icon];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-navy shadow-[0_24px_50px_-30px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/[0.04]">
        {category.image ? (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute size-40 rounded-full bg-navy/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125" />
            <Icon
              size={72}
              weight="duotone"
              className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110"
            />
          </div>
        )}
        {category.fee && (
          <span className="absolute right-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
            {category.fee}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-body text-lg font-bold md:text-xl">{category.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-navy/70">{category.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {category.learnMoreUrl && (
            <Link
              href={category.learnMoreUrl}
              {...externalProps(category.learnMoreUrl)}
              className="rounded-full border border-navy bg-navy px-4 py-1.5 text-xs font-bold uppercase text-white press hover:-translate-y-0.5 hover:bg-navy/90"
            >
              {labels.learnMore}
            </Link>
          )}
          {category.registerUrl && (
            <Link
              href={category.registerUrl}
              {...externalProps(category.registerUrl)}
              className="rounded-full border border-navy px-4 py-1.5 text-xs font-bold uppercase btn-sweep press [--sweep:var(--color-navy)] hover:text-white"
            >
              {labels.register}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Competition categories on a navy block with rounded top corners (Figma
 * "CRO landing page"). The last row of cards hangs below the block.
 */
export function ProgramCategories({
  sections,
  labels,
  hideLearnMore = false,
}: {
  sections: ProgramPage["sections"];
  labels: Labels;
  /** On an event page the Learn more buttons would point back to itself. */
  hideLearnMore?: boolean;
}) {
  if (sections.length === 0) return null;
  return (
    <section id="programs" className="scroll-mt-28">
      <div className="rounded-t-[3rem] bg-navy pb-44 pt-16 text-white md:rounded-t-[5rem] md:pt-24">
        {sections.map((section, s) => {
          const right = s % 2 === 1;
          const last = s === sections.length - 1;
          return (
            <div key={section.title} className={`container-site ${s > 0 ? "mt-20 md:mt-28" : ""}`}>
              <Reveal className={`flex flex-col ${right ? "items-end text-right" : "items-start"}`}>
                <h2 className="bg-white px-6 py-3 font-display text-2xl font-bold uppercase text-navy md:px-10 md:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-relaxed md:text-lg">{section.intro}</p>
              </Reveal>
              <ul
                className={`mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8 ${
                  last ? "relative z-10 -mb-72 md:-mb-80" : ""
                }`}
              >
                {section.categories.map((category, i) => (
                  <li key={category.name}>
                    <Reveal scroll={(i % 3) * 0.16} className="h-full">
                      <CategoryCard
                        category={hideLearnMore ? { ...category, learnMoreUrl: undefined } : category}
                        labels={labels}
                      />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {/* Room for the last row of cards, which hangs below the navy block */}
      <div className="h-44 md:h-52" />
    </section>
  );
}
