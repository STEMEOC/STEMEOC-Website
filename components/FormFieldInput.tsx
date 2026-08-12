export const formInputClass =
  "mt-2 w-full rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue disabled:cursor-not-allowed disabled:bg-paper-dim disabled:text-ink/40";

const formInputClassDark =
  "mt-2 w-full rounded-2xl border-2 border-white/15 bg-white/5 px-4 py-3 text-sm text-paper outline-none focus:border-white/40 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-paper/40";

export type FieldLike = {
  id: string;
  label: string;
  type:
    | "SHORT_TEXT"
    | "PARAGRAPH"
    | "EMAIL"
    | "NUMBER"
    | "DATE"
    | "DROPDOWN"
    | "MULTIPLE_CHOICE"
    | "CHECKBOXES"
    | "FILE";
  options: string[];
  required: boolean;
};

export function FieldInput({ field, disabled = false, dark = false }: { field: FieldLike; disabled?: boolean; dark?: boolean }) {
  const inputClass = dark ? formInputClassDark : formInputClass;
  const optionTextClass = dark ? "text-paper/80" : "text-ink/80";
  const emptyOptionClass = dark ? "text-paper/40" : "text-ink/40";

  switch (field.type) {
    case "PARAGRAPH":
      return (
        <textarea id={field.id} name={field.id} rows={5} required={field.required} disabled={disabled} className={inputClass} />
      );
    case "EMAIL":
      return (
        <input id={field.id} name={field.id} type="email" required={field.required} disabled={disabled} className={inputClass} />
      );
    case "NUMBER":
      return (
        <input id={field.id} name={field.id} type="number" required={field.required} disabled={disabled} className={inputClass} />
      );
    case "DATE":
      return (
        <input id={field.id} name={field.id} type="date" required={field.required} disabled={disabled} className={inputClass} />
      );
    case "FILE":
      return (
        <input
          id={field.id}
          name={field.id}
          type="file"
          required={field.required}
          disabled={disabled}
          className={`mt-2 w-full text-sm ${dark ? "text-paper/70" : "text-ink/70"} file:mr-4 file:rounded-full file:border-0 file:bg-blue file:px-4 file:py-2 file:text-sm file:font-bold file:text-paper disabled:cursor-not-allowed disabled:opacity-50`}
        />
      );
    case "DROPDOWN":
      return (
        <select id={field.id} name={field.id} required={field.required} disabled={disabled} defaultValue="" className={inputClass}>
          <option value="" disabled>Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case "MULTIPLE_CHOICE":
      return (
        <div className="mt-3 space-y-2">
          {field.options.length === 0 && <p className={`text-sm italic ${emptyOptionClass}`}>No options added yet</p>}
          {field.options.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 text-sm ${optionTextClass}`}>
              <input type="radio" name={field.id} value={opt} required={field.required} disabled={disabled} />
              {opt}
            </label>
          ))}
        </div>
      );
    case "CHECKBOXES":
      return (
        <div className="mt-3 space-y-2">
          {field.options.length === 0 && <p className={`text-sm italic ${emptyOptionClass}`}>No options added yet</p>}
          {field.options.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 text-sm ${optionTextClass}`}>
              <input type="checkbox" name={field.id} value={opt} disabled={disabled} />
              {opt}
            </label>
          ))}
        </div>
      );
    default:
      return (
        <input id={field.id} name={field.id} type="text" required={field.required} disabled={disabled} className={inputClass} />
      );
  }
}
