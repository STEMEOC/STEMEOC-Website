"use client";

import { useRef, type ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// horizontal snap row with arrows
export function ScrollRow({
  children,
  className = "",
  labels,
}: {
  children: ReactNode;
  className?: string;
  labels: { prev: string; next: string };
}) {
  const list = useRef<HTMLUListElement>(null);

  function page(dir: number) {
    const el = list.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="relative">
      <ul ref={list} className={`flex snap-x snap-mandatory overflow-x-auto pb-6 scrollbar-rail ${className}`}>
        {children}
      </ul>
      {/* arrows on the row's edges, outside the cards on lg */}
      {[
        { dir: -1, label: labels.prev, Icon: CaretLeft, side: "left-0 -translate-x-1/2 lg:left-auto lg:right-full lg:mr-4 lg:translate-x-0" },
        { dir: 1, label: labels.next, Icon: CaretRight, side: "right-0 translate-x-1/2 lg:right-auto lg:left-full lg:ml-4 lg:translate-x-0" },
      ].map(({ dir, label, Icon, side }) => (
          <button
            key={dir}
            type="button"
            aria-label={label}
            onClick={() => page(dir)}
            className={`press absolute top-[calc(50%-0.75rem)] z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-navy bg-white text-navy shadow-md transition-colors hover:bg-navy hover:text-white ${side}`}
          >
            <Icon size={20} weight="bold" />
          </button>
      ))}
    </div>
  );
}
