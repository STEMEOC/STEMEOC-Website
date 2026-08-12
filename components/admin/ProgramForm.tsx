import type { Program } from "@prisma/client";

export function ProgramForm({
  action,
  program,
}: {
  action: (formData: FormData) => void;
  program?: Program;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={program?.title}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-medium">Slug</label>
        <input
          id="slug"
          name="slug"
          defaultValue={program?.slug}
          placeholder="cambodian-stem-festival"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-mono outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <input
          id="category"
          name="category"
          defaultValue={program?.category}
          placeholder="festival / robotics / eco"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={program?.description}
          rows={5}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="coverImageUrl" className="text-sm font-medium">Cover image URL</label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          defaultValue={program?.coverImageUrl ?? ""}
          placeholder="https://…"
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="order" className="text-sm font-medium">Display order</label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={program?.order ?? 0}
          className="mt-2 w-32 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={program?.published ?? true} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-paper"
      >
        {program ? "Save changes" : "Create program"}
      </button>
    </form>
  );
}
