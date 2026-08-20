import type { CartItemType } from "@/types";

export interface LocalOrder {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: any;
  items: CartItemType[];
  paymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  createdAt: string;
}

const STORAGE_KEY = "jewelry-orders";

function readOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: LocalOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // storage full or unavailable — ignore
  }
}

export function getLocalOrders(): LocalOrder[] {
  return readOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function placeLocalOrder(order: Omit<LocalOrder, "id" | "createdAt">): LocalOrder {
  const id = `ORD-${Date.now().toString(36).to()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .to()}`;
  const full: LocalOrder = {
    ...order,
    id,
    createdAt: new Date().toISOString(),
  };
  writeOrders([full, ...readOrders()]);
  return full;
}
