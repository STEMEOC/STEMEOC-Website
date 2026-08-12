"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Neuters all Motion animations for users with prefers-reduced-motion,
 * without any SSR/client branching in individual components (which would
 * cause hydration mismatches since the server can't know the OS preference).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
