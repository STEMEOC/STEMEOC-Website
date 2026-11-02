"use client";

import { createAnimatable } from "animejs";
import { useRef, type ReactNode } from "react";
import { useAnimeScope } from "@/components/interactive/useAnimeScope";

/**
 * Leans toward the cursor in 3D, with a soft light that follows the pointer
 * across the surface, and wobbles back flat on leave. `max` is the tilt in
 * degrees at the card's edge.
 */
export function TiltCard({
  children,
  max = 10,
  glare = true,
  className,
}: {
  children: ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useAnimeScope(ref, (el) => {
    const tilt = createAnimatable(el, {
      rotateX: { unit: "deg", duration: 450 },
      rotateY: { unit: "deg", duration: 450 },
      scale: 400,
      ease: "out(3)",
    });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -0.5 … 0.5 from the card's center.
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.rotateY(px * max * 2);
      tilt.rotateX(-py * max * 2);
      tilt.scale(1.03);
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    };
    const onLeave = () => {
      tilt.rotateX(0, 1100, "outElastic(1, .45)");
      tilt.rotateY(0, 1100, "outElastic(1, .45)");
      tilt.scale(1, 600, "outElastic(1, .6)");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <div className={`[perspective:900px] ${className ?? ""}`}>
      <div ref={ref} className="group/tilt relative rounded-[inherit] [transform-style:preserve-3d] will-change-transform">
        {children}
        {glare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/tilt:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.85), transparent 55%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
