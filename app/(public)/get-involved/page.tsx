import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/lib/i18n";
import { PARTNERS } from "@/lib/brand";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { QuestionsBand } from "@/components/QuestionsBand";
import { PartnerLogos } from "@/components/PartnerLogos";

const STORY_VIDEO = "NKvKym71_o0";

const POINT_COLORS = [
  "bg-green text-white",
  "bg-orange text-white",
  "bg-red text-white",
  "bg-blue text-white",
];

const HELP_CARDS = [
  {
    key: "volunteer",
    image: "/uploads/682141820_1380405444133117_32712812770791493_n.jpg",
    href: "/apply",
  },
  {
    key: "partnership",
    image: "/uploads/653712120_1348361477337514_1919288644011531013_n.jpg",
    href: "/contact",
  },
  {
    key: "internship",
    image: "/uploads/CRO-4-scaled.jpg",
    href: "/apply",
  },
  {
    key: "sponsorship",
    image: "/uploads/DSC02178-1-scaled-e1780366784828.webp",
    href: "/contact",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.getInvolvedPage.metaTitle,
    description: dict.getInvolvedPage.hero.body,
  };
}

export default async function GetInvolvedPage() {
  const { dict } = await getDictionary();
  const t = dict.getInvolvedPage;

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative -mt-(--header-h) overflow-hidden bg-navy pt-(--header-h) text-white">
        <Image
          src="/uploads/stemfest-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Scrim overlay for readability */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(5_19_59/0.92)_15%,rgb(5_19_59/0.75)_55%,rgb(5_19_59/0.45))]" />

        <div className="container-site relative flex min-h-[min(56vw,36rem)] flex-col justify-center pb-20 pt-16 md:pb-28 md:pt-24">
          <Reveal>
            <span className="inline-block rounded-full bg-orange px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md md:text-sm">
              {t.hero.badge}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl">
              {t.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Section 2: Why work with us? */}
      <section className="container-site py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left: Photo with blue offset accent frame */}
          <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Blue accent backdrop card */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-blue md:translate-x-5 md:translate-y-5 md:rounded-[2.5rem]"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-placeholder shadow-xl md:rounded-[2.5rem]">
                <Image
                  src="/uploads/STEM-Group.jpg"
                  alt="Cambodian students and organizers celebrating together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          {/* Right: Why work with us list */}
          <Reveal delay={0.12}>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {t.whyWorkWithUs.title}
            </h2>

            <ul className="mt-8 space-y-5 md:mt-10 md:space-y-6">
              {t.whyWorkWithUs.points.map((point, i) => (
                <li key={point} className="flex items-center gap-4 md:gap-5">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full font-body text-sm font-bold shadow-xs md:size-12 md:text-base ${POINT_COLORS[i % POINT_COLORS.length]}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-base font-semibold leading-snug text-navy md:text-lg">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Section 3: Your support matters + Video Frame */}
      <section className="container-site py-12 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20">
          {/* Left: Text */}
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {t.supportMatters.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-navy/80 md:text-lg md:text-justify">
              {t.supportMatters.body}
            </p>
          </Reveal>

          {/* Right: Video player with navy offset frame */}
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Navy accent backdrop frame */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-navy md:translate-x-4 md:translate-y-4"
              />
              <div className="relative overflow-hidden rounded-2xl bg-navy shadow-xl">
                <YouTubePlayer
                  videoId={STORY_VIDEO}
                  title="STEM Cambodia - Your Support Matters"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 4: How can you help */}
      <section className="container-site py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-[#f5f7fa] px-6 py-14 sm:px-10 md:px-14 md:py-20 lg:px-20">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {t.howCanYouHelp.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy/75 md:text-lg">
              {t.howCanYouHelp.subtitle}
            </p>
          </Reveal>

          {/* 4 Cards in 2x2 Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 md:gap-8">
            {HELP_CARDS.map(({ key, image, href }, i) => {
              const card = t.howCanYouHelp.cards[key];
              return (
                <Reveal key={key} scroll={(i % 2) * 0.1}>
                  <Link
                    href={href}
                    className="group relative flex aspect-[16/10] overflow-hidden rounded-2xl bg-navy p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:aspect-[16/9] md:rounded-3xl md:p-8"
                  >
                    <Image
                      src={image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 560px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_19_59/0.92)_15%,rgb(5_19_59/0.6)_65%,rgb(5_19_59/0.3))] transition-colors duration-300 group-hover:bg-navy/80" />

                    <div className="relative mt-auto flex w-full flex-col">
                      <h3 className="font-display text-2xl font-bold uppercase text-white md:text-3xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
                        {card.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange transition-colors duration-300 group-hover:text-white md:text-sm">
                        {dict.common.learnMore}
                        <ArrowRight
                          size={16}
                          weight="bold"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Our Partners and Sponsors */}
      <section className="container-site py-12 md:py-20">
        <h2 className="text-center font-body text-base font-semibold uppercase tracking-wider text-[#6a6a6a] md:text-lg">
          {t.partnersTitle}
        </h2>
        <div className="mt-10">
          <PartnerLogos partners={PARTNERS} />
        </div>
      </section>

      {/* Section 6: HAVE QUESTIONS? Band */}
      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
