"use client";

import { useMemo, useState, useTransition } from "react";
import type { FormFieldType } from "@prisma/client";
import {
  CaretLeft,
  CaretRight,
  Paperclip,
  Trash,
  Check,
  ChartPieSlice,
  Question,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { deleteSubmission, setAcceptingResponses } from "@/lib/actions/forms";
import { ExportMenu } from "@/components/admin/ExportMenu";

export type ResponseField = {
  id: string;
  label: string;
  type: FormFieldType;
  options: string[];
  required: boolean;
  /** Removed from the form; shown so answers given before removal aren't lost. */
  archived?: boolean;
};
export type ResponseSubmission = { id: string; createdAt: string; data: Record<string, string | string[] | undefined> };

type Tab = "summary" | "question" | "individual";

// Brand hues in a colorblind-checked order (validated for adjacent-slice separation).
const CHART_COLORS = ["#2c80c2", "#e5262a", "#0d9488", "#f49423", "#7c3aed", "#14a650"];
const CHOICE_TYPES = new Set<FormFieldType>(["MULTIPLE_CHOICE", "DROPDOWN", "CHECKBOXES"]);

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function answersFor(field: ResponseField, submissions: ResponseSubmission[]): string[][] {
  return submissions
    .map((s) => s.data[field.id])
    .map((v) => (Array.isArray(v) ? v : v ? [v] : []))
    .filter((v) => v.length > 0 && v.some((x) => x.trim() !== ""));
}

/** Option counts in the question's own order, then any extra answers. */
function countChoices(field: ResponseField, answers: string[][]) {
  const counts = new Map<string, number>(field.options.map((o) => [o, 0]));
  for (const answer of answers) for (const v of answer) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].map(([label, count]) => ({ label, count }));
}

/** Identical text answers grouped, most common first (as Google Forms does). */
function groupText(answers: string[][]) {
  const counts = new Map<string, number>();
  for (const answer of answers) for (const v of answer) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function responsesLabel(n: number) {
  return `${n} response${n === 1 ? "" : "s"}`;
}

export function FormResponses({
  formId,
  slug,
  title,
  accentColor,
  accepting,
  fields,
  submissions,
  initialTab = "summary",
}: {
  formId: string;
  slug: string;
  title: string;
  accentColor: string;
  accepting: boolean;
  fields: ResponseField[];
  submissions: ResponseSubmission[];
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [isAccepting, setIsAccepting] = useState(accepting);
  const [togglePending, startToggle] = useTransition();

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "summary", label: "Summary", icon: ChartPieSlice },
    { id: "question", label: "Question", icon: Question },
    { id: "individual", label: "Individual", icon: User },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4" style={{ "--accent": accentColor } as React.CSSProperties}>
      {/* Header card: count, export, accepting switch, tabs */}
      {/* No overflow-hidden here: the Export menu has to drop out of this card. */}
      <section className="relative z-10 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="h-2.5 rounded-t-2xl" style={{ backgroundColor: accentColor }} />
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">{responsesLabel(submissions.length)}</h2>
            <p className="mt-1 text-sm text-ink/50">{title}</p>
          </div>
          <ExportMenu title={title} filename={slug} fields={fields} submissions={submissions} />
        </div>

        <div className="mx-6 mt-5 flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
          <span className="text-sm font-medium text-ink/70">Accepting responses</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAccepting}
            aria-label="Accepting responses"
            disabled={togglePending}
            onClick={() => {
              const next = !isAccepting;
              setIsAccepting(next);
              startToggle(() => setAcceptingResponses(formId, next));
            }}
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
            style={{ backgroundColor: isAccepting ? accentColor : "rgb(23 24 43 / 0.2)" }}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${
                isAccepting ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        {!isAccepting && (
          <div className="mx-6 mt-4 rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
            This form is no longer accepting responses. It is hidden from the website.
          </div>
        )}

        <nav className="mt-4 flex justify-center border-t border-ink/10" aria-label="Response views">
          {tabs.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 border-b-[3px] px-6 py-3.5 text-sm font-semibold transition-colors ${
                  active ? "" : "border-transparent text-ink/50 hover:text-ink"
                }`}
                style={active ? { borderColor: accentColor, color: accentColor } : undefined}
              >
                <Icon size={16} weight={active ? "fill" : "regular"} />
                {t.label}
              </button>
            );
          })}
        </nav>
      </section>

      {submissions.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-ink/50">
            Waiting for responses. Share the form link: <span className="font-mono text-ink/70">/apply/{slug}</span>
          </p>
        </Card>
      ) : tab === "summary" ? (
        <SummaryView fields={fields} submissions={submissions} />
      ) : tab === "question" ? (
        <QuestionView fields={fields} submissions={submissions} accentColor={accentColor} />
      ) : (
        <IndividualView formId={formId} fields={fields} submissions={submissions} accentColor={accentColor} />
      )}
    </div>
  );
}

function FieldLabel({ field }: { field: ResponseField }) {
  return (
    <>
      {field.label}
      {field.archived && (
        <span className="ml-2 inline-block rounded-full bg-ink/5 px-2 py-0.5 align-middle text-xs font-medium text-ink/50">
          Deleted question
        </span>
      )}
    </>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>{children}</section>;
}

/* ------------------------------ Summary tab ------------------------------ */

function SummaryView({ fields, submissions }: { fields: ResponseField[]; submissions: ResponseSubmission[] }) {
  return (
    <>
      {fields.map((field) => {
        const answers = answersFor(field, submissions);
        return (
          <Card key={field.id}>
            <h3 className="text-base font-semibold text-ink">
              <FieldLabel field={field} />
            </h3>
            <p className="mt-1 text-sm text-ink/50">{responsesLabel(answers.length)}</p>
            <div className="mt-5">
              {answers.length === 0 ? (
                <p className="text-sm text-ink/40">No responses yet for this question.</p>
              ) : CHOICE_TYPES.has(field.type) ? (
                <ChoiceChart field={field} answers={answers} total={answers.length} />
              ) : field.type === "FILE" ? (
                <FileList answers={answers} />
              ) : (
                <TextAnswers answers={answers} />
              )}
            </div>
          </Card>
        );
      })}
    </>
  );
}

function ChoiceChart({ field, answers, total }: { field: ResponseField; answers: string[][]; total: number }) {
  const counts = countChoices(field, answers);
  // Pie for single-answer questions with few options; bars otherwise (checkboxes add up past 100%).
  if (field.type !== "CHECKBOXES" && counts.length <= CHART_COLORS.length) {
    return <PieChart data={counts} total={total} />;
  }
  return <BarChart data={counts} total={total} />;
}

function pct(count: number, total: number) {
  return total ? `${Math.round((count / total) * 1000) / 10}%` : "0%";
}

function PieChart({ data, total }: { data: { label: string; count: number }[]; total: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const R = 90;
  const C = 100;

  const slices = data.map((d, i) => {
    const before = data.slice(0, i).reduce((sum, x) => sum + x.count, 0);
    const start = -Math.PI / 2 + (total ? (before / total) * Math.PI * 2 : 0);
    const sweep = total ? (d.count / total) * Math.PI * 2 : 0;
    return { ...d, i, start, end: start + sweep, sweep, mid: start + sweep / 2 };
  });
  const nonZero = slices.filter((s) => s.count > 0);

  function arc(s: (typeof slices)[number]) {
    if (s.sweep >= Math.PI * 2 - 1e-6) return null; // full circle drawn separately
    const x1 = C + R * Math.cos(s.start);
    const y1 = C + R * Math.sin(s.start);
    const x2 = C + R * Math.cos(s.end);
    const y2 = C + R * Math.sin(s.end);
    return `M${C},${C} L${x1},${y1} A${R},${R} 0 ${s.sweep > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`;
  }

  const hovered = hover !== null ? slices[hover] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg viewBox="0 0 200 200" className="h-48 w-48" role="img" aria-label="Answer distribution">
          {nonZero.map((s) => {
            const d = arc(s);
            const color = CHART_COLORS[s.i % CHART_COLORS.length];
            const common = {
              fill: color,
              stroke: "var(--color-paper)",
              strokeWidth: 2,
              opacity: hover === null || hover === s.i ? 1 : 0.45,
              onMouseEnter: () => setHover(s.i),
              onMouseLeave: () => setHover(null),
              className: "cursor-default transition-opacity",
            };
            return d ? <path key={s.i} d={d} {...common} /> : <circle key={s.i} cx={C} cy={C} r={R} {...common} />;
          })}
          {/* Percentage on slices big enough to hold it */}
          {nonZero
            .filter((s) => s.sweep > 0.45)
            .map((s) => (
              <text
                key={`t${s.i}`}
                x={C + R * 0.62 * Math.cos(s.mid)}
                y={C + R * 0.62 * Math.sin(s.mid)}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none fill-white text-[13px] font-semibold"
              >
                {pct(s.count, total)}
              </text>
            ))}
        </svg>
        {hovered && (
          <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs text-paper shadow-lg">
            <span className="font-semibold">{hovered.label}</span> · {hovered.count} ({pct(hovered.count, total)})
          </div>
        )}
      </div>

      <ul className="w-full space-y-1">
        {slices.map((s) => (
          <li
            key={s.i}
            onMouseEnter={() => setHover(s.i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
              hover === s.i ? "bg-ink/5" : ""
            }`}
          >
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full"
              style={{ backgroundColor: CHART_COLORS[s.i % CHART_COLORS.length] }}
            />
            <span className="min-w-0 flex-1 text-ink/80">{s.label}</span>
            <span className="shrink-0 tabular-nums text-ink/50">
              {s.count} · {pct(s.count, total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarChart({ data, total }: { data: { label: string; count: number }[]; total: number }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label} title={`${d.label}: ${d.count} (${pct(d.count, total)})`} className="group">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 text-ink/80">{d.label}</span>
            <span className="shrink-0 tabular-nums text-ink/50">
              {d.count} · {pct(d.count, total)}
            </span>
          </div>
          <div className="mt-1.5 h-6 w-full rounded bg-ink/5">
            <div
              className="h-full rounded-r transition-[filter] group-hover:brightness-110"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: CHART_COLORS[0], minWidth: d.count ? 4 : 0 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function TextAnswers({ answers }: { answers: string[][] }) {
  const grouped = groupText(answers);
  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
      {grouped.map((g) => (
        <li key={g.label} className="flex items-start justify-between gap-3 rounded-lg bg-paper-dim px-4 py-2.5 text-sm">
          <span className="min-w-0 whitespace-pre-line break-words text-ink/80">{g.label}</span>
          {g.count > 1 && <span className="shrink-0 text-xs font-semibold text-ink/40">×{g.count}</span>}
        </li>
      ))}
    </ul>
  );
}

function FileList({ answers }: { answers: string[][] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {answers.flat().map((url, i) => (
        <li key={`${url}-${i}`}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2.5 text-sm text-ink/80 hover:border-blue hover:text-blue"
          >
            <Paperclip size={16} className="shrink-0" />
            <span className="truncate">{decodeURIComponent(url.split("/").pop() ?? url)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------- Question tab ------------------------------ */

function Stepper({
  index,
  count,
  onChange,
  children,
}: {
  index: number;
  count: number;
  onChange: (i: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(index - 1)}
        disabled={index <= 0}
        aria-label="Previous"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 disabled:opacity-30"
      >
        <CaretLeft size={18} weight="bold" />
      </button>
      {children}
      <button
        type="button"
        onClick={() => onChange(index + 1)}
        disabled={index >= count - 1}
        aria-label="Next"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 disabled:opacity-30"
      >
        <CaretRight size={18} weight="bold" />
      </button>
    </div>
  );
}

function QuestionView({
  fields,
  submissions,
  accentColor,
}: {
  fields: ResponseField[];
  submissions: ResponseSubmission[];
  accentColor: string;
}) {
  const [index, setIndex] = useState(0);
  const field = fields[Math.min(index, fields.length - 1)];
  if (!field) return null;

  const answers = answersFor(field, submissions);
  const groups = CHOICE_TYPES.has(field.type)
    ? countChoices(field, answers).sort((a, b) => b.count - a.count)
    : groupText(answers);

  return (
    <>
      <Card className="flex flex-wrap items-center gap-3">
        <select
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          aria-label="Question"
          className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        >
          {fields.map((f, i) => (
            <option key={f.id} value={i}>
              {f.archived ? `${f.label} (deleted question)` : f.label}
            </option>
          ))}
        </select>
        <Stepper index={index} count={fields.length} onChange={setIndex}>
          <span className="text-sm tabular-nums text-ink/60">
            {index + 1} of {fields.length}
          </span>
        </Stepper>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-ink">
              <FieldLabel field={field} />
            </h3>
        <p className="mt-1 text-sm text-ink/50">{responsesLabel(answers.length)}</p>
      </Card>

      {field.type === "FILE" ? (
        <Card>
          <FileList answers={answers} />
        </Card>
      ) : (
        groups.map((g) => (
          <Card key={g.label} className="flex items-start justify-between gap-4">
            <p className="min-w-0 whitespace-pre-line break-words text-sm text-ink/85">{g.label}</p>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
            >
              {responsesLabel(g.count)}
            </span>
          </Card>
        ))
      )}
    </>
  );
}

/* ---------------------------- Individual tab ----------------------------- */

function IndividualView({
  formId,
  fields,
  submissions,
  accentColor,
}: {
  formId: string;
  fields: ResponseField[];
  submissions: ResponseSubmission[];
  accentColor: string;
}) {
  // Google Forms numbers responses oldest-first.
  const ordered = useMemo(() => [...submissions].reverse(), [submissions]);
  const [index, setIndex] = useState(ordered.length - 1);
  const [pending, startTransition] = useTransition();

  const current = Math.min(Math.max(index, 0), ordered.length - 1);
  const submission = ordered[current];
  if (!submission) return null;

  // Label each response by its first email or text answer, like Google's responder dropdown.
  const nameField = fields.find((f) => f.type === "EMAIL") ?? fields.find((f) => f.type === "SHORT_TEXT");
  const labelOf = (s: ResponseSubmission, i: number) => {
    const v = nameField ? s.data[nameField.id] : undefined;
    return typeof v === "string" && v ? v : `Response ${i + 1}`;
  };

  return (
    <>
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <Stepper index={current} count={ordered.length} onChange={setIndex}>
          <select
            value={current}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-label="Response"
            className="max-w-56 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            {ordered.map((s, i) => (
              <option key={s.id} value={i}>
                {labelOf(s, i)}
              </option>
            ))}
          </select>
          <span className="text-sm tabular-nums text-ink/60">
            {current + 1} of {ordered.length}
          </span>
        </Stepper>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Delete this response? This can't be undone.")) return;
            startTransition(async () => {
              await deleteSubmission(formId, submission.id);
              setIndex((i) => Math.max(0, i - 1));
            });
          }}
          aria-label="Delete response"
          title="Delete response"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-red hover:text-paper disabled:opacity-40"
        >
          <Trash size={18} />
        </button>
      </Card>

      <Card className="overflow-hidden !p-0">
        <div className="h-2.5" style={{ backgroundColor: accentColor }} />
        <p className="px-6 py-4 text-sm text-ink/60">
          Submitted {dateTime.format(new Date(submission.createdAt))}
        </p>
      </Card>

      {fields.map((field) => (
        <Card key={field.id}>
          <h3 className="text-base text-ink">
            <FieldLabel field={field} />
            {field.required && !field.archived && <span className="ml-1 text-red">*</span>}
          </h3>
          <div className="mt-4">
            <AnswerDisplay field={field} value={submission.data[field.id]} accentColor={accentColor} />
          </div>
        </Card>
      ))}
    </>
  );
}

function AnswerDisplay({
  field,
  value,
  accentColor,
}: {
  field: ResponseField;
  value: string | string[] | undefined;
  accentColor: string;
}) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  if (CHOICE_TYPES.has(field.type)) {
    const extras = values.filter((v) => !field.options.includes(v));
    const square = field.type === "CHECKBOXES";
    return (
      <ul className="space-y-3">
        {[...field.options, ...extras].map((option) => {
          const checked = values.includes(option);
          return (
            <li key={option} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${square ? "rounded" : "rounded-full"}`}
                style={{
                  borderColor: checked ? accentColor : "rgb(23 24 43 / 0.3)",
                  backgroundColor: checked && square ? accentColor : undefined,
                }}
              >
                {checked &&
                  (square ? (
                    <Check size={12} weight="bold" className="text-white" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  ))}
              </span>
              <span className={checked ? "font-medium text-ink" : "text-ink/60"}>{option}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (values.length === 0) return <p className="text-sm italic text-ink/35">No answer</p>;

  if (field.type === "FILE") return <FileList answers={[values]} />;

  return (
    <p className="whitespace-pre-line break-words border-b border-dotted border-ink/25 pb-2 text-sm text-ink/85">
      {values.join(", ")}
    </p>
  );
}
