"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { getCategories, getProductList, getProducts, getMaterials, getOccasions } from "@/lib/api";

const PAGE_SIZE = 12;

function ProductListing() {
  const params = useSearchParams();
  const router = useRouter();
  const page = Math.max(0, Number(params.get("page") || 0));
  const categoryId = params.get("categoryId") || "";
  const materialId = params.get("materialId") || "";
  const occasionId = params.get("occasionId") || "";
  const search = params.get("search") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const sort = params.get("sort") || "newest";
  const [searchValue, setSearchValue] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = useQuery({
    queryKey: ["product-list", page, categoryId, materialId, occasionId, search, minPrice, maxPrice, sort],
    queryFn: () => getProductList({
      page,
      size: PAGE_SIZE,
      categoryId: categoryId || undefined,
      materialId: materialId || undefined,
      occasionId: occasionId || undefined,
      search: search || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      ...(sort === "price-asc" || sort === "price-desc"
        ? { sortBy: "price", direction: sort === "price-asc" ? "asc" : "desc" }
        : {}),
    }),
    placeholderData: (previous) => previous,
  });
  const categories = useQuery({ queryKey: ["categories"], queryFn: getCategories }).data ?? [];
  const materials = useQuery({ queryKey: ["materials"], queryFn: getMaterials }).data ?? [];
  const occasions = useQuery({ queryKey: ["occasions"], queryFn: getOccasions }).data ?? [];
  const activeCategory = categories.find((category) => category.id === categoryId);
  const products = query.data?.products ?? [];
  const result = query.data;
  // compute counts per category from fallback dataset (used for counts in sidebar)
  const allFallback = getProducts().products;
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    allFallback.forEach((p) => {
      const id = p.categoryId ?? "uncategorized";
      map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, [allFallback]);

  const hrefFor = useCallback((updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const values = { categoryId, materialId, occasionId, search, minPrice, maxPrice, sort, page: String(page), ...updates };
    Object.entries(values).forEach(([key, value]) => {
      if (value && !(key === "page" && value === "0") && !(key === "sort" && value === "newest")) next.set(key, value);
    });
    const string = next.toString();
    return string ? `/product?${string}` : "/product";
  }, [categoryId, materialId, occasionId, search, minPrice, maxPrice, sort, page]);

  const pageNumbers = useMemo(() => {
    const total = result?.totalPages ?? 0;
    return Array.from({ length: Math.min(total, 5) }, (_, index) => {
      if (total <= 5 || page < 3) return index;
      if (page > total - 4) return total - 5 + index;
      return page - 2 + index;
    });
  }, [result?.totalPages, page]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    router.push(hrefFor({ search: searchValue || undefined, page: "0" }));
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold  tracking-[0.28em] text-[var(--color-gold)]">Handmade collection</p>
          <h1 className="font-serif text-4xl sm:text-5xl">{activeCategory ? activeCategory.title : "All products"}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-cream-dark)]">Discover thoughtful pieces made by skilled artisans, each with its own story and character.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={submitSearch} className="mb-6 flex gap-2">
          <div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gold-muted)]" /><input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search products" className="h-11 w-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-3 text-sm outline-none transition focus:border-[var(--color-gold)]" /></div>
          <button className="bg-[var(--color-gold)] px-5 text-xs font-bold  tracking-wider text-[#17130a]">Search</button>
          <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="inline-flex items-center gap-2 border border-[var(--color-border-subtle)] px-4 text-xs font-semibold  tracking-wider lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        </form>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-64 lg:shrink-0`}>
            <div className="space-y-7 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 rounded-lg lg:sticky lg:top-28">
              <div>
                <h2 className="mb-3 text-xs font-bold  tracking-[0.18em]">Category</h2>
                <div className="space-y-2">
                  {categories.length ? categories.map((cat) => {
                    const checked = categoryId === cat.id;
                    return (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const nextCategory = checked ? undefined : cat.id;
                            router.push(hrefFor({ categoryId: nextCategory, page: "0" }));
                          }}
                          className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                        />
                        <span className="text-sm text-[var(--color-cream-dark)]">{cat.title} </span>
                      </label>
                    );
                  }) : <p className="text-sm text-[var(--color-cream-dark)]">No categories</p>}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xs font-bold  tracking-[0.18em]">Material</h2>
                <div className="space-y-2">
                  {materials.length ? materials.map((m) => {
                    const checked = materialId === m.id;
                    return (
                      <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked ? undefined : m.id;
                            router.push(hrefFor({ materialId: next, page: "0" }));
                          }}
                          className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                        />
                        <span className="text-sm text-[var(--color-cream-dark)]">{m.name}</span>
                      </label>
                    );
                  }) : <p className="text-sm text-[var(--color-cream-dark)]">No materials</p>}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xs font-bold  tracking-[0.18em]">Occasion</h2>
                <div className="space-y-2">
                  {occasions.length ? occasions.map((o) => {
                    const checked = occasionId === o.id;
                    return (
                      <label key={o.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked ? undefined : o.id;
                            router.push(hrefFor({ occasionId: next, page: "0" }));
                          }}
                          className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                        />
                        <span className="text-sm text-[var(--color-cream-dark)]">{o.name}</span>
                      </label>
                    );
                  }) : <p className="text-sm text-[var(--color-cream-dark)]">No occasions</p>}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xs font-bold  tracking-[0.18em]">Price range</h2>
                <div className="grid grid-cols-2 gap-2">
                  <input aria-label="Minimum price" defaultValue={minPrice} onBlur={(event) => router.push(hrefFor({ minPrice: event.target.value || undefined, page: "0" }))} inputMode="decimal" placeholder="Min" className="h-10 min-w-0 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 text-sm" />
                  <input aria-label="Maximum price" defaultValue={maxPrice} onBlur={(event) => router.push(hrefFor({ maxPrice: event.target.value || undefined, page: "0" }))} inputMode="decimal" placeholder="Max" className="h-10 min-w-0 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 text-sm" />
                </div>
              </div>

              {(categoryId || materialId || occasionId || search || minPrice || maxPrice) && (
                <button onClick={() => router.push('/product')} className="inline-flex items-center gap-1 text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"><X className="h-3.5 w-3.5" /> Clear filters</button>
              )}
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-[var(--color-cream-dark)]">{result?.totalElements ?? 0} {result?.totalElements === 1 ? "product" : "products"}</p><select value={sort} onChange={(event) => router.push(hrefFor({ sort: event.target.value, page: "0" }))} className="h-10 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 text-sm"><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div>
            {query.isPending ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="aspect-[3/4] animate-pulse bg-[var(--color-surface-elevated)]" />
                <div className="aspect-[3/4] animate-pulse bg-[var(--color-surface-elevated)]" />
                <div className="aspect-[3/4] animate-pulse bg-[var(--color-surface-elevated)]" />
              </div>
            ) : products.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {(result?.totalPages ?? 0) > 1 && (
                  <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Pagination">
                    <Link aria-disabled={page === 0} href={page > 0 ? hrefFor({ page: String(page - 1) }) : hrefFor({})} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-cream-dark)]">
                      <ChevronLeft className="h-5 w-5" />
                    </Link>

                    {pageNumbers.map((number) => (
                      <Link
                        key={number}
                        href={hrefFor({ page: String(number) })}
                        className={`grid h-10 w-10 place-items-center text-sm rounded-full ${number === page ? "bg-[var(--color-gold)] text-[#17130a]" : "border border-[var(--color-border-subtle)] text-[var(--color-cream-dark)]"}`}
                      >
                        {number + 1}
                      </Link>
                    ))}

                    <Link aria-disabled={result?.last} href={!result?.last ? hrefFor({ page: String(page + 1) }) : hrefFor({})} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-cream-dark)]">
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </nav>
                )}
              </>
            ) : (
              <div className="border border-dashed border-[var(--color-border-subtle)] py-20 text-center">
                <p className="font-serif text-2xl">No products found</p>
                <Link href="/product" className="mt-3 inline-block text-sm text-[var(--color-gold)]">Clear filters and browse all products</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ProductListingPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[var(--color-background)]" />}><ProductListing /></Suspense>;
}
