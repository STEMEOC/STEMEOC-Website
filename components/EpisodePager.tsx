"use client";

import { useState } from "react";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { Pagination } from "@/components/Pagination";

type Episode = { id: string; videoId: string; title: string; description: string; order: number };

const PAGE_SIZE = 3;

/** Episode cards, three per page. */
export function EpisodePager({
  episodes,
  labels,
}: {
  episodes: Episode[];
  labels: { episode: string; page: string; previous: string; next: string };
}) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(episodes.length / PAGE_SIZE);
  const shown = episodes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {shown.map((episode) => (
          <li key={episode.id} id={`episode-${episode.order}`} className="animate-item-in scroll-mt-32">
            <article className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)] ring-1 ring-navy/10">
              <YouTubePlayer
                videoId={episode.videoId}
                title={episode.title}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              />
              <h3 className="mt-4 font-body text-lg font-bold leading-snug">{episode.title}</h3>
              <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-navy/70">{episode.description}</p>
              <span className="mt-4 self-start rounded-full bg-green px-3 py-0.5 text-xs font-bold text-white">
                {labels.episode} {String(episode.order).padStart(2, "0")}
              </span>
            </article>
          </li>
        ))}
      </ul>
      <Pagination page={page} pages={pages} onChange={setPage} labels={labels} />
    </>
  );
}
