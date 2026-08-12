import type { PodcastEpisode } from "@prisma/client";

export function PodcastEpisodeForm({
  action,
  episode,
}: {
  action: (formData: FormData) => void;
  episode?: PodcastEpisode;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={episode?.title}
          placeholder="Andrew Roberts"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="videoId" className="text-sm font-medium">YouTube video ID</label>
        <input
          id="videoId"
          name="videoId"
          defaultValue={episode?.videoId}
          placeholder="uLvIQmWKLH8"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-mono outline-none focus:border-blue"
        />
        <p className="mt-1 text-xs text-ink/50">
          The part after youtube.com/watch?v= or after youtu.be/
        </p>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={episode?.description}
          rows={6}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="tag" className="text-sm font-medium">Tag (optional)</label>
        <input
          id="tag"
          name="tag"
          defaultValue={episode?.tag ?? ""}
          placeholder="Special Episode"
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="order" className="text-sm font-medium">Episode number</label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={episode?.order ?? 0}
          className="mt-2 w-32 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
        <p className="mt-1 text-xs text-ink/50">Higher numbers appear as more recent episodes.</p>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={episode?.published ?? true} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-paper"
      >
        {episode ? "Save changes" : "Add episode"}
      </button>
    </form>
  );
}
