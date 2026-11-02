"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

// smooth scroll
export function SmoothScroll() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -96 } }} />;
}
