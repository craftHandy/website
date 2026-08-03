"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { placeLocalOrder } from "@/lib/local-orders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "react-razorpay";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useUserStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [isKeyLoading, setIsKeyLoading] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);
  const { Razorpay, isLoading: razorpayIsLoading, error: razorpayError } = useRazorpay();

  const subtotal = getTotal();
  const freeShipping = subtotal >= 25000;
  const shippingCost = freeShipping ? 0 : 150;
  const total = subtotal + shippingCost;

  useEffect(() => {
    async function fetchKey() {
      setIsKeyLoading(true);
      try {
        const res = await fetch("/api/razorpay");
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error || "Unable to load Razorpay public key.");
        }
        const data = await res.json();
        setRazorpayKeyId(data.key_id ?? null);
        console.log("Checkout: loaded Razorpay public key", data.key_id);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load Razorpay public key.";
        console.error("Checkout: failed to load Razorpay public key", message);
        setKeyError(message);
      } finally {
        setIsKeyLoading(false);
      }
    }

    fetchKey();
  }, []);

  async function handleSubmit() {
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (razorpayIsLoading) {
      setError("Payment gateway is still loading. Please wait a moment and try again.");
      return;
    }

    if (!Razorpay) {
      setError("Razorpay checkout is not available. Please refresh the page.");
      return;
    }

    if (isKeyLoading) {
      setError("Razorpay public key is still loading. Please wait a moment.");
      return;
    }

    if (!razorpayKeyId) {
      setError(keyError || "Razorpay public key is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local and restart your dev server.");
      return;
    }

    setIsSubmitting(true);

    console.log("Checkout: creating Razorpay order", {
      total,
      amount: Math.round(total * 100),
      user: { name: user?.name, email: user?.email },
      razorpayKeyIdConfigured: !!razorpayKeyId,
    });

    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            customerName: user?.name || "Guest",
            customerEmail: user?.email || "",
          },
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.clone().json().catch(() => null);
        console.error("Checkout: Razorpay order creation failed", {
          status: response.status,
          errorPayload,
        });
        throw new Error(errorPayload?.error || "Unable to create payment order. Please try again.");
      }

      const orderData = await response.json();
      console.log("Checkout: Razorpay order created", orderData);

      const checkout = new Razorpay({
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ratnagiri",
        description: "Secure jewelry payment",
        order_id: orderData.id,
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "",
          method: "upi",
        },
        theme: {
          color: "#c9a84c",
        },
        handler: async (paymentResponse: any) => {
          try {
            const order = placeLocalOrder({
              status: "paid",
              subtotal,
              shipping: shippingCost,
              total,
              customerName: user?.name || "Guest",
              customerEmail: user?.email || "",
              customerPhone: paymentResponse.contact || undefined,
              shippingAddress: {},
              items: items.map((item) => ({ ...item })),
              paymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            clearCart();
            router.push(`/order/success?orderId=${order.id}`);
          } catch (innerError) {
            setError(innerError instanceof Error ? innerError.message : "Payment succeeded, but order confirmation failed.");
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });

      checkout.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment failed. Please try again.");
        setIsSubmitting(false);
      });

      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-serif text-cream mb-4">Nothing to Checkout</h1>
            <p className="text-cream-dark/70 mb-8">Your cart is empty. Add some beautiful pieces before checking out.</p>
            <Button asChild size="lg" variant="default" className="px-8">
              <Link href="/jewelry">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em] uppercase text-xs font-medium mb-3">Checkout</p>
          <h1 className="text-3xl font-serif text-cream">Complete Your Order</h1>
          <p className="max-w-2xl text-sm text-gold-muted mt-2">
            You’ll be redirected to Razorpay’s secure checkout experience after clicking the button below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <section className="bg-surface rounded-sm p-6 md:p-8 border border-[rgba(201,168,76,0.1)]">
              <h2 className="text-lg font-serif text-cream mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="w-14 h-16 rounded-sm overflow-hidden bg-background shrink-0 relative border border-[rgba(201,168,76,0.1)]">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream-dark/40 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-cream line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gold-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-cream shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgba(201,168,76,0.1)] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream-dark/70">Subtotal</span>
                  <span className="text-cream">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-dark/70">Shipping</span>
                  <span className={freeShipping ? "text-emerald-400" : "text-cream"}>{freeShipping ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                {!freeShipping && <p className="text-xs text-gold-muted">Add {formatPrice(25000 - subtotal)} more for free shipping</p>}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-sm p-6 lg:sticky lg:top-24 border border-[rgba(201,168,76,0.1)]">
              <div className="flex justify-between text-base font-semibold mb-6">
                <span className="text-cream">Total</span>
                <span className="text-cream">{formatPrice(total)}</span>
              </div>

              {error && <p className="text-red-400 text-xs mb-4 bg-red-400/10 px-3 py-2 rounded-sm">{error}</p>}

              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || isKeyLoading || !razorpayKeyId || !!keyError}
                variant="default"
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : isKeyLoading ? (
                  "Loading Razorpay..."
                ) : keyError ? (
                  "Unable to load payment"
                ) : (
                  "Pay with Razorpay"
                )}
              </Button>

              <p className="text-xs text-gold-muted text-center mt-4">
                {razorpayError ? `Razorpay failed to load: ${razorpayError}` : razorpayIsLoading ? "Loading Razorpay checkout..." : "Payments are processed securely through Razorpay."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
