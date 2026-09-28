"use client";

import { useRef, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowUpLeft } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const BRAND = ["var(--color-green)", "var(--color-orange)", "var(--color-red)", "var(--color-blue)"];

const textGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Name rises word by word from behind a mask.
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

/**
 * Team profile card (Figma "Team01", expanded). On load the portrait wipes up
 * and settles from a slight zoom while the text staggers in. With a mouse the
 * portrait tilts toward the pointer under a soft glare. Reduced motion is
 * handled by MotionProvider (entrances) and `reduce` (the tilt), keeping the
 * server and client markup identical.
 */
export function TeamProfileCard({
  member,
  aboutLabel,
  backLabel,
  backHref,
}: {
  member: { name: string; role: string; photoUrl: string | null; bio: string[] };
  aboutLabel: string;
  backLabel: string;
  backHref: string;
}) {
  const reduce = useReducedMotion();
  const photo = useRef<HTMLDivElement>(null);

  // Pointer position over the portrait, -0.5..0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.28), transparent 55%)`;
  const glareOpacity = useSpring(0, spring);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !photo.current) return;
    const rect = photo.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(1);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative isolate mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[1.875rem] bg-navy p-5 text-white md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] md:items-center md:gap-12 md:p-8"
    >
      {/* Slowly turning logo mark, faint, behind the text */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 size-80 opacity-[0.06] md:-right-16 md:-top-16 md:size-[26rem]">
        <Image src="/brand/logo-mark.png" alt="" fill sizes="416px" className="animate-spin-slow object-contain" />
      </div>

      {/* Portrait */}
      <div className="[perspective:1200px]">
        <motion.div
          ref={photo}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ clipPath: "inset(100% 0% 0% 0% round 1.7rem)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 1.7rem)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          className="relative mx-auto aspect-[452/674] w-full max-w-sm overflow-hidden rounded-[1.7rem] bg-white/10 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.7)] ring-1 ring-white/10 md:max-h-[min(40rem,calc(100svh-10rem))] md:max-w-none"
        >
          {member.photoUrl && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
            >
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                priority
                quality={90}
                // The frame is narrower than most portraits, so object-cover
                // fills it by height; ask for width to match, not the frame's.
                sizes="(max-width: 768px) 520px, 600px"
                className="object-cover"
              />
            </motion.div>
          )}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ backgroundImage: glare, opacity: glareOpacity }}
          />
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        variants={textGroup}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center pb-16 md:py-10 md:pr-8"
      >
        <h1 className="font-body text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
          {member.name.split(" ").map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p variants={textItem} className="mt-2 text-lg text-white/80 lg:text-xl">
          {member.role}
        </motion.p>

        {/* Four logo colors drawing in, left to right */}
        <motion.div variants={textItem} aria-hidden className="mt-6 flex h-1.5 w-40 gap-1">
          {BRAND.map((c, i) => (
            <motion.span
              key={c}
              className="flex-1 origin-left rounded-full"
              style={{ backgroundColor: c }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.75 + i * 0.1 }}
            />
          ))}
        </motion.div>

        {member.bio.length > 0 && (
          <div className="mt-8 max-w-3xl">
            <motion.h2 variants={textItem} className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              {aboutLabel}
            </motion.h2>
            <div className="mt-4 space-y-4 text-base font-light leading-relaxed text-white/90 lg:text-lg">
              {member.bio.map((p, i) => (
                <motion.p key={i} variants={textItem}>
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Back to the team */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.9 }}
        className="absolute bottom-5 right-5 md:bottom-8 md:right-8"
      >
        <Link
          href={backHref}
          aria-label={backLabel}
          title={backLabel}
          className="group relative flex size-11 items-center justify-center rounded-full bg-white text-navy md:size-14"
        >
          <span className="absolute inset-0 rounded-full bg-white transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150 group-hover:opacity-0" />
          <ArrowUpLeft
            size={24}
            weight="bold"
            className="relative transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:-rotate-12"
          />
        </Link>
      </motion.div>
    </motion.article>
  );
}
