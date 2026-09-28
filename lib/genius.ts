export type LyricsLine = { kind: "section" | "line" | "gap"; text: string };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text: string) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/**
 * Lyrics for a song, read from its public Genius embed script. The embed is
 * meant to document.write its markup, which doesn't work for scripts added
 * after load (and Genius's bot protection blocks it in some browsers), so the
 * server fetches it instead and returns plain lines to render natively.
 * Returns null if Genius is unreachable or the format changes.
 */
export async function getGeniusLyrics(songId: number): Promise<LyricsLine[] | null> {
  try {
    const res = await fetch(`https://genius.com/songs/${songId}/embed.js`, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;
    const js = await res.text();

    // The markup is a JSON string wrapped in a single-quoted JS string: document.write(JSON.parse('...')).
    const literal = js.match(/document\.write\(JSON\.parse\('((?:[^'\\]|\\.)*)'\)\)/)?.[1];
    if (!literal) return null;
    const html: string = JSON.parse(JSON.parse(`"${literal.replace(/\\'/g, "'")}"`));

    const body = html.match(/<div class="rg_embed_body">([\s\S]*?)<\/div>/)?.[1];
    if (!body) return null;

    const lines: LyricsLine[] = [];
    for (const raw of body.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").split("\n")) {
      const text = decodeEntities(raw).trim();
      if (!text) {
        if (lines.length && lines.at(-1)!.kind !== "gap") lines.push({ kind: "gap", text: "" });
      } else {
        lines.push({ kind: /^\[.*\]$/.test(text) ? "section" : "line", text });
      }
    }
    while (lines.at(-1)?.kind === "gap") lines.pop();
    return lines.length ? lines : null;
  } catch {
    return null;
  }
}
