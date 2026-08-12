import type { Partner } from "@prisma/client";

export function PartnerForm({
  action,
  partner,
}: {
  action: (formData: FormData) => void;
  partner?: Partner;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={partner?.name}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="logoUrl" className="text-sm font-medium">Logo URL</label>
        <input
          id="logoUrl"
          name="logoUrl"
          defaultValue={partner?.logoUrl}
          placeholder="/placeholders/partner-1.svg"
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="text-sm font-medium">Website URL</label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          defaultValue={partner?.websiteUrl ?? ""}
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
          defaultValue={partner?.order ?? 0}
          className="mt-2 w-32 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={partner?.published ?? true} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-paper"
      >
        {partner ? "Save changes" : "Add partner"}
      </button>
    </form>
  );
}
