"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Animates the numeric portion of a stat value (e.g. "40,000+" -> counts 0 to 40000,
 * keeps the "+" suffix and comma formatting) once it scrolls into view.
 */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  const match = value.match(/^([\d,]+)(.*)$/);
  const numeric = match ? Number(match[1].replace(/,/g, "")) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!inView || !ref.current || numeric === null) return;

    if (reduce) {
      ref.current.textContent = value;
      return;
    }

    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toLocaleString("en-US") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, numeric, suffix, reduce, value]);

  return <span ref={ref}>{numeric === null ? value : "0" + suffix}</span>;
}
