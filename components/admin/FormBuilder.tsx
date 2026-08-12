"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { Form, FormField, FormFieldType, FormLayout, FormTheme } from "@prisma/client";
import {
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Eye,
  PencilSimple,
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

function newField(): FieldDraft {
  return { id: crypto.randomUUID(), label: "", type: "SHORT_TEXT", options: [], required: false };
}

export function FormBuilder({
  action,
  form,
}: {
  action: (formData: FormData) => void;
  form?: Form & { fields: FormField[] };
}) {
  const [fields, setFields] = useState<FieldDraft[]>(
    form?.fields.map((f) => ({ id: f.id, label: f.label, type: f.type, options: f.options, required: f.required })) ?? []
  );
  const [title, setTitle] = useState(form?.title ?? "");
  const [slug, setSlug] = useState(form?.slug ?? "");
  const [description, setDescription] = useState(form?.description ?? "");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState(form?.accentColor ?? "#2c80c2");
  const [layout, setLayout] = useState<FormLayout>(form?.layout ?? "CLASSIC");
  const [theme, setTheme] = useState<FormTheme>(form?.theme ?? "LIGHT");
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

  function addOption(fieldId: string) {
    setFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, options: [...f.options, ""] } : f)));
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
    <form action={action} className={`space-y-8 ${mode === "preview" ? "w-full" : "max-w-2xl"}`}>
      <input type="hidden" name="fields" value={JSON.stringify(fields)} />
      <input type="hidden" name="accentColor" value={accentColor} />
      <input type="hidden" name="layout" value={layout} />
      <input type="hidden" name="theme" value={theme} />
      <input type="hidden" name="existingCoverImageUrl" value={existingCoverImageUrl} />

      <div className="inline-flex rounded-full bg-ink/5 p-1">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            mode === "edit" ? "bg-paper text-ink shadow-sm" : "text-ink/50 hover:text-ink"
          }`}
        >
          <PencilSimple size={14} weight="bold" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            mode === "preview" ? "bg-paper text-ink shadow-sm" : "text-ink/50 hover:text-ink"
          }`}
        >
          <Eye size={14} weight="bold" />
          Preview
        </button>
      </div>

      <div className={mode === "edit" ? "space-y-8" : "hidden"} aria-hidden={mode !== "edit"}>
        {!form && (
          <div className="space-y-3">
            <p className="font-mono-label text-xs uppercase text-ink/40">Start from a template</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FORM_TEMPLATES.map((template) => {
                const active = templateId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`relative flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-transparent bg-paper shadow-pop-sm ring-2 ring-blue"
                        : "border-ink/15 bg-paper-dim hover:border-ink/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue text-paper">
                        <Check size={12} weight="bold" />
                      </span>
                    )}
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <span className="text-sm font-bold text-ink">{template.label}</span>
                    <span className="text-xs text-ink/50">{template.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-6 rounded-[2rem] bg-paper p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div>
            <label htmlFor="title" className="text-sm font-bold text-ink">Title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-ink/15 bg-paper-dim px-4 py-3 text-sm outline-none transition-colors focus:border-blue focus:bg-paper"
            />
          </div>

          <div>
            <label htmlFor="slug" className="text-sm font-bold text-ink">Slug</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="volunteer-application"
              required
              className="mt-2 w-full rounded-xl border border-ink/15 bg-paper-dim px-4 py-3 text-sm font-mono outline-none transition-colors focus:border-blue focus:bg-paper"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-bold text-ink">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-ink/15 bg-paper-dim px-4 py-3 text-sm outline-none transition-colors focus:border-blue focus:bg-paper"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-ink">
            <input type="checkbox" name="published" defaultChecked={form?.published ?? true} />
            Published
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono-label text-xs uppercase text-ink/40">Questions</p>
            <button
              type="button"
              onClick={() => setFields((prev) => [...prev, newField()])}
              className="flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-ink/10"
            >
              <Plus size={14} weight="bold" />
              Add question
            </button>
          </div>

          {fields.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink/50">
              No questions yet. Add at least one.
            </p>
          )}

          {fields.map((field, index) => {
            const meta = FIELD_TYPE_META.get(field.type)!;
            const Icon = meta.icon;
            return (
              <div key={field.id} className="space-y-3 rounded-2xl border border-ink/15 bg-paper-dim p-4 shadow-sm">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)`, color: meta.color }}
                  >
                    <Icon size={16} weight="bold" />
                  </span>
                  <input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Question label"
                    required
                    className="flex-1 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FormFieldType })}
                    className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-blue"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {OPTION_TYPES.has(field.type) && (
                  <div className="space-y-2 pl-11">
                    {field.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={opt}
                          onChange={(e) => updateOption(field.id, i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 rounded-lg border border-ink/15 bg-paper px-3 py-1.5 text-sm outline-none focus:border-blue"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(field.id, i)}
                          aria-label="Remove option"
                          className="text-ink/40 hover:text-red"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(field.id)}
                      className="text-xs font-bold text-blue hover:underline"
                    >
                      + Add option
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pl-11">
                  <label className="flex items-center gap-2 text-xs font-medium text-ink/70">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveField(field.id, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUp size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveField(field.id, 1)}
                      disabled={index === fields.length - 1}
                      aria-label="Move down"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDown size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      aria-label="Remove question"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red hover:text-paper"
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={fields.length === 0}
          className="shadow-pop-hover rounded-2xl bg-blue px-6 py-3 text-sm font-bold text-paper shadow-pop-sm disabled:opacity-50 disabled:shadow-none"
        >
          {form ? "Save changes" : "Create form"}
        </button>
      </div>

      {mode === "preview" && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="space-y-6 rounded-[2rem] bg-paper p-6 shadow-sm ring-1 ring-black/5 sm:p-8 lg:w-[680px] lg:shrink-0">
            <p className="font-mono-label text-xs uppercase text-ink/40">Style</p>

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

          <div className="min-w-0 flex-1 space-y-6 rounded-[2rem] bg-paper p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 whitespace-nowrap font-mono-label text-xs uppercase text-ink/40">
                <Eye size={13} weight="bold" className="shrink-0" />
                How applicants will see this — inputs are disabled
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
      )}
    </form>
  );
}
