import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Discover the blog posts behind Himalayan handicraft traditions, artisan craftsmanship, and the heritage of Ratnagiri.",
};

interface BlogsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) >= 1 ? Number(resolvedSearchParams.page) : 1;
  const pageSize = 10;
  const result = await getBlogPosts(page, pageSize);
  const posts = result.posts;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-cream">
      <section className="border-b border-[rgba(201,168,76,0.12)] bg-[radial-gradient(circle_at_top_left,_rgba(201,168,76,0.16),_transparent_45%),linear-gradient(135deg,_#0f0f0f,_#161616)]">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
            <div>
              <p className="text-gold tracking-[0.28em]  text-xs font-medium mb-4">
                Ratnagiri Journal
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream mb-5 leading-tight">
                Discover the stories shaping our craft
              </h1>
              <p className="text-cream-dark/75 max-w-2xl text-lg font-light leading-relaxed">
                From artisan heritage to the symbolism behind every piece, explore the living narratives that inspire our collections.
              </p>
            </div>
            <div className="rounded-sm border border-[rgba(201,168,76,0.16)] bg-[#141414]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <p className="text-xs  tracking-[0.25em] text-gold mb-3">Fresh from the studio</p>
              <p className="text-xl font-serif text-cream">Thoughtful narratives, timeless craftsmanship, and cultural depth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {featuredPost && (
          <Link href={`/blogs/${featuredPost.slug}`} className="group block mb-16">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center rounded-sm border border-[rgba(201,168,76,0.12)] bg-[#121212] p-4 md:p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#141414] relative luxe-card">
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-gold/20 text-6xl font-serif select-none">✦</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gold tracking-[0.25em]  text-xs font-medium mb-3">
                  Featured Story
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-cream mb-4 group-hover:text-gold transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-cream-dark/70 leading-relaxed mb-5 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gold-muted">
                  {featuredPost.author && <span className="text-cream-dark">{featuredPost.author}</span>}
                  {featuredPost.publishedAt && (
                    <>
                      {featuredPost.author && <span>·</span>}
                      <time dateTime={featuredPost.publishedAt}>
                        {new Date(featuredPost.publishedAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </>
                  )}
                </div>
                {featuredPost.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs  tracking-[0.2em] border border-[rgba(201,168,76,0.16)] text-gold px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}

        {remainingPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#141414] mb-4 relative luxe-card">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-gold/20 text-5xl font-serif select-none">✦</span>
                    </div>
                  )}
                </div>
                <div className="rounded-sm border border-[rgba(201,168,76,0.1)] bg-[#121212] p-5 h-full">
                  <h3 className="text-lg font-serif text-cream mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-cream-dark/70 line-clamp-3 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gold-muted">
                    {post.author && <span className="text-cream-dark">{post.author}</span>}
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[rgba(201,168,76,0.15)] rounded-sm bg-[#121212]">
            <p className="text-cream-dark/70 mb-4">No blogs available right now. Check back soon.</p>
            <Link href="/" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-cream-dark">
              <span className="text-cream">Page {result.currentPage} of {result.totalPages || 1}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/blogs?page=${Math.max(1, result.currentPage - 1)}`}
                className={`rounded-sm border border-[rgba(201,168,76,0.15)] px-4 py-2 text-sm transition-colors ${result.currentPage <= 1 ? "cursor-not-allowed opacity-50" : "hover:border-gold hover:text-gold"}`}
                aria-disabled={result.currentPage <= 1}
              >
                Previous
              </Link>
              <Link
                href={`/blogs?page=${Math.min(result.totalPages || 1, result.currentPage + 1)}`}
                className={`rounded-sm border border-[rgba(201,168,76,0.15)] px-4 py-2 text-sm transition-colors ${result.last ? "cursor-not-allowed opacity-50" : "hover:border-gold hover:text-gold"}`}
                aria-disabled={result.last}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
