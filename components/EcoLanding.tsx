"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { ProgramPage } from "@/lib/program-pages";
import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/motion/StatCounter";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { QuestionsBand } from "@/components/QuestionsBand";

type Program = { id: string; slug: string; title: string; coverImageUrl: string | null };

const STATS_DATA = [
  { value: "5", label: "Provinces Covered", color: "bg-green" },
  { value: "200", label: "Total Cleanups", color: "bg-orange" },
  { value: "30", label: "Schools", color: "bg-red" },
  { value: "5", label: "Projects", color: "bg-blue" },
];

const ECO_PROJECTS = [
  {
    id: "eco-hero-cleanup",
    title: "Eco Hero Clean Up",
    description:
      "A nationwide environmental cleanup movement engaging students and local communities in plastic waste collection, recycling, and sustainable living.",
    image: "/uploads/eco-hero-booth.jpg",
    href: "/projects/eco-stem/cleanup-day-2024",
  },
  {
    id: "wcs",
    title: "WCS",
    description:
      "Educational wildlife exploration trip to Keo Seima Wildlife Sanctuary in Mondulkiri, studying biodiversity protection and forest conservation.",
    image: "/uploads/6057366070777463922.jpg",
    href: "/projects/eco-stem/green-festival-2024",
  },
  {
    id: "plastic-odyssey-2019",
    title: "Plastic Odyssey Tour 2019",
    description:
      "Eco Heroes students took an eye-opening exploration tour discovering ocean pollution solutions and clean technology aboard the Plastic Odyssey ship.",
    image: "/uploads/events/plastic-odyssey-2019/01.jpg",
    href: "/projects/eco-stem/plastic-odyssey-2019",
  },
];

const MORE_PROGRAMS = [
  {
    slug: "annual-stem-festivals",
    title: "The Annual Cambodia STEM Festival",
    logoUrl: "/brand/festival-logo.png",
    color: "bg-green",
  },
  {
    slug: "icia",
    title: "International Creativity and Innovation Award",
    logoUrl: "/brand/icia-logo.png",
    color: "bg-red",
  },
  {
    slug: "cambodia-robotics-olympiad",
    title: "Cambodia Robotics Olympiad (CRO)",
    logoUrl: "/brand/cro-logo.png",
    color: "bg-orange",
  },
];

export function EcoLanding({
  program,
  page,
  others = [],
  dict,
}: {
  program: Program;
  page: ProgramPage;
  others?: Program[];
  dict: Dictionary;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "gallery">("overview");

  const photos = page.photos && page.photos.length > 0 ? page.photos : [
    { src: "/uploads/events/plastic-odyssey-2019/01.jpg", alt: "Eco Heroes students on the deck of the Plastic Odyssey ship" },
    { src: "/uploads/events/plastic-odyssey-2019/02.jpg", alt: "Students and guides with worksheets aboard Plastic Odyssey" },
    { src: "/uploads/events/plastic-odyssey-2019/03.jpg", alt: "Students exploring the Plastic Odyssey ship's lab and library" },
    { src: "/uploads/events/festival-2024/01.jpg", alt: "Green Innovation exhibition projects at Cambodia STEM Festival" },
    { src: "/uploads/6057366070777463922.jpg", alt: "Educational trip to Keo Seima Wildlife Sanctuary" },
    { src: "/uploads/events/festival-2025/01.jpg", alt: "Eco-STEM student participants showcase" },
  ];

  return (
    <div className="bg-[#fbfcfd] text-navy">
      {/* 1. Hero Section */}
      <section className="relative -mt-(--header-h) overflow-hidden bg-gradient-to-b from-[#f3f6fb] via-[#f7f9fd] to-white pt-(--header-h)">
        <div className="container-site pb-12 pt-10 sm:pt-16 md:pb-16 md:pt-20 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-7xl">
                  ECO STEM
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-navy/75 sm:text-base md:text-lg">
                  {page.summary ||
                    "The Eco Hero initiative, led by STEMEOC, is a program designed to inspire and educate young students about environmental sustainability through science and technology. Empowering participants to become champions of ecological stewardship."}
                </p>

                {/* Hero Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-navy/20 bg-white px-6 py-3 text-xs font-bold text-navy shadow-xs transition-all duration-300 hover:border-navy hover:shadow-md active:scale-95 sm:px-7 sm:py-3.5 sm:text-sm"
                  >
                    <span>Explore all programs</span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/get-involved"
                    className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-blue-deep hover:shadow-md active:scale-95 sm:px-8 sm:py-3.5 sm:text-sm"
                  >
                    Get involved
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Prominent Eco-STEM Brand Logo */}
            <div className="flex items-center justify-center lg:col-span-5 lg:justify-end">
              <Reveal delay={0.15}>
                <div className="relative flex max-w-sm items-center justify-center p-4 drop-shadow-sm sm:max-w-md lg:max-w-lg">
                  <Image
                    src="/brand/eco-stem-logo.png"
                    alt="Eco STEM Cambodia Logo"
                    width={520}
                    height={460}
                    priority
                    className="h-auto w-full object-contain"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Diagonal Transition to Content */}
        <div className="h-6 w-full bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* 2. Interactive Navigation Pills (Event Overview / Gallery) */}
      <section className="container-site -mt-3 pb-8 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all duration-300 sm:px-7 sm:py-3 sm:text-sm ${
              activeTab === "overview"
                ? "bg-green text-white shadow-md shadow-green/20"
                : "border border-navy/15 bg-white text-navy/75 hover:border-navy hover:text-navy"
            }`}
          >
            Event Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all duration-300 sm:px-7 sm:py-3 sm:text-sm ${
              activeTab === "gallery"
                ? "bg-green text-white shadow-md shadow-green/20"
                : "border border-navy/15 bg-white text-navy/75 hover:border-navy hover:text-navy"
            }`}
          >
            Gallery
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3. About the Event Section (Overview + 4 Stats + Video Player) */}
            <section className="container-site py-10 md:py-16">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Left Column: Text & 4 Stats Cards */}
                <div className="lg:col-span-7">
                  <Reveal>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-green sm:text-sm">
                      About the event
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
                      {page.whatIsTitle || "What is Eco-STEM?"}
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-navy/75 sm:text-base md:text-lg">
                      {page.whatIs ||
                        "Environmental stewardship is one of STEMEOC's core values. Through Eco-STEM (formerly Eco Heroes), students take what they learn in science and engineering out into their communities: clean-up days, plastic-awareness tours, and green-innovation projects at the STEM Festival. The 18th Annual Cambodia STEM Festival alone avoided more than 10,000 single-use plastic items."}
                    </p>

                    {/* 4 Stats Cards Horizontal Row */}
                    <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5">
                      {STATS_DATA.map((st, i) => (
                        <div
                          key={st.label}
                          className="flex flex-col items-center justify-between rounded-2xl border border-navy/10 bg-white p-4 shadow-xs transition hover:border-navy/20 hover:shadow-sm"
                        >
                          <span className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
                            <StatCounter value={st.value} />
                          </span>
                          <span
                            className={`mt-2 rounded-full px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px] ${st.color}`}
                          >
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                {/* Right Column: Video Box with Offset Green Accent Block */}
                <div className="lg:col-span-5">
                  <Reveal delay={0.15}>
                    <div className="relative mx-auto max-w-lg lg:max-w-none">
                      {/* Green Offset Backing Plate */}
                      <div className="absolute -bottom-3 -right-3 size-full rounded-[2rem] bg-green" />

                      {/* Video Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-navy/10 bg-slate-200 shadow-lg sm:aspect-[16/11]">
                        <YouTubePlayer
                          videoId="OIc-Fbpvo8I"
                          title="Eco-STEM & Green Innovation at STEM Festival"
                          sizes="(max-width: 1024px) 100vw, 520px"
                        />
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* 4. Projects Section (3 Project Cards Grid) */}
            <section className="container-site py-12 md:py-20">
              <Reveal>
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-navy sm:text-4xl md:text-5xl">
                    Projects
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-navy/70 sm:text-sm md:text-base">
                    Inspiring environmental innovation and action through student-led ecological cleanups, wildlife protection tours, and green engineering across Cambodia.
                  </p>
                </div>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 md:grid-cols-3 md:gap-7 lg:gap-8">
                {ECO_PROJECTS.map((proj, idx) => (
                  <Reveal key={proj.id} delay={idx * 0.08}>
                    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg">
                      {/* Card Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={proj.image}
                          alt={proj.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 380px"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                        <div>
                          <h3 className="font-display text-xl font-bold text-navy sm:text-2xl">
                            {proj.title}
                          </h3>
                          <p className="mt-2.5 text-xs leading-relaxed text-navy/70 sm:text-sm">
                            {proj.description}
                          </p>
                        </div>

                        {/* Bottom Row: Explore Button & Arrow */}
                        <div className="mt-6 flex items-center justify-between border-t border-navy/5 pt-4">
                          <Link
                            href={proj.href}
                            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-blue-deep hover:shadow-md active:scale-95 sm:px-6 sm:py-2.5 sm:text-sm"
                          >
                            Explore
                          </Link>

                          <Link
                            href={proj.href}
                            className="flex size-9 items-center justify-center rounded-full text-navy/70 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5 hover:text-navy"
                          >
                            <ArrowUpRight size={18} weight="bold" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          /* Gallery Tab View */
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="container-site py-10 md:py-16"
          >
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy sm:text-3xl">
              Eco-STEM Moments & Photo Gallery
            </h2>
            <p className="mt-2 text-xs text-navy/70 sm:text-sm">
              Snapshots of student clean-up days, science experiments, and provincial environmental outreach.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {photos.map((ph, idx) => (
                <div
                  key={ph.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-navy/10 bg-slate-100 shadow-xs"
                >
                  <Image
                    src={ph.src}
                    alt={ph.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 420px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {ph.alt}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. More Projects Section (Card Bracket Frame Style) */}
      <section className="container-site pb-20 pt-8 md:pb-28">
        <div className="rounded-[2.5rem] bg-[#f5f7fa] p-8 shadow-xs sm:p-10 md:p-14">
          <Reveal>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy sm:text-3xl md:text-4xl">
              More Projects
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-7 lg:gap-8">
            {MORE_PROGRAMS.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.08}>
                <Link
                  href={`/projects/${item.slug}`}
                  className="group relative block aspect-[495/415] w-full"
                  aria-label={item.title}
                >
                  {/* Underneath colored offset shape */}
                  <span
                    className={`card-notch absolute left-[4.6%] top-[4.6%] h-[91%] w-[93.4%] ${item.color}`}
                  />
                  {/* White foreground card */}
                  <span className="absolute left-[1.2%] top-0 h-[91%] w-[93.4%] drop-shadow-[0_4px_12px_rgb(0_0_0/0.08)] transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="card-notch relative block size-full bg-white">
                      <Image
                        src={item.logoUrl}
                        alt={item.title}
                        fill
                        className="object-contain p-[14%] pb-[22%]"
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                    </span>
                  </span>
                  {/* Details Pill Button in Notch */}
                  <span className="absolute left-[68.7%] top-[85.6%] flex h-[9.3%] w-[26%] items-center justify-center rounded-full border border-navy bg-white text-[0.65rem] font-bold uppercase tracking-wider text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                    DETAILS
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Floating HAVE QUESTIONS? Band */}
      <QuestionsBand
        title="HAVE QUESTIONS?"
        body="Find answers to the questions people asked most about how we work and how you can get involved."
        cta="Frequently Asked Questions"
        href="/faq"
      />
    </div>
  );
}
