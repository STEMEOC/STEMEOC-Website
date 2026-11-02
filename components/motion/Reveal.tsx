"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { FLY, ScrollCard, useSide } from "@/components/motion/ScrollHeavy";

/**
 * Scroll-in animation used across the site. Each block flies in from its own
 * side of the screen (left half from the left, right half from the right,
 * wide or centred blocks rise up) and glides into place on a long ease-out.
 *
 * Pass `scroll` for cards in a grid: the card is then driven by scroll
 * position (see ScrollCard), and the number is its lag within a row, e.g.
 * `(i % columns) * 0.16`, so cards in a row land one after another.
 */
export function Reveal({
  children,
  delay = 0,
  y = 60,
  className,
  scroll,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** @deprecated Duration is fixed; kept so existing calls still type-check. */
  duration?: number;
  className?: string;
  scroll?: number;
}) {
  if (scroll !== undefined) {
    return (
      <ScrollCard lag={scroll} className={className}>
        {children}
      </ScrollCard>
    );
  }

  return (
    <FlyIn delay={delay} y={y} className={className}>
      {children}
    </FlyIn>
  );
}

function FlyIn({ children, delay, y, className }: { children: ReactNode; delay: number; y: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const side = useMotionValue(0);
  useSide(ref, side);
  // 1 while hidden, 0 once landed
  const rest = useMotionValue(1);
  const x = useTransform(() => rest.get() * side.get() * FLY);
  const ty = useTransform(() => rest.get() * (side.get() === 0 ? y : 0));
  const rotate = useTransform(() => rest.get() * side.get() * -2);
  const scale = useTransform(() => 1 - rest.get() * (side.get() === 0 ? 0.05 : 0));
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y: ty, rotate, scale }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      onViewportEnter={() => {
        if (reduce) rest.set(0);
        else animate(rest, 0, { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay });
      }}
    >
      {children}
    </motion.div>
  );
}
