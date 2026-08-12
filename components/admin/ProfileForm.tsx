"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

export function ProfileForm({
  action,
  name,
  email,
  avatarUrl,
}: {
  action: (formData: FormData) => void;
  name: string;
  email: string;
  avatarUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <form action={action} className="max-w-md space-y-6 rounded-[2rem] border-2 border-ink/10 bg-paper p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <label htmlFor="avatar" className="group relative shrink-0 cursor-pointer">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-orange text-2xl font-bold text-ink ring-2 ring-ink/10">
            {preview ? (
              <Image src={preview} alt="" width={80} height={80} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper ring-2 ring-paper transition-colors group-hover:bg-blue">
            <Camera size={13} weight="bold" />
          </span>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
        <div>
          <p className="text-sm font-bold text-ink">Profile photo</p>
          <p className="text-xs text-ink/50">Click the avatar to upload a new photo.</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-bold text-ink">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={name}
          required
          className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper-dim px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-bold text-ink">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          required
          className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper-dim px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t-2 border-ink/10 pt-5">
        <div>
          <p className="text-sm font-bold text-ink">Password</p>
          <p className="text-xs text-ink/50">Requires your current password.</p>
        </div>
        <ChangePasswordModal />
      </div>

      <button
        type="submit"
        className="shadow-pop-hover rounded-2xl bg-blue px-6 py-3 text-sm font-bold text-paper shadow-pop-sm"
      >
        Save changes
      </button>
    </form>
  );
}
