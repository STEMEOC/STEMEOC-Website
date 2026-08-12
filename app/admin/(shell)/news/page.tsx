import type { Metadata } from "next";
import { Newspaper } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteNews } from "@/lib/actions/news";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="News"
        cta={{ label: "New Post", href: "/admin/news/new", icon: <Newspaper size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Updated</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 font-bold text-ink">{post.title}</td>
                <td className="px-6 py-4">
                  <StatusPill active={post.published} onLabel="Published" offLabel="Draft" />
                </td>
                <td className="px-6 py-4 text-ink/60">{post.updatedAt.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <RowActions editHref={`/admin/news/${post.id}/edit`} onDelete={deleteNews.bind(null, post.id)} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink/50">
                  No news posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
