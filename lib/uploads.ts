import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Stores an uploaded file under `folder` and returns its public URL. On hosts
 * with a read-only disk (Vercel) set BLOB_READ_WRITE_TOKEN and files go to
 * Vercel Blob; otherwise they're written to public/uploads.
 */
export async function saveUpload(file: File, folder: string, filename: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${folder}/${filename}`, file, {
      access: "public",
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${filename}`;
}

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB

/**
 * Resolves an <ImageField name="x"> submission to a URL: an uploaded file
 * (`xFile`) wins, otherwise the kept/typed URL (`x`). Returns "" when cleared.
 */
export async function resolveImageField(formData: FormData, name: string, folder: string): Promise<string> {
  const file = formData.get(`${name}File`);
  if (file instanceof File && file.size > 0) {
    const ext = IMAGE_EXTENSIONS[file.type];
    if (!ext) throw new Error("Unsupported image type. Use JPG, PNG, WebP, GIF, AVIF, or SVG.");
    if (file.size > MAX_IMAGE_SIZE) throw new Error("Image must be under 8MB.");

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    return saveUpload(file, folder, filename);
  }
  return String(formData.get(name) ?? "").trim();
}
