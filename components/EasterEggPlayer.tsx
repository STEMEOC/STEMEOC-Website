"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowClockwise, ArrowCounterClockwise, ArrowUpLeft, Pause, Play, X } from "@phosphor-icons/react";
import type { EasterEgg } from "@/lib/easter-egg";

const SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** A record that turns while the song plays. */
function Vinyl({ spinning }: { spinning: boolean }) {
  return (
    <div
      aria-hidden
      className="relative size-14 shrink-0 animate-[spin-slow_4s_linear_infinite] rounded-full bg-[repeating-radial-gradient(circle,#11121f_0_2px,#1d1f33_2px_3px)] shadow-[inset_0_0_0_2px_rgb(255_255_255/0.06),0_8px_18px_-8px_rgb(5_19_59/0.8)] motion-reduce:animate-none sm:size-16"
      style={{ animationPlayState: spinning ? "running" : "paused" }}
    >
      {/* Light catching the grooves */}
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0_15%,rgb(255_255_255/0.14)_20%,transparent_28%_65%,rgb(255_255_255/0.1)_70%,transparent_78%)]" />
      {/* Label in the four logo colors, with the STEM mark */}
      <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-[conic-gradient(var(--color-green)_0_25%,var(--color-orange)_0_50%,var(--color-red)_0_75%,var(--color-blue)_0)]">
        <span className="relative size-[70%] overflow-hidden rounded-full bg-white">
          <Image src="/brand/logo-mark.png" alt="" fill sizes="32px" className="object-contain p-px" />
        </span>
      </span>
    </div>
  );
}

/**
 * The profile card's corner button. Clicking it morphs the button into a mini
 * player for `egg` and starts the song. Playback starts inside the click
 * handler itself, which is what lets it autoplay on iOS.
 */
export function EasterEggPlayer({
  egg,
  open,
  onOpenChange,
  onProgress,
  onPlayingChange,
  backHref,
  backLabel,
}: {
  egg: EasterEgg;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fraction of the song played, 0..1. */
  onProgress: (fraction: number) => void;
  onPlayingChange: (playing: boolean) => void;
  backHref: string;
  backLabel: string;
}) {
  const reduce = useReducedMotion();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    onProgress(duration ? time / duration : 0);
  }, [time, duration, onProgress]);

  useEffect(() => {
    onPlayingChange(playing);
  }, [playing, onPlayingChange]);

  function openPlayer() {
    onOpenChange(true);
    audio.current?.play().catch(() => {
      // Blocked or failed: the play button is right there.
    });
  }

  function closePlayer() {
    const el = audio.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    onOpenChange(false);
  }

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }

  function seekTo(t: number) {
    const el = audio.current;
    if (!el || !duration) return;
    el.currentTime = Math.min(Math.max(t, 0), duration);
    setTime(el.currentTime);
  }

  function seekClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    seekTo(((e.clientX - rect.left) / rect.width) * duration);
  }

  function seekKey(e: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowRight: 5, Home: -Infinity, End: Infinity };
    const step = steps[e.key];
    if (step === undefined) return;
    e.preventDefault();
    seekTo(time + step);
  }

  const progress = duration ? (time / duration) * 100 : 0;
  const transition = reduce ? { duration: 0 } : SPRING;
  const iconButton =
    "flex size-8 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/10 hover:text-navy";

  return (
    <>
      <audio
        ref={audio}
        src={egg.audioSrc}
        preload="none"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <AnimatePresence initial={false} mode="popLayout">
        {!open ? (
          <motion.button
            key="button"
            layoutId="easter-egg"
            type="button"
            onClick={openPlayer}
            aria-label={backLabel}
            title={backLabel}
            transition={transition}
            style={{ borderRadius: 999 }}
            className="group relative flex size-11 items-center justify-center bg-white text-navy md:size-14"
          >
            <span className="absolute inset-0 rounded-full bg-white transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150 group-hover:opacity-0" />
            {/* A slow spin on hover, like a record, hints there's more than a back link here. */}
            <ArrowUpLeft
              size={24}
              weight="bold"
              className="relative group-hover:animate-[spin-slow_3s_linear_infinite] motion-reduce:group-hover:animate-none"
            />
          </motion.button>
        ) : (
          <motion.div
            key="player"
            layoutId="easter-egg"
            transition={transition}
            style={{ borderRadius: 24 }}
            className="w-[min(32rem,calc(100vw-5rem))] bg-white p-3 text-navy shadow-[0_24px_50px_-20px_rgb(0_0_0/0.6)]"
            role="region"
            aria-label={`Now playing: ${egg.title} by ${egg.artist}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.18, duration: 0.25 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Vinyl spinning={playing} />
                <div className="min-w-0 flex-1">
                  <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40 sm:block">Now playing</p>
                  <p className="truncate text-base font-bold leading-tight sm:mt-0.5 sm:text-lg">{egg.title}</p>
                  <p className="truncate text-sm text-navy/55">{egg.artist}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => seekTo(time - 10)} aria-label="Back 10 seconds" className={`${iconButton} hidden sm:flex`}>
                    <ArrowCounterClockwise size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? "Pause" : "Play"}
                    className="flex size-12 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_18px_-8px_rgb(5_19_59/0.8)] transition-transform hover:scale-105 active:scale-90"
                  >
                    {playing ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" className="translate-x-px" />}
                  </button>
                  <button type="button" onClick={() => seekTo(time + 10)} aria-label="Forward 10 seconds" className={`${iconButton} hidden sm:flex`}>
                    <ArrowClockwise size={18} weight="bold" />
                  </button>
                </div>
                <div className="flex shrink-0 flex-col self-start">
                  <button type="button" onClick={closePlayer} aria-label="Close player" className={iconButton}>
                    <X size={15} weight="bold" />
                  </button>
                  <Link href={backHref} aria-label={backLabel} title={backLabel} className={iconButton}>
                    <ArrowUpLeft size={15} weight="bold" />
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 px-1">
                <span className="w-9 text-right text-xs tabular-nums text-navy/50">{clock(time)}</span>
                <div
                  onClick={seekClick}
                  onKeyDown={seekKey}
                  tabIndex={0}
                  role="slider"
                  aria-label="Song position"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuenow={Math.round(time)}
                  aria-valuetext={`${clock(time)} of ${clock(duration)}`}
                  className="group/bar relative flex h-4 flex-1 cursor-pointer items-center rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-navy"
                >
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
                    {/* The gradient spans the whole track, so the fill reveals more colors as the song plays. */}
                    <div className="h-full overflow-hidden rounded-full" style={{ width: `${progress}%` }}>
                      <div
                        className="h-full bg-[linear-gradient(90deg,var(--color-green),var(--color-orange),var(--color-red),var(--color-blue))]"
                        style={{ width: progress ? `${(100 / progress) * 100}%` : "100%" }}
                      />
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="absolute size-3.5 -translate-x-1/2 rounded-full bg-navy shadow ring-2 ring-white transition-transform group-hover/bar:scale-125"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <span className="w-9 text-xs tabular-nums text-navy/50">{clock(duration)}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
