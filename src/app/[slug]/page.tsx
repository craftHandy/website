import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/api";

export const dynamic = "force-dynamic";

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageContent(slug);
  if (!page) return { title: "Page Not Found" };
  return {
    title: `${page.title} | Ratnagiri`,
    description: page.content?.slice(0, 160) || page.title,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  // Skip reserved routes
  const reserved = ["admin", "login", "register", "orders", "jewelry", "collections", "stories", "blogs", "cart", "checkout", "order", "care", "contact", "privacy", "shipping", "size-guide", "terms", "about"];
  if (reserved.includes(slug)) {
    notFound();
  }

  const page = getPageContent(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          {page.title}
        </p>
        <h1 className="text-3xl md:text-5xl font-serif text-cream mb-8">
          {page.title}
        </h1>
        <div className="prose prose-neutral max-w-none">
          {page.content ? (
            <div className="text-cream-dark/70 leading-relaxed space-y-4">
              {page.content.split("\n").map((paragraph: string, index: number) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("## ")) {
                  return <h2 key={index} className="text-2xl font-serif text-cream mt-8 mb-4">{trimmed.replace("## ", "")}</h2>;
                }
                if (trimmed.startsWith("### ")) {
                  return <h3 key={index} className="text-xl font-serif text-cream mt-6 mb-3">{trimmed.replace("### ", "")}</h3>;
                }
                return <p key={index}>{trimmed}</p>;
              })}
            </div>
          ) : (
            <p className="text-gold-muted">Content coming soon.</p>
          )}
        </div>
      </div>
    </main>
  );
}
