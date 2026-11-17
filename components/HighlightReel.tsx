"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { YouTubePlayer } from "@/components/YouTubePlayer";

type Item = { year: string; title: string; image?: string; video?: string };

/**
 * One big player and a row of year thumbnails under it. Picking a year swaps
 * the player; years without a video show their photo instead.
 */
export function HighlightReel({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const item = items[active];
  if (!item) return null;

  return (
    <div>
      <div className="relative mx-auto max-w-3xl pb-3 pl-3">
        <span aria-hidden className="absolute inset-0 right-3 top-3 rounded-2xl bg-blue" />
        <div className="relative">
          {item.video ? (
            <YouTubePlayer key={item.video} videoId={item.video} title={item.title} sizes="(max-width: 768px) 100vw, 768px" />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-placeholder shadow-lg">
              {item.image && <Image key={item.image} src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover animate-item-in" />}
            </div>
          )}
        </div>
      </div>

      <ul className="mt-10 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-14 md:justify-center md:gap-6 md:overflow-visible">
        {items.map((it, i) => (
          <li key={it.year} className="w-56 shrink-0 snap-start md:w-[calc((100%-4.5rem)/4)]">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={it.title}
              className={`group relative block aspect-video w-full overflow-hidden rounded-xl bg-placeholder press ring-offset-2 ring-offset-navy transition-[box-shadow] ${
                i === active ? "ring-3 ring-blue" : "hover:ring-2 hover:ring-white/40"
              }`}
            >
              {it.image && (
                <Image src={it.image} alt="" fill sizes="(max-width: 768px) 224px, 300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <span className="absolute inset-0 bg-navy/25 transition-colors group-hover:bg-navy/10" />
              {it.video && (
                <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy">
                  <Play weight="fill" className="ml-0.5 size-4" />
                </span>
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-white px-3 py-0.5 text-xs font-bold text-navy">{it.year}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
