"use client";

import { createScope, type Scope } from "animejs";
import { useEffect, type RefObject } from "react";

/**
 * Runs an anime.js setup inside a scope rooted at `root`, but only for a
 * mouse or trackpad (hover-capable, fine pointer) and when the reader hasn't
 * asked for reduced motion. The scope re-runs the setup if either media query
 * flips, and reverts every animation, draggable and listener on unmount.
 *
 * `setup` returns its own cleanup for listeners it adds by hand.
 */
export function useAnimeScope(
  root: RefObject<HTMLElement | null>,
  setup: (el: HTMLElement, scope: Scope) => void | (() => void),
) {
  useEffect(() => {
    const scope = createScope({
      root,
      mediaQueries: {
        motionOk: "(prefers-reduced-motion: no-preference)",
        finePointer: "(hover: hover) and (pointer: fine)",
      },
    }).add((self) => {
      const el = root.current;
      if (!el || !self?.matches.motionOk || !self.matches.finePointer) return;
      return setup(el, self) ?? undefined;
    });
    return () => scope.revert();
    // setup is a fresh closure every render; the effect should run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);
}
