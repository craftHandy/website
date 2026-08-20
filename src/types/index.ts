export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  description?: string;
  materials: string[];
  craftType?: string;
  origin?: string;
  occasion: string[];
  occasions?: string[];
  images: { url: string; alt?: string }[];
  stockStatus: string;
  stockQuantity?: number;
  featured: boolean;
  height?: number | string;
  width?: number | string;
  weight?: number | string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  } | null;
  categoryId?: string | null;
  categoryName?: string | null;
  category?: Category | null;
  collectionId?: string | null;
  collection?: Collection | null;
  createdAt: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  products?: Product[];
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  } | null;
  products?: Product[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  publishedAt: string;
  tags: string[];
}

export interface CartItemType {
  id: string;
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartType {
  id: string;
  items: CartItemType[];
  total: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: any;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}
