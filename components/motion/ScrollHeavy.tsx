"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

// Heavy spring: lots of mass and little stiffness, so things lag behind the
// scroll and settle with inertia instead of snapping into place.
const HEAVY = { stiffness: 70, damping: 22, mass: 1.6 };

/**
 * A card driven by scroll position: it rises from below tipped back in 3D,
 * then swings upright and lands as it reaches the reading line. `lag` (0–1)
 * delays it within the scroll range so cards in one row land in turn.
 */
export function ScrollCard({
  children,
  className,
  lag = 0,
}: {
  children: ReactNode;
  className?: string;
  lag?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 58%"] });
  const progress = useSpring(scrollYProgress, HEAVY);

  const start = Math.min(lag, 0.6);
  const range = [start, 1];
  const y = useTransform(progress, range, [180, 0]);
  const rotateX = useTransform(progress, range, [42, 0]);
  const scale = useTransform(progress, range, [0.82, 1]);
  const opacity = useTransform(progress, [start, start + (1 - start) * 0.45], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotateX, scale, opacity, transformPerspective: 1400, transformOrigin: "50% 100%" }}
      className={`will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Oversized outlined word that drifts sideways as its section scrolls past,
 * as a parallax layer behind a heading. Decorative only.
 */
export function ScrollMarquee({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["6%", "-22%"]), HEAVY);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none select-none overflow-hidden ${className ?? ""}`}>
      <motion.p
        style={{ x }}
        className="whitespace-nowrap font-display text-[5.5rem] font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.09)] motion-reduce:!transform-none md:text-[10rem] xl:text-[13rem]"
      >
        {text}
      </motion.p>
    </div>
  );
}
