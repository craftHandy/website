"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { getLocalOrders, type LocalOrder } from "@/lib/local-orders";

async function fetchOrders(): Promise<LocalOrder[]> {
  return getLocalOrders();
}

export default function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const orders = ordersQuery.data ?? [];
  const loading = ordersQuery.isPending;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
            Your Account
          </p>
          <h1 className="text-3xl font-serif text-neutral-900">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-500">Order #{order.id}</p>
                    <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-neutral-900">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "confirmed" || order.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{order.status}</span>
                  </div>
                </div>
                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <span className="text-neutral-500">{item.quantity}x</span>
                      <Link href={`/jewelry/${item.slug}`} className="text-neutral-900 hover:text-[#C9A84C]">{item.title}</Link>
                      <span className="ml-auto text-neutral-600">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-500 mb-4">No orders yet.</p>
            <Link href="/jewelry" className="text-[#C9A84C] hover:underline text-sm font-medium">
              Start Shopping →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
