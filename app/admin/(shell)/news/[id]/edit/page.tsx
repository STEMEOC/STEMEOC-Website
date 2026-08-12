import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";
import { updateNews } from "@/lib/actions/news";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditNewsPage({ params }: PageProps<"/admin/news/[id]/edit">) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Post</h1>
      <div className="mt-8">
        <NewsForm action={updateNews.bind(null, id)} post={post} />
      </div>
    </div>
  );
}
