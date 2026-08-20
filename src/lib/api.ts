import type { Product, Category, Collection, BlogPost } from "@/types";
import {
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES,
  FALLBACK_COLLECTIONS,
  FALLBACK_SETTINGS,
  FALLBACK_PAGES,
  fallbackSettingsRecord,
  type HeroSlide,
  type PageContent,
} from "./fallback-data";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const HERO_SLIDES_ENDPOINT = `${API_BASE_URL}/api/v1/public/hero-slide`;
const CATEGORY_API_ORIGIN = API_BASE_URL || "https://backend-4gle.onrender.com";
const CATEGORIES_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/public/category/all`;
const FEATURED_PRODUCTS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/public/product/featured`;
// Updated public products endpoint per backend API
const PRODUCTS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/public/product`;

/**
 * Central data-access layer for the storefront.
 *
 * All product / category / collection / story data flows through these
 * functions. Right now they return rich static fallback data so the website
 * works out of the box without any backend.
 *
 * TODO: When the real backend API is available, implement each function to
 * fetch from `process.env.NEXT_PUBLIC_API_URL` and remove the fallback usage.
 */

export interface ProductQuery {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductListQuery {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  materialId?: string;
  occasionId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "id" | "price" | "title";
  direction?: "asc" | "desc";
}
const MATERIALS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/public/material`;
const OCCASIONS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/public/occasion`;

export interface ProductListResult {
  products: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface BlogPostsResult {
  posts: BlogPost[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const BLOG_LIST_PATH = "/api/v1/public/blog";
const BLOG_DETAIL_PATH = "/api/v1/public/blog";

function buildBlogListUrl(page = 0, size = 10) {
  return `${API_BASE_URL}${BLOG_LIST_PATH}?page=${page}&size=${size}&sortBy=id&direction=desc`;
}

function buildBlogDetailUrl(slug: string) {
  return `${API_BASE_URL}${BLOG_DETAIL_PATH}/${encodeURIComponent(slug)}`;
}

function toCategorySlug(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(CATEGORIES_ENDPOINT, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`Categories request failed with status ${response.status}`);
      return [];
    }

    const payload = await response.json();
    const rawCategories = Array.isArray(payload?.data) ? payload.data : [];
    const categories = rawCategories
      .filter((category: any) => category?.id != null && category?.categoryName)
      .map((category: any) => ({
        id: String(category.id),
        title: String(category.categoryName),
        slug: toCategorySlug(String(category.categoryCode || category.categoryName), `category-${category.id}`),
        description: category.description || undefined,
        image: category.file || undefined,
      }));

    return categories.length > 0 ? categories : [];
  } catch (error) {
    console.warn("Categories request failed.", error);
    return [];
  }
}

export async function getMaterials(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await fetch(MATERIALS_ENDPOINT, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.warn(`Materials request failed with status ${response.status}`);
      return [];
    }

    const payload = await response.json().catch(() => null);
    const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    return raw
      .filter((m: any) => m?.id != null && (m?.name || m?.materialName))
      .map((m: any) => ({ id: String(m.id), name: String(m.name ?? m.materialName) }));
  } catch (error) {
    console.warn("Materials request failed.", error);
    return [];
  }
}

export async function getOccasions(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await fetch(OCCASIONS_ENDPOINT, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.warn(`Occasions request failed with status ${response.status}`);
      return [];
    }

    const payload = await response.json().catch(() => null);
    const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    return raw
      .filter((o: any) => o?.id != null && (o?.name || o?.occasionName))
      .map((o: any) => ({ id: String(o.id), name: String(o.name ?? o.occasionName) }));
  } catch (error) {
    console.warn("Occasions request failed.", error);
    return [];
  }
}

export function getCollections(): Collection[] {
  return FALLBACK_COLLECTIONS;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const response = await fetch(HERO_SLIDES_ENDPOINT, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`Hero slides request failed with status ${response.status}`);
      return [];
    }

    const payload = await response.json();
    const slides = Array.isArray(payload?.data) ? payload.data : [];

    const mappedSlides = slides
      .filter((slide: any) => slide?.active !== false)
      .map((slide: any, index: number) => ({
        id: slide?.id?.toString() ?? `hero-${index + 1}`,
        eyebrow: slide?.eyebrow || slide?.overline || slide?.kicker || undefined,
        title: slide?.title || "Featured Collection",
        subtitle: slide?.subtitle || slide?.description || undefined,
        ctaText: slide?.ctaText || slide?.buttonText || undefined,
        ctaLink: slide?.ctaLink || slide?.buttonLink || "/jewelry",
        image: slide?.backgroundImageUrl || slide?.image || slide?.backgroundImage || undefined,
        order: typeof slide?.order === "number" ? slide.order : index + 1,
        active: slide?.active !== false,
      }));

    if (mappedSlides.length > 0) {
      return mappedSlides;
    }
  } catch (error) {
    console.warn("Hero slides request failed.", error);
  }

  return [];
}

export async function getBlogPosts(page = 1, size = 10): Promise<BlogPostsResult> {
  const apiPage = Math.max(0, page - 1);
  const response = await fetch(buildBlogListUrl(apiPage, size), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    console.warn(`Blog list request failed with status ${response.status}`);
    return {
      posts: [],
      currentPage: page,
      pageSize: size,
      totalElements: 0,
      totalPages: 0,
      last: true,
    };
  }

  const payload = await response.json();
  const rawPosts = Array.isArray(payload?.data?.content) ? payload.data.content : [];
  const mappedPosts = rawPosts
    .filter((post: any) => post?.deleted !== true && post?.status !== "DRAFT")
    .map((post: any, index: number) => ({
      id: post?.id?.toString() ?? `blog-${index + 1}`,
      title: post?.title || "Untitled story",
      slug: post?.slug || `story-${index + 1}`,
      excerpt: post?.excerpt || post?.summary || undefined,
      content: post?.content || undefined,
      coverImage: post?.coverImage || undefined,
      author: post?.author || undefined,
      publishedAt: post?.createdDate || post?.modifiedDate || new Date().toISOString(),
      tags: Array.isArray(post?.tags)
        ? post.tags
          .map((tag: any) => (typeof tag === "string" ? tag : tag?.name))
          .filter(Boolean)
        : [],
    }));

  return {
    posts: mappedPosts.sort(
      (a: BlogPost, b: BlogPost) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ),
    currentPage: typeof payload?.data?.page === "number" ? payload.data.page + 1 : page,
    pageSize: typeof payload?.data?.size === "number" ? payload.data.size : size,
    totalElements: typeof payload?.data?.totalElements === "number" ? payload.data.totalElements : mappedPosts.length,
    totalPages: typeof payload?.data?.totalPages === "number" ? payload.data.totalPages : mappedPosts.length > 0 ? 1 : 0,
    last: typeof payload?.data?.last === "boolean" ? payload.data.last : true,
  };
}

export function getSiteSettings(): Record<string, any> {
  return fallbackSettingsRecord;
}

export function getPages(): PageContent[] {
  return FALLBACK_PAGES;
}

export function getProducts(query: ProductQuery = {}): {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
} {
  // Avoid returning static fallback products. This synchronous helper
  // intentionally returns an empty result so the UI doesn't render stale
  // static data when the API is expected to be the source of truth.
  return { products: [], total: 0, page: query.page ?? 1, pageSize: query.pageSize ?? 0 };
}

function mapApiProducts(rawProducts: any[]): Product[] {
  return rawProducts
    .filter((product: any) => product?.id != null && product?.title)
    .map((product: any, index: number): Product => {
      const price = Number(product.price) || 0;
      const discountPercentage = Number(product.discountPercentage) || 0;

      return {
        id: String(product.id),
        title: String(product.title),
        slug: product.slug || `product-${product.id}`,
        price,
        discountPrice: discountPercentage > 0 ? price * (1 - discountPercentage / 100) : undefined,
        discountPercentage,
        materials: Array.isArray(product.materials)
          ? product.materials.map((material: any) => typeof material === "string" ? material : material?.name).filter(Boolean)
          : [],
        occasion: Array.isArray(product.occasions)
          ? product.occasions.map((occasion: any) => typeof occasion === "string" ? occasion : occasion?.name).filter(Boolean)
          : [],
        occasions: Array.isArray(product.occasions)
          ? product.occasions.map((occasion: any) => typeof occasion === "string" ? occasion : occasion?.name).filter(Boolean)
          : [],
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : [],
        stockStatus: product.stockStatus || "IN_STOCK",
        stockQuantity: product.stockQuantity != null ? Number(product.stockQuantity) : undefined,
        featured: product.featured === true,
        height: product.height != null ? product.height : undefined,
        width: product.width != null ? product.width : undefined,
        weight: product.weight != null ? product.weight : undefined,
        categoryId: product.categoryId != null ? String(product.categoryId) : null,
        categoryName: product.categoryName ? String(product.categoryName) : null,
        category: product.categoryName
          ? {
              id: product.categoryId != null ? String(product.categoryId) : `category-${index}`,
              title: String(product.categoryName),
              slug: toCategorySlug(String(product.categoryName), `category-${index}`),
            }
          : null,
        createdAt: product.createdAt || "1970-01-01T00:00:00.000Z",
      };
    });
}

function mapApiProduct(product: any): Product | null {
  return mapApiProducts(product ? [product] : [])[0] ?? null;
}

/** Fetches the paginated product catalogue from the storefront API. */
export async function getProductList(query: ProductListQuery = {}): Promise<ProductListResult> {
  const params = new URLSearchParams({
    page: String(Math.max(0, query.page ?? 0)),
    size: String(Math.max(1, query.size ?? 12)),
  });

  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.direction) params.set("direction", query.direction);

  if (query.search) params.set("search", query.search);
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.materialId) params.set("materialId", query.materialId);
  if (query.occasionId) params.set("occasionId", query.occasionId);
  if (query.minPrice != null) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice != null) params.set("maxPrice", String(query.maxPrice));

  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}?${params}`, { next: { revalidate: 30 } });
    if (!response.ok) {
      console.warn(`Product list request failed with status ${response.status}`);
      return { products: [], page: query.page ?? 0, size: query.size ?? 12, totalElements: 0, totalPages: 0, last: true };
    }

    const payload = await response.json().catch(() => null);
    // Support a couple of payload shapes: { data: { content: [...] } } or { data: [...] } or direct array
    const rawItems = Array.isArray(payload?.data?.content)
      ? payload.data.content
      : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];

    const products = mapApiProducts(rawItems);
    const data = payload?.data ?? {};

    const pageVal = typeof data.page === "number" ? data.page : typeof payload?.page === "number" ? payload.page : query.page ?? 0;
    const sizeVal = typeof data.size === "number" ? data.size : query.size ?? 12;
    const totalElements = typeof data.totalElements === "number" ? data.totalElements : products.length;
    const totalPages = typeof data.totalPages === "number" ? data.totalPages : totalElements > 0 ? Math.ceil(totalElements / sizeVal) : 0;
    const last = typeof data.last === "boolean" ? data.last : pageVal >= Math.max(0, totalPages - 1);

    return {
      products,
      page: pageVal,
      size: sizeVal,
      totalElements,
      totalPages,
      last,
    };
  } catch (error) {
    console.warn("Product list request failed.", error);
    return { products: [], page: query.page ?? 0, size: query.size ?? 12, totalElements: 0, totalPages: 0, last: true };
  }
}

/** Fetches a single product by its API id. */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`, { next: { revalidate: 30 } });
    if (!response.ok) {
      console.warn(`Product detail request failed with status ${response.status}`);
      return null;
    }

    const payload = await response.json().catch(() => null);
    const raw = payload?.data ?? payload ?? null;
    const product = mapApiProduct(Array.isArray(raw) ? raw[0] : raw);
    if (!product) return null;

    const occasions = Array.isArray(raw?.occasions)
      ? raw.occasions.map((occasion: any) => typeof occasion === "string" ? occasion : occasion?.name).filter(Boolean)
      : Array.isArray(raw.occasion)
        ? raw.occasion.map((occasion: any) => typeof occasion === "string" ? occasion : occasion?.name).filter(Boolean)
        : [];

    const materials = Array.isArray(raw?.materials)
      ? raw.materials.map((material: any) => typeof material === "string" ? material : material?.name).filter(Boolean)
      : [];

    return {
      ...product,
      title: raw.title || product.title,
      slug: raw.slug || product.slug,
      price: Number(raw.price) || product.price,
      discountPercentage: Number(raw.discountPercentage) || product.discountPercentage || 0,
      discountPrice: raw.discountPercentage ? (Number(raw.price) || product.price) * (1 - Number(raw.discountPercentage) / 100) : product.discountPrice,
      description: raw.description || product.description || undefined,
      materials,
      occasion: occasions,
      occasions,
      craftType: raw.craftType || product.craftType || undefined,
      origin: raw.origin || product.origin || undefined,
      stockStatus: raw.stockStatus || product.stockStatus || "IN_STOCK",
      stockQuantity: raw.stockQuantity != null ? Number(raw.stockQuantity) : product.stockQuantity,
      featured: raw.featured === true || product.featured,
      height: raw.height != null ? raw.height : product.height,
      width: raw.width != null ? raw.width : product.width,
      weight: raw.weight != null ? raw.weight : product.weight,
      categoryId: raw.categoryId != null ? String(raw.categoryId) : product.categoryId ?? null,
      categoryName: raw.categoryName ? String(raw.categoryName) : product.categoryName ?? null,
      category: raw.categoryName
        ? {
            id: raw.categoryId != null ? String(raw.categoryId) : product.categoryId ?? "category-unknown",
            title: String(raw.categoryName),
            slug: toCategorySlug(String(raw.categoryName), raw.categoryId != null ? String(raw.categoryId) : product.categoryId ?? "category-unknown"),
          }
        : product.category ?? null,
      images: Array.isArray(raw.images)
        ? raw.images.map((image: any) => ({ url: image?.url || image?.imageUrl || image?.file, alt: image?.alt || raw.title || product.title })).filter((image: any) => image.url)
        : product.images,
    };
  } catch (error) {
    console.warn("Product detail request failed.", error);
    return null;
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const response = await fetch(
      `${FEATURED_PRODUCTS_ENDPOINT}?page=0&size=${limit}&sortBy=id&direction=desc`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
        console.warn(`Featured products request failed with status ${response.status}`);
        return [];
    }

    const payload = await response.json();
    const rawProducts = Array.isArray(payload?.data?.content) ? payload.data.content : [];
    const products = mapApiProducts(rawProducts);

    return products.length > 0 ? products : [];
  } catch (error) {
    console.warn("Featured products request failed.", error);
    return [];
  }
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}?page=0&size=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`Products request failed with status ${response.status}`);
      return [];
    }

    const payload = await response.json().catch(() => null);
    const rawItems = Array.isArray(payload?.data?.content)
      ? payload.data.content
      : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];

    const products = mapApiProducts(rawItems);
    return products.length > 0 ? products.slice(0, limit) : [];
  } catch (error) {
    console.warn("Products request failed.", error);
    return [];
  }
}

export function getProductBySlug(slug: string): Product | null {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  if (!product.categoryId) return [];
  return FALLBACK_PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, limit);
}

export function getCollectionBySlug(slug: string): Collection | null {
  const collection = FALLBACK_COLLECTIONS.find((c) => c.slug === slug) ?? null;
  if (collection) {
    collection.products = FALLBACK_PRODUCTS.filter(
      (p) => p.collectionId === collection.id
    );
  }
  return collection;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetch(buildBlogDetailUrl(slug), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    console.warn(`Blog detail request failed with status ${response.status}`);
    return null;
  }

  const payload = await response.json();
  const post = payload?.data;

  if (!post) {
    return null;
  }

  return {
    id: post?.id?.toString() ?? slug,
    title: post?.title || "Untitled story",
    slug: post?.slug || slug,
    excerpt: post?.excerpt || post?.summary || undefined,
    content: post?.content || undefined,
    coverImage: post?.coverImage || undefined,
    author: post?.author || undefined,
    publishedAt: post?.createdDate || post?.modifiedDate || new Date().toISOString(),
    tags: Array.isArray(post?.tags)
      ? post.tags
        .map((tag: any) => (typeof tag === "string" ? tag : tag?.name))
        .filter(Boolean)
      : [],
  };
}

export function getPageContent(slug: string): PageContent | null {
  return FALLBACK_PAGES.find((p) => p.slug === slug && p.published) ?? null;
}

// Re-export for convenience
export const FALLBACK = {
  settings: fallbackSettingsRecord,
};
