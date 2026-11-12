// internal-only: import from admin pages only, never public pages

export type EventNote = {
  /** Where the numbers came from. */
  source?: string;
  /** Data clashes and things to check. */
  flags?: string[];
};

/** Keyed by "programSlug/eventSlug". */
export const EVENT_NOTES: Record<string, EventNote> = {
  "cambodia-robotics-olympiad/2026": {
    source: "Drive: CRO&WRO2026-TeamList.pdf",
    flags: ["Counts are registered teams only, not final entries", "Robot Soccer not in the team list"],
  },
  "cambodia-robotics-olympiad/2025": { source: "Drive: CRO 2025 report" },
  "cambodia-robotics-olympiad/2024": {
    source: "Drive: CRO Press Release + WRO 2024 International Final trip report",
    flags: ["Trip report says competition days 28–29 Nov; page says 28–30 Nov", "No Izmir photos in drive"],
  },
  "cambodia-robotics-olympiad/2023": {
    source: "Drive: folder 'WRO 2023 - Winners'",
    flags: ["Ro-Boat 'Best Start-up Idea Award' only from a drive folder name, unconfirmed"],
  },
  "annual-stem-festivals/2026": { source: "Drive: ACSF 2026 report" },
  "annual-stem-festivals/2023": {
    source: "Drive: Report STEM17.pdf",
    flags: ["Sumo winner names differ: BMC 5 vs The Unknown, Zombeat vs Zoom Beat"],
  },
  "annual-stem-festivals/global-round-2026": {
    source: "Drive: ICIA Global 2026 report",
    flags: ["Site says 27 countries, report says 12"],
  },
  "annual-stem-festivals/national-selection-2026": {
    source: "Drive: ICIA National 2026 report",
    flags: ["Date: February vs March"],
  },
};

export type DatasetRow = { category: string; count: number };

/** Parses "category,count" CSV lines; skips a header row and blank lines. */
export function parseDatasetCsv(text: string): DatasetRow[] {
  const rows: DatasetRow[] = [];
  for (const line of text.replace(/^﻿/, "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = splitCsvLine(line);
    if (cells.length < 2) throw new Error(`Need "category,count" on each line: ${line.slice(0, 60)}`);
    const category = cells[0].trim();
    const raw = cells[1].replace(/[,\s]/g, "");
    const count = raw ? Number(raw) : NaN;
    if (!Number.isInteger(count) || count < 0) {
      if (rows.length === 0) continue; // header row
      throw new Error(`Count must be a whole number: ${line.slice(0, 60)}`);
    }
    if (!category || category.length > 100) throw new Error(`Bad category name: ${line.slice(0, 60)}`);
    rows.push({ category, count });
  }
  if (rows.length === 0) throw new Error("No rows found.");
  if (rows.length > 100) throw new Error("Max 100 rows.");
  return rows;
}

// csv cells with "quoted, values"
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += ch;
  }
  cells.push(cell);
  return cells;
}
