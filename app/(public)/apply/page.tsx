import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { getPublishedForms } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.apply.metaTitle };
}

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export default async function ApplyPage() {
  const [forms, { dict }] = await Promise.all([getPublishedForms(), getDictionary()]);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.apply.hero.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.apply.hero.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {forms.map((form, i) => {
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <Reveal key={form.id} delay={i * 0.06}>
                  <Link
                    href={`/apply/${form.slug}`}
                    className="group flex h-full flex-col rounded-[1.75rem] bg-paper p-7 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
                    >
                      <ClipboardText size={22} weight="bold" style={{ color }} />
                    </div>
                    <h2 className="mt-5 font-display text-xl font-semibold text-ink">{form.title}</h2>
                    {form.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">{form.description}</p>
                    )}
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold" style={{ color }}>
                      {dict.common.applyNow}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
            {forms.length === 0 && (
              <p className="col-span-full text-center text-ink/50">{dict.apply.empty}</p>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
