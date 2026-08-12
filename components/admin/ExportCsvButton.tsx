"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { exportSubmissionsCsv } from "@/lib/actions/forms";

export function ExportCsvButton({ formId, filename }: { formId: string; filename: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const csv = await exportSubmissionsCsv(formId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 rounded-2xl bg-ink/5 px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink/10 disabled:opacity-50"
    >
      <DownloadSimple size={16} weight="bold" />
      {pending ? "Exporting…" : "Export CSV"}
    </button>
  );
}
