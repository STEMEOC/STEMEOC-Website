"use client";

import { useActionState } from "react";
import type { Form, FormField } from "@prisma/client";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { submitFormResponse, type FormSubmitState } from "@/lib/actions/form-submissions";
import { FieldInput } from "@/components/FormFieldInput";
import { FormStyleFrame } from "@/components/FormStyleFrame";

const initialState: FormSubmitState = { status: "idle" };

export function DynamicForm({ form }: { form: Form & { fields: FormField[] } }) {
  const [state, formAction, pending] = useActionState(submitFormResponse.bind(null, form.id), initialState);
  const dark = form.theme === "DARK";

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
      <form action={formAction} encType="multipart/form-data" className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="text-sm font-bold">
              {field.label}
              {field.required && <span className="text-red"> *</span>}
            </label>
            <FieldInput field={field} dark={dark} />
            {state.fieldErrors?.[field.id] && (
              <p className="mt-1 text-sm text-red">{state.fieldErrors[field.id]}</p>
            )}
          </div>
        ))}

        {state.status === "error" && !state.fieldErrors && (
          <p className="text-sm text-red">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ backgroundColor: form.accentColor }}
        >
          {pending ? "Submitting" : "Submit"}
        </button>
      </form>
    </FormStyleFrame>
  );
}
