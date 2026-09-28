"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpLeft, Pause, Play, X } from "@phosphor-icons/react";
import type { EasterEgg } from "@/lib/easter-egg";

// The slice of the YouTube IFrame API used here.
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, number>;
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_PLAYING = 1;
const SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;

let apiReady: Promise<YTNamespace> | null = null;
function loadYouTubeApi() {
  apiReady ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiReady;
}

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The profile card's corner button. Clicking it morphs the button into a mini
 * player for `egg`. YouTube's terms require the video to stay visible, so the
 * player shows a small thumbnail-sized embed rather than hiding it.
 */
export function EasterEggPlayer({
  egg,
  open,
  onOpenChange,
  onTime,
  onPlayingChange,
  backHref,
  backLabel,
}: {
  egg: EasterEgg;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTime: (seconds: number) => void;
  onPlayingChange: (playing: boolean) => void;
  backHref: string;
  backLabel: string;
}) {
  const reduce = useReducedMotion();
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch the API early so the song starts right after the click.
  useEffect(() => {
    loadYouTubeApi();
  }, []);

  useEffect(() => {
    if (!open || !mount.current) return;
    let cancelled = false;
    // YouTube replaces the element it's given, so hand it a child React doesn't manage.
    const el = document.createElement("div");
    mount.current.appendChild(el);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      player.current = new YT.Player(el, {
        videoId: egg.videoId,
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1, disablekb: 1 },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const now = e.data === YT_PLAYING;
            setPlaying(now);
            onPlayingChange(now);
          },
        },
      });
    });

    const tick = setInterval(() => {
      const t = player.current?.getCurrentTime();
      if (t === undefined) return;
      setTime(t);
      onTime(t);
    }, 200);

    return () => {
      cancelled = true;
      clearInterval(tick);
      player.current?.destroy();
      player.current = null;
      el.remove();
      setPlaying(false);
      setTime(0);
      onPlayingChange(false);
      onTime(0);
    };
  }, [open, egg.videoId, onTime, onPlayingChange]);

  function toggle() {
    if (playing) player.current?.pauseVideo();
    else player.current?.playVideo();
  }

  function seek(e: MouseEvent<HTMLDivElement>) {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - rect.left) / rect.width) * duration;
    player.current?.seekTo(t, true);
    setTime(t);
    onTime(t);
  }

  const transition = reduce ? { duration: 0 } : SPRING;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {!open ? (
        <motion.button
          key="button"
          layoutId="easter-egg"
          type="button"
          onClick={() => onOpenChange(true)}
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
          style={{ borderRadius: 22 }}
          className="w-[min(23rem,calc(100vw-5rem))] bg-white p-2 text-navy shadow-[0_24px_50px_-20px_rgb(0_0_0/0.6)]"
          role="region"
          aria-label={`Now playing: ${egg.title} by ${egg.artist}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.18, duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <div ref={mount} className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-[14px] bg-navy [&>iframe]:absolute [&>iframe]:inset-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">{egg.title}</p>
              <p className="truncate text-xs text-navy/55">{egg.artist}</p>
              <div
                onClick={seek}
                className="group/bar mt-2 flex h-3 cursor-pointer items-center"
                role="progressbar"
                aria-label="Song position"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(time)}
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-navy/10 transition-[height] group-hover/bar:h-1.5">
                  <div className="h-full rounded-full bg-navy" style={{ width: duration ? `${(time / duration) * 100}%` : "0%" }} />
                </div>
              </div>
              <p className="mt-0.5 text-[11px] tabular-nums text-navy/50">
                {clock(time)} / {clock(duration)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="flex size-10 items-center justify-center rounded-full bg-navy text-white transition-transform active:scale-90"
              >
                {playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
              </button>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close player"
                  className="flex size-7 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/10 hover:text-navy"
                >
                  <X size={14} weight="bold" />
                </button>
                <Link
                  href={backHref}
                  aria-label={backLabel}
                  title={backLabel}
                  className="flex size-7 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/10 hover:text-navy"
                >
                  <ArrowUpLeft size={14} weight="bold" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
