"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ScrollCard } from "@/components/motion/ScrollHeavy";

/**
 * Scroll-in animation used across the site. Blocks rise from well below,
 * tipped slightly back in 3D, and settle on a heavy spring so they land with
 * weight rather than float in.
 *
 * Pass `scroll` for cards in a grid: the card is then driven by scroll
 * position (see ScrollCard), and the number is its lag within a row, e.g.
 * `(i % columns) * 0.16`, so cards in a row land one after another.
 */
export function Reveal({
  children,
  delay = 0,
  y = 70,
  className,
  scroll,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** @deprecated Motion is spring-based now; kept so existing calls still type-check. */
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
    <motion.div
      className={className}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
      initial={{ opacity: 0, y, rotateX: 12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 17,
        mass: 1.3,
        delay,
        opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
      }}
    >
      {children}
    </motion.div>
  );
}
