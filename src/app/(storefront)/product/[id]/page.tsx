import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PackageCheck, Ruler, ShieldCheck } from "lucide-react";
import { AddToCartBtn } from "@/components/shared/add-to-cart-btn";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/shared/image-gallery";
import { getProductById } from "@/lib/api";
import { calculateDiscount, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProductDetailProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const product = await getProductById((await params).id);
  return product ? { title: `${product.title} | Ratna Treasure`, description: product.description || `Shop ${product.title}` } : { title: "Product not found" };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const product = await getProductById((await params).id);
  if (!product) notFound();

  const discounted = product.discountPrice && product.discountPrice < product.price;
  const price = discounted ? product.discountPrice! : product.price;
  const inStock = product.stockStatus === "IN_STOCK" || product.stockStatus === "In Stock";
  const occasions = product.occasions && product.occasions.length ? product.occasions : product.occasion;
  const productDetails = [
    // { label: "Product ID", value: product.id },
    // { label: "Slug", value: product.slug },
    // { label: "Category", value: product.category?.title ?? product.categoryName ?? "Uncategorized" },
    { label: "Craft Type", value: product.craftType ?? "Not specified" },
    { label: "Origin", value: product.origin ?? "Not specified" },
    { label: "Materials", value: product.materials.length ? product.materials.join(", ") : "Not specified" },
    { label: "Discount Percentage", value: product.discountPercentage != null ? `${product.discountPercentage}%` : "Not specified" },
    { label: "Ideal for", value: occasions.length ? occasions.join(", ") : "Not specified" },
    { label: "Height", value: product.height != null ? `${product.height} cm` : "Not specified" },
    { label: "Width", value: product.width != null ? `${product.width} cm` : "Not specified" },
    { label: "Weight", value: product.weight != null ? `${product.weight} kg` : "Not specified" },
    { label: "Stock Status", value: product.stockStatus || "Not specified" },
    { label: "Stock Quantity", value: product.stockQuantity != null ? String(product.stockQuantity) : "Not specified" },
    { label: "Featured", value: product.featured ? "Yes" : "No" },
  ];

  return <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link href="/product" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-cream-dark)] transition hover:text-[var(--color-gold)]"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageGallery images={product.images} className="lg:sticky lg:top-28 lg:self-start" />
        <section>
          {product.category && <Link href={`/product?categoryId=${product.category.id}`} className="text-xs font-bold tracking-[0.24em] text-[var(--color-gold)]">{product.category.title}</Link>}
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.title}</h1>
          {product.craftType && <p className="mt-3 text-sm text-[var(--color-cream-dark)]">{product.craftType}</p>}
          <div className="mt-7 flex items-center gap-3"><span className="text-3xl font-semibold">{formatPrice(price)}</span>{discounted && <><span className="text-lg text-[var(--color-gold-muted)] line-through">{formatPrice(product.price)}</span><Badge variant="sale">{calculateDiscount(product.price, price)}% OFF</Badge></>}</div>
          <div className="mt-5">{inStock ? <span className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"><PackageCheck className="h-4 w-4" /> In stock and ready to ship</span> : <span className="text-sm text-[var(--color-gold-muted)]">Currently unavailable</span>}</div>
          <div className="my-8 h-px bg-[var(--color-border-subtle)]" />
          <p className="whitespace-pre-line text-base leading-8 text-[var(--color-cream-dark)]">{product.description || "A special handcrafted piece, made with the care and attention of traditional artisan work."}</p>
          <div className="mt-8"><AddToCartBtn productId={product.id} slug={product.slug} title={product.title} price={price} image={product.images[0]?.url} disabled={!inStock} className="w-full bg-[var(--color-gold)] text-[#17130a] hover:bg-[var(--color-gold-dark)] sm:w-auto sm:min-w-64">{inStock ? "Add to cart" : "Out of stock"}</AddToCartBtn></div>
          <div className="mt-10 grid gap-4 border-y border-[var(--color-border-subtle)] py-6 sm:grid-cols-2">
            {product.materials.length > 0 && <Info label="Materials" value={product.materials.join(", ")} />}
            {product.origin && <Info label="Origin" value={product.origin} />}
            {occasions.length > 0 && <Info label="Ideal for" value={occasions.join(", ")} />}
            <div className="flex gap-3 text-sm text-[var(--color-cream-dark)]"><Ruler className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" /><span>Made with artisan care</span></div>
          </div>
          <div className="mt-7 flex gap-3 text-sm leading-6 text-[var(--color-cream-dark)]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold)]" /><p>Each order is carefully checked and securely packed before shipping.</p></div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Product details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productDetails.map((detail) => (
                <Info key={detail.label} label={detail.label} value={detail.value} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-bold tracking-[0.18em] text-[var(--color-gold-muted)]">{label}</p><p className="mt-1 text-sm text-[var(--color-cream-dark)]">{value}</p></div>;
}
