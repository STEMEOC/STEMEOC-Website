import { MaskText, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

// One logo color per card, in Figma order.
const COLORS = ["var(--color-green)", "var(--color-orange)", "var(--color-red)", "var(--color-blue)"];

/**
 * Four tall cards in the logo colors, each with a title, short text and a big
 * number in the corner. The intro (eyebrow, title, body) is optional.
 */
export function ValuesPanel({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  items: readonly { title: string; body: string }[];
}) {
  return (
    <section className="container-site py-16 lg:py-24">
      {title && (
        <StaggerGroup className="mb-12 max-w-3xl">
          {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.2em] text-navy/60">{eyebrow}</p>}
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
            <MaskText>{title}</MaskText>
          </h2>
          {body && <p className="mt-5 text-lg leading-relaxed text-navy/80">{body}</p>}
        </StaggerGroup>
      )}

      <StaggerGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {items.map((item, i) => (
          <StaggerItem as="li" key={item.title} wave={i}>
            <article
              className="group relative flex h-full min-h-80 flex-col overflow-hidden rounded-[1.25rem] p-7 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 md:min-h-[26rem] md:p-8"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            >
              <h3 className="max-w-[12ch] font-body text-2xl font-bold leading-tight md:text-[1.75rem]">{item.title}</h3>
              <p className="mt-5 text-base leading-relaxed md:text-lg">{item.body}</p>
              <span
                aria-hidden
                className="mt-auto self-end font-body text-8xl font-black leading-none transition-transform duration-500 group-hover:-rotate-6 md:text-9xl"
              >
                {i + 1}
              </span>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
