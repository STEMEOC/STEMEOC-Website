import { ImageField } from "@/components/admin/ImageField";
import type { TeamMember } from "@prisma/client";

export function TeamForm({
  action,
  member,
}: {
  action: (formData: FormData) => void;
  member?: TeamMember;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={member?.name}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <input
          id="role"
          name="role"
          defaultValue={member?.role}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={member?.bio}
          rows={4}
          required
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <ImageField name="photoUrl" label="Photo" defaultValue={member?.photoUrl} />

      <div>
        <label htmlFor="order" className="text-sm font-medium">Display order</label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={member?.order ?? 0}
          className="mt-2 w-32 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={member?.published ?? true} />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-paper"
      >
        {member ? "Save changes" : "Add team member"}
      </button>
    </form>
  );
}
