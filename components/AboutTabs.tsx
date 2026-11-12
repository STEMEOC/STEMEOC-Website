"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

type Tab = { id: string; label: string; content: ReactNode };

const EASE = [0.16, 1, 0.3, 1] as const;

// Panels slide in from the side of the tab you moved toward, and the old one
// leaves the other way, so the switch reads as moving along the tab row.
const panelVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48, filter: "blur(6px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -32,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

/**
 * The strip under a navy hero: a slanted navy tab holding `actions`, and the
 * tab buttons on the white area beside it. `side` puts the navy tab on the
 * left (home page) or right (program pages). The active tab's panel renders
 * below the strip.
 *
 * Without `actions`, the tabs sit in white on a slanted navy notch (pull it up
 * over the hero with a negative margin), and `nextLabel` adds a round red
 * button that moves to the next tab. `light` makes that notch white with pill
 * tabs; `activeTone` colors the active pill.
 */
export function AboutTabs({
  actions,
  tabs,
  side = "left",
  nextLabel,
  light = false,
  activeTone = "bg-navy",
}: {
  actions?: ReactNode;
  tabs: Tab[];
  side?: "left" | "right";
  nextLabel?: string;
  light?: boolean;
  activeTone?: string;
}) {
  const inset = !actions;
  const [[active, direction], setState] = useState<[string | undefined, number]>([tabs[0]?.id, 0]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function setActive(id: string) {
    const from = tabs.findIndex((t) => t.id === active);
    const to = tabs.findIndex((t) => t.id === id);
    if (from === to) return;
    setState([id, Math.sign(to - from)]);
  }

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
  function onKeyDown(e: KeyboardEvent, index: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  }

  function tabButton(tab: Tab, i: number, tone: string, bar: string, pill = false) {
    return (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`${base}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls={active === tab.id ? `${base}-panel-${tab.id}` : undefined}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={
              pill
                ? `shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold press md:text-base ${
                    active === tab.id ? `${tone} text-white` : "border border-navy/30 text-navy/70 hover:text-navy"
                  }`
                : `relative shrink-0 whitespace-nowrap px-5 text-xl leading-10 press first:pl-0 not-first:border-l ${tone} md:px-6 md:text-xl md:leading-10 ${
                    active === tab.id ? "font-semibold" : "font-normal"
                  }`
            }
          >
            {tab.label}
            {!pill && active === tab.id && (
              <motion.span
                layoutId={`${base}-tab-indicator`}
                aria-hidden
                className={`absolute -bottom-1 right-5 h-[3px] rounded-full ${bar} md:right-6 ${i === 0 ? "left-0" : "left-5 md:left-6"}`}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
          </button>
    );
  }

  return (
    <>
      {inset ? (
        <div className="relative">
          <div className={`absolute top-0 left-0 w-full ${light ? "-bottom-px bg-white" : "bottom-0 bg-navy"} [--slant:4rem] sm:w-[85%] sm:tab-slant-top lg:w-[50%] lg:[--slant:6rem]`} />
          <div
            role="tablist"
            className={`container-site relative flex overflow-x-auto py-5 [scrollbar-width:none] md:py-7 ${light ? "gap-3" : ""}`}
          >
            {tabs.map((tab, i) =>
              light
                ? tabButton(tab, i, activeTone, "", true)
                : tabButton(tab, i, "border-white/70 text-white hover:text-white/75", "bg-white"),
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Navy tab, flush with the page edge */}
          <div
            className={`absolute inset-y-0 w-full bg-navy lg:[--slant:6rem] ${
              side === "left" ? "left-0 lg:w-[52%] lg:tab-slant-bottom" : "right-0 lg:w-[45%] lg:tab-slant-bottom-left"
            }`}
          />
          <div
            className={`container-site relative flex flex-col gap-6 lg:items-center lg:justify-between ${
              side === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            <div className="flex flex-wrap gap-4 py-6 lg:py-5">{actions}</div>

            <div
              role="tablist"
              className="-mx-(--gutter) flex overflow-x-auto bg-white px-(--gutter) py-4 [scrollbar-width:none] lg:mx-0 lg:bg-transparent lg:px-0 lg:py-5"
            >
              {tabs.map((tab, i) => tabButton(tab, i, "border-navy text-navy hover:text-navy/70", "bg-navy"))}
            </div>
          </div>
        </div>
      )}

      {/* Only the active panel is mounted, so its scroll-in animations replay on each switch. */}
      <div className={`relative overflow-x-clip ${inset ? "-mt-0.5" : ""}`}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {tabs
            .filter((tab) => tab.id === active)
            .map((tab) => (
              <motion.div
                key={tab.id}
                id={`${base}-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`${base}-tab-${tab.id}`}
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {tab.content}
              </motion.div>
            ))}
        </AnimatePresence>
        {inset && nextLabel && (
          <button
            type="button"
            onClick={() => setActive(tabs[(tabs.findIndex((t) => t.id === active) + 1) % tabs.length].id)}
            aria-label={nextLabel}
            className="group press absolute bottom-6 right-(--gutter) flex size-12 items-center justify-center rounded-full bg-red text-white hover:-translate-y-0.5 md:bottom-10"
          >
            <ArrowRight size={22} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </>
  );
}
