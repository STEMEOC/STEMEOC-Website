"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CaretDown,
  Check,
  DownloadSimple,
  FileCsv,
  GoogleDriveLogo,
  ArrowSquareOut,
  ClipboardText,
  SpinnerGap,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { GOOGLE_CLIENT_ID, createSheet, getAccessToken, preloadGoogle } from "@/lib/google-sheets";
import type { ResponseField, ResponseSubmission } from "@/components/admin/FormResponses";

const timestamp = new Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeStyle: "short" });

/** Header row + one row per response, oldest first like a Google Forms sheet. */
function buildTable(fields: ResponseField[], submissions: ResponseSubmission[]): string[][] {
  const origin = window.location.origin;
  const header = ["Timestamp", ...fields.map((f) => (f.archived ? `${f.label} (deleted question)` : f.label))];
  const rows = [...submissions].reverse().map((s) => [
    timestamp.format(new Date(s.createdAt)),
    ...fields.map((f) => {
      const value = s.data[f.id];
      const text = Array.isArray(value) ? value.join(", ") : (value ?? "");
      // Absolute links so uploaded files open from the spreadsheet.
      return f.type === "FILE" && text.startsWith("/") ? origin + text : text;
    }),
  ]);
  return [header, ...rows];
}

function toCsv(table: string[][]) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  // BOM so Excel reads UTF-8 (Khmer text) correctly.
  return "\uFEFF" + table.map((row) => row.map(cell).join(",")).join("\r\n");
}

function toTsv(table: string[][]) {
  return table.map((row) => row.map((v) => v.replace(/[\t\r\n]+/g, " ")).join("\t")).join("\n");
}

function toHtml(table: string[][]) {
  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const [header, ...rows] = table;
  return (
    "<table><thead><tr>" +
    header.map((h) => `<th><b>${esc(h)}</b></th>`).join("") +
    "</tr></thead><tbody>" +
    rows.map((r) => "<tr>" + r.map((v) => `<td>${esc(v)}</td>`).join("") + "</tr>").join("") +
    "</tbody></table>"
  );
}

async function copyTable(table: string[][]) {
  // HTML keeps multi-line answers inside one cell; plain TSV is the fallback.
  if (typeof ClipboardItem !== "undefined") {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([toHtml(table)], { type: "text/html" }),
        "text/plain": new Blob([toTsv(table)], { type: "text/plain" }),
      }),
    ]);
  } else {
    await navigator.clipboard.writeText(toTsv(table));
  }
}

type SheetsState =
  | { step: "idle" }
  | { step: "working" }
  | { step: "done"; url: string }
  | { step: "error"; message: string }
  | { step: "copied" }
  | { step: "copy-failed" };

export function ExportMenu({
  title,
  filename,
  fields,
  submissions,
}: {
  title: string;
  filename: string;
  fields: ResponseField[];
  submissions: ResponseSubmission[];
}) {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetsState>({ step: "idle" });
  const menuRef = useRef<HTMLDivElement>(null);
  const empty = submissions.length === 0;
  const direct = GOOGLE_CLIENT_ID !== "";

  useEffect(() => {
    // Load Google sign-in early so its popup opens inside the click and isn't blocked.
    if (direct) preloadGoogle().catch(() => {});
  }, [direct]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function toGoogleSheets() {
    setOpen(false);
    const table = buildTable(fields, submissions);

    if (!direct) {
      try {
        await copyTable(table);
        setSheets({ step: "copied" });
      } catch {
        setSheets({ step: "copy-failed" });
      }
      return;
    }

    // getAccessToken must run before any await so the sign-in popup counts as part of the click.
    const token = getAccessToken();
    setSheets({ step: "working" });
    try {
      const url = await createSheet(await token, `${title} (Responses)`, table);
      setSheets({ step: "done", url });
    } catch (error) {
      setSheets({ step: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  function downloadCsv() {
    setOpen(false);
    const blob = new Blob([toCsv(buildTable(fields, submissions))], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const close = () => setSheets({ step: "idle" });
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
  const count = `${submissions.length} response${submissions.length === 1 ? "" : "s"}`;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={empty}
        aria-haspopup="menu"
        aria-expanded={open}
        title={empty ? "No responses to export yet" : undefined}
        className="flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-bold text-white transition-colors hover:bg-blue-deep disabled:opacity-40"
      >
        <DownloadSimple size={16} weight="bold" />
        Export
        <CaretDown size={14} weight="bold" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl shadow-navy/15 ring-1 ring-navy/10"
        >
          <MenuItem
            onClick={toGoogleSheets}
            tint="bg-green/10 text-green"
            icon={<GoogleDriveLogo size={20} weight="bold" />}
            title="Google Sheets"
            description={
              direct ? "Create a new sheet with all responses in your Google Drive" : "Copy all responses, then paste into a new sheet"
            }
          />
          <MenuItem
            onClick={downloadCsv}
            tint="bg-blue/10 text-blue"
            icon={<FileCsv size={20} weight="bold" />}
            title="Excel / CSV file"
            description="Download a file that opens in Excel or Numbers"
          />
        </div>
      )}

      {sheets.step !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheets-title"
          onClick={sheets.step === "working" ? undefined : close}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  sheets.step === "error" || sheets.step === "copy-failed"
                    ? "bg-red/10 text-red"
                    : "bg-green/15 text-green"
                }`}
              >
                {sheets.step === "working" ? (
                  <SpinnerGap size={24} weight="bold" className="animate-spin" />
                ) : sheets.step === "error" || sheets.step === "copy-failed" ? (
                  <X size={24} weight="bold" />
                ) : sheets.step === "copied" ? (
                  <ClipboardText size={24} weight="bold" />
                ) : (
                  <Check size={24} weight="bold" />
                )}
              </span>
              {sheets.step !== "working" && (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-navy/40 hover:bg-navy/5 hover:text-navy"
                >
                  <X size={18} weight="bold" />
                </button>
              )}
            </div>

            {sheets.step === "working" && (
              <>
                <h2 id="sheets-title" className="mt-4 font-display text-2xl font-bold text-navy">
                  Creating your sheet…
                </h2>
                <p className="mt-3 text-base text-navy/70">
                  If a Google window opens, choose your account and click <b className="text-navy">Allow</b>.
                </p>
              </>
            )}

            {sheets.step === "done" && (
              <>
                <h2 id="sheets-title" className="mt-4 font-display text-2xl font-bold text-navy">
                  Your sheet is ready
                </h2>
                <p className="mt-3 text-base text-navy/70">
                  {count} are in “{title} (Responses)” in your Google Drive.
                </p>
                <a
                  href={sheets.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-green text-base font-bold text-white transition-colors hover:brightness-95"
                >
                  Open in Google Sheets
                  <ArrowSquareOut size={18} weight="bold" />
                </a>
              </>
            )}

            {sheets.step === "error" && (
              <>
                <h2 id="sheets-title" className="mt-4 font-display text-2xl font-bold text-navy">
                  Couldn’t create the sheet
                </h2>
                <p className="mt-3 text-base text-navy/70">{sheets.message}</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={toGoogleSheets}
                    className="flex h-12 items-center justify-center rounded-full bg-navy text-base font-bold text-white hover:bg-blue-deep"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      downloadCsv();
                    }}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-navy/5 text-base font-bold text-navy hover:bg-navy/10"
                  >
                    <DownloadSimple size={18} weight="bold" />
                    Download CSV
                  </button>
                </div>
              </>
            )}

            {sheets.step === "copied" && (
              <>
                <h2 id="sheets-title" className="mt-4 font-display text-2xl font-bold text-navy">
                  {count} copied. Now paste them
                </h2>
                <p className="mt-2 text-sm text-navy/55">
                  The new sheet opens empty. It fills up when you paste.
                </p>
                <ol className="mt-5 space-y-3 text-base text-navy/75">
                  <li className="flex gap-3">
                    <Step n={1} />
                    <span>
                      Click <b className="text-navy">Open Google Sheets</b> below.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Step n={2} />
                    <span>
                      In the new sheet, click the first box (<b className="text-navy">A1</b>, top left).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Step n={3} />
                    <span>
                      Press{" "}
                      <kbd className="rounded-md bg-navy/5 px-1.5 py-0.5 font-mono text-sm font-bold text-navy">
                        {isMac ? "⌘ + V" : "Ctrl + V"}
                      </kbd>{" "}
                      to paste. All responses appear.
                    </span>
                  </li>
                </ol>
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-green text-base font-bold text-white transition-colors hover:brightness-95"
                >
                  Open Google Sheets
                  <ArrowSquareOut size={18} weight="bold" />
                </a>
              </>
            )}

            {sheets.step === "copy-failed" && (
              <>
                <h2 id="sheets-title" className="mt-4 font-display text-2xl font-bold text-navy">
                  Couldn’t copy the responses
                </h2>
                <p className="mt-3 text-base text-navy/70">
                  Your browser blocked copying. Download the file instead, then in Google Sheets choose{" "}
                  <b className="text-navy">File → Import → Upload</b>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    downloadCsv();
                  }}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy text-base font-bold text-white hover:bg-blue-deep"
                >
                  <DownloadSimple size={18} weight="bold" />
                  Download CSV file
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  tint,
  icon,
  title,
  description,
}: {
  onClick: () => void;
  tint: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-paper-dim"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}>{icon}</span>
      <span>
        <span className="block text-sm font-bold text-navy">{title}</span>
        <span className="block text-xs text-navy/55">{description}</span>
      </span>
    </button>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
      {n}
    </span>
  );
}
