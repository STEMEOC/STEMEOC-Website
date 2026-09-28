import type { Metadata } from "next";
import { Newspaper } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { NewsTable } from "@/components/admin/NewsTable";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }] });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="News"
        cta={{ label: "New Post", href: "/admin/news/new", icon: <Newspaper size={16} weight="bold" /> }}
      />

      <NewsTable
        posts={posts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          coverImageUrl: p.coverImageUrl,
          published: p.published,
          publishedAt: p.publishedAt?.toISOString() ?? null,
          updatedAt: p.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
