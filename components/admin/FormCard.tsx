"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ChartBar,
  PencilSimple,
  LinkSimple,
  Check,
  ArrowSquareOut,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { deleteForm, setAcceptingResponses } from "@/lib/actions/forms";

export type FormCardData = {
  id: string;
  slug: string;
  title: string;
  accentColor: string;
  coverImageUrl: string | null;
  published: boolean;
  questionCount: number;
  responseCount: number;
  /** Pre-formatted on the server, e.g. "2 days ago". */
  updatedLabel: string;
  latestResponseLabel: string | null;
};

/** One form on the Forms page: preview thumbnail, response count, and its actions. */
export function FormCard({ form }: { form: FormCardData }) {
  const [accepting, setAccepting] = useState(form.published);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const publicPath = `/apply/${form.slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function toggleAccepting() {
    const next = !accepting;
    setAccepting(next);
    startTransition(() => setAcceptingResponses(form.id, next));
  }

  function remove() {
    const warning =
      form.responseCount > 0
        ? `Delete “${form.title}” and its ${form.responseCount} response${form.responseCount === 1 ? "" : "s"}? This can't be undone.`
        : `Delete “${form.title}”? This can't be undone.`;
    if (!confirm(warning)) return;
    startTransition(() => deleteForm(form.id));
  }

  return (
    <article
      className={`group/card flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy/10 transition-shadow hover:shadow-xl hover:shadow-navy/10 ${
        pending ? "opacity-60" : ""
      }`}
    >
      {/* Thumbnail: a tiny picture of the form in its own color */}
      <Link
        href={`/admin/forms/${form.id}/responses`}
        className="relative block h-32 overflow-hidden"
        style={{ backgroundColor: `${form.accentColor}1f` }}
        tabIndex={-1}
        aria-hidden
      >
        {form.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="absolute inset-x-8 top-6 bottom-0 rounded-t-xl bg-white shadow-sm transition-transform group-hover/card:-translate-y-1">
          <div className="h-2 rounded-t-xl" style={{ backgroundColor: form.accentColor }} />
          <div className="space-y-2 p-4">
            <p className="truncate font-display text-sm font-bold text-navy">{form.title}</p>
            <div className="h-2 w-1/3 rounded-full bg-navy/10" />
            <div className="mt-3 h-5 w-full rounded-md border border-navy/10" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-display text-xl font-bold text-navy">
            <Link href={`/admin/forms/${form.id}/responses`} className="hover:underline">
              {form.title}
            </Link>
          </h3>
          <span
            className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
              accepting ? "bg-green/15 text-green" : "bg-navy/5 text-navy/50"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${accepting ? "bg-green" : "bg-navy/30"}`} />
            {accepting ? "Open" : "Closed"}
          </span>
        </div>
        <p className="mt-1 text-sm text-navy/50">
          {form.questionCount} question{form.questionCount === 1 ? "" : "s"} · Edited {form.updatedLabel}
        </p>

        <Link
          href={`/admin/forms/${form.id}/responses`}
          className="mt-5 flex items-center justify-between rounded-2xl bg-paper-dim px-5 py-4 transition-colors hover:bg-navy/5"
        >
          <span>
            <span className="block font-display text-3xl font-bold leading-none text-navy">{form.responseCount}</span>
            <span className="mt-1 block text-sm text-navy/60">
              {form.responseCount === 1 ? "response" : "responses"}
              {form.latestResponseLabel && <> · latest {form.latestResponseLabel}</>}
            </span>
          </span>
          <span className="flex items-center gap-2 text-sm font-bold text-navy">
            <ChartBar size={18} weight="bold" style={{ color: form.accentColor }} />
            View
          </span>
        </Link>

        <label className="mb-5 mt-4 flex cursor-pointer items-center justify-between gap-3 text-sm">
          <span className="font-medium text-navy/70">Accepting responses</span>
          <button
            type="button"
            role="switch"
            aria-checked={accepting}
            onClick={toggleAccepting}
            disabled={pending}
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
            style={{ backgroundColor: accepting ? form.accentColor : "rgb(5 19 59 / 0.2)" }}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${
                accepting ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </button>
        </label>

        <div className="mt-auto flex items-center gap-2 border-t border-navy/10 pt-4">
          <Link
            href={`/admin/forms/${form.id}/edit`}
            className="flex h-10 items-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-white transition-colors hover:bg-blue-deep"
          >
            <PencilSimple size={16} weight="bold" />
            Edit
          </Link>
          <button
            type="button"
            onClick={copyLink}
            className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors ${
              copied ? "bg-green text-white" : "bg-navy/5 text-navy hover:bg-navy/10"
            }`}
          >
            {copied ? <Check size={16} weight="bold" /> : <LinkSimple size={16} weight="bold" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the form on the website"
            title="Open on website"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy"
          >
            <ArrowSquareOut size={18} />
          </a>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label={`Delete ${form.title}`}
            title="Delete form"
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-red hover:text-white"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
