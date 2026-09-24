import type { Metadata } from "next";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import sharp from "sharp";
import { getNewsPostBySlug, getNewsPosts } from "@/lib/content";
import { ShareButtons } from "@/components/ShareButtons";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

async function getLocalImageDimensions(publicPath: string) {
  if (!publicPath.startsWith("/")) return null;
  try {
    const filePath = path.join(process.cwd(), "public", publicPath);
    const { width, height } = await sharp(filePath).metadata();
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Competition: "var(--color-orange)",
  Events: "var(--color-green)",
  News: "var(--color-blue)",
};

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [post, { dict }] = await Promise.all([getNewsPostBySlug(slug), getDictionary()]);
  return { title: post?.title ?? dict.news.metaTitle };
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const [post, allPosts, { dict }] = await Promise.all([
    getNewsPostBySlug(slug),
    getNewsPosts(),
    getDictionary(),
  ]);
  if (!post) notFound();

  const others = allPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  const related = [...sameCategory, ...rest].slice(0, 5);

  const coverDimensions = post.coverImageUrl ? await getLocalImageDimensions(post.coverImageUrl) : null;

  return (
    <PageTransition>
      <section className="bg-paper-dim py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/news" className="text-sm font-bold text-blue hover:underline">
            {dict.news.backToNews}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <article className="overflow-hidden rounded-[1.75rem] bg-paper p-6 shadow-lg ring-1 ring-black/5 md:p-10">
              {post.coverImageUrl && (
                coverDimensions ? (
                  <Image
                    src={post.coverImageUrl}
                    alt=""
                    width={coverDimensions.width}
                    height={coverDimensions.height}
                    className="h-auto w-full overflow-hidden rounded-2xl"
                    sizes="768px"
                    priority
                  />
                ) : (
                  <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-96">
                    <Image src={post.coverImageUrl} alt="" fill className="object-cover" sizes="768px" priority />
                  </div>
                )
              )}
              {post.publishedAt && (
                <p className="font-mono-label mt-6 text-xs uppercase text-ink/50">
                  <span style={{ color: CATEGORY_COLORS[post.category] ?? "var(--color-blue)" }}>
                    {post.category}
                  </span>
                  {" · "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {post.author.name}
                </p>
              )}
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
                {post.title}
              </h1>
              <div
                className="prose prose-lg mt-6 max-w-none prose-headings:font-display prose-a:text-blue"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </article>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
              <ShareButtons slug={post.slug} title={post.title} />

              {related.length > 0 && (
                <div className="rounded-[1.75rem] bg-paper p-5 shadow-lg ring-1 ring-black/5">
                  <p className="font-mono-label px-1 text-xs uppercase text-ink/50">{dict.news.related}</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {related.map((item) => {
                      const color = CATEGORY_COLORS[item.category] ?? "var(--color-blue)";
                      return (
                        <Link
                          key={item.id}
                          href={`/news/${item.slug}`}
                          className="group flex items-center gap-3 rounded-2xl p-2 transition-colors duration-200 hover:bg-paper-dim"
                        >
                          {item.coverImageUrl && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-dim">
                              <Image
                                src={item.coverImageUrl}
                                alt=""
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="font-mono-label text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
                              {item.category}
                            </span>
                            <h3 className="line-clamp-2 font-display text-sm font-semibold leading-tight">
                              {item.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
