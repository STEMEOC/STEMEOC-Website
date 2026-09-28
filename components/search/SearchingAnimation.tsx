"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import searching from "@/components/search/searching.json";

// The Lottie engine is large and browser-only, so it loads on first use. The
// svg build is enough here and smaller than the full one.
const LottieSvg = dynamic(() => import("lottie-react").then((m) => m.LottieSvg), {
  ssr: false,
  loading: () => <span className="block size-full" />,
});

/**
 * The "searching" Lottie: a magnifying glass sweeping over four logo-color
 * dots. With reduced motion it shows the still first frame.
 */
export function SearchingAnimation({ className = "size-40", label }: { className?: string; label?: string }) {
  const reduce = useReducedMotion();
  return (
    <span role="status" className={`block ${className}`}>
      <LottieSvg src={searching} loop autoplay={!reduce} className="size-full" aria-hidden />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
