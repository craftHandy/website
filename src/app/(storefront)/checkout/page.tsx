"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "react-razorpay";

type AddressFormValues = {
  fullName: string;
  mobileNo: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useUserStore((s) => s.user);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowCheckout, setAllowCheckout] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [isKeyLoading, setIsKeyLoading] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);
  const { Razorpay, isLoading: razorpayIsLoading, error: razorpayError } = useRazorpay();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<AddressFormValues>({
    defaultValues: {
      fullName: user?.name || "",
      mobileNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
    },
  });

  useEffect(() => {
    setSelectedIds((current) => {
      const next = items.map((item) => item.id);
      if (current.length === next.length && current.every((id) => next.includes(id))) {
        return current;
      }
      return next;
    });
  }, [items]);

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
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load Razorpay public key.";
        setKeyError(message);
      } finally {
        setIsKeyLoading(false);
      }
    }

    fetchKey();
  }, []);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipping = subtotal >= 25000;
  const shippingCost = freeShipping ? 0 : selectedItems.length > 0 ? 150 : 0;
  const total = subtotal + shippingCost;

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((current) => current.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds((current) => [...current, id]);
    }
  };

  const createCartPayloadItem = (item: (typeof items)[number]) => {
    const rawId = item.productId || item.id;
    const numericId = Number(rawId);
    const cartItemId = Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

    return {
      cartItemId,
      quantity: item.quantity,
    };
  };

  const onSubmit = async (data: AddressFormValues) => {
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Select at least one item to checkout.");
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
      setError(keyError || "Razorpay public key is not configured.");
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutResponse = await fetch("https://backend-4gle.onrender.com/api/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cartItems: selectedItems.map(createCartPayloadItem),
          address: {
            fullName: data.fullName,
            mobileNo: data.mobileNo,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2 || "",
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
          },
        }),
      });

      const checkoutPayload = await checkoutResponse.json().catch(() => null);

      if (!checkoutResponse.ok) {
        throw new Error(checkoutPayload?.message || checkoutPayload?.error || "Checkout failed. Please try again.");
      }

      const paymentResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            customerName: data.fullName,
            customerEmail: user?.email || "",
          },
        }),
      });

      const paymentOrder = await paymentResponse.json().catch(() => null);

      if (!paymentResponse.ok) {
        throw new Error(paymentOrder?.error || "Unable to create payment order. Please try again.");
      }

      const razorpayCheckout = new Razorpay({
        key: razorpayKeyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Ratnagiri",
        description: "Secure jewelry payment",
        order_id: paymentOrder.id,
        prefill: {
          name: data.fullName,
          email: user?.email || "",
          contact: data.mobileNo,
        },
        theme: {
          color: "#c9a84c",
        },
        handler: async (paymentResult: any) => {
          try {
            const verifyResponse = await fetch("https://backend-4gle.onrender.com/api/v1/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature,
              }),
            });

            const verifyPayload = await verifyResponse.json().catch(() => null);

            if (!verifyResponse.ok) {
              throw new Error(verifyPayload?.message || verifyPayload?.error || "Payment verification failed.");
            }

            // Prefer server-provided order id from verification response, fall back to checkout payload
            const serverOrderId =
              verifyPayload?.orderId ||
              verifyPayload?.data?.orderId ||
              verifyPayload?.data?.id ||
              checkoutPayload?.orderId ||
              checkoutPayload?.data?.id ||
              null;

            // If backend didn't return an order id, still clear cart and navigate to success with a generated token
            clearCart();
            const finalOrderId = serverOrderId ?? `local-${Date.now()}`;
            router.push(`/order/success?orderId=${finalOrderId}`);
          } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Payment succeeded but verification failed.");
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });

      razorpayCheckout.on("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment failed. Please try again.");
        setIsSubmitting(false);
      });

      razorpayCheckout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-serif text-[var(--color-foreground)] mb-4">Nothing to Checkout</h1>
            <p className="text-[var(--color-cream-dark)]/70 mb-8">Your cart is empty. Add some beautiful pieces before checking out.</p>
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
          <p className="text-gold tracking-[0.2em] text-xs font-medium mb-3">Checkout</p>
          <h1 className="text-3xl font-serif text-[var(--color-foreground)]">Complete Your Order</h1>
          <p className="max-w-2xl text-sm text-gold-muted mt-2">
            Enter your delivery address and complete your order with secure Razorpay checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[var(--color-surface-elevated)] rounded-sm p-6 md:p-8 border border-[var(--color-border-subtle)]">
              <h2 className="text-lg font-serif text-[var(--color-foreground)] mb-6">Delivery Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <label className="flex items-center gap-3 text-sm text-[var(--color-cream-dark)]/80">
                  <input
                    type="checkbox"
                    checked={allowCheckout}
                    onChange={(e) => setAllowCheckout(e.target.checked)}
                    className="h-4 w-4 accent-[var(--color-gold)]"
                    aria-label="Enable checkout"
                  />
                  <span>I want to proceed to checkout and complete the payment</span>
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>Full name</span>
                    <input
                      {...register("fullName", { required: "Full name is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
                  </label>

                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>Mobile Number</span>
                    <input
                      {...register("mobileNo", { required: "Mobile number is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="9876543210"
                    />
                    {errors.mobileNo && <span className="text-xs text-red-400">{errors.mobileNo.message}</span>}
                  </label>
                </div>

                <label className="space-y-2 block text-sm text-[var(--color-cream-dark)]/80">
                  <span>Address Line 1</span>
                  <input
                    {...register("addressLine1", { required: "Address line 1 is required" })}
                    disabled={!allowCheckout}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                    placeholder="123"
                  />
                  {errors.addressLine1 && <span className="text-xs text-red-400">{errors.addressLine1.message}</span>}
                </label>

                <label className="space-y-2 block text-sm text-[var(--color-cream-dark)]/80">
                  <span>Address Line 2</span>
                  <input
                    {...register("addressLine2")}
                    disabled={!allowCheckout}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                    placeholder="Apt 4B"
                  />
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>City</span>
                    <input
                      {...register("city", { required: "City is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="Mumbai"
                    />
                    {errors.city && <span className="text-xs text-red-400">{errors.city.message}</span>}
                  </label>

                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>State</span>
                    <input
                      {...register("state", { required: "State is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="Maharashtra"
                    />
                    {errors.state && <span className="text-xs text-red-400">{errors.state.message}</span>}
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>Country</span>
                    <input
                      {...register("country", { required: "Country is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="India"
                    />
                    {errors.country && <span className="text-xs text-red-400">{errors.country.message}</span>}
                  </label>

                  <label className="space-y-2 text-sm text-[var(--color-cream-dark)]/80">
                    <span>Postal Code</span>
                    <input
                      {...register("postalCode", { required: "Postal code is required" })}
                      disabled={!allowCheckout}
                      className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="400001"
                    />
                    {errors.postalCode && <span className="text-xs text-red-400">{errors.postalCode.message}</span>}
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={isSubmitting || isFormSubmitting || isKeyLoading || !razorpayKeyId || !!keyError || selectedItems.length === 0}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting || isFormSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              </form>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface-elevated)] rounded-sm p-6 lg:sticky lg:top-24 border border-[var(--color-border-subtle)]">
              <h2 className="text-lg font-serif text-[var(--color-foreground)] mb-6">Items to Pay</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const checked = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1 h-4 w-4 accent-[var(--color-gold)]"
                        aria-label={`Select ${item.title}`}
                      />

                      <div className="w-14 h-16 rounded-sm overflow-hidden bg-[var(--color-surface)] shrink-0 relative border border-[var(--color-border-subtle)]">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-cream-dark)]/40 text-[10px]">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--color-foreground)] line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gold-muted">Qty: {item.quantity}</p>
                        {checked && (
                          <p className="mt-1 text-xs text-gold">{formatPrice(item.price * item.quantity)}</p>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedIds((prev) => prev.filter((id) => id !== item.id))}
                        className="text-gold-muted hover:text-red-400 p-1"
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
                  );
                })}
              </div>

              <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-cream-dark)]/70">Selected subtotal</span>
                  <span className="text-[var(--color-foreground)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-cream-dark)]/70">Shipping</span>
                  <span className={freeShipping ? "text-emerald-400" : "text-[var(--color-foreground)]"}>
                    {freeShipping ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {!freeShipping && selectedItems.length > 0 && (
                  <p className="text-xs text-[var(--color-gold-muted)]">Add {formatPrice(25000 - subtotal)} more for free shipping</p>
                )}
              </div>

              <div className="flex justify-between text-base font-semibold mt-6 mb-4">
                <span className="text-[var(--color-foreground)]">Total</span>
                <span className="text-[var(--color-foreground)]">{formatPrice(total)}</span>
              </div>

              {error && <p className="text-red-400 text-xs mb-4 bg-red-400/10 px-3 py-2 rounded-sm">{error}</p>}

              <p className="text-xs text-gold-muted text-center mt-4">
                {razorpayError
                  ? `Razorpay failed to load: ${razorpayError}`
                  : razorpayIsLoading
                  ? "Loading Razorpay checkout..."
                  : "Payments are processed securely through Razorpay."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}