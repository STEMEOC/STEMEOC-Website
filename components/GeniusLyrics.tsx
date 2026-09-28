"use client";

import { useEffect, useRef } from "react";
import type { LyricsLine } from "@/lib/genius";

/** How long a manual scroll pauses the auto-follow. */
const HOLD_MS = 4000;

/**
 * Song lyrics (from Genius, fetched on the server) in the profile card.
 * Genius lyrics aren't timed, so the list scrolls in proportion to how much
 * of the song has played; scrolling by hand pauses that for a few seconds.
 */
export function GeniusLyrics({
  lines,
  url,
  title,
  artist,
  progress,
}: {
  lines: LyricsLine[] | null;
  url: string;
  title: string;
  artist: string;
  /** Fraction of the song played, 0..1. */
  progress: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const heldUntil = useRef(0);

  useEffect(() => {
    const el = box.current;
    if (!el || Date.now() < heldUntil.current) return;
    const target = Math.round(progress * (el.scrollHeight - el.clientHeight));
    if (Math.abs(el.scrollTop - target) > 6) el.scrollTo({ top: target, behavior: "smooth" });
  }, [progress]);

  const hold = () => (heldUntil.current = Date.now() + HOLD_MS);
  const credit = (
    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-white/45 underline-offset-4 hover:text-white hover:underline">
      Lyrics from Genius
    </a>
  );

  if (!lines) {
    return (
      <p className="text-white/70">
        Read{" "}
        <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-4">
          “{title}” by {artist}
        </a>{" "}
        on Genius.
      </p>
    );
  }

  return (
    <div>
      <div
        ref={box}
        onWheel={hold}
        onTouchMove={hold}
        tabIndex={0}
        aria-label={`Lyrics for ${title} by ${artist}`}
        className="h-72 overflow-y-auto overscroll-contain py-10 [mask-image:linear-gradient(transparent,black_15%,black_80%,transparent)] [scrollbar-width:none] focus-visible:outline-none lg:h-80 [&::-webkit-scrollbar]:hidden"
      >
        {lines.map((line, i) =>
          line.kind === "gap" ? (
            <div key={i} className="h-5" />
          ) : line.kind === "section" ? (
            <p key={i} className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {line.text.slice(1, -1)}
            </p>
          ) : (
            <p key={i} className="text-lg font-semibold leading-relaxed text-white/85 lg:text-xl">
              {line.text}
            </p>
          )
        )}
      </div>
      <div className="mt-2">{credit}</div>
    </div>
  );
}
