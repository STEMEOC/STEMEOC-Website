"use client";

import { useEffect, useState, type ReactNode } from "react";

export const INTRO_DONE_EVENT = "stemeoc:intro-done";

/**
 * The header's white bar. On a load that plays the intro it starts as a
 * logo circle and grows into the bar once the intro has gone (see
 * .header-pill in globals.css); otherwise it is simply the bar.
 */
export function HeaderPill({ children, className }: { children: ReactNode; className: string }) {
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-intro-seen")) return;
    const open = () => setState("opening");
    window.addEventListener(INTRO_DONE_EVENT, open);
    return () => window.removeEventListener(INTRO_DONE_EVENT, open);
  }, []);

  return (
    <div
      data-state={state}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "max-width") setState("open");
      }}
      className={`header-pill ${className}`}
    >
      {children}
    </div>
  );
}
