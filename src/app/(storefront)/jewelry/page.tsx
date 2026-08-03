"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/shared/product-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { getProducts, getCategories } from "@/lib/api";
import type { Product, Category } from "@/types";

const PAGE_SIZE = 12;

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

async function fetchProducts(category?: string, page = 1): Promise<ProductsResponse> {
  return getProducts({
    category,
    page,
    pageSize: PAGE_SIZE,
  });
}

async function fetchCategories(): Promise<Category[]> {
  return getCategories();
}

function JewelryPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 bg-[#1a1a1a] rounded" />
          <div className="h-10 w-96 bg-[#1a1a1a] rounded" />
          <div className="h-4 w-[600px] bg-[#1a1a1a] rounded" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#141414] rounded-sm border border-[rgba(201,168,76,0.08)]" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function JewelryPage() {
  return (
    <Suspense fallback={<JewelryPageSkeleton />}>
      <JewelryPageContent />
    </Suspense>
  );
}

function JewelryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? "newest";
  const priceRange = searchParams.get("price") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");

  const [priceMinInput, setPriceMinInput] = useState(0);
  const [priceMaxInput, setPriceMaxInput] = useState(200000);

  const productsQuery = useQuery({
    queryKey: ["products", categorySlug, page],
    queryFn: () => fetchProducts(categorySlug, page),
    placeholderData: (prev) => prev,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const products = productsQuery.data?.products ?? [];
  const total = productsQuery.data?.total ?? 0;
  const categories = categoriesQuery.data ?? [];
  const loading = productsQuery.isPending || productsQuery.isFetching;

  const allPrices = products.map((p) => p.discountPrice || p.price);
  const minPrice = useMemo(() => {
    if (allPrices.length === 0) return 0;
    return Math.floor(Math.min(...allPrices) / 1000) * 1000;
  }, [allPrices.length]);
  const maxPrice = useMemo(() => {
    if (allPrices.length === 0) return 200000;
    return Math.ceil(Math.max(...allPrices) / 1000) * 1000;
  }, [allPrices.length]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (priceRange) {
      const parts = priceRange.split("-").map(Number);
      const min = parts[0];
      const max = parts.length > 1 && parts[1] ? parts[1] : Infinity;
      result = result.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= min && price <= max;
      });
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
    }

    return result;
  }, [products, priceRange, sort]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildQuery = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const merged: Record<string, string> = {};
      const currentCategory = overrides.category !== undefined ? overrides.category : categorySlug;
      const currentSort = overrides.sort !== undefined ? overrides.sort : sort;
      const currentPrice = overrides.price !== undefined ? overrides.price : priceRange;
      const currentPage = overrides.page !== undefined ? overrides.page : "1";
      if (currentCategory) merged.category = currentCategory;
      if (currentSort && currentSort !== "newest") merged.sort = currentSort;
      if (currentPrice) merged.price = currentPrice;
      if (currentPage !== "1") merged.page = currentPage;
      const qs = new URLSearchParams(merged).toString();
      return qs ? `/jewelry?${qs}` : "/jewelry";
    },
    [categorySlug, sort, priceRange]
  );

  const handlePriceChange = useCallback(
    (type: "min" | "max", value: number) => {
      if (type === "min") {
        setPriceMinInput(Math.min(value, priceMaxInput - 1000));
      } else {
        setPriceMaxInput(Math.max(value, priceMinInput + 1000));
      }
    },
    [priceMinInput, priceMaxInput]
  );

  const applyPriceFilter = useCallback(() => {
    const qs = new URLSearchParams();
    if (categorySlug) qs.set("category", categorySlug);
    if (sort !== "newest") qs.set("sort", sort);
    qs.set("price", `${priceMinInput}-${priceMaxInput}`);
    router.push(`/jewelry?${qs.toString()}`);
  }, [categorySlug, sort, priceMinInput, priceMaxInput, router]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-32 bg-[#1a1a1a] rounded" />
            <div className="h-10 w-96 bg-[#1a1a1a] rounded" />
            <div className="h-4 w-[600px] bg-[#1a1a1a] rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#141414] rounded-sm border border-[rgba(201,168,76,0.08)]" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <FadeIn>
          <div className="mb-12">
            <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
              Our Collection
            </p>
            <h1 className="text-3xl md:text-5xl font-serif text-cream mb-2">
              Handcrafted Treasures
            </h1>
            <p className="text-cream-dark/70 max-w-2xl">
              {activeCategory
                ? `Explore our ${activeCategory.title} collection — each piece a testament to Himalayan living traditions.`
                : "Each piece in our collection embodies the sacred artistry of Himalayan craftsmanship — from statues of Nepal to ritual objects of Tibet."}
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              <FadeIn direction="left" delay={0.1}>
                <div className="bg-[#141414] border border-[rgba(201,168,76,0.1)] rounded-sm p-5">
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-cream mb-4">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href={buildQuery({ category: undefined, price: priceRange, page: "1" })}
                      className={`block text-sm py-1.5 transition-colors ${!categorySlug ? "text-gold font-medium" : "text-cream-dark/70 hover:text-cream"}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${!categorySlug
                              ? "bg-gold border-gold"
                              : "border-[rgba(201,168,76,0.3)]"
                            }`}
                        >
                          {!categorySlug && (
                            <svg className="w-2 h-2 text-[#0a0a0a]" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        All Treasures
                      </span>
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={buildQuery({ category: category.slug, page: "1" })}
                        className={`block text-sm py-1.5 transition-colors ${categorySlug === category.slug ? "text-gold font-medium" : "text-cream-dark/70 hover:text-cream"}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${categorySlug === category.slug
                                ? "bg-gold border-gold"
                                : "border-[rgba(201,168,76,0.3)]"
                              }`}
                          >
                            {categorySlug === category.slug && (
                              <svg className="w-2 h-2 text-[#0a0a0a]" fill="none" viewBox="0 0 12 12">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          {category.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                <div className="bg-[#141414] border border-[rgba(201,168,76,0.1)] rounded-sm p-5">
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-cream mb-4">
                    Price Range
                  </h3>
                  <div className="px-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-cream">
                        ₹{priceMinInput.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gold-muted">—</span>
                      <span className="text-sm font-medium text-cream">
                        ₹{priceMaxInput.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="relative w-full h-7 mb-4 overflow-hidden">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={1000}
                        value={priceMinInput}
                        onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                        className="absolute inset-0 w-full h-full min-w-0 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0a0a0a] [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0a0a0a] [&::-moz-range-track]:h-0 [&::-moz-range-track]:bg-transparent"
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={1000}
                        value={priceMaxInput}
                        onChange={(e) => handlePriceChange("max", Number(e.target.value))}
                        className="absolute inset-0 w-full h-full min-w-0 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0a0a0a] [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0a0a0a] [&::-moz-range-track]:h-0 [&::-moz-range-track]:bg-transparent"
                      />
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-[rgba(201,168,76,0.12)] rounded-full overflow-hidden" />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-gold rounded-full"
                        style={{
                          left: `${((priceMinInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                          right: `${100 - ((priceMaxInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        }}
                      />
                    </div>
                    <button
                      onClick={applyPriceFilter}
                      className="w-full text-xs tracking-wider uppercase bg-gold text-[#0a0a0a] py-2 rounded-sm hover:bg-gold-dark transition-colors font-medium"
                    >
                      Apply Price
                    </button>
                  </div>
                </div>
              </FadeIn>

              {(categorySlug || priceRange) && (
                <FadeIn direction="left" delay={0.3}>
                  <Link
                    href="/jewelry"
                    className="inline-block text-xs text-gold-muted underline underline-offset-4 hover:text-gold transition-colors"
                  >
                    Clear all filters
                  </Link>
                </FadeIn>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <FadeIn delay={0.15}>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gold-muted">
                  {total} {total === 1 ? "piece" : "pieces"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gold-muted hidden sm:inline">Sort by</span>
                  <div className="flex gap-1">
                    {[
                      { label: "Newest", value: "newest" },
                      { label: "Price ↑", value: "price-asc" },
                      { label: "Price ↓", value: "price-desc" },
                    ].map((option) => (
                      <Link
                        key={option.value}
                        href={buildQuery({ sort: option.value })}
                        className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${sort === option.value ? "bg-gold text-[#0a0a0a] font-medium" : "bg-[#141414] text-cream-dark hover:text-cream border border-[rgba(201,168,76,0.1)]"}`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {filteredProducts.length > 0 ? (
              <>
                <StaggerContainer staggerChildren={0.06}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product, index) => (
                      <StaggerItem key={product.id}>
                        <ProductCard product={product} index={index} />
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={buildQuery({ page: String(page - 1) })}
                        className="px-4 py-2 text-sm border border-[rgba(201,168,76,0.2)] text-cream-dark rounded-sm hover:bg-[rgba(201,168,76,0.08)] hover:text-gold transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={buildQuery({ page: String(p) })}
                        className={`px-4 py-2 text-sm rounded-sm transition-colors ${p === page
                            ? "bg-gold text-[#0a0a0a] font-medium"
                            : "border border-[rgba(201,168,76,0.2)] text-cream-dark hover:bg-[rgba(201,168,76,0.08)] hover:text-gold"
                          }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={buildQuery({ page: String(page + 1) })}
                        className="px-4 py-2 text-sm border border-[rgba(201,168,76,0.2)] text-cream-dark rounded-sm hover:bg-[rgba(201,168,76,0.08)] hover:text-gold transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <FadeIn>
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 text-gold/30">✦</div>
                  <p className="text-cream-dark/70 mb-2">No pieces found matching your criteria.</p>
                  <Link href="/jewelry" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
                    View All Treasures
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
