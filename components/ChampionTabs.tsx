"use client";

import { useState } from "react";
import type { WinnerGroup } from "@/lib/program-pages";
import { BADGE_TONES, TeamCard } from "@/components/WinnersBoard";

/** Winning teams, one category at a time, split by division. */
export function ChampionTabs({ groups }: { groups: WinnerGroup[] }) {
  const categories = Array.from(new Set(groups.map((g) => g.category)));
  const [active, setActive] = useState(categories[0]);
  const shown = groups.filter((g) => g.category === active);

  return (
    <div>
      <div role="tablist" className="flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:flex-wrap md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={category === active}
            onClick={() => setActive(category)}
            className={`shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm font-semibold press ${
              category === active ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-navy hover:border-navy"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-10 space-y-12 md:mt-12">
        {shown.map((group, g) => (
          <section key={`${active}-${group.division ?? g}`} className="animate-item-in">
            {group.division && (
              <h3 className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.18em]">
                <span aria-hidden className="h-px flex-1 bg-navy/20" />
                {group.division}
                <span aria-hidden className="h-px flex-1 bg-navy/20" />
              </h3>
            )}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {group.teams.map((team, t) => (
                <li key={t}>
                  <TeamCard team={team} tone={BADGE_TONES[t % BADGE_TONES.length]} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
