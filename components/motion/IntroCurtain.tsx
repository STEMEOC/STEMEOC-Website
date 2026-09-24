"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export const INTRO_STORAGE_KEY = "stemeoc-intro-seen";

const COLORS = ["bg-blue", "bg-red", "bg-green", "bg-orange"];
const EASE = [0.76, 0, 0.24, 1] as const;
const HOLD = 0.3;
const STAGGER = 0.08;
const SLIDE = 0.9;
const TOTAL = HOLD + STAGGER * (COLORS.length - 1) + SLIDE;

/**
 * Opening animation: four brand-color columns cover the screen, then
 * slide up one after another to reveal the page. Plays once per
 * browser session. It is server-rendered so the page never flashes before it;
 * on repeat loads, the inline script in the public layout hides it before first paint.
 */
export function IntroCurtain() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-intro-seen")) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}
    // Safety net: never leave the page covered if a callback is missed.
    const id = setTimeout(() => setDone(true), (TOTAL + 0.5) * 1000);
    return () => clearTimeout(id);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden className="intro-curtain pointer-events-none fixed inset-0 z-[100] flex">
      {COLORS.map((color, i) => (
        <motion.div
          key={color}
          className={`${color} h-full flex-1 -mx-px`}
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: SLIDE, delay: HOLD + i * STAGGER, ease: EASE }}
          onAnimationComplete={() => i === COLORS.length - 1 && setDone(true)}
        />
      ))}
    </div>
  );
}
