import type { Icon } from "@phosphor-icons/react";
import { Lightbulb, Plant, RocketLaunch, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { DrawLine, MaskText, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

// One logo color per value, in logo order. Used only as small accents.
const ACCENTS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];
const ICONS: Icon[] = [RocketLaunch, Lightbulb, Plant, UsersThree];

/**
 * The "Values" tab on the home page: a short intro beside four numbered
 * value cards. Each card carries one logo color on its icon, number and the
 * bar that draws across its foot on hover.
 */
export function ValuesPanel({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: readonly { title: string; body: string }[];
}) {
  return (
    <section className="container-site grid gap-12 py-16 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20 lg:py-24">
      <StaggerGroup className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-navy/60">
          <span aria-hidden className="flex gap-1">
            {ACCENTS.map((color) => (
              <span key={color} className="size-2 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </span>
          {eyebrow}
        </p>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl">
          <MaskText>{title}</MaskText>
        </h2>
        <DrawLine className="mt-6 block h-[3px] w-16 bg-navy" />
        <p className="mt-6 max-w-md text-lg leading-relaxed text-navy/80">{body}</p>
      </StaggerGroup>

      <StaggerGroup as="ul" className="grid gap-5 sm:grid-cols-2" stagger={0.1}>
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          const color = ACCENTS[i % ACCENTS.length];
          return (
            <StaggerItem as="li" key={item.title} wave={Math.floor(i / 2) + (i % 2)}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper p-7 ring-1 ring-navy/5 transition-[translate,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_28px_60px_-30px_rgb(5_19_59/0.45)] md:p-8">
                <div className="flex items-start justify-between">
                  <span
                    className="flex size-14 items-center justify-center rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110"
                    style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
                  >
                    <Icon size={28} weight="duotone" />
                  </span>
                  <span
                    aria-hidden
                    className="font-display text-5xl font-bold leading-none text-navy/10 transition-colors duration-500 group-hover:text-[var(--accent)]"
                    style={{ "--accent": color } as React.CSSProperties}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-body text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy/75 md:text-lg">{item.body}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  style={{ backgroundColor: color }}
                />
              </article>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
