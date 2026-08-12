"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Atom,
  Confetti,
  Robot,
  Leaf,
  Trophy,
  UsersThree,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/lib/i18n";

type Program = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  category: string;
};

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

const PROGRAM_ICONS: Record<string, typeof Confetti> = {
  festival: Confetti,
  robotics: Robot,
  eco: Leaf,
  innovation: Trophy,
  community: UsersThree,
};

const AUTO_SLIDE_MS = 4500;

export function ProgramsCarousel({
  programs,
  labels,
  categories,
}: {
  programs: Program[];
  labels: { learnMore: string };
  categories: Dictionary["projects"]["categories"];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = programs.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, AUTO_SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  if (count === 0) return null;

  const goTo = (index: number) => setActive(((index % count) + count) % count);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[480px] sm:h-[520px]">
        {programs.map((program, i) => {
          let offset = i - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const Icon = PROGRAM_ICONS[program.category] ?? Atom;
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];

          if (abs > 2) {
            return null;
          }

          return (
            <motion.div
              key={program.id}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: 10 - abs }}
              animate={{
                x: `calc(-50% + ${offset * 58}%)`,
                y: "-50%",
                scale: isCenter ? 1 : abs === 1 ? 0.82 : 0.66,
                opacity: 1,
              }}
              initial={false}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <Link
                href={`/projects/${program.slug}`}
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                className="group relative flex h-[430px] w-[310px] flex-col overflow-hidden rounded-[1.75rem] border-2 border-ink/10 bg-paper p-3 shadow-2xl sm:h-[460px] sm:w-[340px]"
              >
                <div className="relative h-52 w-full overflow-hidden rounded-2xl">
                  {program.coverImageUrl ? (
                    <Image
                      src={program.coverImageUrl}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="300px"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                  <div
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-paper shadow-md ring-2 ring-white/40"
                    style={{ backgroundColor: color }}
                  >
                    <Icon size={20} weight="bold" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center px-3 pb-2 pt-5 text-center">
                  <span
                    className="font-mono-label text-[11px] font-bold uppercase tracking-wide"
                    style={{ color }}
                  >
                    {(categories as Record<string, string>)[program.category] ?? program.category}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight">
                    {program.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
                    {program.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
                    {labels.learnMore}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
                <div
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: color }}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous program"
          onClick={() => goTo(active - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink shadow-md transition-transform hover:-translate-y-0.5"
        >
          <CaretLeft size={18} weight="bold" />
        </button>

        <button
          type="button"
          aria-label="Next program"
          onClick={() => goTo(active + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink shadow-md transition-transform hover:-translate-y-0.5"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
