"use client";

import { animate, createDraggable, spring } from "animejs";
import { useRef, type ReactNode } from "react";
import { useAnimeScope } from "@/components/interactive/useAnimeScope";

/**
 * Something to play with: grab it, fling it, and it springs back home.
 * It leans into the direction it's dragged and lifts slightly while held.
 * Mouse only, so on touch screens a swipe over it still scrolls the page.
 */
export function DraggableToy({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useAnimeScope(ref, (el) => {
    const inner = el.firstElementChild as HTMLElement;

    createDraggable(el, {
      // A zero-size container: it can be pulled anywhere, but always returns.
      container: [0, 0, 0, 0],
      containerFriction: 0.6,
      releaseEase: spring({ bounce: 0.55, duration: 700 }),
      cursor: { onHover: "grab", onGrab: "grabbing" },
      onGrab: () => animate(inner, { scale: 1.06, duration: 250, ease: "out(3)" }),
      // Lean into the drag: a fast sideways pull tips it up to 14°.
      onDrag: (d) =>
        animate(inner, { rotate: Math.max(-14, Math.min(14, d.deltaX * 0.8)), duration: 300, ease: "out(2)" }),
      onRelease: () =>
        animate(inner, { scale: 1, rotate: 0, ease: spring({ bounce: 0.6, duration: 800 }) }),
    });
  });

  return (
    <div ref={ref} className={`touch-pan-y select-none ${className ?? ""}`}>
      <div className="[&_img]:pointer-events-none">{children}</div>
    </div>
  );
}
