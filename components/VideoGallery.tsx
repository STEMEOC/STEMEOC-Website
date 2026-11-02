"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { YouTubePlayer } from "@/components/YouTubePlayer";

type Video = { id: string; videoId: string; title: string };

/** One big player with a column of thumbnails beside it; a thumbnail swaps the player. */
export function VideoGallery({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0);
  const main = videos[active];
  if (!main) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
      <div>
        <YouTubePlayer key={main.videoId} videoId={main.videoId} title={main.title} sizes="(max-width: 1024px) 100vw, 900px" />
        <p className="mt-4 font-bold">{main.title}</p>
      </div>
      <ul className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:flex-col lg:overflow-visible">
        {videos.map((video, i) =>
          i === active ? null : (
            <li key={video.id} className="w-56 shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={video.title}
                className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-placeholder press"
              >
                <Image
                  src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 224px, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-navy/25 transition-colors group-hover:bg-navy/10" />
                <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy">
                  <Play weight="fill" className="ml-0.5 size-4" />
                </span>
              </button>
              <p className="mt-2 line-clamp-1 text-sm font-semibold">{video.title}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
