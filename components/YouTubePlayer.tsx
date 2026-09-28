"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";

/**
 * YouTube thumbnail that swaps to the embedded player on click, so the
 * page doesn't load YouTube's scripts until someone actually plays.
 */
export function YouTubePlayer({
  videoId,
  title,
  sizes = "(max-width: 768px) 100vw, 560px",
  priority = false,
}: {
  videoId: string;
  title: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group/play relative block aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lg transition-[scale] duration-150 active:scale-[0.99]"
    >
      <Image
        src={thumbnail}
        alt=""
        fill
        priority={priority}
        onError={() => setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/play:scale-105"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-navy/20 transition-colors duration-500 group-hover/play:bg-navy/40" />
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:size-20">
        {/* Ring that swells out from the button on hover */}
        <span className="absolute inset-0 rounded-full bg-white/30 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/play:scale-150" />
        <span className="relative flex size-full items-center justify-center rounded-full bg-white text-navy shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/play:scale-110">
          <Play weight="fill" className="ml-1 size-6 md:size-8" />
        </span>
      </span>
    </button>
  );
}
