"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 140, damping: 20, mass: 0.9 } as const;

/**
 * Scroll-triggered sequence for a block of content. Children using the
 * `StaggerItem`, `DrawLine`, `MaskText` or `PopIn` pieces below play in order
 * once the block enters the viewport.
 */
export function StaggerGroup({
  children,
  className,
  id,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.96, filter: "blur(6px)" },
  show: (wave: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { ...SPRING, delay: wave * 0.07, filter: { duration: 0.5, ease: EASE, delay: wave * 0.07 } },
  }),
};

/**
 * A card in a StaggerGroup grid. `wave` adds extra delay, e.g. row + column,
 * so a grid fills in as a diagonal wave instead of one card at a time.
 */
export function StaggerItem({
  children,
  className,
  wave = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  wave?: number;
  as?: "div" | "li";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants} custom={wave}>
      {children}
    </Tag>
  );
}

/** Hairline that draws from left to right. */
export function DrawLine({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={`origin-left ${className ?? ""}`}
      variants={{
        hidden: { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
      }}
    />
  );
}

/** Text that rises out from behind a mask. */
export function MaskText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        className="block"
        variants={{
          hidden: { y: "110%" },
          show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Pops in with a little spring and turn, for icons and round photos. */
export function PopIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      variants={{
        hidden: { opacity: 0, scale: 0.4, rotate: -25 },
        show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16, delay } },
      }}
    >
      {children}
    </motion.span>
  );
}

/** Fades up gently; for secondary lines such as counts and captions. */
export function FadeUp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.span>
  );
}
