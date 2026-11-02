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
import { QuestionsBand } from "@/components/QuestionsBand";

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

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
  const related = [...sameCategory, ...rest].slice(0, 3);

  const coverDimensions = post.coverImageUrl ? await getLocalImageDimensions(post.coverImageUrl) : null;

  return (
    <PageTransition>
      <section className="container-site pb-20 pt-12 md:pb-28 md:pt-16">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl font-bold uppercase leading-tight md:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-base leading-relaxed md:text-lg">{post.excerpt}</p>}
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-navy/55">
            <span className="font-bold uppercase" style={{ color: CATEGORY_COLORS[post.category] ?? "var(--color-blue)" }}>
              {post.category}
            </span>
            {post.publishedAt && <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>}
            <span>{post.author.name}</span>
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 xl:gap-24">
          <article className="min-w-0">
            {post.coverImageUrl &&
              (coverDimensions ? (
                <Image
                  src={post.coverImageUrl}
                  alt=""
                  width={coverDimensions.width}
                  height={coverDimensions.height}
                  className="mx-auto h-auto w-full max-w-2xl"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              ) : (
                <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden">
                  <Image src={post.coverImageUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" priority />
                </div>
              ))}
            <div
              className="prose prose-lg mx-auto mt-10 max-w-2xl text-navy prose-headings:font-display prose-headings:text-navy prose-strong:text-navy prose-a:text-blue prose-a:break-words prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </article>

          <aside className="flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start">
            <ShareButtons slug={post.slug} title={post.title} heading={dict.news.sharePost} />

            {related.length > 0 && (
              <div>
                <h2 className="font-body text-lg font-bold">{sameCategory.length > 0 ? dict.news.moreFromCategory : dict.news.related}</h2>
                <ul className="mt-4 space-y-4">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link href={`/news/${item.slug}`} className="group flex items-start gap-3">
                        <span className="relative size-16 shrink-0 overflow-hidden bg-navy">
                          {item.coverImageUrl && (
                            <Image
                              src={item.coverImageUrl}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-navy/70">{item.title}</span>
                          <span className="mt-0.5 line-clamp-1 text-xs text-navy/60">{item.excerpt}</span>
                          {item.publishedAt && <span className="mt-0.5 block text-[0.7rem] text-navy/45">{formatDate(item.publishedAt)}</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <QuestionsBand
        title={dict.footer.questions.title}
        body={dict.footer.questions.body}
        cta={dict.footer.questions.cta}
        href="/faq"
      />
    </PageTransition>
  );
}
