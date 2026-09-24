import { prisma } from "@/lib/prisma";
import { getOrSetCache } from "@/lib/cache";

const TTL = 60 * 5; // 5 minutes

export function getSiteStats() {
  return getOrSetCache(
    "home:stats",
    TTL,
    () => prisma.siteStat.findMany({ orderBy: { order: "asc" } }),
    ["stats"]
  );
}

export function getPrograms() {
  return getOrSetCache(
    "programs:published",
    TTL,
    () =>
      prisma.program.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ["programs"]
  );
}

export function getProgramBySlug(slug: string) {
  return getOrSetCache(
    `programs:slug:${slug}`,
    TTL,
    () => prisma.program.findFirst({ where: { slug, published: true } }),
    ["programs"]
  );
}

export function getTeamMembers() {
  return getOrSetCache(
    "team:published",
    TTL,
    () =>
      prisma.teamMember.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ["team"]
  );
}

export function getPartners() {
  return getOrSetCache(
    "partners:published",
    TTL,
    () =>
      prisma.partner.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ["partners"]
  );
}

export function getNewsPosts() {
  return getOrSetCache(
    "news:published",
    TTL,
    () =>
      prisma.newsPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    ["news"]
  );
}

export function getPodcastEpisodes() {
  return getOrSetCache(
    "podcast:published",
    TTL,
    () =>
      prisma.podcastEpisode.findMany({
        where: { published: true },
        orderBy: { order: "desc" },
      }),
    ["podcast"]
  );
}

export function getPublishedForms() {
  return getOrSetCache(
    "forms:published",
    TTL,
    () =>
      prisma.form.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
    ["forms"]
  );
}

export function getFormBySlug(slug: string) {
  return getOrSetCache(
    `forms:slug:${slug}`,
    TTL,
    () =>
      prisma.form.findFirst({
        where: { slug, published: true },
        include: { fields: { orderBy: { order: "asc" } } },
      }),
    ["forms"]
  );
}

export function getNewsPostBySlug(slug: string) {
  return getOrSetCache(
    `news:slug:${slug}`,
    TTL,
    () =>
      prisma.newsPost.findFirst({
        where: { slug, published: true },
        include: { author: { select: { name: true } } },
      }),
    ["news"]
  );
}

/** URL segment for a team member's profile, e.g. "Te Henglay" -> "te-henglay". */
export function teamMemberSlug(member: { id: string; name: string }) {
  const slug = member.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  // Names with no Latin letters (e.g. written in Khmer) fall back to the id.
  return slug || member.id;
}

/**
 * Finds a published team member by profile slug, reusing the cached team list
 * (the model has no slug column). Also returns their position, which drives
 * their accent color, and the full list for "more of the team".
 */
export async function getTeamMemberBySlug(slug: string) {
  const team = await getTeamMembers();
  const index = team.findIndex((m) => teamMemberSlug(m) === slug || m.id === slug);
  return index === -1 ? null : { member: team[index], index, team };
}
