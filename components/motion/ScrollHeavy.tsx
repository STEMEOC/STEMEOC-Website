"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

/** How far (px) things fly in from the side. */
export const FLY = 110;

/**
 * Where an element sits on screen, which decides the side it flies in from:
 * left half from the left, right half from the right, wide or centred from below.
 */
export function measureSide(el: HTMLElement): -1 | 0 | 1 {
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth;
  if (r.width > vw * 0.7) return 0;
  const centre = (r.left + r.width / 2) / vw;
  return centre < 0.42 ? -1 : centre > 0.58 ? 1 : 0;
}

/** Measures the element before first paint and writes its side into `side`. */
export function useSide(ref: React.RefObject<HTMLElement | null>, side: MotionValue<number>) {
  useLayoutEffect(() => {
    if (ref.current) side.set(measureSide(ref.current));
  }, [ref, side]);
}

// Heavy spring: lots of mass and little stiffness, so things lag behind the
// scroll and settle with inertia instead of snapping into place.
const HEAVY = { stiffness: 70, damping: 22, mass: 1.6 };

/**
 * A card driven by scroll position: it slides in from its side of the screen
 * (or rises, if centred) as it reaches the reading line. `lag` (0–1) delays it
 * within the scroll range so cards in one row land in turn.
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });

  const start = Math.min(lag, 0.6);
  const range = [start, 1];
  const side = useMotionValue(0);
  useSide(ref, side);
  const rest = useTransform(progress, range, [1, 0]);
  const x = useTransform(() => rest.get() * side.get() * FLY);
  const y = useTransform(() => (side.get() === 0 ? rest.get() * 70 : rest.get() * 24));
  const rotate = useTransform(() => rest.get() * side.get() * -3);
  const scale = useTransform(rest, [1, 0], [0.94, 1]);
  const opacity = useTransform(progress, [start, start + (1 - start) * 0.6], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, rotate, scale, opacity }}
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
