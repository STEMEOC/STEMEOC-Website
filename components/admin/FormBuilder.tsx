"use client";

import { startTransition, useActionState, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { FormSaveState } from "@/lib/actions/forms";
import type { Form, FormField, FormFieldType, FormLayout, FormTheme } from "@prisma/client";
import {
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  ListChecks,
  PaintBrush,
  LinkSimple,
  Copy,
  SpinnerGap,
  TextAa,
  TextAlignLeft,
  EnvelopeSimple,
  HashStraight,
  CalendarBlank,
  CaretDown,
  RadioButton,
  CheckSquare,
  Paperclip,
  Check,
  Sun,
  Moon,
  Eyedropper,
  Image as ImageIcon,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { FieldInput } from "@/components/FormFieldInput";
import { FormStyleFrame } from "@/components/FormStyleFrame";
import { FORM_TEMPLATES, type FormTemplate } from "@/lib/formTemplates";

const ACCENT_SWATCHES = [
  "#2c80c2",
  "#e5262a",
  "#14a650",
  "#f49423",
  "#7c3aed",
  "#0d9488",
  "#db2777",
  "#475569",
];

const LAYOUTS: { value: FormLayout; label: string; description: string }[] = [
  { value: "CLASSIC", label: "Classic", description: "Centered card" },
  { value: "MINIMAL", label: "Minimal", description: "Flush, no card" },
  { value: "BOLD", label: "Bold", description: "Color header banner" },
  { value: "COVER", label: "Cover", description: "Full-bleed photo background" },
  { value: "SIDEBAR", label: "Sidebar", description: "Colored side stripe" },
  { value: "DUOTONE", label: "Duotone", description: "Soft tinted header" },
  { value: "FRAMED", label: "Framed", description: "Tinted card with monogram" },
  { value: "BADGE", label: "Badge", description: "Pill-labeled header" },
];

type FieldDraft = {
  id: string;
  label: string;
  type: FormFieldType;
  options: string[];
  required: boolean;
};

const FIELD_TYPES: {
  value: FormFieldType;
  label: string;
  icon: typeof TextAa;
  color: string;
}[] = [
  { value: "SHORT_TEXT", label: "Short text", icon: TextAa, color: "var(--color-blue)" },
  { value: "PARAGRAPH", label: "Paragraph", icon: TextAlignLeft, color: "var(--color-blue)" },
  { value: "EMAIL", label: "Email", icon: EnvelopeSimple, color: "var(--color-green)" },
  { value: "NUMBER", label: "Number", icon: HashStraight, color: "var(--color-green)" },
  { value: "DATE", label: "Date", icon: CalendarBlank, color: "var(--color-orange)" },
  { value: "DROPDOWN", label: "Dropdown", icon: CaretDown, color: "var(--color-orange)" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice", icon: RadioButton, color: "var(--color-red)" },
  { value: "CHECKBOXES", label: "Checkboxes", icon: CheckSquare, color: "var(--color-red)" },
  { value: "FILE", label: "File upload", icon: Paperclip, color: "var(--color-blue)" },
];

const FIELD_TYPE_META = new Map(FIELD_TYPES.map((t) => [t.value, t]));
const OPTION_TYPES = new Set<FormFieldType>(["DROPDOWN", "MULTIPLE_CHOICE", "CHECKBOXES"]);

const TABS = [
  { id: "questions", label: "Questions", icon: ListChecks },
  { id: "design", label: "Design & preview", icon: PaintBrush },
] as const;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 80);
}

function newField(type: FormFieldType = "SHORT_TEXT"): FieldDraft {
  return {
    id: crypto.randomUUID(),
    label: "",
    type,
    options: OPTION_TYPES.has(type) ? ["Option 1"] : [],
    required: false,
  };
}

function Switch({ on, onToggle, color, small = false }: { on: boolean; onToggle: () => void; color: string; small?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative shrink-0 rounded-full transition-colors ${small ? "h-5 w-9" : "h-6 w-11"}`}
      style={{ backgroundColor: on ? color : "rgb(5 19 59 / 0.2)" }}
    >
      <span
        className={`absolute top-0.5 rounded-full bg-white shadow transition-[left] ${small ? "h-4 w-4" : "h-5 w-5"} ${
          on ? (small ? "left-[1.125rem]" : "left-[1.375rem]") : "left-0.5"
        }`}
      />
    </button>
  );
}

function SaveButton({ disabled, pending, label }: { disabled: boolean; pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      title={disabled ? "Add at least one question first" : undefined}
      className="flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-sm font-bold text-white transition-colors hover:bg-blue-deep disabled:opacity-50"
    >
      {pending ? <SpinnerGap size={16} weight="bold" className="animate-spin" /> : <Check size={16} weight="bold" />}
      {pending ? "Saving…" : label}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-navy/50 transition-colors disabled:opacity-25 ${
        danger ? "hover:bg-red hover:text-white" : "hover:bg-navy/5 hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

/** The circle / square / number in front of each choice, as respondents see it. */
function OptionMarker({ type, index }: { type: FormFieldType; index: number }) {
  if (type === "DROPDOWN") return <span className="w-5 shrink-0 text-right text-sm text-navy/40">{index + 1}.</span>;
  return (
    <span
      className={`h-5 w-5 shrink-0 border-2 border-navy/25 ${type === "CHECKBOXES" ? "rounded" : "rounded-full"}`}
      aria-hidden
    />
  );
}

const ANSWER_SAMPLES: Partial<Record<FormFieldType, { text: string; icon?: typeof TextAa; wide?: boolean }>> = {
  SHORT_TEXT: { text: "Short answer" },
  PARAGRAPH: { text: "Long answer", wide: true },
  EMAIL: { text: "name@example.com", icon: EnvelopeSimple },
  NUMBER: { text: "Number", icon: HashStraight },
  DATE: { text: "Day / month / year", icon: CalendarBlank },
  FILE: { text: "People upload a file (up to 10MB)", icon: Paperclip },
};

/** A faded example of the answer box, so it's clear what people will fill in. */
function AnswerSample({ type }: { type: FormFieldType }) {
  const sample = ANSWER_SAMPLES[type];
  if (!sample) return null;
  const Icon = sample.icon;
  return (
    <p
      className={`flex items-center gap-2 border-b border-dotted border-navy/25 pb-2 text-sm text-navy/40 ${
        sample.wide ? "w-full sm:w-4/5" : "w-full sm:w-1/2"
      }`}
    >
      {Icon && <Icon size={16} />}
      {sample.text}
    </p>
  );
}

export function FormBuilder({
  action,
  form,
  initialTemplate,
}: {
  action: (prev: FormSaveState, formData: FormData) => Promise<FormSaveState>;
  form?: Form & { fields: FormField[] };
  /** New forms only: pre-fill from a template picked on the Forms page. */
  initialTemplate?: FormTemplate;
}) {
  const tpl = form ? undefined : initialTemplate;
  const [fields, setFields] = useState<FieldDraft[]>(
    form?.fields.map((f) => ({ id: f.id, label: f.label, type: f.type, options: f.options, required: f.required })) ??
      // Deterministic ids so the server and client render the same markup.
      tpl?.fields.map((f, i) => ({
        id: `${tpl.id}-${i}`,
        label: f.label,
        type: f.type,
        options: f.options ?? [],
        required: f.required ?? false,
      })) ??
      []
  );
  const [title, setTitle] = useState(form?.title ?? tpl?.title ?? "");
  const [slug, setSlug] = useState(form?.slug ?? tpl?.slug ?? "");
  const [description, setDescription] = useState(form?.description ?? tpl?.formDescription ?? "");
  const [mode, setMode] = useState<"questions" | "design">("questions");
  const [published, setPublished] = useState(form?.published ?? true);
  // New forms fill the link from the title until someone edits it by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(form));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, saveAction, saving] = useActionState(action, {});
  const [dismissed, setDismissed] = useState<FormSaveState | null>(null);
  const shownError = error ?? (saveState !== dismissed ? saveState.error : undefined);
  const [templateId, setTemplateId] = useState<string | null>(tpl?.id ?? null);
  const [accentColor, setAccentColor] = useState(form?.accentColor ?? tpl?.accentColor ?? "#2c80c2");
  const [layout, setLayout] = useState<FormLayout>(form?.layout ?? tpl?.layout ?? "CLASSIC");
  const [theme, setTheme] = useState<FormTheme>(form?.theme ?? tpl?.theme ?? "LIGHT");
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState(form?.coverImageUrl ?? "");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(form?.coverImageUrl ?? null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  function handleCoverImageChange(file: File | null) {
    setCoverPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : existingCoverImageUrl || null;
    });
  }

  function removeCoverImage() {
    if (coverImageInputRef.current) coverImageInputRef.current.value = "";
    setExistingCoverImageUrl("");
    setCoverPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  }

  function applyTemplate(template: FormTemplate) {
    setTemplateId(template.id);
    setTitle(template.title);
    setSlug(template.slug);
    setDescription(template.formDescription);
    setAccentColor(template.accentColor);
    setLayout(template.layout);
    setTheme(template.theme);
    setFields(
      template.fields.map((f) => ({
        id: crypto.randomUUID(),
        label: f.label,
        type: f.type,
        options: f.options ?? [],
        required: f.required ?? false,
      }))
    );
  }

  // Blank choices are dropped on save rather than failing validation.
  const cleanFields = fields.map((f) => ({
    ...f,
    options: OPTION_TYPES.has(f.type) ? f.options.map((o) => o.trim()).filter(Boolean) : [],
  }));

  function focusSoon(selector: string) {
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>(selector)?.focus());
  }

  function addField(type: FormFieldType) {
    const field = newField(type);
    setFields((prev) => {
      const at = prev.findIndex((f) => f.id === activeId);
      if (at === -1) return [...prev, field];
      return [...prev.slice(0, at + 1), field, ...prev.slice(at + 1)];
    });
    setActiveId(field.id);
    setError(null);
    focusSoon(`#q-${CSS.escape(field.id)}`);
  }

  function duplicateField(id: string) {
    const copy = { ...fields.find((f) => f.id === id)!, id: crypto.randomUUID() };
    copy.options = [...copy.options];
    setFields((prev) => {
      const at = prev.findIndex((f) => f.id === id);
      return [...prev.slice(0, at + 1), copy, ...prev.slice(at + 1)];
    });
    setActiveId(copy.id);
  }

  function changeType(field: FieldDraft, type: FormFieldType) {
    const needsOptions = OPTION_TYPES.has(type) && field.options.length === 0;
    updateField(field.id, { type, ...(needsOptions ? { options: ["Option 1"] } : {}) });
  }

  function updateField(id: string, patch: Partial<FieldDraft>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function moveField(id: string, direction: -1 | 1) {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addOption(fieldId: string, at?: number) {
    let index = 0;
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        index = at ?? f.options.length;
        const options = [...f.options];
        options.splice(index, 0, "");
        return { ...f, options };
      })
    );
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>(`[data-option="${CSS.escape(`${fieldId}-${index}`)}"]`)?.focus()
    );
  }

  function updateOption(fieldId: string, index: number, value: string) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        const options = [...f.options];
        options[index] = value;
        return { ...f, options };
      })
    );
  }

  function removeOption(fieldId: string, index: number) {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, options: f.options.filter((_, i) => i !== index) } : f))
    );
  }

  return (
    <form
      // Submitted by hand rather than via `action`, so React doesn't clear the
      // form (and the chosen cover image) when the server sends back an error.
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(() => saveAction(formData));
      }}
      onChange={() => {
        setError(null);
        setDismissed(saveState);
      }}
      onInvalidCapture={() => {
        // A required box on the hidden tab can't show its own message, so bring it into view.
        setMode("questions");
        setError("Please fill in the highlighted boxes before saving.");
      }}
      className="w-full"
    >
      <input type="hidden" name="fields" value={JSON.stringify(cleanFields)} />
      <input type="hidden" name="accentColor" value={accentColor} />
      <input type="hidden" name="layout" value={layout} />
      <input type="hidden" name="theme" value={theme} />
      <input type="hidden" name="existingCoverImageUrl" value={existingCoverImageUrl} />
      {published && <input type="hidden" name="published" value="on" />}

      {/* Toolbar: stays on screen so Save is always one click away */}
      <div className="sticky top-0 z-20 -mx-8 mb-8 border-b border-navy/10 bg-paper-dim/90 px-8 py-3 backdrop-blur lg:-mx-14 lg:px-14">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-navy/10" role="tablist">
            {TABS.map((t) => {
              const active = mode === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(t.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    active ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
                  }`}
                >
                  <Icon size={16} weight={active ? "fill" : "bold"} />
                  {t.label}
                  {t.id === "questions" && (
                    <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-navy/10"}`}>
                      {fields.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-navy/70">
              <Switch on={published} onToggle={() => setPublished((p) => !p)} color={accentColor} />
              {published ? "Accepting responses" : "Closed"}
            </label>
            <SaveButton disabled={fields.length === 0} pending={saving} label={form ? "Save changes" : "Create form"} />
          </div>
        </div>
        {shownError && (
          <p className="mt-2 text-sm font-medium text-red" role="alert">
            {shownError}
          </p>
        )}
      </div>

      {/* ---------------------------- Questions tab ---------------------------- */}
      <div className={mode === "questions" ? "max-w-3xl space-y-4" : "hidden"}>
        {!form && (
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="mr-1 text-sm font-semibold text-navy/50">Start from:</span>
            {FORM_TEMPLATES.map((template) => {
              const active = templateId === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10 hover:ring-navy/30"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: template.accentColor }} />
                  {template.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Title card */}
        <section
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/10"
          style={{ "--accent": accentColor } as CSSProperties}
        >
          <div className="h-2.5" style={{ backgroundColor: accentColor }} />
          <div className="space-y-4 p-6 sm:p-8">
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Untitled form"
              aria-label="Form title"
              required
              className="w-full border-b-2 border-transparent bg-transparent pb-2 font-display text-3xl font-bold text-navy outline-none transition-colors placeholder:text-navy/30 hover:border-navy/10 focus:border-[var(--accent)] user-invalid:border-red"
            />
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form description (optional): tell people what this form is for"
              aria-label="Form description"
              rows={2}
              className="w-full resize-y border-b-2 border-transparent bg-transparent pb-2 text-base text-navy/80 outline-none transition-colors placeholder:text-navy/35 hover:border-navy/10 focus:border-[var(--accent)]"
            />
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-paper-dim px-4 py-3 text-sm">
              <LinkSimple size={16} weight="bold" className="text-navy/40" />
              <span className="text-navy/50">Form link:</span>
              <span className="font-mono text-navy/50">/apply/</span>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                placeholder="volunteer-application"
                aria-label="Form link"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Lowercase letters, numbers and hyphens only"
                className="min-w-40 flex-1 rounded-md bg-transparent px-1 font-mono text-navy outline-none focus:bg-white focus:ring-1 focus:ring-navy/20 user-invalid:text-red"
              />
            </div>
          </div>
        </section>

        {fields.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-navy/15 px-6 py-10 text-center">
            <p className="text-base font-semibold text-navy">No questions yet</p>
            <p className="mt-1 text-sm text-navy/55">Pick a question type below to add your first one.</p>
          </div>
        )}

        {fields.map((field, index) => {
          const active = activeId === field.id;
          const meta = FIELD_TYPE_META.get(field.type)!;
          const TypeIcon = meta.icon;
          return (
            <section
              key={field.id}
              onFocusCapture={() => setActiveId(field.id)}
              onClick={() => setActiveId(field.id)}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-shadow ${
                active ? "shadow-lg shadow-navy/10 ring-navy/15" : "ring-navy/10"
              }`}
              style={{ "--accent": accentColor } as CSSProperties}
            >
              <span
                className="absolute inset-y-0 left-0 w-1.5 transition-opacity"
                style={{ backgroundColor: accentColor, opacity: active ? 1 : 0 }}
                aria-hidden
              />
              <div className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="hidden h-12 w-8 shrink-0 items-center text-sm font-bold text-navy/35 sm:flex">
                    {index + 1}.
                  </span>
                  <input
                    id={`q-${field.id}`}
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Type your question"
                    aria-label={`Question ${index + 1}`}
                    required
                    className="h-12 min-w-0 flex-1 rounded-t-lg border-b-2 border-navy/10 bg-paper-dim px-4 text-base text-navy outline-none transition-colors placeholder:text-navy/35 focus:border-[var(--accent)] user-invalid:border-red"
                  />
                  <div className="relative sm:w-56">
                    <TypeIcon
                      size={18}
                      weight="bold"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: meta.color }}
                    />
                    <select
                      value={field.type}
                      onChange={(e) => changeType(field, e.target.value as FormFieldType)}
                      aria-label="Question type"
                      className="h-12 w-full appearance-none rounded-lg border border-navy/15 bg-white pl-11 pr-9 text-sm font-medium text-navy outline-none focus:border-navy/40"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <CaretDown
                      size={14}
                      weight="bold"
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40"
                    />
                  </div>
                </div>

                {/* What the answer looks like, so it's clear what people will fill in */}
                <div className="mt-4 sm:pl-11">
                  {OPTION_TYPES.has(field.type) ? (
                    <div className="space-y-1">
                      {field.options.map((opt, i) => (
                        <div key={i} className="group/opt flex items-center gap-3">
                          <OptionMarker type={field.type} index={i} />
                          <input
                            value={opt}
                            onChange={(e) => updateOption(field.id, i, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addOption(field.id, i + 1);
                              }
                            }}
                            data-option={`${field.id}-${i}`}
                            placeholder={`Option ${i + 1}`}
                            aria-label={`Option ${i + 1}`}
                            className="min-w-0 flex-1 border-b border-transparent bg-transparent py-2 text-sm text-navy outline-none hover:border-navy/10 focus:border-navy/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(field.id, i)}
                            aria-label={`Remove option ${i + 1}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-navy/35 opacity-0 transition-opacity hover:bg-navy/5 hover:text-red focus:opacity-100 group-hover/opt:opacity-100"
                          >
                            <X size={16} weight="bold" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(field.id)}
                        className="flex items-center gap-3 py-2 text-sm text-navy/50 hover:text-navy"
                      >
                        <OptionMarker type={field.type} index={field.options.length} />
                        Add option
                      </button>
                    </div>
                  ) : (
                    <AnswerSample type={field.type} />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-1 border-t border-navy/10 px-4 py-2.5">
                <IconButton label="Move up" onClick={() => moveField(field.id, -1)} disabled={index === 0}>
                  <ArrowUp size={18} />
                </IconButton>
                <IconButton label="Move down" onClick={() => moveField(field.id, 1)} disabled={index === fields.length - 1}>
                  <ArrowDown size={18} />
                </IconButton>
                <IconButton label="Duplicate" onClick={() => duplicateField(field.id)}>
                  <Copy size={18} />
                </IconButton>
                <IconButton label="Delete question" onClick={() => removeField(field.id)} danger>
                  <Trash size={18} />
                </IconButton>
                <span className="mx-2 h-6 w-px bg-navy/10" aria-hidden />
                <label className="flex cursor-pointer items-center gap-2.5 pr-2 text-sm font-medium text-navy/70">
                  Required
                  <Switch
                    on={field.required}
                    onToggle={() => updateField(field.id, { required: !field.required })}
                    color={accentColor}
                    small
                  />
                </label>
              </div>
            </section>
          );
        })}

        {/* Add a question: one click per type */}
        <section className="rounded-2xl border-2 border-dashed border-navy/15 p-5">
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-navy">
            <Plus size={16} weight="bold" />
            Add a question
            {activeId && fields.some((f) => f.id === activeId) && (
              <span className="font-normal text-navy/45">(it goes below the selected question)</span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FIELD_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => addField(t.value)}
                  className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-navy ring-1 ring-navy/10 transition-shadow hover:shadow-md hover:ring-navy/25"
                >
                  <Icon size={16} weight="bold" style={{ color: t.color }} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ------------------------- Design & preview tab ------------------------- */}
      <div className={mode === "design" ? "flex flex-col gap-6 2xl:flex-row 2xl:items-start" : "hidden"}>
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy/10 sm:p-8 2xl:w-[560px] 2xl:shrink-0">
            <div>
              <p className="font-display text-xl font-bold text-navy">Design</p>
              <p className="mt-1 text-sm text-navy/55">Changes show in the preview straight away.</p>
            </div>

            <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-bold text-ink">Accent color</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {ACCENT_SWATCHES.map((swatch) => {
                  const active = accentColor.toLowerCase() === swatch.toLowerCase();
                  return (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => setAccentColor(swatch)}
                      aria-label={swatch}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform ${active ? "scale-110 ring-2 ring-offset-2 ring-offset-paper" : "hover:scale-105"}`}
                      style={{ backgroundColor: swatch, ...(active ? ({ "--tw-ring-color": swatch } as CSSProperties) : {}) }}
                    >
                      {active && <Check size={14} weight="bold" className="text-paper" />}
                    </button>
                  );
                })}
                <label className="relative ml-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/15">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
                    aria-label="Custom accent color"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Eyedropper size={15} weight="bold" className="pointer-events-none relative text-paper drop-shadow-sm" />
                </label>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-ink">Layout</p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {LAYOUTS.map((l) => {
                  const active = layout === l.value;
                  const dark = theme === "DARK";
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setLayout(l.value)}
                      className={`flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-colors ${
                        active ? "border-transparent bg-paper-dim ring-2" : "border-ink/15 hover:border-ink/30"
                      }`}
                      style={active ? ({ "--tw-ring-color": accentColor } as CSSProperties) : undefined}
                    >
                      <span
                        className={`flex h-24 w-full items-center justify-center overflow-hidden rounded-xl p-3 ${dark ? "bg-[#12141c]" : "bg-ink/5"}`}
                      >
                        {l.value === "CLASSIC" && (
                          <span
                            className={`flex h-full w-full flex-col items-start gap-1.5 rounded-lg p-2.5 shadow-sm ring-1 ${dark ? "bg-[#1c1f2b] ring-white/10" : "bg-paper ring-black/10"}`}
                          >
                            <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: accentColor }} />
                            <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                            <span className={`h-1.5 w-2/3 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                          </span>
                        )}
                        {l.value === "MINIMAL" && (
                          <span className="flex h-full w-full flex-col items-start justify-center gap-1.5 px-1">
                            <span className="h-1 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
                            <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/20" : "bg-ink/15"}`} />
                            <span className={`h-1.5 w-1/2 rounded-full ${dark ? "bg-white/20" : "bg-ink/15"}`} />
                          </span>
                        )}
                        {l.value === "BOLD" && (
                          <span
                            className={`flex h-full w-full flex-col overflow-hidden rounded-lg ring-1 ${dark ? "ring-white/10" : "ring-black/10"}`}
                          >
                            <span className="flex h-1/2 flex-col justify-center gap-1 px-2.5" style={{ backgroundColor: accentColor }}>
                              <span className="h-1.5 w-2/3 rounded-full bg-white/60" />
                              <span className="h-1.5 w-1/3 rounded-full bg-white/40" />
                            </span>
                            <span className={`flex h-1/2 flex-col justify-center gap-1.5 px-2.5 ${dark ? "bg-[#1c1f2b]" : "bg-paper"}`}>
                              <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                              <span className={`h-1.5 w-2/3 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                            </span>
                          </span>
                        )}
                        {l.value === "COVER" && (
                          <span
                            className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center p-2 ring-1 ring-black/10"
                            style={
                              coverPreviewUrl
                                ? { backgroundImage: `url(${coverPreviewUrl})` }
                                : { backgroundColor: accentColor }
                            }
                          >
                            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            {!coverPreviewUrl && (
                              <ImageIcon size={16} weight="bold" className="relative mx-auto mb-auto mt-auto text-white/70" />
                            )}
                            <span className="relative h-1.5 w-1/2 rounded-full bg-white/70" />
                          </span>
                        )}
                        {l.value === "SIDEBAR" && (
                          <span
                            className={`flex h-full w-full overflow-hidden rounded-lg ring-1 ${dark ? "ring-white/10" : "ring-black/10"}`}
                          >
                            <span className="w-2 shrink-0" style={{ backgroundColor: accentColor }} />
                            <span className={`flex flex-1 flex-col justify-center gap-1.5 px-2.5 ${dark ? "bg-[#1c1f2b]" : "bg-paper"}`}>
                              <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                              <span className={`h-1.5 w-2/3 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                            </span>
                          </span>
                        )}
                        {l.value === "DUOTONE" && (
                          <span
                            className={`flex h-full w-full flex-col overflow-hidden rounded-lg ring-1 ${dark ? "ring-white/10" : "ring-black/10"}`}
                          >
                            <span
                              className="flex h-2/3 flex-col justify-center gap-1.5 px-2.5"
                              style={{ backgroundImage: `linear-gradient(180deg, ${accentColor}55, transparent)` }}
                            >
                              <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: accentColor }} />
                              <span className={`h-1.5 w-3/4 rounded-full ${dark ? "bg-white/25" : "bg-ink/15"}`} />
                            </span>
                            <span className={`flex h-1/3 flex-col justify-center px-2.5 ${dark ? "bg-[#1c1f2b]" : "bg-paper"}`}>
                              <span className={`h-1.5 w-1/2 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                            </span>
                          </span>
                        )}
                        {l.value === "FRAMED" && (
                          <span
                            className="flex h-full w-full flex-col items-start gap-1.5 rounded-lg p-2.5"
                            style={{ backgroundColor: `${accentColor}0d`, boxShadow: `inset 0 0 0 1.5px ${accentColor}59` }}
                          >
                            <span
                              className="flex h-4 w-4 items-center justify-center rounded-md text-[8px] font-bold text-white"
                              style={{ backgroundColor: accentColor }}
                            >
                              A
                            </span>
                            <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/20" : "bg-ink/15"}`} />
                            <span className={`h-1.5 w-2/3 rounded-full ${dark ? "bg-white/20" : "bg-ink/15"}`} />
                          </span>
                        )}
                        {l.value === "BADGE" && (
                          <span
                            className={`flex h-full w-full flex-col items-start justify-center gap-1.5 rounded-lg p-2.5 ${dark ? "bg-[#1c1f2b]" : "bg-paper"}`}
                          >
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase text-white"
                              style={{ backgroundColor: accentColor }}
                            >
                              Tag
                            </span>
                            <span className={`h-1.5 w-full rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                            <span className={`h-1.5 w-2/3 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-ink">{l.label}</span>
                      <span className="text-[10px] text-ink/50">{l.description}</span>
                    </button>
                  );
                })}
              </div>

              {layout === "COVER" && (
                <div className="mt-3 rounded-2xl border border-dashed border-ink/20 p-4">
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverImageChange(e.target.files?.[0] ?? null)}
                  />
                  {coverPreviewUrl ? (
                    <div className="flex items-center gap-3">
                      <span
                        className="h-14 w-20 shrink-0 rounded-lg bg-cover bg-center ring-1 ring-black/10"
                        style={{ backgroundImage: `url(${coverPreviewUrl})` }}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-xs text-ink/60">Cover image set</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => coverImageInputRef.current?.click()}
                            className="text-xs font-bold text-blue hover:underline"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className="flex items-center gap-1 text-xs font-bold text-red hover:underline"
                          >
                            <X size={12} weight="bold" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverImageInputRef.current?.click()}
                      className="flex w-full cursor-pointer flex-col items-center gap-1.5 py-4 text-center"
                    >
                      <ImageIcon size={20} weight="bold" className="text-ink/40" />
                      <span className="text-xs font-bold text-ink">Upload a background image</span>
                      <span className="text-[10px] text-ink/50">PNG or JPG, up to 10MB</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy/10 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 whitespace-nowrap font-mono-label text-xs uppercase text-ink/40">
                <Eye size={13} weight="bold" className="shrink-0" />
                Live preview: how people will see your form
              </p>
              <div className="inline-flex shrink-0 rounded-full bg-ink/5 p-1">
                <button
                  type="button"
                  onClick={() => setTheme("LIGHT")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    theme === "LIGHT" ? "bg-paper text-ink shadow-sm" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  <Sun size={14} weight="bold" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("DARK")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    theme === "DARK" ? "bg-paper text-ink shadow-sm" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  <Moon size={14} weight="bold" />
                  Dark
                </button>
              </div>
            </div>
            <FormStyleFrame
              accentColor={accentColor}
              layout={layout}
              theme={theme}
              title={title}
              description={description}
              coverImageUrl={coverPreviewUrl}
            >
            <div className="space-y-6">
              {fields.length === 0 && (
                <p className={`text-sm ${theme === "DARK" ? "text-paper/50" : "text-ink/50"}`}>Add questions to see them here.</p>
              )}
              {fields.map((field) => (
                <div key={field.id}>
                  <p className="text-sm font-bold">
                    {field.label || "Untitled question"}
                    {field.required && <span className="text-red"> *</span>}
                  </p>
                  <FieldInput field={field} disabled dark={theme === "DARK"} />
                </div>
              ))}
            </div>

            {fields.length > 0 && (
              <button
                type="button"
                disabled
                className="mt-8 rounded-full px-7 py-3.5 text-sm font-bold text-white opacity-60"
                style={{ backgroundColor: accentColor }}
              >
                Submit
              </button>
            )}
          </FormStyleFrame>
          </div>
      </div>
    </form>
  );
}
