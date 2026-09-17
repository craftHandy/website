"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMyOrders, isAccessTokenExpired } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useUserStore } from "@/store/user";

function formatOrderDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function orderStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED": case "COMPLETED": case "PAID": return "bg-emerald-100 text-emerald-800";
    case "PENDING": case "PROCESSING": return "bg-amber-100 text-amber-800";
    default: return "bg-red-100 text-red-800";
  }
}

export default function MyOrdersPage() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("access_token");
    setAuthChecked(true);
    if (!savedToken || isAccessTokenExpired(savedToken)) {
      if (savedToken) clearUser();
      router.replace("/login?redirect=/my-orders");
      return;
    }
    setToken(savedToken);
  }, [clearUser, router]);

  const ordersQuery = useQuery({
    queryKey: ["my-orders", token],
    queryFn: () => getMyOrders(token!),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (ordersQuery.error && /401|403|unauthori[sz]ed|forbidden/i.test(ordersQuery.error.message)) {
      clearUser();
      router.replace("/login?redirect=/my-orders");
    }
  }, [clearUser, ordersQuery.error, router]);

  if (!authChecked || !token) return <main className="min-h-screen bg-[var(--color-background)]" />;

  const orders = ordersQuery.data?.content ?? [];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em] text-xs font-medium mb-3">Your Account</p>
          <h1 className="text-fluid-h3 font-serif">My Orders</h1>
        </div>
        {ordersQuery.isPending ? (
          <div className="flex items-center justify-center h-64" aria-label="Loading orders"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
        ) : ordersQuery.isError ? (
          <div className="border border-red-300 bg-red-50 text-red-800 p-5 text-sm font-poppins">{ordersQuery.error.message}</div>
        ) : orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div><p className="text-sm font-medium font-poppins">{order.orderNumber}</p><p className="text-sm text-[var(--color-cream-dark)] font-poppins mt-1">Placed on {formatOrderDate(order.createdDate)}</p></div>
                  <div className="sm:text-right flex sm:block items-center justify-between gap-4"><p className="text-lg font-semibold">{formatPrice(order.totalAmount)}</p><span className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-medium ${orderStatusClass(order.status)}`}>{order.status}</span></div>
                </div>
                <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[var(--color-surface)]">{item.imageUrl ? <Image src={item.imageUrl} alt={item.productName} fill sizes="64px" className="object-cover" unoptimized /> : null}</div>
                      <div className="min-w-0 flex-1 font-poppins"><Link href={`/product/${item.productId}`} className="text-sm font-medium hover:text-gold transition-colors">{item.productName}</Link><p className="text-xs text-[var(--color-cream-dark)] mt-1">Qty: {item.quantity}</p></div>
                      <p className="text-sm font-medium whitespace-nowrap">{formatPrice(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-[var(--color-cream-dark)] mb-4 font-poppins">You have not placed any orders yet.</p><Link href="/product" className="text-gold hover:underline text-sm font-medium">Start Shopping →</Link></div>
        )}
      </div>
    </main>
  );
}
