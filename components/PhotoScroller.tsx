"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { Photo } from "@/lib/program-pages";

type Labels = { open: string; prev: string; next: string; close: string };

/** Scrollable photo list (vertical next to a video, grid without); click opens a full-size viewer. */
export function PhotoScroller({ photos, vertical, labels }: { photos: Photo[]; vertical: boolean; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (dir: number) => setIndex((i) => (i + dir + photos.length) % photos.length);
  const photo = photos[index];

  return (
    <>
      {/* photo column */}
      <div className={vertical ? "relative" : undefined}>
      <ul
        className={
          vertical
            ? "flex snap-y snap-mandatory gap-4 overflow-x-auto scrollbar-rail max-lg:pb-4 lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-10 lg:flex-col lg:overflow-y-auto lg:pr-3"
            : "grid grid-cols-2 gap-4 sm:grid-cols-3"
        }
      >
        {photos.map((p, i) => (
          <li key={p.src} className={vertical ? "w-[45%] shrink-0 snap-start sm:w-[30%] lg:w-auto" : undefined}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`${labels.open}: ${p.alt}`}
              className="group relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl bg-placeholder"
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      </div>

      {/* full-size viewer */}
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-navy/90"
      >
        <figure className="relative w-[min(92vw,1200px)]">
          <div className="relative aspect-[3/2] max-h-[80vh] w-full">
            <Image src={photo.src} alt={photo.alt} fill quality={90} sizes="92vw" className="object-contain" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-white/80">
            {photo.alt} · {index + 1}/{photos.length}
          </figcaption>
          {photos.length > 1 &&
            [
              { dir: -1, label: labels.prev, Icon: CaretLeft, side: "left-2" },
              { dir: 1, label: labels.next, Icon: CaretRight, side: "right-2" },
            ].map(({ dir, label, Icon, side }) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                onClick={() => step(dir)}
                className={`absolute top-[calc(50%-1rem)] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-md hover:bg-navy hover:text-white ${side}`}
              >
                <Icon size={20} weight="bold" />
              </button>
            ))}
          <button
            type="button"
            aria-label={labels.close}
            onClick={() => dialog.current?.close()}
            className="absolute -top-14 right-0 flex size-11 items-center justify-center rounded-full bg-white text-navy hover:bg-navy hover:text-white"
          >
            <X size={20} weight="bold" />
          </button>
        </figure>
      </dialog>
    </>
  );
}
