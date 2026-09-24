// Compresses images in /public in place: caps the long edge at MAX_EDGE and
// re-encodes at web quality, keeping each file's name and format so existing
// URLs in the database keep working. A file is only replaced when the result
// is smaller. Form submission uploads are left untouched (they're user data).
//
//   node scripts/compress-images.mjs
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public");
const SKIP = [path.join(ROOT, "uploads", "forms")];
const MAX_EDGE = 2000;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (SKIP.some((s) => full.startsWith(s))) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield full;
  }
}

let before = 0;
let after = 0;

for await (const file of walk(ROOT)) {
  const input = await readFile(file);
  const ext = path.extname(file).toLowerCase();
  const pipeline = sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  const output = await (ext === ".png"
    ? pipeline.png({ compressionLevel: 9, effort: 10, palette: input.length > 200_000, quality: 90 })
    : ext === ".webp"
      ? pipeline.webp({ quality: 80 })
      : pipeline.jpeg({ quality: 80, mozjpeg: true })
  ).toBuffer();

  before += input.length;
  if (output.length < input.length * 0.95) {
    await writeFile(file, output);
    after += output.length;
    console.log(`${path.relative(ROOT, file)}: ${kb(input.length)} -> ${kb(output.length)}`);
  } else {
    after += input.length;
  }
}

console.log(`\nTotal: ${kb(before)} -> ${kb(after)} (${Math.round((1 - after / before) * 100)}% smaller)`);

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}
