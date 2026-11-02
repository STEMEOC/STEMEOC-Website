"use client";

import { createAnimatable } from "animejs";
import { useRef, type ReactNode } from "react";
import { useAnimeScope } from "@/components/interactive/useAnimeScope";

/**
 * Pulls its child toward the cursor while hovered, then lets go with an
 * elastic snap back. `strength` is how far it follows: 1 tracks the cursor
 * 1:1 from the center, 0.3 is a gentle tug.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useAnimeScope(ref, (el) => {
    const pull = createAnimatable(el, { x: 350, y: 350, ease: "out(3)" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pull.x((e.clientX - (r.left + r.width / 2)) * strength);
      pull.y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      pull.x(0, 900, "outElastic(1, .4)");
      pull.y(0, 900, "outElastic(1, .4)");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}
