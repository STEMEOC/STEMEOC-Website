import type { Metadata } from "next";
import Image from "next/image";
import {
  ClipboardText,
  PaperPlaneTilt,
  PencilSimpleLine,
} from "@phosphor-icons/react/dist/ssr";
import { getPublishedForms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { QuestionsBand } from "@/components/QuestionsBand";
import { OpportunityExplorer } from "@/components/OpportunityExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: "Current Opportunities · STEMEOC",
    description: dict.apply.hero.body,
  };
}

export default async function ApplyPage() {
  const [forms] = await Promise.all([getPublishedForms(), getDictionary()]);
  const volunteerAndCommunityCount = forms.filter(
    (f) => (f.category || "volunteer").toLowerCase() === "volunteer" || (f.category || "").toLowerCase() === "community"
  ).length;

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative -mt-(--header-h) overflow-hidden bg-navy pt-(--header-h) text-white">
        <Image
          src="/uploads/faq-banner.png"
          alt="STEM Education Organization for Cambodia ceremony and stage"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Navy gradient scrim for high contrast and readability */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_19_59/0.88)_0%,rgb(5_19_59/0.75)_50%,rgb(5_19_59/0.92)_100%)]" />

        <div className="container-site relative flex min-h-[min(50vw,34rem)] flex-col items-center justify-center py-20 text-center md:py-28">
          <Reveal>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Join our team
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Help run our festivals and competitions, bring STEM to your school, or take part in one of our programs. Pick an application below to get started.
            </p>

            {/* Two Dynamic Stat Badges */}
            <div className="mt-8 flex items-center justify-center gap-8 sm:gap-14 md:gap-18">
              {/* Stat 1: Volunteer & Community */}
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  {volunteerAndCommunityCount}
                </span>
                <span className="mt-1.5 inline-block rounded-full bg-orange px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md sm:text-xs">
                  Volunteer & Community
                </span>
              </div>

              {/* Stat 2: Total Open Opportunities */}
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  {forms.length}
                </span>
                <span className="mt-1.5 inline-block rounded-full bg-blue px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md sm:text-xs">
                  Open Opportunities
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Opportunities Directory with Category Filter */}
      <section className="container-site py-16 md:py-24">
        <OpportunityExplorer dbForms={forms} />
      </section>

      {/* How it works Section */}
      <section className="bg-white pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="container-site">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold uppercase tracking-tight text-navy sm:text-4xl md:text-5xl">
              How it works
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3 md:gap-7 lg:gap-8">
            {/* Step 1 */}
            <Reveal delay={0.05}>
              <div className="relative flex h-full flex-col justify-between rounded-[2rem] bg-[#f5f7fa] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-xl font-bold text-navy sm:text-2xl">
                    Pick an application
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                    <ClipboardText size={20} weight="fill" />
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-navy/70 sm:text-sm">
                  Select one program that suits you best
                </p>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between rounded-[2rem] bg-[#f5f7fa] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-xl font-bold text-navy sm:text-2xl">
                    Fill out the form
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                    <PencilSimpleLine size={20} weight="fill" />
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-navy/70 sm:text-sm">
                  Tell us about yourself
                </p>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={0.15}>
              <div className="relative flex h-full flex-col justify-between rounded-[2rem] bg-[#f5f7fa] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-xl font-bold text-navy sm:text-2xl">
                    Waiting for the result
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                    <PaperPlaneTilt size={20} weight="fill" />
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-navy/70 sm:text-sm">
                  Hear back from us through e-mail and telegram
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Floating HAVE QUESTIONS? Band */}
      <QuestionsBand
        title="HAVE QUESTIONS?"
        body="Find answers to the questions people asked most about how we work and how you can get involved."
        cta="Frequently Asked Questions"
        href="/faq"
      />
    </PageTransition>
  );
}
