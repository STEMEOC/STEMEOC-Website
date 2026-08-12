import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/NewsForm";
import { createNews } from "@/lib/actions/news";

export const metadata: Metadata = { title: "New Post" };

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">New Post</h1>
      <div className="mt-8">
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
