"use client";

import { animate, stagger, utils } from "animejs";
import { useEffect } from "react";

const COLORS = ["var(--color-green)", "var(--color-orange)", "var(--color-red)", "var(--color-blue)"];
const SPARKS = 8;

/**
 * Every press anywhere on the page, on a control or not, fires a small burst
 * of sparks in the four logo colors from the point of contact. Mounted once
 * per layout; works for touch too. Skipped entirely when the reader prefers
 * reduced motion.
 */
export function ClickSparks() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function onPointerDown(e: PointerEvent) {
      if (reduce.matches || e.button !== 0) return;

      const burst = document.createElement("div");
      burst.setAttribute("aria-hidden", "true");
      burst.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;pointer-events:none;z-index:9999`;
      // Start each burst at a random turn so repeated clicks don't look stamped.
      const offset = utils.random(0, 360 / SPARKS);
      for (let i = 0; i < SPARKS; i++) {
        const spark = document.createElement("span");
        spark.style.cssText = `position:absolute;left:-1.5px;top:-11px;width:3px;height:9px;border-radius:2px;background:${COLORS[i % COLORS.length]};transform-origin:50% 11px;rotate:${offset + (360 / SPARKS) * i}deg`;
        burst.appendChild(spark);
      }
      document.body.appendChild(burst);

      animate(burst.children, {
        // Fly outward along each spark's own rotation, shrinking as they go.
        translateY: [0, () => -utils.random(14, 22)],
        scaleY: [1, 0.2],
        opacity: [1, 0],
        duration: 520,
        delay: stagger(8),
        ease: "out(3)",
        onComplete: () => burst.remove(),
      });
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
