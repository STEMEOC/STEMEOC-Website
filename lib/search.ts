import { getNewsPosts, getPodcastEpisodes, getPrograms, getTeamMembers, teamMemberSlug } from "@/lib/content";
import { PROGRAM_PAGES } from "@/lib/program-pages";
import { programLogo } from "@/lib/brand";

export const SEARCH_TYPES = ["news", "projects", "events", "podcast", "team"] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];
export type SearchSort = "relevance" | "newest" | "oldest";

export type SearchResult = {
  id: string;
  type: SearchType;
  title: string;
  snippet: string;
  href: string;
  image: string | null;
  /** Short line under the title: category, date, role… */
  meta: string;
  /** Four-digit year, when the item has one. Used by the year filter. */
  year: string | null;
  /** Milliseconds since epoch, for date sorting. 0 when undated. */
  time: number;
  score: number;
};

/**
 * A parsed query. Plain words must all appear somewhere in an item;
 * "quoted phrases" must appear as written; words after a minus (-2019)
 * must not appear at all.
 */
export type ParsedQuery = { terms: string[]; phrases: string[]; excludes: string[] };

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

export function parseQuery(raw: string): ParsedQuery {
  const phrases: string[] = [];
  const rest = raw.replace(/"([^"]+)"/g, (_, phrase: string) => {
    if (phrase.trim()) phrases.push(normalize(phrase.trim()));
    return " ";
  });
  const terms: string[] = [];
  const excludes: string[] = [];
  for (const word of rest.split(/\s+/)) {
    if (!word || word === "-") continue;
    if (word.startsWith("-")) excludes.push(normalize(word.slice(1)));
    else terms.push(normalize(word));
  }
  return { terms, phrases, excludes };
}

/** The words and phrases to mark in results. */
export function highlightTerms(q: ParsedQuery) {
  return [...q.phrases, ...q.terms].filter((t) => t.length > 0);
}

function stripHtml(html: string) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** ~180 characters of `text` around the first match, or its opening. */
function makeSnippet(text: string, needles: string[]) {
  const lower = normalize(text);
  let at = -1;
  for (const n of needles) {
    const i = lower.indexOf(n);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return text.length > 180 ? `${text.slice(0, 180).trimEnd()}…` : text;
  const start = Math.max(0, at - 60);
  const end = Math.min(text.length, start + 180);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

type Doc = Omit<SearchResult, "score" | "snippet"> & { body: string; extra: string };

/** Scores a document, or returns null when it doesn't match. */
function score(doc: Doc, q: ParsedQuery): number | null {
  const title = normalize(doc.title);
  const extra = normalize(doc.extra);
  const body = normalize(doc.body);
  const all = `${title} ${extra} ${body}`;

  if (q.excludes.some((x) => x && all.includes(x))) return null;
  if (!q.phrases.every((p) => all.includes(p))) return null;
  if (!q.terms.every((t) => all.includes(t))) return null;

  let s = 0;
  const whole = [...q.phrases, ...q.terms].join(" ");
  if (whole && title === whole) s += 100;
  else if (whole && title.startsWith(whole)) s += 60;
  else if (whole && title.includes(whole)) s += 40;
  for (const p of q.phrases) {
    if (title.includes(p)) s += 25;
    else if (extra.includes(p)) s += 12;
    else s += 6;
  }
  for (const t of q.terms) {
    if (new RegExp(`(^|\\s)${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) s += 15;
    else if (title.includes(t)) s += 10;
    if (extra.includes(t)) s += 5;
    // A few points for repeated mentions in the body, capped.
    s += Math.min(body.split(t).length - 1, 5);
  }
  return s;
}

// The index is rebuilt at most once a minute per server instance, so typing in
// the header search stays quick; content edits show up within that minute.
const INDEX_TTL = 60_000;
let indexCache: { at: number; docs: Promise<Doc[]> } | null = null;

function getIndex(): Promise<Doc[]> {
  if (!indexCache || Date.now() - indexCache.at > INDEX_TTL) {
    const docs = buildIndex();
    indexCache = { at: Date.now(), docs };
    // A failed build is dropped so the next search retries.
    docs.catch(() => {
      if (indexCache?.docs === docs) indexCache = null;
    });
  }
  return indexCache.docs;
}

async function buildIndex(): Promise<Doc[]> {
  const [news, programs, episodes, team] = await Promise.all([
    getNewsPosts(),
    getPrograms(),
    getPodcastEpisodes(),
    getTeamMembers(),
  ]);
  const docs: Doc[] = [];

  for (const post of news) {
    const date = post.publishedAt ? new Date(post.publishedAt) : null;
    docs.push({
      id: `news-${post.id}`,
      type: "news",
      title: post.title,
      body: `${post.excerpt} ${stripHtml(post.body)}`,
      extra: post.category,
      href: `/news/${post.slug}`,
      image: post.coverImageUrl,
      meta: [
        post.category,
        date?.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      ]
        .filter(Boolean)
        .join(" · "),
      year: date ? String(date.getFullYear()) : null,
      time: date?.getTime() ?? 0,
    });
  }

  for (const program of programs) {
    const page = PROGRAM_PAGES[program.slug];
    docs.push({
      id: `project-${program.id}`,
      type: "projects",
      title: program.title,
      body: [program.description, page?.summary, page?.whatIs].filter(Boolean).join(" "),
      extra: program.category,
      href: `/projects/${program.slug}`,
      image: programLogo(program) ?? program.coverImageUrl,
      meta: program.category,
      year: null,
      time: 0,
    });

    for (const event of page?.events ?? []) {
      const year = event.year.match(/\d{4}/)?.[0] ?? null;
      const parsed = Date.parse(event.date);
      docs.push({
        id: `event-${program.slug}-${event.slug}`,
        type: "events",
        title: event.title,
        body: [event.summary, ...(event.body ?? []), ...(event.highlights ?? [])].join(" "),
        // Winners too, so a school or team name finds the edition they won.
        extra: [
          program.title,
          event.venue,
          event.year,
          ...(event.winners?.groups ?? []).flatMap((g) =>
            g.teams.flatMap((t) => [g.category, t.name, t.school, ...(t.members ?? [])])
          ),
        ]
          .filter(Boolean)
          .join(" "),
        href: `/projects/${program.slug}/${event.slug}`,
        image: event.image ?? null,
        meta: [event.date, event.venue].filter(Boolean).join(" · "),
        year,
        time: Number.isNaN(parsed) ? (year ? Date.UTC(Number(year), 0, 1) : 0) : parsed,
      });
    }
  }

  for (const episode of episodes) {
    docs.push({
      id: `podcast-${episode.id}`,
      type: "podcast",
      title: episode.title,
      body: episode.description,
      extra: `${episode.tag ?? ""} episode ${episode.order}`,
      href: `/podcast#episode-${episode.order}`,
      image: `https://i.ytimg.com/vi/${episode.videoId}/hqdefault.jpg`,
      meta: `STEM Talks · Episode ${String(episode.order).padStart(2, "0")}`,
      year: null,
      time: new Date(episode.createdAt).getTime(),
    });
  }

  for (const member of team) {
    docs.push({
      id: `team-${member.id}`,
      type: "team",
      title: member.name,
      body: member.bio,
      extra: member.role,
      href: `/team/${teamMemberSlug(member)}`,
      image: member.photoUrl,
      meta: member.role,
      year: null,
      time: 0,
    });
  }

  return docs;
}

/** Every item on the site matching `raw`, best match first. */
export async function searchSite(raw: string): Promise<SearchResult[]> {
  const q = parseQuery(raw);
  if (q.terms.length === 0 && q.phrases.length === 0) return [];
  const needles = highlightTerms(q);
  const docs = await getIndex();

  const results: SearchResult[] = [];
  for (const doc of docs) {
    const s = score(doc, q);
    if (s === null) continue;
    results.push({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      href: doc.href,
      image: doc.image,
      meta: doc.meta,
      year: doc.year,
      time: doc.time,
      snippet: makeSnippet(doc.body, needles),
      score: s,
    });
  }
  return results.sort((a, b) => b.score - a.score || b.time - a.time);
}

export function sortResults(results: SearchResult[], sort: SearchSort) {
  if (sort === "relevance") return results;
  const dir = sort === "newest" ? -1 : 1;
  // Undated items go last either way.
  return [...results].sort((a, b) => {
    if (!a.time !== !b.time) return a.time ? -1 : 1;
    return (a.time - b.time) * dir;
  });
}
