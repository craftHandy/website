// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { ArrowLeft } from "lucide-react";
// import { useCartStore } from "@/store/cart";
// import { useUserStore } from "@/store/user";
// import { formatPrice } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useRazorpay } from "react-razorpay";
// import { API_BASE_URL } from "@/lib/api";
// import { toast } from "@/store/toast";

// type AddressFormValues = {
//   fullName: string;
//   mobileNo: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   country: string;
//   postalCode: string;
// };

// const inputCls =
//   "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none focus:border-[var(--color-gold)] border-[var(--color-border-subtle)]";
// const inputErrCls =
//   "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none border-red-400 focus:border-red-500";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const items = useCartStore((s) => s.items);
//   const clearCart = useCartStore((s) => s.clearCart);
//   const user = useUserStore((s) => s.user);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
//   const [isKeyLoading, setIsKeyLoading] = useState(true);
//   const [keyError, setKeyError] = useState<string | null>(null);
//   const { Razorpay, isLoading: razorpayIsLoading, error: razorpayError } = useRazorpay();
//   const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<AddressFormValues>({
//     defaultValues: {
//       fullName: user?.name || "",
//       mobileNo: "",
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       country: "India",
//       postalCode: "",
//     },
//   });

//   useEffect(() => {
//     async function fetchKey() {
//       setIsKeyLoading(true);
//       try {
//         const res = await fetch("/api/razorpay");
//         if (!res.ok) {
//           const payload = await res.json().catch(() => null);
//           throw new Error(payload?.error || "Unable to load Razorpay public key.");
//         }
//         const data = await res.json();
//         setRazorpayKeyId(data.key_id ?? null);
//       } catch (fetchError) {
//         const message = fetchError instanceof Error ? fetchError.message : "Unable to load Razorpay public key.";
//         setKeyError(message);
//       } finally {
//         setIsKeyLoading(false);
//       }
//     }

//     fetchKey();
//   }, []);

//   const selectedItems = useMemo(() => items, [items]);

//   const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const freeShipping = subtotal >= 25000;
//   const shippingCost = freeShipping ? 0 : items.length > 0 ? 150 : 0;
//   const total = subtotal + shippingCost;

//   const createCartPayloadItem = (item: (typeof items)[number]) => {
//     const rawId = item.productId || item.id;
//     const numericId = Number(rawId);
//     const cartItemId = Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

//     return {
//       productId: cartItemId,
//       quantity: item.quantity,
//     };
//   };

//   function waitForRazorpay(maxWaitMs = 12000): Promise<boolean> {
//     if (Razorpay) return Promise.resolve(true);
//     if (razorpayError) return Promise.resolve(false);
//     if (isKeyLoading || !razorpayKeyId) {
//       return new Promise((resolve) => {
//         const start = Date.now();
//         const interval = setInterval(() => {
//           if (Razorpay) { clearInterval(interval); resolve(true); }
//           else if (razorpayError || Date.now() - start > maxWaitMs) { clearInterval(interval); resolve(false); }
//         }, 200);
//       });
//     }
//     return Promise.resolve(false);
//   }

//   const onSubmit = async (data: AddressFormValues) => {
//     if (items.length === 0) {
//       toast("Cart is empty", { description: "Add items before checking out.", variant: "error" });
//       return;
//     }

//     if (selectedItems.length === 0) {
//       toast("No items selected", { description: "Select at least one item to checkout.", variant: "error" });
//       return;
//     }

//     if (keyError || (!isKeyLoading && !razorpayKeyId)) {
//       toast("Payment unavailable", { description: keyError || "Razorpay key not configured.", variant: "error" });
//       return;
//     }

//     const razorpayReady = await waitForRazorpay();
//     if (!razorpayReady) {
//       toast("Payment gateway unavailable", {
//         description: razorpayError || "Razorpay failed to load. Please refresh or try again later.",
//         variant: "error",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     const accessToken = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
//     const authHeaders: Record<string, string> = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

//     const checkoutHeaders: Record<string, string> = {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       ...authHeaders,
//     };

//     const verifyHeaders: Record<string, string> = {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       ...authHeaders,
//     };

//     try {
//       const checkoutResponse = await fetch(`${API_BASE_URL}/api/v1/checkout/buy-now`, {
//         method: "POST",
//         headers: checkoutHeaders,
//         body: JSON.stringify({
//           cartItems: selectedItems.map(createCartPayloadItem),
//           address: {
//             fullName: data.fullName,
//             mobileNo: data.mobileNo,
//             addressLine1: data.addressLine1,
//             addressLine2: data.addressLine2 || "",
//             city: data.city,
//             state: data.state,
//             country: data.country,
//             postalCode: data.postalCode,
//           },
//         }),
//       });

//       const checkoutPayload = await checkoutResponse.json().catch(() => null);

//       if (!checkoutResponse.ok) {
//         throw new Error(checkoutPayload?.message || checkoutPayload?.error || "Checkout failed. Please try again.");
//       }

//       const paymentResponse = await fetch("/api/razorpay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           currency: "INR",
//           receipt: `receipt_${Date.now()}`,
//           notes: {
//             customerName: data.fullName,
//             customerEmail: user?.email || "",
//           },
//         }),
//       });

//       const paymentOrder = await paymentResponse.json().catch(() => null);

//       if (!paymentResponse.ok) {
//         throw new Error(paymentOrder?.error || "Unable to create payment order. Please try again.");
//       }

//       const razorpayCheckout = new Razorpay({
//         key: razorpayKeyId!,
//         amount: paymentOrder.amount,
//         currency: paymentOrder.currency,
//         name: "Ratnagiri",
//         description: "Secure jewelry payment",
//         order_id: paymentOrder.id,
//         prefill: {
//           name: data.fullName,
//           email: user?.email || "",
//           contact: data.mobileNo,
//         },
//         theme: {
//           color: "#c9a84c",
//         },
//         handler: async (paymentResult: any) => {
//           try {
//             const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, {
//               method: "POST",
//               headers: verifyHeaders,
//               body: JSON.stringify({
//                 razorpayOrderId: paymentResult.razorpay_order_id,
//                 razorpayPaymentId: paymentResult.razorpay_payment_id,
//                 razorpaySignature: paymentResult.razorpay_signature,
//               }),
//             });

//             const verifyPayload = await verifyResponse.json().catch(() => null);

//             if (!verifyResponse.ok) {
//               throw new Error(verifyPayload?.message || verifyPayload?.error || "Payment verification failed.");
//             }

//             const serverOrderId =
//               verifyPayload?.orderId ||
//               verifyPayload?.data?.orderId ||
//               verifyPayload?.data?.id ||
//               checkoutPayload?.orderId ||
//               checkoutPayload?.data?.id ||
//               null;

//             clearCart();
//             const finalOrderId = serverOrderId ?? `local-${Date.now()}`;
//             router.push(`/order/success?orderId=${finalOrderId}`);
//           } catch (verifyError) {
//             toast("Verification failed", {
//               description: verifyError instanceof Error ? verifyError.message : "Payment succeeded but verification failed.",
//               variant: "error",
//             });
//             setIsSubmitting(false);
//           }
//         },
//         modal: {
//           ondismiss: () => {
//             setIsSubmitting(false);
//           },
//         },
//       });

//       razorpayCheckout.on("payment.failed", (failure: any) => {
//         toast("Payment failed", {
//           description: failure?.error?.description || "Please try again.",
//           variant: "error",
//         });
//         setIsSubmitting(false);
//       });

//       razorpayCheckout.open();
//     } catch (err) {
//       toast("Checkout failed", {
//         description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
//         variant: "error",
//       });
//       setIsSubmitting(false);
//     }
//   };

//   if (items.length === 0 && !isSubmitting) {
//     return (
//       <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <div className="text-center max-w-md mx-auto">
//             <h1 className="text-3xl font-serif text-[var(--color-foreground)] mb-4">Nothing to Checkout</h1>
//             <p className="text-[var(--color-cream-dark)]/70 mb-8">Your cart is empty. Add some beautiful pieces before checking out.</p>
//             <Button asChild size="lg" variant="default" className="px-8">
//               <Link href="/product">Explore Collection</Link>
//             </Button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="mb-10">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors mb-6 font-poppins"
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>
//           <p className="text-gold tracking-[0.2em] text-xs font-medium mb-3">Checkout</p>
//           <h1 className="text-fluid-h3 font-serif text-[var(--color-foreground)]">Complete Your Order</h1>
//           <p className="max-w-2xl text-sm text-gold-muted mt-2">
//             Enter your delivery address and complete your order with secure Razorpay checkout.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-10">
//           <div className="lg:col-span-2 space-y-6">
//             <section className="bg-[var(--color-surface-elevated)] rounded-sm p-6 md:p-8 border border-[var(--color-border-subtle)]">
//               <h2 className="text-fluid-h3 font-serif text-[var(--color-foreground)] mb-6">Delivery Details</h2>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-poppins" noValidate>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">Full name</label>
//                     <input
//                       {...register("fullName", { required: "Full name is required" })}
//                       aria-invalid={!!errors.fullName}
//                       className={errors.fullName ? inputErrCls : inputCls}
//                       placeholder="John Doe"
//                     />
//                     {errors.fullName && <span className="block text-xs text-red-400">{errors.fullName.message}</span>}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">Mobile Number</label>
//                     <input
//                       {...register("mobileNo", {
//                         required: "Mobile number is required",
//                         pattern: { value: /^\d+$/, message: "Mobile number must contain only digits" },
//                       })}
//                       type="tel"
//                       inputMode="numeric"
//                       aria-invalid={!!errors.mobileNo}
//                       className={errors.mobileNo ? inputErrCls : inputCls}
//                       placeholder="9876543210"
//                     />
//                     {errors.mobileNo && <span className="block text-xs text-red-400">{errors.mobileNo.message}</span>}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">Address Line 1</label>
//                   <input
//                     {...register("addressLine1", { required: "Address line 1 is required" })}
//                     aria-invalid={!!errors.addressLine1}
//                     className={errors.addressLine1 ? inputErrCls : inputCls}
//                     placeholder="123"
//                   />
//                   {errors.addressLine1 && <span className="block text-xs text-red-400">{errors.addressLine1.message}</span>}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm text-[var(--color-cream-dark)]/80">Address Line 2</label>
//                   <input
//                     {...register("addressLine2")}
//                     className={inputCls}
//                     placeholder="Apt 4B"
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">City</label>
//                     <input
//                       {...register("city", { required: "City is required" })}
//                       aria-invalid={!!errors.city}
//                       className={errors.city ? inputErrCls : inputCls}
//                       placeholder="Mumbai"
//                     />
//                     {errors.city && <span className="block text-xs text-red-400">{errors.city.message}</span>}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">State</label>
//                     <input
//                       {...register("state", { required: "State is required" })}
//                       aria-invalid={!!errors.state}
//                       className={errors.state ? inputErrCls : inputCls}
//                       placeholder="Maharashtra"
//                     />
//                     {errors.state && <span className="block text-xs text-red-400">{errors.state.message}</span>}
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">Country</label>
//                     <input
//                       {...register("country", { required: "Country is required" })}
//                       aria-invalid={!!errors.country}
//                       className={errors.country ? inputErrCls : inputCls}
//                       placeholder="India"
//                     />
//                     {errors.country && <span className="block text-xs text-red-400">{errors.country.message}</span>}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm text-[var(--color-cream-dark)]/80 font-poppins">Postal Code</label>
//                     <input
//                       {...register("postalCode", { required: "Postal code is required" })}
//                       aria-invalid={!!errors.postalCode}
//                       className={errors.postalCode ? inputErrCls : inputCls}
//                       placeholder="400001"
//                     />
//                     {errors.postalCode && <span className="block text-xs text-red-400">{errors.postalCode.message}</span>}
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     size="lg"
//                     variant="default"
//                     className="w-full md:w-auto"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Processing..." : "Proceed to Payment"}
//                   </Button>
//                 </div>
//               </form>
//             </section>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-[var(--color-surface-elevated)] rounded-sm p-6 lg:sticky lg:top-24 border border-[var(--color-border-subtle)]">
//               <h2 className="text-fluid-h3 font-serif text-[var(--color-foreground)] mb-6">Items to Pay</h2>

//               <div className="space-y-4 mb-6">
//                 {items.map((item) => {
//                   return (
//                     <div
//                       key={item.id}
//                       className="flex items-start gap-3 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
//                     >
//                       <div className="w-14 h-16 rounded-sm overflow-hidden bg-[var(--color-surface)] shrink-0 relative border border-[var(--color-border-subtle)]">
//                         {item.image ? (
//                           <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-[var(--color-cream-dark)]/40 text-[10px]">
//                             No Image
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-medium text-[var(--color-foreground)] line-clamp-2">{item.title}</p>
//                         <p className="text-xs text-gold-muted">Qty: {item.quantity}</p>
//                         <p className="mt-1 text-xs text-gold">{formatPrice(item.price * item.quantity)}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--color-cream-dark)]/70">Selected subtotal</span>
//                   <span className="text-[var(--color-foreground)]">{formatPrice(subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--color-cream-dark)]/70">Shipping</span>
//                   <span className={freeShipping ? "text-emerald-500" : "text-[var(--color-foreground)]"}>
//                     {freeShipping ? "Free" : formatPrice(shippingCost)}
//                   </span>
//                 </div>
//                 {!freeShipping && selectedItems.length > 0 && (
//                   <p className="text-xs text-[var(--color-gold-muted)]">Add {formatPrice(25000 - subtotal)} more for free shipping</p>
//                 )}
//               </div>

//               <div className="flex justify-between text-base font-semibold mt-6 mb-4">
//                 <span className="text-[var(--color-foreground)]">Total</span>
//                 <span className="text-[var(--color-foreground)]">{formatPrice(total)}</span>
//               </div>

//               <p className="text-xs text-gold-muted text-center mt-4">
//                 {razorpayError
//                   ? `Razorpay failed to load: ${razorpayError}`
//                   : razorpayIsLoading
//                   ? "Loading Razorpay checkout..."
//                   : "Payments are processed securely through Razorpay."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "react-razorpay";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "@/store/toast";

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

type RazorpayPaymentResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailure = {
  error?: {
    description?: string;
    code?: string;
    reason?: string;
    source?: string;
    step?: string;
  };
};

type CheckoutPayload = {
  orderId?: string;
  data?: {
    orderId?: string;
    id?: string;
  };
};

type PaymentOrderPayload = {
  id: string;
  amount: number;
  currency: 'INR';
};

const inputCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none focus:border-[var(--color-gold)] border-[var(--color-border-subtle)]";

const inputErrCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none border-red-400 focus:border-red-500";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useUserStore((state) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [isKeyLoading, setIsKeyLoading] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);

  const {
    Razorpay,
    isLoading: razorpayIsLoading,
    error: razorpayError,
  } = useRazorpay();

  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  /**
   * Load Razorpay public key from our server.
   *
   * The secret Razorpay key must NEVER be exposed here.
   * Only the public key_id should be returned by /api/razorpay.
   */
  useEffect(() => {
    let isMounted = true;

    async function fetchKey() {
      setIsKeyLoading(true);
      setKeyError(null);

      try {
        const response = await fetch("/api/razorpay", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const payload = (await response.json().catch(() => null)) as
          | { key_id?: string; error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            payload?.error || "Unable to load Razorpay public key.",
          );
        }

        if (!payload?.key_id) {
          throw new Error("Razorpay public key is not configured.");
        }

        if (isMounted) {
          setRazorpayKeyId(payload.key_id);
        }
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load Razorpay public key.";

        setKeyError(message);
      } finally {
        if (isMounted) {
          setIsKeyLoading(false);
        }
      }
    }

    fetchKey();

    return () => {
      isMounted = false;

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  const selectedItems = useMemo(() => items, [items]);

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const freeShipping = subtotal >= 25000;

  const shippingCost = freeShipping
    ? 0
    : selectedItems.length > 0
      ? 150
      : 0;

  const total = subtotal + shippingCost;

  /**
   * Convert cart item IDs into the format expected by the backend.
   */
  const createCartPayloadItem = (
    item: (typeof items)[number],
  ): {
    productId: number | string;
    quantity: number;
  } => {
    const rawId = item.productId || item.id;

    const numericId = Number(rawId);

    const productId =
      Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

    return {
      productId,
      quantity: item.quantity,
    };
  };

  /**
   * Wait until the Razorpay browser SDK is ready.
   *
   * This prevents a race condition where the public key is loaded
   * before the Razorpay constructor becomes available.
   */
  function waitForRazorpay(maxWaitMs = 12000): Promise<boolean> {
    if (Razorpay) {
      return Promise.resolve(true);
    }

    if (razorpayError) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      const start = Date.now();

      const interval = setInterval(() => {
        if (Razorpay) {
          clearInterval(interval);
          resolve(true);
          return;
        }

        if (razorpayError || Date.now() - start > maxWaitMs) {
          clearInterval(interval);
          resolve(false);
        }
      }, 200);
    });
  }

  const onSubmit = async (data: AddressFormValues) => {
    if (items.length === 0) {
      toast("Cart is empty", {
        description: "Add items before checking out.",
        variant: "error",
      });

      return;
    }

    if (selectedItems.length === 0) {
      toast("No items selected", {
        description: "Select at least one item to checkout.",
        variant: "error",
      });

      return;
    }

    if (keyError || (!isKeyLoading && !razorpayKeyId)) {
      toast("Payment unavailable", {
        description: keyError || "Razorpay key not configured.",
        variant: "error",
      });

      return;
    }

    const razorpayReady = await waitForRazorpay();

    if (!razorpayReady) {
      toast("Payment gateway unavailable", {
        description:
          razorpayError ||
          "Razorpay failed to load. Please refresh or try again later.",
        variant: "error",
      });

      return;
    }

    if (!razorpayKeyId || !Razorpay) {
      toast("Payment unavailable", {
        description: "Razorpay is not ready. Please try again.",
        variant: "error",
      });

      return;
    }

    setIsSubmitting(true);

    /**
     * Current application authentication flow.
     *
     * If your application has moved the access token entirely into
     * memory, replace this with your auth client's in-memory token getter.
     */
    const accessToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    const authHeaders: Record<string, string> = accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {};

    const checkoutHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    };

    const verifyHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    };

    try {
      /**
       * 1. Create the application order.
       */
      const checkoutResponse = await fetch(
        `${API_BASE_URL}/api/v1/checkout/buy-now`,
        {
          method: "POST",
          headers: checkoutHeaders,
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
        },
      );

      const checkoutPayload = (await checkoutResponse
        .json()
        .catch(() => null)) as CheckoutPayload | null;

      if (!checkoutResponse.ok) {
        throw new Error(
          checkoutPayload?.data?.orderId ||
            checkoutPayload?.orderId ||
            "Checkout failed. Please try again.",
        );
      }

      /**
       * 2. Create Razorpay order.
       *
       * IMPORTANT:
       * Do not put Razorpay secret credentials here.
       *
       * Also don't send `notes` as an object here because the
       * react-razorpay frontend type expects a string.
       *
       * If you need Razorpay notes, create them server-side in
       * your /api/razorpay route using the Razorpay SDK.
       */
      const paymentResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const paymentOrder = (await paymentResponse
        .json()
        .catch(() => null)) as PaymentOrderPayload | { error?: string } | null;

      if (!paymentResponse.ok) {
        const message =
          paymentOrder &&
          "error" in paymentOrder &&
          typeof paymentOrder.error === "string"
            ? paymentOrder.error
            : "Unable to create payment order. Please try again.";

        throw new Error(message);
      }

      if (
        !paymentOrder ||
        !("id" in paymentOrder) ||
        !paymentOrder.id ||
        typeof paymentOrder.amount !== "number" ||
        !paymentOrder.currency
      ) {
        throw new Error("Invalid Razorpay payment order received.");
      }

      /**
       * 3. Open Razorpay Checkout.
       *
       * IMPORTANT:
       *
       * Do NOT add:
       *
       * config.display.preferences
       * retry.max_count
       * notes: {}
       *
       * Those are not compatible with the react-razorpay types
       * used by your project.
       */
      const razorpayCheckout = new Razorpay({
        key: razorpayKeyId,

        amount: paymentOrder.amount,

        currency: paymentOrder.currency,

        name: "Ratna Treaseure",

        description: "Secure  payment",

        order_id: paymentOrder.id,

        prefill: {
          name: data.fullName,
          email: user?.email || "",
          contact: data.mobileNo,
        },

        theme: {
          color: "#c9a84c",
        },

        handler: async (paymentResult: RazorpayPaymentResult) => {
          try {
            /**
             * 4. Verify payment on the backend.
             *
             * Never verify the Razorpay signature in the browser.
             * The backend must perform signature verification using
             * the Razorpay secret.
             */
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/v1/payments/verify`,
              {
                method: "POST",
                headers: verifyHeaders,
                body: JSON.stringify({
                  razorpayOrderId: paymentResult.razorpay_order_id,
                  razorpayPaymentId: paymentResult.razorpay_payment_id,
                  razorpaySignature: paymentResult.razorpay_signature,
                }),
              },
            );

            const verifyPayload = (await verifyResponse
              .json()
              .catch(() => null)) as CheckoutPayload | null;

            if (!verifyResponse.ok) {
              throw new Error(
                verifyPayload?.data?.orderId ||
                  verifyPayload?.orderId ||
                  "Payment verification failed.",
              );
            }

            /**
             * Try to obtain the actual application order ID from
             * the verification response first, then checkout response.
             */
            const serverOrderId =
              verifyPayload?.orderId ||
              verifyPayload?.data?.orderId ||
              verifyPayload?.data?.id ||
              checkoutPayload?.orderId ||
              checkoutPayload?.data?.orderId ||
              checkoutPayload?.data?.id ||
              null;

            /**
             * Payment has been verified successfully.
             */
            clearCart();

            const finalOrderId =
              serverOrderId || `local-${Date.now()}`;

            router.push(
              `/order/success?orderId=${encodeURIComponent(finalOrderId)}`,
            );
          } catch (verifyError) {
            toast("Verification failed", {
              description:
                verifyError instanceof Error
                  ? verifyError.message
                  : "Payment succeeded but verification failed.",
              variant: "error",
            });

            setIsSubmitting(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },

          confirm_close: true,
        },
      });

      /**
       * Handle Razorpay payment failures.
       */
      razorpayCheckout.on(
        "payment.failed",
        (failure: RazorpayPaymentFailure) => {
          toast("Payment failed", {
            description:
              failure.error?.description || "Please try again.",
            variant: "error",
          });

          setIsSubmitting(false);
        },
      );

      /**
       * 5. Open Razorpay modal.
       */
      razorpayCheckout.open();
    } catch (error) {
      toast("Checkout failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "error",
      });

      setIsSubmitting(false);
    }
  };

  /**
   * Empty cart state.
   */
  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 font-serif text-3xl text-[var(--color-foreground)]">
              Nothing to Checkout
            </h1>

            <p className="mb-8 text-[var(--color-cream-dark)]/70">
              Your cart is empty. Add some beautiful pieces before checking
              out.
            </p>

            <Button asChild size="lg" variant="default" className="px-8">
              <Link href="/product">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 font-poppins text-sm text-[var(--color-cream-dark)] transition-colors hover:text-[var(--color-gold)]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-gold">
            Checkout
          </p>

          <h1 className="font-serif text-fluid-h3 text-[var(--color-foreground)]">
            Complete Your Order
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gold-muted">
            Enter your delivery address and complete your order with secure
            Razorpay checkout.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Delivery details */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 md:p-8">
              <h2 className="mb-6 font-serif text-fluid-h3 text-[var(--color-foreground)]">
                Delivery Details
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 font-poppins"
                noValidate
              >
                {/* Full name + mobile */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      Full name
                    </label>

                    <input
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      aria-invalid={!!errors.fullName}
                      className={
                        errors.fullName ? inputErrCls : inputCls
                      }
                      placeholder="John Doe"
                    />

                    {errors.fullName && (
                      <span className="block text-xs text-red-400">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      Mobile Number
                    </label>

                    <input
                      {...register("mobileNo", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^\d+$/,
                          message:
                            "Mobile number must contain only digits",
                        },
                      })}
                      type="tel"
                      inputMode="numeric"
                      aria-invalid={!!errors.mobileNo}
                      className={
                        errors.mobileNo ? inputErrCls : inputCls
                      }
                      placeholder="9876543210"
                    />

                    {errors.mobileNo && (
                      <span className="block text-xs text-red-400">
                        {errors.mobileNo.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Address line 1 */}
                <div className="space-y-2">
                  <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                    Address Line 1
                  </label>

                  <input
                    {...register("addressLine1", {
                      required: "Address line 1 is required",
                    })}
                    aria-invalid={!!errors.addressLine1}
                    className={
                      errors.addressLine1 ? inputErrCls : inputCls
                    }
                    placeholder="123"
                  />

                  {errors.addressLine1 && (
                    <span className="block text-xs text-red-400">
                      {errors.addressLine1.message}
                    </span>
                  )}
                </div>

                {/* Address line 2 */}
                <div className="space-y-2">
                  <label className="block text-sm text-[var(--color-cream-dark)]/80">
                    Address Line 2
                  </label>

                  <input
                    {...register("addressLine2")}
                    className={inputCls}
                    placeholder="Apt 4B"
                  />
                </div>

                {/* City + state */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      City
                    </label>

                    <input
                      {...register("city", {
                        required: "City is required",
                      })}
                      aria-invalid={!!errors.city}
                      className={errors.city ? inputErrCls : inputCls}
                      placeholder="Mumbai"
                    />

                    {errors.city && (
                      <span className="block text-xs text-red-400">
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      State
                    </label>

                    <input
                      {...register("state", {
                        required: "State is required",
                      })}
                      aria-invalid={!!errors.state}
                      className={errors.state ? inputErrCls : inputCls}
                      placeholder="Maharashtra"
                    />

                    {errors.state && (
                      <span className="block text-xs text-red-400">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Country + postal code */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      Country
                    </label>

                    <input
                      {...register("country", {
                        required: "Country is required",
                      })}
                      aria-invalid={!!errors.country}
                      className={
                        errors.country ? inputErrCls : inputCls
                      }
                      placeholder="India"
                    />

                    {errors.country && (
                      <span className="block text-xs text-red-400">
                        {errors.country.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
                      Postal Code
                    </label>

                    <input
                      {...register("postalCode", {
                        required: "Postal code is required",
                      })}
                      aria-invalid={!!errors.postalCode}
                      className={
                        errors.postalCode ? inputErrCls : inputCls
                      }
                      placeholder="400001"
                    />

                    {errors.postalCode && (
                      <span className="block text-xs text-red-400">
                        {errors.postalCode.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    className="w-full md:w-auto"
                    disabled={
                      isSubmitting ||
                      isKeyLoading ||
                      !razorpayKeyId ||
                      razorpayIsLoading
                    }
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isKeyLoading || razorpayIsLoading
                        ? "Loading Payment..."
                        : "Proceed to Payment"}
                  </Button>
                </div>
              </form>
            </section>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 lg:sticky lg:top-24">
              <h2 className="mb-6 font-serif text-fluid-h3 text-[var(--color-foreground)]">
                Items to Pay
              </h2>

              <div className="mb-6 space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
                  >
                    {/* Product image */}
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-cream-dark)]/40">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product information */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-[var(--color-foreground)]">
                        {item.title}
                      </p>

                      <p className="text-xs text-gold-muted">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-xs text-gold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-2 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-cream-dark)]/70">
                    Selected subtotal
                  </span>

                  <span className="text-[var(--color-foreground)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--color-cream-dark)]/70">
                    Shipping
                  </span>

                  <span
                    className={
                      freeShipping
                        ? "text-emerald-500"
                        : "text-[var(--color-foreground)]"
                    }
                  >
                    {freeShipping
                      ? "Free"
                      : formatPrice(shippingCost)}
                  </span>
                </div>

                {!freeShipping && selectedItems.length > 0 && (
                  <p className="text-xs text-[var(--color-gold-muted)]">
                    Add {formatPrice(25000 - subtotal)} more for free
                    shipping
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="mb-4 mt-6 flex justify-between text-base font-semibold">
                <span className="text-[var(--color-foreground)]">
                  Total
                </span>

                <span className="text-[var(--color-foreground)]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Razorpay status */}
              <p className="mt-4 text-center text-xs text-gold-muted">
                {keyError
                  ? `Payment configuration error: ${keyError}`
                  : razorpayError
                    ? `Razorpay failed to load: ${razorpayError}`
                    : razorpayIsLoading || isKeyLoading
                      ? "Loading secure payment checkout..."
                      : "Payments are processed securely through Razorpay."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}