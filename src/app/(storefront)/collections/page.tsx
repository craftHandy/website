import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated collections of handcrafted Indian jewelry — bridal, everyday, and heritage pieces.",
};

export default async function CollectionsPage() {
  const collections = await Promise.resolve(getCollections());

    return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <p className="text-gold tracking-[0.25em]  text-xs font-medium mb-3">
            Curated Worlds
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-4">
            Collections
          </h1>
          <p className="text-[var(--color-cream-dark)]/70 max-w-2xl text-lg font-light leading-relaxed">
            Each collection tells a story — from the grandeur of sacred statues to the understated elegance of ritual objects. Discover the world that speaks to you.
          </p>
        </div>

        {collections.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-sm ${index % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"} luxe-card`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent z-10" />
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
                      <span className="text-gold/20 text-8xl font-serif select-none">✦</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-foreground)] mb-2">
                      {collection.title}
                    </h2>
                    {collection.description && (
                      <p className="text-[var(--color-cream-dark)]/80 text-sm max-w-md line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <span className="inline-block mt-4 text-gold text-sm tracking-wider  group-hover:tracking-[0.25em] transition-all duration-300">
                      View Collection →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-gold/30">✦</div>
            <p className="text-[var(--color-cream-dark)]/70 mb-2">Collections are being curated.</p>
            <Link href="/jewelry" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
              Browse All Treasures →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
