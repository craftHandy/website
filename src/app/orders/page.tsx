"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "https://backend-4gle.onrender.com";

async function fetchOrders(): Promise<any[]> {
  try {
    const res = await fetch(`${API_ORIGIN.replace(/\/$/, "")}/api/v1/orders`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json().catch(() => null);
    // support payload.data or direct array
    const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    return raw;
  } catch (err) {
    return [];
  }
}

export default function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const orders = ordersQuery.data ?? [];
  const loading = ordersQuery.isPending;

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
            Your Account
          </p>
          <h1 className="text-3xl font-serif text-[var(--color-foreground)]">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[var(--color-cream-dark)]">Order #{order.id}</p>
                    <p className="text-sm text-[var(--color-cream-dark)]">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[var(--color-foreground)]">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "confirmed" || order.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{order.status}</span>
                  </div>
                </div>
                <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2">
                  {order.items?.map((item:any) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="text-[var(--color-cream-dark)]">{item.quantity}x</span>
                      <Link href={`/jewelry/${item.slug}`} className="text-[var(--color-foreground)] hover:text-gold">{item.title}</Link>
                      <span className="ml-auto text-[var(--color-cream-dark)]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[var(--color-cream-dark)] mb-4">No orders yet.</p>
            <Link href="/jewelry" className="text-gold hover:underline text-sm font-medium">
              Start Shopping →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}