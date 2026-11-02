"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarBlank,
  GraduationCap,
  Handshake,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";

export type FaqItem = {
  readonly q: string;
  readonly a: string;
};

export type FaqSection = {
  readonly id: string;
  readonly title: string;
  readonly items: readonly FaqItem[];
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: Icon; badgeClass: string }
> = {
  general: {
    label: "General",
    icon: Sparkle,
    badgeClass: "bg-green text-white",
  },
  event: {
    label: "Event",
    icon: CalendarBlank,
    badgeClass: "bg-red text-white",
  },
  students: {
    label: "Students",
    icon: GraduationCap,
    badgeClass: "bg-orange text-white",
  },
  "get-involve": {
    label: "Get Involve",
    icon: Handshake,
    badgeClass: "bg-blue text-white",
  },
};

/**
 * 4 Quick jump pills displayed in 2 columns inside the hero's slanted white tab.
 */
export function FaqJumpPills() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:max-w-xl sm:gap-4 md:max-w-2xl md:gap-4.5">
      {/* Row 1: General (Green), Event (Red) */}
      <button
        type="button"
        onClick={() => scrollTo("faq-section-general")}
        className="group flex w-full min-w-[160px] items-center gap-3 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-left shadow-xs transition-all duration-300 hover:border-navy hover:shadow-md active:scale-95 sm:min-w-[200px] sm:gap-3.5 sm:px-5 sm:py-3 md:min-w-[230px] md:px-6 md:py-3.5"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-xs sm:size-7 md:size-8">
          <Sparkle size={15} weight="fill" />
        </span>
        <span className="font-display text-xs font-bold text-navy sm:text-sm md:text-base">
          General
        </span>
      </button>

      <button
        type="button"
        onClick={() => scrollTo("faq-section-event")}
        className="group flex w-full min-w-[160px] items-center gap-3 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-left shadow-xs transition-all duration-300 hover:border-navy hover:shadow-md active:scale-95 sm:min-w-[200px] sm:gap-3.5 sm:px-5 sm:py-3 md:min-w-[230px] md:px-6 md:py-3.5"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red text-white shadow-xs sm:size-7 md:size-8">
          <CalendarBlank size={15} weight="fill" />
        </span>
        <span className="font-display text-xs font-bold text-navy sm:text-sm md:text-base">
          Event
        </span>
      </button>

      {/* Row 2: Students (Orange), Get Involve (Blue) */}
      <button
        type="button"
        onClick={() => scrollTo("faq-section-students")}
        className="group flex w-full min-w-[160px] items-center gap-3 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-left shadow-xs transition-all duration-300 hover:border-navy hover:shadow-md active:scale-95 sm:min-w-[200px] sm:gap-3.5 sm:px-5 sm:py-3 md:min-w-[230px] md:px-6 md:py-3.5"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-xs sm:size-7 md:size-8">
          <GraduationCap size={15} weight="fill" />
        </span>
        <span className="font-display text-xs font-bold text-navy sm:text-sm md:text-base">
          Students
        </span>
      </button>

      <button
        type="button"
        onClick={() => scrollTo("faq-section-get-involve")}
        className="group flex w-full min-w-[160px] items-center gap-3 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-left shadow-xs transition-all duration-300 hover:border-navy hover:shadow-md active:scale-95 sm:min-w-[200px] sm:gap-3.5 sm:px-5 sm:py-3 md:min-w-[230px] md:px-6 md:py-3.5"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue text-white shadow-xs sm:size-7 md:size-8">
          <Handshake size={15} weight="fill" />
        </span>
        <span className="font-display text-xs font-bold text-navy sm:text-sm md:text-base">
          Get Involve
        </span>
      </button>
    </div>
  );
}

/**
 * Individual FAQ accordion item that smoothly morphs its border radius from a pill
 * (9999px) into a card (1.5rem) with animated height expansion and graceful text slide-in.
 */
function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout="position"
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group overflow-hidden border transition-all duration-300 ${
        isOpen
          ? "border-navy/15 bg-[#f0f4f9] shadow-md"
          : "border-transparent bg-[#f0f4f9] hover:bg-[#e4ebf5]"
      }`}
      style={{
        borderRadius: isOpen ? "1.5rem" : "9999px",
        transition: shouldReduceMotion
          ? "none"
          : "border-radius 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, background-color 0.2s ease, border-color 0.3s ease",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors sm:px-8 sm:py-5 md:px-10 md:py-5.5"
      >
        <span className="font-display text-sm font-bold text-navy sm:text-base md:text-lg">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            isOpen ? "bg-blue/10 text-blue" : "text-navy/70 group-hover:text-navy"
          }`}
        >
          <ArrowRight size={18} weight="bold" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: shouldReduceMotion ? 0 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: shouldReduceMotion ? 0 : 0.25,
                  delay: shouldReduceMotion ? 0 : 0.08,
                  ease: "easeOut",
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                opacity: { duration: shouldReduceMotion ? 0 : 0.15, ease: "easeIn" },
                height: {
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: shouldReduceMotion ? 0 : -8 }}
              animate={{ y: 0 }}
              exit={{ y: shouldReduceMotion ? 0 : -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="px-6 pb-5 pt-0 sm:px-8 sm:pb-6 md:px-10 md:pb-7"
            >
              <p className="text-sm leading-relaxed text-navy/80 sm:text-base md:text-lg">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Accordion lists grouped by category with animated expansion and smooth state toggling.
 */
export function FaqAccordionList({ sections }: { sections: readonly FaqSection[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 md:space-y-16">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`faq-section-${section.id}`}
          className="scroll-mt-28 md:scroll-mt-36"
        >
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
              {section.title}
            </h2>
          </Reveal>

          <motion.div layout className="mt-4 space-y-3.5 md:mt-5 md:space-y-4">
            {section.items.map((item, index) => {
              const key = `${section.id}-${index}`;
              const isOpen = Boolean(openItems[key]);

              return (
                <Reveal key={item.q} delay={index * 0.04}>
                  <FaqAccordionItem
                    item={item}
                    isOpen={isOpen}
                    onToggle={() => toggle(key)}
                  />
                </Reveal>
              );
            })}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
