"use client";

import { ProductCard } from "@/components/shared/product-card";
import {
  getCategories,
  getMaterials,
  getOccasions,
  getProductList,
  getProducts,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters = useMemo(
    () =>
      categoryId || materialId || occasionId || search || minPrice || maxPrice,
    [categoryId, materialId, occasionId, search, minPrice, maxPrice],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryId) count++;
    if (materialId) count++;
    if (occasionId) count++;
    if (search) count++;
    if (minPrice || maxPrice) count++;
    return count;
  }, [categoryId, materialId, occasionId, search, minPrice, maxPrice]);

  const query = useQuery({
    queryKey: [
      "product-list",
      page,
      categoryId,
      materialId,
      occasionId,
      search,
      minPrice,
      maxPrice,
      sort,
    ],
    queryFn: () =>
      getProductList({
        page,
        size: PAGE_SIZE,
        categoryId: categoryId || undefined,
        materialId: materialId || undefined,
        occasionId: occasionId || undefined,
        search: search || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        ...(sort === "price-asc" || sort === "price-desc"
          ? {
              sortBy: "price",
              direction: sort === "price-asc" ? "asc" : "desc",
            }
          : {}),
      }),
    placeholderData: (previous) => previous,
  });
  const categories =
    useQuery({ queryKey: ["categories"], queryFn: getCategories }).data ?? [];
  const materials =
    useQuery({ queryKey: ["materials"], queryFn: getMaterials }).data ?? [];
  const occasions =
    useQuery({ queryKey: ["occasions"], queryFn: getOccasions }).data ?? [];
  const activeCategory = categories.find(
    (category) => category.id === categoryId,
  );
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

  const hrefFor = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams();
      const values = {
        categoryId,
        materialId,
        occasionId,
        search,
        minPrice,
        maxPrice,
        sort,
        page: String(page),
        ...updates,
      };
      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          !(key === "page" && value === "0") &&
          !(key === "sort" && value === "newest")
        )
          next.set(key, value);
      });
      const string = next.toString();
      return string ? `/product?${string}` : "/product";
    },
    [
      categoryId,
      materialId,
      occasionId,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
    ],
  );

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <section
        className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/product-bg.jpeg')" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.span
            className="mb-5 flex items-center justify-start gap-3 text-xs font-semibold tracking-[0.28em] text-[#e8c779] "
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="h-px w-8 bg-[#e8c779]/70 " />
            Our Collections
            <span className="h-px w-8 bg-[#e8c779]/70 " />
          </motion.span>

          <h1 className="font-serif text-fluid-h3 text-white md:text-fluid-display">
            EXQUISITE HANDCRAFTS <br />
            FROM THE HIMALAYAS
          </h1>

          <p className="mt-3 max-w-2xl text-fluid-body leading-6 text-surface font-poppins">
            Discover our curated collection of authentic Nepalese and Tibetan
            <br />
            handicrafts. Each piece is a masterpiece of traditional
            <br />
            craftsmanship, made with devotion and skill.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* <form onSubmit={submitSearch} className="mb-6 flex gap-2">
          <div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gold-muted)]" /><input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search products" className="h-11 w-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] pl-10 pr-3 text-sm outline-none transition focus:border-[var(--color-gold)]" /></div>
          <button className="bg-[var(--color-gold)] px-5 text-xs font-bold  tracking-wider text-[#17130a]">Search</button>
          <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="inline-flex items-center gap-2 border border-[var(--color-border-subtle)] px-4 text-xs font-semibold  tracking-wider lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        </form> */}

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside
            className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-64 lg:shrink-0`}
          >
            <div className="space-y-7 border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 rounded-lg lg:sticky lg:top-28">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em]">
                    Category
                  </h2>
                  {categoryId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {categories.length ? (
                    categories.map((cat) => {
                      const checked = categoryId === cat.id;
                      return (
                        <label
                          key={cat.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const nextCategory = checked ? undefined : cat.id;
                              router.push(
                                hrefFor({
                                  categoryId: nextCategory,
                                  page: "0",
                                }),
                              );
                            }}
                            className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                          />
                          <span className="text-sm   text-[var(--color-cream-dark)] font-poppins">
                            {cat.title}{" "}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[var(--color-cream-dark)] ">
                      No categories
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em]">
                    Material
                  </h2>
                  {materialId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {materials.length ? (
                    materials.map((m) => {
                      const checked = materialId === m.id;
                      return (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked ? undefined : m.id;
                              router.push(
                                hrefFor({ materialId: next, page: "0" }),
                              );
                            }}
                            className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                          />
                          <span className="text-sm text-[var(--color-cream-dark)] font-poppins">
                            {m.name}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[var(--color-cream-dark)]">
                      No materials
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em]">
                    Occasion
                  </h2>
                  {occasionId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {occasions.length ? (
                    occasions.map((o) => {
                      const checked = occasionId === o.id;
                      return (
                        <label
                          key={o.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked ? undefined : o.id;
                              router.push(
                                hrefFor({ occasionId: next, page: "0" }),
                              );
                            }}
                            className="w-4 h-4 rounded border-[var(--color-border-subtle)]"
                          />
                          <span className="text-sm text-[var(--color-cream-dark)] font-poppins">
                            {o.name}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[var(--color-cream-dark)]">
                      No occasions
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em]">
                    Price range
                  </h2>
                  {(minPrice || maxPrice) && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 font-poppins">
                  <input
                    aria-label="Minimum price"
                    defaultValue={minPrice}
                    onBlur={(event) =>
                      router.push(
                        hrefFor({
                          minPrice: event.target.value || undefined,
                          page: "0",
                        }),
                      )
                    }
                    inputMode="decimal"
                    placeholder="Min"
                    className="h-10 min-w-0 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 text-sm"
                  />
                  <input
                    aria-label="Maximum price"
                    defaultValue={maxPrice}
                    onBlur={(event) =>
                      router.push(
                        hrefFor({
                          maxPrice: event.target.value || undefined,
                          page: "0",
                        }),
                      )
                    }
                    inputMode="decimal"
                    placeholder="Max"
                    className="h-10 min-w-0 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2 text-sm"
                  />
                </div>
              </div>

              {(categoryId ||
                materialId ||
                occasionId ||
                search ||
                minPrice ||
                maxPrice) && (
                <button
                  onClick={() => router.push("/product")}
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
                >
                  <X className="h-3.5 w-3.5" /> Clear filters
                </button>
              )}
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-cream-dark)]">
                {result?.totalElements ?? 0}{" "}
                {result?.totalElements === 1 ? "product" : "products"}
              </p>
              <div className="flex items-center gap-3">
                {/* {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/product")}
                    className="gap-1.5 text-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </Button>
                )} */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden gap-1.5"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-gold text-black text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Select
                  value={sort}
                  onValueChange={(value) =>
                    router.push(hrefFor({ sort: value, page: "0" }))
                  }
                >
                  <SelectTrigger className="h-10 w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="price-asc">
                      Price: low to high
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: high to low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>

                {(result?.totalPages ?? 0) > 1 && (
                  <nav
                    className="mt-12 flex items-center justify-center gap-3"
                    aria-label="Pagination"
                  >
                    <Link
                      aria-disabled={page === 0}
                      href={
                        page > 0
                          ? hrefFor({ page: String(page - 1) })
                          : hrefFor({})
                      }
                      className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-cream-dark)]"
                    >
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

                    <Link
                      aria-disabled={result?.last}
                      href={
                        !result?.last
                          ? hrefFor({ page: String(page + 1) })
                          : hrefFor({})
                      }
                      className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-cream-dark)]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </nav>
                )}
              </>
            ) : (
              <div className="border border-dashed border-[var(--color-border-subtle)] py-20 text-center">
                <p className="font-serif text-fluid-h3">No products found</p>
                <Link
                  href="/product"
                  className="mt-3 inline-block text-sm text-[var(--color-gold)]"
                >
                  Clear filters and browse all products
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[90vh]">
          <SheetHeader className="space-y-1">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your search results</SheetDescription>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/product")}
                className="mt-2 text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] justify-start"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            )}
          </SheetHeader>
          <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto overscroll-contain [scrollbar-width:thin]">
            {/* Category */}
            {categories.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em] uppercase">
                    Category
                  </h2>
                  {categoryId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {categories.map((cat) => {
                    const checked = categoryId === cat.id;
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const nextCategory = checked ? undefined : cat.id;
                            router.push(
                              hrefFor({
                                categoryId: nextCategory,
                                page: "0",
                              }),
                            );
                          }}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border-subtle)] text-gold accent-gold focus:ring-2 focus:ring-gold/20"
                        />
                        <span className="text-sm text-[var(--color-foreground)] font-poppins">
                          {cat.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Material */}
            {materials.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em] uppercase">
                    Material
                  </h2>
                  {materialId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {materials.map((m) => {
                    const checked = materialId === m.id;
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked ? undefined : m.id;
                            router.push(
                              hrefFor({ materialId: next, page: "0" }),
                            );
                          }}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border-subtle)] text-gold accent-gold focus:ring-2 focus:ring-gold/20"
                        />
                        <span className="text-sm text-[var(--color-foreground)] font-poppins">
                          {m.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Occasion */}
            {occasions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gold tracking-[0.18em] uppercase">
                    Occasion
                  </h2>
                  {occasionId && (
                    <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {occasions.map((o) => {
                    const checked = occasionId === o.id;
                    return (
                      <label
                        key={o.id}
                        className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked ? undefined : o.id;
                            router.push(
                              hrefFor({ occasionId: next, page: "0" }),
                            );
                          }}
                          className="w-5 h-5 rounded border-2 border-[var(--color-border-subtle)] text-gold accent-gold focus:ring-2 focus:ring-gold/20"
                        />
                        <span className="text-sm text-[var(--color-foreground)] font-poppins">
                          {o.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gold tracking-[0.18em] uppercase">
                  Price Range
                </h2>
                {(minPrice || maxPrice) && (
                  <span className="bg-gold/10 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-3 text-[10px] text-[var(--color-cream-dark)] font-poppins uppercase tracking-wider bg-[var(--color-surface-elevated)] px-1">
                    Min
                  </label>
                  <input
                    aria-label="Minimum price"
                    defaultValue={minPrice}
                    onBlur={(event) =>
                      router.push(
                        hrefFor({
                          minPrice: event.target.value || undefined,
                          page: "0",
                        }),
                      )
                    }
                    inputMode="decimal"
                    placeholder="0"
                    className="w-full h-12 border-2 border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 text-sm font-poppins text-[var(--color-foreground)] placeholder:text-[var(--color-cream-dark)] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-lg transition-colors"
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-2 left-3 text-[10px] text-[var(--color-cream-dark)] font-poppins uppercase tracking-wider bg-[var(--color-surface-elevated)] px-1">
                    Max
                  </label>
                  <input
                    aria-label="Maximum price"
                    defaultValue={maxPrice}
                    onBlur={(event) =>
                      router.push(
                        hrefFor({
                          maxPrice: event.target.value || undefined,
                          page: "0",
                        }),
                      )
                    }
                    inputMode="decimal"
                    className="w-full h-12 border-2 border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 text-sm font-poppins text-[var(--color-foreground)] placeholder:text-[var(--color-cream-dark)] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-lg transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-[var(--color-background)]" />}
    >
      <ProductListing />
    </Suspense>
  );
}
