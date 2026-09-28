"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSquare, UploadSimple, Trash } from "@phosphor-icons/react/dist/ssr";

/**
 * Image picker with a live preview. Submits the kept/typed URL as `name` and a
 * newly chosen file as `${name}File`; resolve both with `resolveImageField`.
 */
export function ImageField({
  name,
  label,
  defaultValue,
  required = false,
  fit = "cover",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  /** "contain" suits logos, "cover" suits photos. */
  fit?: "cover" | "contain";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const preview = filePreview ?? (url || null);

  function clear() {
    if (fileRef.current) fileRef.current.value = "";
    setFilePreview(null);
    setUrl("");
    setBroken(false);
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink/15 bg-paper-dim transition-colors hover:border-blue"
          aria-label={preview ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        >
          {preview && !broken ? (
            // Plain <img>: the URL may be any host, which next/image would reject.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              onError={() => setBroken(true)}
              className={`h-full w-full ${fit === "contain" ? "object-contain p-3" : "object-cover"}`}
            />
          ) : (
            <span className="flex flex-col items-center gap-2 px-3 text-center text-xs text-ink/50">
              <ImageSquare size={32} />
              {broken ? "Image not found" : "Click to upload"}
            </span>
          )}
          {preview && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-xs font-semibold text-paper opacity-0 transition-opacity group-hover:opacity-100">
              Replace
            </span>
          )}
        </button>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:border-blue hover:text-blue"
            >
              <UploadSimple size={16} weight="bold" />
              {preview ? "Replace image" : "Upload image"}
            </button>
            {preview && (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 hover:border-red hover:text-red"
              >
                <Trash size={16} weight="bold" />
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            name={`${name}File`}
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setBroken(false);
              setFilePreview(file ? URL.createObjectURL(file) : null);
            }}
          />

          {filePreview ? (
            <p className="text-xs text-ink/50">New image selected. It uploads when you save.</p>
          ) : (
            <details className="text-xs text-ink/50">
              <summary className="cursor-pointer select-none">Or use an image URL</summary>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setBroken(false);
                }}
                placeholder="https://… or /uploads/…"
                className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-blue"
              />
            </details>
          )}
          <p className="text-xs text-ink/40">JPG, PNG, WebP, GIF, AVIF or SVG, up to 8MB.</p>
        </div>
      </div>
      {/* Required only when neither a URL nor a new file is present. */}
      <input type="hidden" name={name} value={filePreview ? "" : url} />
      {required && !preview && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value=""
          onChange={() => {}}
          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(`Please add a ${label.toLowerCase()}.`)}
          className="pointer-events-none h-0 w-0 opacity-0"
        />
      )}
    </div>
  );
}
