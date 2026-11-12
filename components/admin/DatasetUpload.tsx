"use client";

import { useActionState } from "react";
import { uploadDataset } from "@/lib/actions/dataset";

// csv upload for one event
export function DatasetUpload({ events }: { events: { key: string; label: string }[] }) {
  const [state, action, pending] = useActionState(uploadDataset, null);

  return (
    <form action={action} className="mt-8 rounded-[2rem] bg-paper p-6 shadow-sm ring-1 ring-black/5">
      <p className="font-bold text-navy">Upload numbers</p>
      <p className="mt-1 text-sm text-ink/60">
        CSV with one <code>category,count</code> per line. In Excel or Google Sheets: File → Download / Save as →
        CSV. A new upload replaces that event&apos;s old one.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="dataset-event">Event</label>
        <select id="dataset-event" name="event" required defaultValue="" className="h-11 rounded-xl border border-ink/15 bg-white px-3 text-sm">
          <option value="" disabled>Choose event…</option>
          {events.map((e) => (
            <option key={e.key} value={e.key}>{e.label}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="dataset-file">CSV file</label>
        <input id="dataset-file" name="file" type="file" accept=".csv,text/csv" required className="text-sm" />
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl bg-navy px-5 text-sm font-bold text-white transition-colors hover:bg-blue-deep disabled:opacity-50"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
      {state && (
        <p role="status" className={`mt-3 text-sm font-semibold ${state.ok ? "text-green" : "text-red"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
