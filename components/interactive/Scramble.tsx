"use client";

import { animate, scrambleText } from "animejs";
import { useRef } from "react";
import { useAnimeScope } from "@/components/interactive/useAnimeScope";

// Khmer letters stack into clusters; scrambling them one code point at a time
// would show broken glyphs, so Khmer labels stay still.
const KHMER = /[\u1780-\u17FF\u19E0-\u19FF]/;

/**
 * A label that briefly decodes from random characters when its link or
 * button is hovered or focused. The width is held while it scrambles so the
 * row around it never shifts. Screen readers get the plain label.
 */
export function Scramble(props: { text: string; className?: string }) {
  // Keyed on the text so a language switch remounts it (and re-runs the
  // effect) instead of React patching a text node anime.js has replaced.
  return <ScrambleLabel key={props.text} {...props} />;
}

function ScrambleLabel({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useAnimeScope(ref, (el) => {
    if (KHMER.test(text)) return;
    const trigger = el.closest<HTMLElement>("a, button") ?? el;
    let running = false;

    const play = () => {
      if (running) return;
      running = true;
      el.style.width = `${el.getBoundingClientRect().width}px`;
      animate(el, {
        innerHTML: scrambleText({ chars: "uppercase", settleDuration: 260, revealRate: 45 }),
        onComplete: () => {
          el.textContent = text;
          el.style.width = "";
          running = false;
        },
      });
    };

    trigger.addEventListener("pointerenter", play);
    trigger.addEventListener("focus", play);
    return () => {
      trigger.removeEventListener("pointerenter", play);
      trigger.removeEventListener("focus", play);
      el.textContent = text;
      el.style.width = "";
    };
  });

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden
        className={`inline-block overflow-visible whitespace-nowrap ${className ?? ""}`}
      >
        {text}
      </span>
    </>
  );
}
