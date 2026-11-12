"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

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

  // translucent once the page's first section (the hero) has scrolled past the bar
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    function update() {
      const hero = document.querySelector("main section");
      const bar = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= bar : window.scrollY > 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  return (
    <div
      data-state={state}
      data-scrolled={scrolled || undefined}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "max-width") setState("open");
      }}
      className={`header-pill ${className}`}
    >
      {children}
    </div>
  );
}
