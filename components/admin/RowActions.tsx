"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, LinkSimple, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export function RowActions({
  editHref,
  onDelete,
  copyPath,
}: {
  editHref: string;
  onDelete: (formData: FormData) => void;
  copyPath?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!copyPath) return;
    await navigator.clipboard.writeText(`${window.location.origin}${copyPath}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {copyPath && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            copied ? "bg-green text-paper" : "text-ink/40 hover:bg-ink/10 hover:text-ink"
          }`}
        >
          {copied ? <Check size={16} weight="bold" /> : <LinkSimple size={16} weight="bold" />}
        </button>
      )}
      <Link
        href={editHref}
        aria-label="Edit"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-blue transition-colors hover:bg-blue hover:text-paper"
      >
        <PencilSimple size={16} weight="bold" />
      </Link>
      <form action={onDelete}>
        <button
          type="submit"
          aria-label="Delete"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/40 transition-colors hover:bg-red hover:text-paper"
        >
          <Trash size={16} weight="bold" />
        </button>
      </form>
    </div>
  );
}
