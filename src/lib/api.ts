import type { Product, Category, Collection, BlogPost } from "@/types";
import {
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES,
  FALLBACK_COLLECTIONS,
  FALLBACK_HERO_SLIDES,
  FALLBACK_SETTINGS,
  FALLBACK_PAGES,
  fallbackSettingsRecord,
  type HeroSlide,
  type PageContent,
} from "./fallback-data";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const HERO_SLIDES_ENDPOINT = `${API_BASE_URL}/api/v1/hero-slide`;
const CATEGORY_API_ORIGIN = API_BASE_URL || "https://backend-4gle.onrender.com";
const CATEGORIES_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/category/all`;
const FEATURED_PRODUCTS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/product/featured`;
const PRODUCTS_ENDPOINT = `${CATEGORY_API_ORIGIN}/api/v1/product`;

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

export interface BlogPostsResult {
  posts: BlogPost[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const BLOG_LIST_PATH = "/api/v1/blog";
const BLOG_DETAIL_PATH = "/api/v1/blog";

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
      return FALLBACK_CATEGORIES;
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

    return categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  } catch (error) {
    console.warn("Categories request failed.", error);
    return FALLBACK_CATEGORIES;
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
        title: slide?.title || FALLBACK_HERO_SLIDES[index]?.title || "Featured Collection",
        subtitle: slide?.subtitle || slide?.description || undefined,
        ctaText: slide?.ctaText || slide?.buttonText || undefined,
        ctaLink: slide?.ctaLink || slide?.buttonLink || "/jewelry",
        image: slide?.backgroundImageUrl || slide?.image || slide?.backgroundImage || undefined,
        order: index + 1,
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
  let products = [...FALLBACK_PRODUCTS];

  if (query.category) {
    const category = FALLBACK_CATEGORIES.find((c) => c.slug === query.category);
    if (category) {
      products = products.filter((p) => p.categoryId === category.id);
    }
  }

  if (query.featured) {
    products = products.filter((p) => p.featured);
  }

  products = products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = products.length;
  const pageSize = query.pageSize ?? total;
  const page = query.page ?? 1;
  const take = query.limit ?? pageSize;
  const skip = page > 1 ? (page - 1) * take : 0;
  const sliced = take > 0 ? products.slice(skip, skip + take) : products;

  return {
    products: sliced,
    total,
    page,
    pageSize: take,
  };
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
        materials: [],
        occasion: [],
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : [],
        stockStatus: product.stockStatus || "IN_STOCK",
        featured: product.featured === true,
        categoryId: product.categoryId != null ? String(product.categoryId) : null,
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

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const response = await fetch(
      `${FEATURED_PRODUCTS_ENDPOINT}?page=0&size=${limit}&sortBy=id&direction=desc`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.warn(`Featured products request failed with status ${response.status}`);
      return getProducts({ featured: true, limit }).products;
    }

    const payload = await response.json();
    const rawProducts = Array.isArray(payload?.data?.content) ? payload.data.content : [];
    const products = mapApiProducts(rawProducts);

    return products.length > 0 ? products : getProducts({ featured: true, limit }).products;
  } catch (error) {
    console.warn("Featured products request failed.", error);
    return getProducts({ featured: true, limit }).products;
  }
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}?page=0&size=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`Products request failed with status ${response.status}`);
      return getProducts({ limit }).products;
    }

    const payload = await response.json();
    const products = mapApiProducts(Array.isArray(payload?.data?.content) ? payload.data.content : []);

    return products.length > 0 ? products.slice(0, limit) : getProducts({ limit }).products;
  } catch (error) {
    console.warn("Products request failed.", error);
    return getProducts({ limit }).products;
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
