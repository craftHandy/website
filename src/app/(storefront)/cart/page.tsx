"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CartItemType } from "@/types";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedIds((current) => {
      const validIds = new Set(items.map((item) => item.id));

      if (current.length === 0 && items.length > 0) {
        return [...validIds];
      }

      return current.filter((id) => validIds.has(id));
    });
  }, [items]);

  const toggleItem = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  const toggleAllItems = () => {
    setSelectedIds((current) =>
      current.length === items.length && items.length > 0 ? [] : items.map((item) => item.id),
    );
  };

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const shippingThreshold = 25000;
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const selectedSubtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const selectedItemCount = selectedItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );
  const freeShipping = selectedItems.length > 0 && selectedSubtotal >= shippingThreshold;
  const shippingCost = selectedItems.length === 0 ? 0 : freeShipping ? 0 : 499;
  const total = selectedSubtotal + shippingCost;

  const subtotalText = selectedItems.length === 0 ? "Subtotal (0 items)" : `Subtotal (${selectedItemCount} ${selectedItemCount === 1 ? "item" : "items"})`;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
              Your Cart
            </p>
            <h1 className="text-3xl font-serif text-[var(--color-foreground)] mb-4">
              Nothing Here Yet
            </h1>
            <p className="text-[var(--color-cream-dark)]/70 mb-8">
              Your cart is empty. Discover handcrafted pieces that speak to your soul.
            </p>
            <Button asChild size="lg" variant="default" className="px-8">
              <Link href="/jewelry">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
            Your Cart
          </p>
          <h1 className="text-3xl font-serif text-[var(--color-foreground)]">
            Shopping Bag
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-1">
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 pb-3 text-xs tracking-[0.15em]  text-gold-muted border-b border-[rgba(201,168,76,0.1)] items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllItems}
                className="h-4 w-4 accent-[var(--color-gold)] cursor-pointer"
                aria-label="Select all items"
              />
              <span>Item</span>
              <span>Price</span>
              <span className="text-center w-28">Quantity</span>
              <span className="w-10" />
            </div>

            {items.map((item: CartItemType) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 md:gap-6 items-center py-6 border-b border-[rgba(201,168,76,0.1)] px-4"
              >
                <div className="flex gap-4 items-center">
                  <label className="w-4 h-4 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 accent-[var(--color-gold)] cursor-pointer"
                      aria-label={`Select ${item.title}`}
                    />
                  </label>
                  <div className="w-20 h-24 rounded-sm overflow-hidden bg-[var(--color-surface-elevated)] shrink-0 relative border border-[var(--color-border-subtle)]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cream-dark/40 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/jewelry/${item.slug}`}
                      className="text-sm font-medium text-[var(--color-foreground)] hover:text-gold transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>

                <div className="md:text-left">
                  <span className="text-sm font-semibold text-[var(--color-foreground)]">
                    {formatPrice(item.price)}
                  </span>
                  <span className="md:hidden text-sm text-gold-muted ml-2">
                    each
                  </span>
                </div>

                <div className="flex items-center border border-[rgba(201,168,76,0.2)] rounded-sm w-28">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex-1 h-9 flex items-center justify-center text-cream-dark/70 hover:text-gold transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="flex-1 h-9 flex items-center justify-center text-sm font-medium border-x border-[rgba(201,168,76,0.2)] text-[var(--color-foreground)]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex-1 h-9 flex items-center justify-center text-cream-dark/70 hover:text-gold transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gold-muted hover:text-red-400 transition-colors p-1"
                  aria-label={`Remove ${item.title}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-gold-muted hover:text-red-400 text-xs tracking-wider "
              >
                Clear Cart
              </Button>
              <Link href="/jewelry" className="text-xs text-gold tracking-wider  hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="cart-order-summary bg-[var(--color-surface-elevated)] rounded-sm p-6 lg:sticky lg:top-24 border border-[var(--color-border-subtle)]">
              <h2 className="text-lg font-serif text-[var(--color-foreground)] mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream-dark/70">
                    {subtotalText}
                  </span>
                  <span className="text-[var(--color-foreground)]">{formatPrice(selectedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-dark/70">Shipping</span>
                  <span className={selectedItems.length === 0 ? "text-[var(--color-foreground)]" : freeShipping ? "text-emerald-400" : "text-[var(--color-foreground)]"}>
                    {selectedItems.length === 0 ? "₹0" : freeShipping ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {selectedItems.length > 0 && !freeShipping && (
                  <p className="text-xs text-gold-muted">
                    Add {formatPrice(shippingThreshold - selectedSubtotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-[rgba(201,168,76,0.1)] my-6" />

              <div className="flex justify-between text-base font-semibold mb-6">
                <span className="text-[var(--color-foreground)]">Total</span>
                <span className="text-[var(--color-foreground)]">{formatPrice(total)}</span>
              </div>

              <Button
                asChild
                size="lg"
                variant="default"
                className="w-full"
                disabled={selectedItems.length === 0}
              >
                <Link
                  href={selectedItems.length === 0 ? "#" : "/checkout"}
                  onClick={(e) => {
                    if (selectedItems.length === 0) {
                      e.preventDefault();
                    }
                  }}
                  className={selectedItems.length === 0 ? "pointer-events-none opacity-60" : ""}
                >
                  Proceed to Checkout
                </Link>
              </Button>

              <p className="text-xs text-gold-muted text-center mt-4">
                Demo checkout — no payment is processed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}