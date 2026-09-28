import { searchSite } from "@/lib/search";

const MAX_SUGGESTIONS = 6;

/** Quick matches for the header search box: GET /api/search?q=robot */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return Response.json({ results: [], total: 0 });

  const results = await searchSite(q);
  return Response.json({
    total: results.length,
    results: results.slice(0, MAX_SUGGESTIONS).map(({ id, type, title, href, image, meta }) => ({
      id,
      type,
      title,
      href,
      image,
      meta,
    })),
  });
}
