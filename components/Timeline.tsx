"use client";

import { motion, type Variants } from "motion/react";

const COLORS = ["bg-green", "bg-orange", "bg-red", "bg-blue"];
const EASE = [0.22, 1, 0.36, 1] as const;
const STEP = 0.35;

const line: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.4 + STEP * 4, ease: EASE } },
};
const pill: Variants = {
  hidden: { scale: 0, opacity: 0 },
  shown: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2 + i * STEP, type: "spring", stiffness: 260, damping: 16 },
  }),
};
const text: Variants = {
  hidden: { y: 24, opacity: 0 },
  shown: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.35 + i * STEP, duration: 0.7, ease: EASE },
  }),
};

// milestones
export function Timeline({ items }: { items: readonly { year: string; title: string; body: string }[] }) {
  return (
    <motion.ol
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
    >
      <motion.span
        aria-hidden
        variants={line}
        className="absolute left-0 right-0 top-5 hidden h-0.5 origin-left bg-navy lg:block"
      />
      {items.map((item, i) => (
        <li key={item.year} className="relative">
          <motion.span
            custom={i}
            variants={pill}
            className={`inline-flex h-10 items-center rounded-full px-6 font-body text-base font-bold text-white ${COLORS[i % 4]}`}
          >
            {item.year}
          </motion.span>
          <motion.div custom={i} variants={text}>
            <h3 className="mt-8 font-body text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed md:text-base">{item.body}</p>
          </motion.div>
        </li>
      ))}
    </motion.ol>
  );
}
