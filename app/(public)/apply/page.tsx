import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardText, EnvelopeSimple, PencilSimpleLine } from "@phosphor-icons/react/dist/ssr";
import { getPublishedForms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { DrawLine, FadeUp, MaskText, StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { QuestionsBand } from "@/components/QuestionsBand";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.apply.metaTitle };
}

const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];
const STEP_ICONS = [ClipboardText, PencilSimpleLine, EnvelopeSimple];

export default async function ApplyPage() {
  const [forms, { dict }] = await Promise.all([getPublishedForms(), getDictionary()]);
  const t = dict.apply;

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
          <FadeUp className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">{t.hero.body}</FadeUp>
        </StaggerGroup>
      </section>

      {/* Slanted navy tab joining the hero to the list, holding the section title */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-full bg-navy sm:w-[70%] sm:tab-slant-bottom lg:w-[45%] lg:[--slant:6rem]" />
        <div className="container-site relative flex items-baseline gap-4 py-5 text-white">
          <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">{t.openTitle}</h2>
          <span className="rounded-full bg-white px-3 py-0.5 text-sm font-bold text-navy">{forms.length}</span>
        </div>
      </div>

      {/* Open applications */}
      <section className="container-site pb-20 pt-10 md:pb-28 md:pt-14">
        {forms.length === 0 ? (
          <p className="py-10 text-lg text-navy/60">{t.empty}</p>
        ) : (
          <StaggerGroup as="ul" className="border-b border-navy/15" stagger={0.08}>
            {forms.map((form, i) => (
              <StaggerItem as="li" key={form.id} wave={i}>
                <Link
                  href={`/apply/${form.slug}`}
                  className="group relative grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-5 border-t border-navy/15 py-8 transition-[background-color,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-paper md:grid-cols-[4rem_1fr_auto] md:gap-x-8 md:py-10 md:hover:px-6"
                  style={{ "--accent": form.accentColor } as React.CSSProperties}
                >
                  {/* Accent bar in the form's own color, grows down the row's left edge */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />
                  <span className="self-start font-display text-2xl font-bold text-navy/25 transition-colors duration-500 group-hover:text-[var(--accent)] md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">{form.title}</h3>
                    {form.description && (
                      <p className="mt-2 max-w-2xl text-base leading-relaxed text-navy/70 md:text-lg">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <span className="col-start-2 inline-flex w-fit items-center gap-2 rounded-full bg-navy py-3 pl-6 pr-5 text-sm font-bold uppercase text-white transition-[translate,box-shadow] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_24px_-12px_rgb(5_19_59/0.7)] group-active:scale-95 md:col-start-3">
                    {dict.common.applyNow}
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      {/* How it works */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-site">
          <StaggerGroup>
            <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">
              <MaskText>{t.steps.title}</MaskText>
            </h2>
            <DrawLine className="mt-5 block h-[3px] w-16 bg-navy" />
          </StaggerGroup>
          <StaggerGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
            {t.steps.items.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              const color = LOGO_COLORS[i % LOGO_COLORS.length];
              return (
                <StaggerItem as="li" key={step.title} wave={i}>
                  <div className="group h-full rounded-2xl bg-white p-7 ring-1 ring-navy/5 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgb(5_19_59/0.45)] md:p-8">
                    <div className="flex items-center justify-between">
                      <span
                        className="flex size-12 items-center justify-center rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110"
                        style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
                      >
                        <Icon size={24} weight="duotone" />
                      </span>
                      <span aria-hidden className="font-display text-sm font-bold uppercase tracking-[0.2em] text-navy/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 font-body text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-navy/70">{step.body}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
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
