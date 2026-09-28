"use client";

import { startTransition, useActionState, useState } from "react";
import type { Form, FormField } from "@prisma/client";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { submitFormResponse, type FormSubmitState } from "@/lib/actions/form-submissions";
import { FieldInput } from "@/components/FormFieldInput";
import { FormStyleFrame } from "@/components/FormStyleFrame";

const initialState: FormSubmitState = { status: "idle" };

// Keep in sync with MAX_FILE_SIZE in lib/actions/form-submissions.ts.
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function DynamicForm({ form }: { form: Form & { fields: FormField[] } }) {
  const [state, formAction, pending] = useActionState(submitFormResponse.bind(null, form.id), initialState);
  const dark = form.theme === "DARK";
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const fieldErrors = { ...state.fieldErrors, ...localErrors };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Submitted by hand rather than via `action`: React would otherwise clear
    // every answer when the server sends back an error.
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Catch files that are too big before uploading them.
    const tooBig: Record<string, string> = {};
    for (const field of form.fields) {
      const file = formData.get(field.id);
      if (field.type === "FILE" && file instanceof File && file.size > MAX_FILE_SIZE) {
        tooBig[field.id] = "File must be under 8MB.";
      }
    }
    setLocalErrors(tooBig);
    if (Object.keys(tooBig).length > 0) {
      document.getElementById(Object.keys(tooBig)[0])?.focus();
      return;
    }
    startTransition(() => formAction(formData));
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center rounded-[2rem] bg-paper p-10 text-center shadow-xl ring-1 ring-black/5 md:p-14">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
          <CheckCircle size={32} weight="fill" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Thanks for submitting!
        </h2>
        <p className="mt-3 max-w-sm text-ink/60">{state.message}</p>
      </div>
    );
  }

  return (
    <FormStyleFrame
      accentColor={form.accentColor}
      layout={form.layout}
      theme={form.theme}
      title={form.title}
      description={form.description}
      coverImageUrl={form.coverImageUrl}
    >
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="text-sm font-bold">
              {field.label}
              {field.required && <span className="text-red"> *</span>}
            </label>
            <FieldInput field={field} dark={dark} />
            {fieldErrors[field.id] && (
              <p className="mt-1 text-sm text-red" role="alert">
                {fieldErrors[field.id]}
              </p>
            )}
          </div>
        ))}

        {state.status === "error" && (
          <p className="rounded-xl bg-red/10 px-4 py-3 text-sm font-medium text-red" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full px-7 py-3.5 text-sm font-bold text-white press hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ backgroundColor: form.accentColor }}
        >
          {pending ? "Submitting" : "Submit"}
        </button>
      </form>
    </FormStyleFrame>
  );
}
