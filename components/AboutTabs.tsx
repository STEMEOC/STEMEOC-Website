"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

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
 */
export function AboutTabs({
  actions,
  tabs,
  side = "left",
}: {
  actions: ReactNode;
  tabs: Tab[];
  side?: "left" | "right";
}) {
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

  return (
    <>
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
            {tabs.map((tab, i) => (
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
                className={`relative shrink-0 whitespace-nowrap border-navy px-5 text-xl leading-10 text-navy press first:pl-0 not-first:border-l hover:text-navy/70 md:px-6 md:text-xl md:leading-10 ${
                  active === tab.id ? "font-semibold" : "font-normal"
                }`}
              >
                {tab.label}
                {active === tab.id && (
                  <motion.span
                    layoutId={`${base}-tab-indicator`}
                    aria-hidden
                    className={`absolute -bottom-1 right-5 h-[3px] rounded-full bg-navy md:right-6 ${i === 0 ? "left-0" : "left-5 md:left-6"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Only the active panel is mounted, so its scroll-in animations replay on each switch. */}
      <div className="overflow-x-clip">
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
      </div>
    </>
  );
}
