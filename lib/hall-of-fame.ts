import { getPrograms } from "@/lib/content";
import { PROGRAM_PAGES, type WinnerGroup } from "@/lib/program-pages";
import { programLogo } from "@/lib/brand";

/** One edition that has published winners, ready for the Hall of Fame page. */
export type HallEntry = {
  id: string;
  programSlug: string;
  programTitle: string;
  programLogo: string | null;
  eventSlug: string;
  eventTitle: string;
  href: string;
  year: string;
  date: string;
  venue: string | null;
  photo: { src: string; alt: string } | null;
  intro: string | null;
  groups: WinnerGroup[];
  teamCount: number;
};

/** An award-ceremony photo, for the strip of winners on stage. */
export type StagePhoto = { src: string; alt: string; event: string; href: string };

export type HallOfFame = { entries: HallEntry[]; stage: StagePhoto[] };

/**
 * Every edition with published winners, newest first, and their award-ceremony
 * photos. Winners live in lib/program-pages.ts; program names come from the
 * Program table so renames there carry through.
 */
export async function getHallOfFame(): Promise<HallOfFame> {
  const programs = await getPrograms();
  const entries: HallEntry[] = [];
  const stage: StagePhoto[] = [];

  for (const [slug, page] of Object.entries(PROGRAM_PAGES)) {
    const program = programs.find((p) => p.slug === slug);
    const programTitle = program?.title ?? page.heroTitle ?? slug;
    for (const event of page.events ?? []) {
      if (!event.winners || event.winners.groups.length === 0) continue;
      const href = `/projects/${slug}/${event.slug}`;
      const photo = event.winners.photos?.[0] ?? event.photos?.[0] ?? (event.image ? { src: event.image, alt: "" } : null);
      entries.push({
        id: `${slug}/${event.slug}`,
        programSlug: slug,
        programTitle,
        programLogo: programLogo({ slug, title: programTitle }),
        eventSlug: event.slug,
        eventTitle: event.title,
        href,
        year: event.year.match(/\d{4}/)?.[0] ?? event.year,
        date: event.date,
        venue: event.venue ?? null,
        photo: photo ? { src: photo.src, alt: photo.alt } : null,
        intro: event.winners.intro ?? null,
        groups: event.winners.groups,
        teamCount: event.winners.groups.reduce((n, g) => n + g.teams.length, 0),
      });
      for (const p of event.winners.photos ?? []) stage.push({ src: p.src, alt: p.alt, event: event.title, href });
    }
  }

  entries.sort((a, b) => b.year.localeCompare(a.year) || a.programTitle.localeCompare(b.programTitle));
  return { entries, stage };
}
