import { ImageField } from "@/components/admin/ImageField";
import type { NewsPost } from "@prisma/client";

export function NewsForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: NewsPost;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-medium">Slug</label>
        <input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          placeholder="stem-festival-2026-recap"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-mono outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={2}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="body" className="text-sm font-medium">Body</label>
        <textarea
          id="body"
          name="body"
          defaultValue={post?.body}
          rows={10}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <ImageField name="coverImageUrl" label="Cover image" defaultValue={post?.coverImageUrl} />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={post?.published} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-paper"
      >
        {post ? "Save changes" : "Create post"}
      </button>
    </form>
  );
}
