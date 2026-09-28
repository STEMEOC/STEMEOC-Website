"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";

type Item = { id: string; title: string };

/**
 * Numbered jump links (01, 02, …) to the program rows on /projects, styled
 * like the AboutTabs tabs. Clicking one scrolls the page to that row; while
 * scrolling, the row in the middle of the screen is marked as current and
 * the underline slides to its number. Hovering shows the program name.
 */
export function ProgramJumpNav({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band across the middle of the viewport decides which row is current.
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  function jump(e: MouseEvent, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // scroll-margin on the row keeps it clear of the sticky header.
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  return (
    <nav aria-label={label} className="flex">
      {items.map((item, i) => {
        const current = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => jump(e, item.id)}
            aria-current={current ? "location" : undefined}
            className={`group/jump press relative shrink-0 border-navy px-5 font-display text-xl leading-10 tabular-nums first:pl-0 not-first:border-l hover:text-navy/70 md:px-6 md:text-xl md:leading-10 ${
              current ? "font-bold text-navy" : "font-normal text-navy/60"
            }`}
          >
            <span className="sr-only">{item.title}, </span>
            {String(i + 1).padStart(2, "0")}
            {current && (
              <motion.span
                layoutId="program-jump-indicator"
                aria-hidden
                className={`absolute -bottom-1 right-5 h-[3px] rounded-full bg-navy md:right-6 ${
                  i === 0 ? "left-0" : "left-5 md:left-6"
                }`}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            {/* Program name on hover */}
            <span
              aria-hidden
              className={`pointer-events-none absolute top-full z-20 mt-3 hidden translate-y-1 ${
                i === items.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
              } whitespace-nowrap rounded-full bg-navy px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wide text-white opacity-0 shadow-lg transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/jump:translate-y-0 group-hover/jump:opacity-100 lg:block`}
            >
              {item.title}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
