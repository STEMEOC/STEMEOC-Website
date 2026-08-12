/**
 * One-time import of real content from the old WordPress site's WXR export
 * (docs/stemeducationorganisationforcambodia.WordPress.2026-08-05.xml) into
 * the Postgres database, replacing the placeholder seed data.
 *
 * - News posts (wp post_type "post") -> NewsPost, body kept as sanitized HTML.
 * - Team members (wp post_type "specialists") -> TeamMember, bio flattened to plain text.
 * - Programs (wp post_type "dt_portfolio") -> Program, description flattened to plain text.
 * - Featured images are downloaded from the (still-live) old site and saved into
 *   public/uploads/ so the new site doesn't depend on stemcambodia.ngo staying online.
 *
 * Run with: npx tsx scripts/import-wordpress.ts
 */
import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { decode } from "he";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const XML_PATH = path.resolve(
  process.cwd(),
  "docs/stemeducationorganisationforcambodia.WordPress.2026-08-05.xml"
);
const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads");

type WxrItem = {
  title?: string;
  link?: string;
  "content:encoded"?: string;
  "excerpt:encoded"?: string;
  "wp:post_id"?: number | string;
  "wp:post_type"?: string;
  "wp:post_date"?: string;
  "wp:status"?: string;
  "wp:attachment_url"?: string;
  "wp:postmeta"?: { "wp:meta_key": string; "wp:meta_value"?: string } | Array<{ "wp:meta_key": string; "wp:meta_value"?: string }>;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function slugFromLink(link: string | undefined, fallback: string): string {
  if (!link) return fallback;
  const clean = link.replace(/\/$/, "");
  let last = clean.split("/").pop() || fallback;
  try {
    last = decodeURIComponent(last);
  } catch {
    // malformed percent-encoding, use as-is
  }
  const slug = last
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

/** Decodes HTML entities in plain text fields (titles, names, roles). */
function decodeEntities(text: string): string {
  return decode(text).trim();
}

/** Skips short heading/title lines ("STEM Sisters Initiative") and returns the first real paragraph of prose. */
function firstSubstantialParagraph(plainText: string): string {
  const blocks = plainText.split("\n\n");
  return blocks.find((b) => b.length > 60) || blocks[0] || "";
}

function stripToPlainText(html: string): string {
  const text = decode(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }));
  return text
    .replace(/&nbsp;|&#8203;| |​|ㅤ/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/**
 * Team bio content mixes an inline SVG icon, a "Background" heading, the real
 * bio paragraphs, then a "Skills" heading with icon+label rows. Only the real
 * bio paragraphs use the `<p style="font-size: ...">` pattern, so target those
 * specifically instead of naively taking the first stripped block of text.
 */
function extractBioParagraphs(html: string): string {
  // Byline/label paragraphs ("Executive Director · STEMEOC", "Focus Areas") use the
  // same font-size:-prefixed style but different sizes; real bio prose is consistently
  // font-size: 16px; line-height: 1.8 across every profile in this export.
  const matches = [...html.matchAll(/<p style="font-size:\s*16px;\s*line-height:\s*1\.8;[^>]*>([\s\S]*?)<\/p>/g)];
  const paragraphs = matches.map((m) => decode(sanitizeHtml(m[1], { allowedTags: [], allowedAttributes: {} })).trim());
  return paragraphs.filter(Boolean).join("\n\n");
}

/** Keep only the real article HTML: headings, paragraphs, lists, bold/italic, links. No images (self-host concern out of scope for in-body images), no inline styles/svg/scripts. */
function sanitizeArticleBody(html: string): string {
  const cleaned = sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "b", "i", "a", "blockquote", "br"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    exclusiveFilter: (frame) => frame.tag === "p" && !frame.text.trim() && frame.mediaChildren.length === 0,
  });
  return cleaned.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

function getMeta(item: WxrItem, key: string): string | undefined {
  const metas = toArray(item["wp:postmeta"]);
  return metas.find((m) => m["wp:meta_key"] === key)?.["wp:meta_value"];
}

async function downloadImage(url: string): Promise<string | null> {
  try {
    const filename = decodeURIComponent(url.split("/").pop() || "").replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const destPath = path.join(UPLOADS_DIR, filename);
    const publicPath = `/uploads/${filename}`;

    try {
      await fs.access(destPath);
      return publicPath; // already downloaded
    } catch {
      // not yet downloaded
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      console.warn(`  ! failed to fetch ${url}: ${res.status}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(destPath, buffer);
    return publicPath;
  } catch (err) {
    console.warn(`  ! error downloading ${url}:`, err);
    return null;
  }
}

async function main() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const xml = await fs.readFile(XML_PATH, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });
  const parsed = parser.parse(xml);

  // fast-xml-parser wraps CDATA text nodes as { __cdata: "..." } at every
  // depth (including nested wp:postmeta entries), so this has to recurse.
  function deepUnwrap(v: unknown): unknown {
    if (Array.isArray(v)) return v.map(deepUnwrap);
    if (typeof v === "object" && v !== null) {
      const obj = v as Record<string, unknown>;
      if ("__cdata" in obj && Object.keys(obj).length === 1) return obj.__cdata;
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(obj)) out[k] = deepUnwrap(val);
      return out;
    }
    return v;
  }

  const items: WxrItem[] = toArray(parsed.rss.channel.item).map((raw) => deepUnwrap(raw) as WxrItem);

  const attachmentUrlById = new Map<string, string>();
  for (const item of items) {
    if (item["wp:post_type"] === "attachment") {
      const id = String(item["wp:post_id"]);
      const url = item["wp:attachment_url"];
      if (url) attachmentUrlById.set(id, url);
    }
  }

  async function resolveImage(item: WxrItem): Promise<string | null> {
    const thumbId = getMeta(item, "_thumbnail_id");
    if (!thumbId) return null;
    const url = attachmentUrlById.get(thumbId);
    if (!url) return null;
    return downloadImage(url);
  }

  const admin = await prisma.admin.findFirstOrThrow();

  // ---- News posts ----
  const posts = items.filter((i) => i["wp:post_type"] === "post" && i["wp:status"] === "publish");
  console.log(`Importing ${posts.length} news posts...`);
  await prisma.newsPost.deleteMany();

  for (const item of posts) {
    const title = decodeEntities(item.title || "Untitled");
    const slug = slugFromLink(item.link, `post-${item["wp:post_id"]}`);
    const rawBody = item["content:encoded"] || "";
    const body = sanitizeArticleBody(rawBody);
    const plainText = stripToPlainText(rawBody);
    const rawExcerpt = stripToPlainText(item["excerpt:encoded"] || "");
    const excerpt = rawExcerpt.length > 3 ? rawExcerpt.slice(0, 300) : plainText.slice(0, 220) + (plainText.length > 220 ? "..." : "");
    const coverImageUrl = await resolveImage(item);
    const publishedAt = item["wp:post_date"] ? new Date(item["wp:post_date"]) : new Date();

    await prisma.newsPost.upsert({
      where: { slug },
      create: {
        slug,
        title,
        excerpt,
        body,
        coverImageUrl,
        published: true,
        publishedAt,
        authorId: admin.id,
      },
      update: { title, excerpt, body, coverImageUrl, publishedAt },
    });
    console.log(`  + ${title}`);
  }

  // ---- Team members ("specialists") ----
  const TEAM_ORDER = [
    "Nithijounie Dene Eang",
    "Sarky Soukamneuth",
    "Lisa Math",
    "Pun Solita",
    "Eam Hot",
    "Ros Brasithy",
    "Te Henglay",
    "Ronie Lina",
    "Ngoun Sivgech",
    "Sokea Vatey",
  ];

  const specialists = items.filter((i) => i["wp:post_type"] === "specialists" && i["wp:status"] === "publish");
  console.log(`\nImporting ${specialists.length} team members...`);
  await prisma.teamMember.deleteMany();

  for (const item of specialists) {
    const name = decodeEntities(item.title || "");
    const role = stripToPlainText(item["excerpt:encoded"] || "") || "Team Member";
    const bio = extractBioParagraphs(item["content:encoded"] || "");
    const photoUrl = await resolveImage(item);
    const order = TEAM_ORDER.indexOf(name);

    await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        photoUrl,
        order: order === -1 ? 99 : order,
        published: true,
      },
    });
    console.log(`  + ${name} (${role})`);
  }

  // ---- Programs ("dt_portfolio") ----
  const PROGRAM_META: Record<string, { slug: string; category: string; order: number }> = {
    "Annual STEM Festivals": { slug: "annual-stem-festivals", category: "festival", order: 0 },
    "Cambodia Robotics Olympiad 2024 (CRO)": { slug: "cambodia-robotics-olympiad", category: "robotics", order: 1 },
    "Eco-STEM": { slug: "eco-stem", category: "eco", order: 2 },
    "International Creativity and Innovation Award (ICIA)": { slug: "icia", category: "innovation", order: 3 },
    "STEM Sisters": { slug: "stem-sisters", category: "community", order: 4 },
  };

  const portfolioItems = items.filter((i) => i["wp:post_type"] === "dt_portfolio" && i["wp:status"] === "publish");
  console.log(`\nImporting ${portfolioItems.length} programs...`);
  await prisma.program.deleteMany();

  for (const item of portfolioItems) {
    const title = decodeEntities(item.title || "");
    const meta = PROGRAM_META[title];
    if (!meta) {
      console.warn(`  ! no mapping for program "${title}", skipping`);
      continue;
    }
    const plainText = stripToPlainText(item["content:encoded"] || "");
    const description = firstSubstantialParagraph(plainText) || plainText.slice(0, 400);
    const coverImageUrl = await resolveImage(item);

    await prisma.program.create({
      data: {
        slug: meta.slug,
        title,
        description,
        category: meta.category,
        coverImageUrl,
        order: meta.order,
        published: true,
      },
    });
    console.log(`  + ${title}`);
  }

  console.log("\nImport complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
