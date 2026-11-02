"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import printer from "@/components/motion/printer-intro.json";
import { INTRO_DONE_EVENT } from "@/components/HeaderPill";

export const INTRO_STORAGE_KEY = "stemeoc-intro-seen";

const EASE = [0.76, 0, 0.24, 1] as const;
const SLIDE = 0.8;
// fallback
const SAFETY_MS = 10000;
const LAST_FRAME = printer.op - 1;

const LottieSvg = dynamic(() => import("lottie-react").then((m) => m.LottieSvg), {
  ssr: false,
  loading: () => <span className="block size-full" />,
});

// opening screen
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<"printing" | "leaving" | "done">("printing");
  const [percent, setPercent] = useState(0);
  const subscriptions = useMemo(
    () => ({
      complete: () => setState("leaving"),
      frame: ({ currentFrame }: { currentFrame: number }) =>
        setPercent(Math.min(100, Math.round((currentFrame / LAST_FRAME) * 100))),
    }),
    [],
  );

  useEffect(() => {
    // css hides it
    if (document.documentElement.hasAttribute("data-intro-seen")) return;
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}
    const id = setTimeout(() => setState("leaving"), reduce ? 0 : SAFETY_MS);
    return () => clearTimeout(id);
  }, [reduce]);

  if (state === "done") return null;

  return (
    <motion.div
      aria-hidden
      className="intro-curtain pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy"
      initial={{ y: "0%" }}
      animate={{ y: state === "leaving" ? "-100%" : "0%" }}
      transition={{ duration: SLIDE, ease: EASE }}
      onAnimationComplete={() => {
        if (state !== "leaving") return;
        setState("done");
        window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      }}
    >
      <div className="size-36 overflow-hidden md:size-44 [&_svg]:!size-full">
        <LottieSvg src={printer} autoplay loop={false} subscriptions={subscriptions} className="size-full" />
      </div>
      {/* progress */}
      <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-white/15 md:w-48">
        <div className="h-full origin-left rounded-full bg-[#f6a623]" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className="mt-3 font-body text-sm font-bold tabular-nums text-[#f6a623]">{percent}%</p>
    </motion.div>
  );
}
