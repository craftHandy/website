import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/lib/api";
import { ProductCard } from "@/components/shared/product-card";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  const seo = collection.seo as { title?: string; description?: string; ogImage?: string } | null;

  return {
    title: seo?.title || collection.title,
    description: seo?.description || `Explore the ${collection.title} collection — handcrafted Indian jewelry by Ratnagiri.`,
    openGraph: {
      title: seo?.title || collection.title,
      description: seo?.description || `Explore the ${collection.title} collection — handcrafted Indian jewelry by Ratnagiri.`,
      images: collection.image ? [{ url: collection.image }] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = collection.products || [];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/50 to-transparent z-[1]" />
        {collection.image ? (
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
            <span className="text-gold/20 text-[12rem] font-serif select-none">✦</span>
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-12">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-medium mb-3">
            Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-cream mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-cream-dark/80 max-w-2xl text-lg font-light leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-sm text-gold-muted">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-cream-dark/70 mb-4">This collection is being curated. Check back soon.</p>
              <Link href="/jewelry" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
                Browse All Treasures
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
