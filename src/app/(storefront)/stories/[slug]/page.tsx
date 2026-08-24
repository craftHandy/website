import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Story Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" — a story from Ratnagiri about Himalayan handicraft heritage.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" — a story from Ratnagiri about Himalayan handicraft heritage.`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const hasHtmlContent = post.content ? /<[^>]+>/.test(post.content) : false;

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <article>
        <div className="relative h-[50vh] min-h-[420px] overflow-hidden bg-[var(--color-background)]">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/30 to-transparent z-[1]" />
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.2),_transparent_45%),var(--color-surface-elevated)] flex items-center justify-center">
              <span className="text-gold/20 text-[12rem] font-serif select-none">✦</span>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10 pb-16">
          <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="mb-8">
              <Link
                href="/stories"
                className="text-gold text-xs tracking-[0.2em]  font-medium hover:text-gold-light transition-colors"
              >
                ← Back to Blogs
              </Link>
            </div>

            <header className="mb-10">
              <p className="text-gold tracking-[0.25em]  text-xs font-medium mb-4">
                Featured Article
              </p>
              <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gold-muted">
                {post.author && (
                  <span className="font-medium text-[var(--color-cream-dark)]">{post.author}</span>
                )}
                {post.publishedAt && (
                  <>
                    {post.author && <span>·</span>}
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs  tracking-[0.2em] bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-gold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {post.excerpt && (
              <p className="text-lg text-[var(--color-cream-dark)]/90 font-light leading-relaxed mb-10 border-l-2 border-gold pl-6 italic">
                {post.excerpt}
              </p>
            )}

            <div className="text-[var(--color-cream-dark)]/80 leading-relaxed space-y-6">
              {post.content ? (
                hasHtmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="space-y-6" />
                ) : (
                  post.content.split("\n").map((paragraph: string, index: number) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith("## ")) {
                      return <h2 key={index} className="text-2xl font-serif text-[var(--color-foreground)] mt-10 mb-4">{trimmed.replace("## ", "")}</h2>;
                    }
                    if (trimmed.startsWith("### ")) {
                      return <h3 key={index} className="text-xl font-serif text-[var(--color-foreground)] mt-8 mb-3">{trimmed.replace("### ", "")}</h3>;
                    }
                    if (trimmed.startsWith("> ")) {
                      return <blockquote key={index} className="border-l-2 border-gold pl-6 italic text-gold-muted my-6">{trimmed.replace("> ", "")}</blockquote>;
                    }
                    return <p key={index}>{trimmed}</p>;
                  })
                )
              ) : (
                <p className="text-gold-muted">Full story coming soon.</p>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gold-muted text-sm mb-4">Continue exploring</p>
            <Link
              href="/blogs"
              className="text-gold tracking-wider  text-sm font-medium hover:text-gold-light transition-colors"
            >
              More Blogs →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
