"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Photo } from "@/lib/program-pages";

/**
 * Up to three photos stacked with an offset; clicking the stack sends the
 * front photo to the back.
 */
export function PhotoStack({ photos, label }: { photos: Photo[]; label: string }) {
  const stack = photos.slice(0, 3);
  const [front, setFront] = useState(0);
  const reduce = useReducedMotion();
  if (stack.length === 0) return null;

  // spot 0 = front, higher = further back
  const spot = (i: number) => (i - front + stack.length) % stack.length;
  const step = 20;
  const pad = (stack.length - 1) * step;

  return (
    <button
      type="button"
      onClick={() => setFront((f) => (f + 1) % stack.length)}
      disabled={stack.length < 2}
      aria-label={label}
      className="group relative block w-full cursor-pointer text-left disabled:cursor-default"
      style={{ paddingRight: pad, paddingBottom: pad }}
    >
      <span className="relative block aspect-[4/5]">
        {stack.map((photo, i) => {
          const s = spot(i);
          return (
            <motion.span
              key={photo.src}
              className="absolute inset-0 overflow-hidden rounded-2xl bg-placeholder shadow-[0_20px_40px_-24px_rgb(5_19_59/0.6)] ring-4 ring-white"
              initial={false}
              animate={{ x: s * step, y: s * step, scale: 1 - s * 0.02, zIndex: stack.length - s }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
            >
              <Image
                src={photo.src}
                alt={s === 0 ? photo.alt : ""}
                fill
                quality={90}
                sizes="(max-width: 1024px) 100vw, 448px"
                className={`object-cover transition-[filter] duration-500 ${s === 0 ? "" : "brightness-75"}`}
              />
            </motion.span>
          );
        })}
      </span>
      {stack.length > 1 && (
        <span className="mt-5 flex gap-1.5" aria-hidden>
          {stack.map((photo, i) => (
            <span key={photo.src} className={`h-1.5 rounded-full transition-all duration-300 ${i === front ? "w-6 bg-navy" : "w-1.5 bg-navy/25"}`} />
          ))}
        </span>
      )}
    </button>
  );
}
