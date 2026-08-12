"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";

export function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-3xl bg-ink shadow-lg">
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
      className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-ink shadow-lg"
    >
      <Image
        src={thumbnail}
        alt=""
        fill
        onError={() => setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 560px"
      />
      <div className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/40" />
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <Play size={56} weight="fill" className="text-paper drop-shadow-lg" />
      </span>
    </button>
  );
}
