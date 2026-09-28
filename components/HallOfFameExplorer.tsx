"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarBlank, GraduationCap, MapPin, Medal, Trophy } from "@phosphor-icons/react";
import type { HallEntry } from "@/lib/hall-of-fame";
import type { WinnerTeam } from "@/lib/program-pages";
import { schoolLogo } from "@/lib/brand";

const EASE = [0.16, 1, 0.3, 1] as const;
const LOGO_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

type Labels = {
  program: string;
  year: string;
  all: string;
  allYears: string;
  teams: string;
  viewEvent: string;
  empty: string;
};

function initials(text: string) {
  const words = text.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2)).toUpperCase();
}

/** A student's face: their portrait, or their initials in the edition's color. */
function StudentFace({ name, photo, color }: { name: string; photo?: string; color: string }) {
  return (
    <li className="flex flex-col items-center text-center">
      <span
        className="relative flex size-16 items-center justify-center overflow-hidden rounded-full text-lg font-extrabold ring-2 ring-white shadow-[0_8px_20px_-10px_rgb(5_19_59/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 md:size-20"
        style={photo ? undefined : { backgroundColor: `color-mix(in srgb, ${color} 16%, white)`, color }}
      >
        {photo ? (
          <Image src={photo} alt={name} fill sizes="80px" className="object-cover" />
        ) : (
          <span aria-hidden>{initials(name)}</span>
        )}
      </span>
      <span className="mt-2 text-sm font-bold leading-tight">{name}</span>
    </li>
  );
}

/**
 * One winning team, students first: an optional team photo, then a face and
 * name for every student, with the team and school beneath.
 */
function WinnerCard({ team, color }: { team: WinnerTeam; color: string }) {
  const logo = schoolLogo(team.school);
  const members = team.members ?? [];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-26px_rgb(5_19_59/0.5)]">
      {team.photo && (
        <div className="relative aspect-[4/3] overflow-hidden bg-paper">
          <Image
            src={team.photo}
            alt={team.name ? `Team ${team.name}` : ""}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {team.place && (
          <p className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-orange/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[#8a4b06]">
            <Medal size={13} weight="fill" />
            {team.place}
          </p>
        )}

        {members.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-4">
            {members.map((m) => (
              <StudentFace key={m} name={m} photo={team.portraits?.[m]} color={color} />
            ))}
          </ul>
        ) : (
          !team.photo && (
            <span
              aria-hidden
              className="mx-auto flex size-16 items-center justify-center rounded-full md:size-20"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, white)`, color }}
            >
              <Trophy size={30} weight="duotone" />
            </span>
          )
        )}

        {/* The team: name, school, country */}
        <div className={`mt-auto text-center ${members.length > 0 || !team.photo ? "pt-4" : ""}`}>
          {team.name && <h5 className="font-display text-base font-bold leading-snug">{team.name}</h5>}
          {team.country && <p className="text-sm text-navy/55">{team.country}</p>}
          {team.school && (
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs leading-snug text-navy/60">
              {logo ? (
                <span className="relative size-4 shrink-0">
                  <Image src={logo} alt="" fill sizes="16px" className="object-contain" />
                </span>
              ) : (
                <GraduationCap size={13} className="shrink-0" />
              )}
              {team.school}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** One edition: its year, photo and details on the left, winners by category on the right. */
function Edition({ entry, color, labels }: { entry: HallEntry; color: string; labels: Labels }) {
  const categories = Array.from(new Set(entry.groups.map((g) => g.category)));
  return (
    <article className="grid gap-8 border-t border-navy/15 py-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14 lg:py-16">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl font-bold leading-none tabular-nums" style={{ color }}>
            {entry.year}
          </span>
          {entry.programLogo && (
            <span className="relative h-10 w-24 shrink-0">
              <Image src={entry.programLogo} alt={entry.programTitle} fill sizes="96px" className="object-contain object-left" />
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight">{entry.eventTitle}</h3>
        <ul className="mt-3 space-y-1 text-sm text-navy/65">
          <li className="flex items-center gap-2">
            <CalendarBlank size={15} weight="bold" className="shrink-0" />
            {entry.date}
          </li>
          {entry.venue && (
            <li className="flex items-center gap-2">
              <MapPin size={15} weight="bold" className="shrink-0" />
              {entry.venue}
            </li>
          )}
          <li className="flex items-center gap-2">
            <Trophy size={15} weight="bold" className="shrink-0" />
            {entry.teamCount} {labels.teams}
          </li>
        </ul>
        {entry.photo && (
          <Link href={entry.href} className="group mt-5 block overflow-hidden rounded-2xl bg-paper" tabIndex={-1} aria-hidden>
            <div className="relative aspect-[16/10]">
              <Image
                src={entry.photo.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </Link>
        )}
        <Link
          href={entry.href}
          className="group mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase"
          style={{ color }}
        >
          <span className="link-underline">{labels.viewEvent}</span>
          <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="space-y-10">
        {entry.intro && <p className="max-w-3xl text-base leading-relaxed text-navy/75">{entry.intro}</p>}
        {categories.map((category) => {
          const inCategory = entry.groups.filter((g) => g.category === category);
          return (
            <section key={category}>
              <h4 className="flex items-center gap-3 font-display text-xl font-bold">
                <span
                  className="flex size-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
                >
                  <Trophy size={18} weight="duotone" />
                </span>
                {category}
              </h4>
              <div className="mt-4 space-y-5">
                {inCategory.map((group, g) => (
                  <div key={group.division ?? g}>
                    {group.division && (
                      <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-navy/50">
                        {group.division}
                        <span aria-hidden className="h-px flex-1 bg-navy/10" />
                      </p>
                    )}
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {group.teams.map((team, t) => (
                        <li key={`${team.name ?? team.school ?? ""}-${t}`}>
                          <WinnerCard team={team} color={color} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}

const chip =
  "press relative shrink-0 snap-start rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap";

/** A row of filter chips; the navy fill slides to the chosen one. */
function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
  allLabel,
  layoutId,
}: {
  label: string;
  options: [T, string][];
  value: T | null;
  onChange: (v: T | null) => void;
  allLabel: string;
  layoutId: string;
}) {
  const all: [T | null, string][] = [[null, allLabel], ...options];
  return (
    // On phones the label sits above one swipeable row that bleeds to the
    // screen edges, so long program names never wrap or get clipped.
    <div className="min-w-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-navy/50 sm:mb-0 sm:mr-1">{label}</span>
      <div className="-mx-(--gutter) flex snap-x scroll-px-(--gutter) gap-2 overflow-x-auto px-(--gutter) py-1 [scrollbar-width:none] sm:contents [&::-webkit-scrollbar]:hidden">
      {all.map(([v, text]) => {
        const on = value === v;
        return (
          <button
            key={v ?? "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(v)}
            className={`${chip} ${on ? "text-white" : "text-navy/70 ring-1 ring-navy/15 hover:text-navy hover:ring-navy/40"}`}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-navy"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{text}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

/** Program and year filters above the list of editions. */
export function HallOfFameExplorer({ entries, labels }: { entries: HallEntry[]; labels: Labels }) {
  const programs = useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of entries) if (!seen.has(e.programSlug)) seen.set(e.programSlug, e.programTitle);
    return [...seen.entries()];
  }, [entries]);
  const years = useMemo(() => [...new Set(entries.map((e) => e.year))].sort().reverse(), [entries]);
  const programColor = (slug: string) => LOGO_COLORS[programs.findIndex(([s]) => s === slug) % LOGO_COLORS.length];

  const [program, setProgram] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const shown = entries.filter((e) => (!program || e.programSlug === program) && (!year || e.year === year));

  return (
    <div>
      <div className="flex flex-col gap-4 pb-8 lg:flex-row lg:items-center lg:justify-between">
        <Chips
          label={labels.program}
          options={programs}
          value={program}
          onChange={setProgram}
          allLabel={labels.all}
          layoutId="hof-program"
        />
        <Chips
          label={labels.year}
          options={years.map((y) => [y, y] as [string, string])}
          value={year}
          onChange={setYear}
          allLabel={labels.allYears}
          layoutId="hof-year"
        />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {shown.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-t border-navy/15 py-16 text-center text-navy/60"
          >
            {labels.empty}
          </motion.p>
        ) : (
          shown.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Edition entry={entry} color={programColor(entry.programSlug)} labels={labels} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
