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
// import { useRazorpay } from "@/hooks/use-razorpay-safe";
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

// type RazorpayPaymentResult = {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// };

// type RazorpayPaymentFailure = {
//   error?: {
//     description?: string;
//     code?: string;
//     reason?: string;
//     source?: string;
//     step?: string;
//   };
// };

// type RazorpayCheckoutInstance = {
//   close?: () => void;
// };

// type CheckoutPayload = {
//   orderId?: string;
//   data?: {
//     orderId?: string;
//     id?: string;
//   };
// };

// type PaymentOrderPayload = {
//   id: string;
//   amount: number;
//   currency: 'INR';
// };

// const inputCls =
//   "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none focus:border-[var(--color-gold)] border-[var(--color-border-subtle)]";

// const inputErrCls =
//   "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none border-red-400 focus:border-red-500";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const items = useCartStore((state) => state.items);
//   const removeSelectedItems = useCartStore(
//     (state) => state.removeSelectedItems,
//   );
//   const user = useUserStore((state) => state.user);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
//   const [isKeyLoading, setIsKeyLoading] = useState(true);
//   const [keyError, setKeyError] = useState<string | null>(null);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // Fix for useRazorpay isLoading bug: when script is already loaded, isLoading should be false
//   const { Razorpay, isLoading: razorpayIsLoading, error: razorpayError } = useRazorpay();
//   const [razorpayLoading, setRazorpayLoading] = useState(false);

//   useEffect(() => {
//     if (!razorpayIsLoading) {
//       setRazorpayLoading(false);
//     }
//   }, [razorpayIsLoading]);

//   const paymentCheckoutRef = useRef<RazorpayCheckoutInstance | null>(null);

//   function finishPaymentAttempt() {
//     paymentCheckoutRef.current = null;
//     setIsPaymentModalOpen(false);
//     setIsSubmitting(false);
//   }

//   function cancelPaymentAttempt() {
//     paymentCheckoutRef.current?.close?.();
//     finishPaymentAttempt();
//   }

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

//   /**
//    * Load Razorpay public key from our server.
//    *
//    * The secret Razorpay key must NEVER be exposed here.
//    * Only the public key_id should be returned by /api/razorpay.
//    */
//   useEffect(() => {
//     let isMounted = true;

//     async function fetchKey() {
//       setIsKeyLoading(true);
//       setKeyError(null);

//       try {
//         const response = await fetch("/api/razorpay", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//         });

//         const payload = (await response.json().catch(() => null)) as
//           | { key_id?: string; error?: string }
//           | null;

//         if (!response.ok) {
//           throw new Error(
//             payload?.error || "Unable to load Razorpay public key.",
//           );
//         }

//         if (!payload?.key_id) {
//           throw new Error("Razorpay public key is not configured.");
//         }

//         if (isMounted) {
//           setRazorpayKeyId(payload.key_id);
//         }
//       } catch (fetchError) {
//         if (!isMounted) {
//           return;
//         }

//         const fallbackKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

//         if (fallbackKey) {
//           if (isMounted) {
//             setRazorpayKeyId(fallbackKey);
//           }
//         } else {
//           const message =
//             fetchError instanceof Error
//               ? fetchError.message
//               : "Unable to load Razorpay public key.";

//           setKeyError(message);
//         }
//       } finally {
//         if (isMounted) {
//           setIsKeyLoading(false);
//         }
//       }
//     }

//     fetchKey();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const freeShipping = subtotal >= 25000;

//   const shippingCost = freeShipping
//     ? 0
//     : items.length > 0
//       ? 150
//       : 0;

//   const total = subtotal + shippingCost;

//   /**
//    * Convert cart item IDs into the format expected by the backend.
//    */
//   const createCartPayloadItem = (
//     item: (typeof items)[number],
//   ): {
//     productId: number | string;
//     quantity: number;
//   } => {
//     const rawId = item.productId || item.id;

//     const numericId = Number(rawId);

//     const productId =
//       Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

//     return {
//       productId,
//       quantity: item.quantity,
//     };
//   };

//   /**
//    * Wait until the Razorpay browser SDK is ready.
//    *
//    * This prevents a race condition where the public key is loaded
//    * before the Razorpay constructor becomes available.
//    */
//   function waitForRazorpay(maxWaitMs = 12000): Promise<boolean> {
//     // Capture current state for the polling loop
//     const currentError = razorpayError;
//     const currentRazorpay = Razorpay;

//     if (currentRazorpay) {
//       return Promise.resolve(true);
//     }

//     if (currentError) {
//       return Promise.resolve(false);
//     }

//     return new Promise((resolve) => {
//       const start = Date.now();
//       const interval = setInterval(() => {
//         // Check if Razorpay is now available
//         if (typeof window !== 'undefined' && (window as any).Razorpay) {
//           clearInterval(interval);
//           resolve(true);
//           return;
//         }

//         // Check if we have an error now or timed out
//         if (razorpayError || Date.now() - start > maxWaitMs) {
//           clearInterval(interval);
//           resolve(false);
//         }
//       }, 200);

//       // Additional timeout safety net
//       setTimeout(() => {
//         clearInterval(interval);
//         resolve(typeof window !== 'undefined' && !!(window as any).Razorpay);
//       }, maxWaitMs);
//     });
//   }

//   const onSubmit = async (data: AddressFormValues) => {
//     if (items.length === 0) {
//       toast("Cart is empty", {
//         description: "Add items before checking out.",
//         variant: "error",
//       });

//       return;
//     }

//     if (keyError || (!isKeyLoading && !razorpayKeyId)) {
//       toast("Payment unavailable", {
//         description: keyError || "Razorpay key not configured.",
//         variant: "error",
//       });

//       return;
//     }

//     const razorpayReady = await waitForRazorpay();

//     if (!razorpayReady) {
//       toast("Payment gateway unavailable", {
//         description:
//           razorpayError ||
//           "Razorpay failed to load. Please refresh or try again later.",
//         variant: "error",
//       });

//       return;
//     }

//     if (!razorpayKeyId || !Razorpay) {
//       toast("Payment unavailable", {
//         description: "Razorpay is not ready. Please try again.",
//         variant: "error",
//       });

//       return;
//     }

//     // Keep the exact cart entries that this checkout was created for. The
//     // cart can change while the Razorpay window is open, so only these items
//     // should be removed after the server confirms payment.
//     const purchasedItemIds = items.map((item) => item.id);

//     setIsSubmitting(true);

//     /**
//      * Current application authentication flow.
//      *
//      * If your application has moved the access token entirely into
//      * memory, replace this with your auth client's in-memory token getter.
//      */
//     const accessToken =
//       typeof window !== "undefined"
//         ? window.localStorage.getItem("access_token")
//         : null;

//     const authHeaders: Record<string, string> = accessToken
//       ? {
//           Authorization: `Bearer ${accessToken}`,
//         }
//       : {};

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

// try {
//         /**
//          * 1. Create the application order.
//          */
//         const controller1 = new AbortController();
//         const timeout1 = setTimeout(() => controller1.abort(), 15000); // 15s timeout

//         const checkoutResponse = await fetch(
//           `${API_BASE_URL}/api/v1/checkout/buy-now`,
//           {
//             method: "POST",
//             headers: checkoutHeaders,
//             body: JSON.stringify({
//               cartItems: items.map(createCartPayloadItem),

//               address: {
//                 fullName: data.fullName,
//                 mobileNo: data.mobileNo,
//                 addressLine1: data.addressLine1,
//                 addressLine2: data.addressLine2 || "",
//                 city: data.city,
//                 state: data.state,
//                 country: data.country,
//                 postalCode: data.postalCode,
//               },
//             }),
//             signal: controller1.signal,
//           },
//         );

//         clearTimeout(timeout1);

//         const checkoutPayload = (await checkoutResponse
//           .json()
//           .catch(() => null)) as CheckoutPayload | null;

//         if (!checkoutResponse.ok) {
//           throw new Error(
//             checkoutPayload?.data?.orderId ||
//               checkoutPayload?.orderId ||
//               "Checkout failed. Please try again.",
//           );
//         }

//         /**
//          * 2. Create Razorpay order.
//          *
//          * IMPORTANT:
//          * Do not put Razorpay secret credentials here.
//          *
//          * Also don't send `notes` as an object here because the
//          * react-razorpay frontend type expects a string.
//          *
//          * If you need Razorpay notes, create them server-side in
//          * your /api/razorpay route using the Razorpay SDK.
//          */
//         const controller2 = new AbortController();
//         const timeout2 = setTimeout(() => controller2.abort(), 15000); // 15s timeout

//         const paymentResponse = await fetch("/api/razorpay", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             amount: Math.round(total * 100),
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//           }),
//           signal: controller2.signal,
//         });

//         clearTimeout(timeout2);

//         const paymentOrder = (await paymentResponse
//           .json()
//           .catch(() => null)) as PaymentOrderPayload | { error?: string } | null;

//         if (!paymentResponse.ok) {
//           const message =
//             paymentOrder &&
//             "error" in paymentOrder &&
//             typeof paymentOrder.error === "string"
//               ? paymentOrder.error
//               : "Unable to create payment order. Please try again.";

//           throw new Error(message);
//         }

//         if (
//           !paymentOrder ||
//           !("id" in paymentOrder) ||
//           !paymentOrder.id ||
//           typeof paymentOrder.amount !== "number" ||
//           !paymentOrder.currency
//         ) {
//           throw new Error("Invalid Razorpay payment order received.");
//         }

//         /**
//          * 3. Open Razorpay Checkout.
//          *
//          * IMPORTANT:
//          *
//          * Do NOT add:
//          *
//          * config.display.preferences
//          * retry.max_count
//          * notes: {}
//          *
//          * Those are not compatible with the react-razorpay types
//          * used by your project.
//          */
//         const razorpayCheckout = new Razorpay({
//           key: razorpayKeyId,

//           amount: paymentOrder.amount,

//           currency: paymentOrder.currency,

//           name: "Ratna Treaseure",

//           description: "Secure  payment",

//           order_id: paymentOrder.id,

//           prefill: {
//             name: data.fullName,
//             email: user?.email || "",
//             contact: data.mobileNo,
//           },

//           theme: {
//             color: "#c9a84c",
//           },

//           // This checkout uses the handler below to receive the completed
//           // payment IDs. Do not switch to a callback/redirect flow here.
//           redirect: false,

//           handler: async (paymentResult: RazorpayPaymentResult) => {
//             // The Razorpay window has completed. Keep the submit state active
//             // while the backend verifies the successful payment.
//             paymentCheckoutRef.current = null;
//             setIsPaymentModalOpen(false);

//             try {
//               /**
//                * 4. Verify payment on the backend.
//                *
//                * Never verify the Razorpay signature in the browser.
//                * The backend must perform signature verification using
//                * the Razorpay secret.
//                */
//               // These values are supplied only after Razorpay Checkout succeeds.
//               // Keep the gateway order ID tied to the order we opened, and never
//               // substitute the application's checkout/order ID for it.
//               const razorpayOrderId =
//                 paymentResult.razorpay_order_id || paymentOrder.id;
//               const razorpayPaymentId = paymentResult.razorpay_payment_id;

//               if (!razorpayOrderId || !razorpayPaymentId) {
//                 throw new Error("Razorpay did not return the payment details needed for verification.");
//               }

//               const controller3 = new AbortController();
//               const timeout3 = setTimeout(() => controller3.abort(), 30000); // 30s timeout for verification

//               const verifyResponse = await fetch(
//                 `${API_BASE_URL}/api/v1/payments/verify`,
//                 {
//                   method: "POST",
//                   headers: verifyHeaders,
//                   body: JSON.stringify({
//                     razorpayOrderId,
//                     razorpayPaymentId,
//                     razorpaySignature: paymentResult.razorpay_signature,
//                   }),
//                   signal: controller3.signal,
//                 },
//               );

//               clearTimeout(timeout3);

//               const verifyPayload = (await verifyResponse
//                 .json()
//                 .catch(() => null)) as CheckoutPayload | null;

//               if (!verifyResponse.ok) {
//                 throw new Error(
//                   verifyPayload?.data?.orderId ||
//                     verifyPayload?.orderId ||
//                     "Payment verification failed.",
//                 );
//               }

//               /**
//                * Try to obtain the actual application order ID from
//                * the verification response first, then checkout response.
//                */
//               const serverOrderId =
//                 verifyPayload?.orderId ||
//                 verifyPayload?.data?.orderId ||
//                 verifyPayload?.data?.id ||
//                 checkoutPayload?.orderId ||
//                 checkoutPayload?.data?.orderId ||
//                 checkoutPayload?.data?.id ||
//                 null;

//               /**
//                * Payment has been verified successfully.
//                */
//               removeSelectedItems(purchasedItemIds);

//               toast("Payment successful", {
//                 description: "Your payment has been verified and your order is confirmed.",
//                 variant: "success",
//               });

//               finishPaymentAttempt();

//               const finalOrderId =
//                 serverOrderId || `local-${Date.now()}`;

//               router.push(
//                 `/order/success?orderId=${encodeURIComponent(finalOrderId)}`,
//               );
//             } catch (verifyError) {
//               toast("Verification failed", {
//                 description:
//                   verifyError instanceof Error
//                     ? verifyError.message
//                     : "Payment succeeded but verification failed.",
//                 variant: "error",
//               });

//               finishPaymentAttempt();
//             }
//           },

//           modal: {
//             ondismiss: () => {
//               finishPaymentAttempt();
//             },

//             confirm_close: true,
//           },
//         });

//         /**
//          * Handle Razorpay payment failures.
//          */
//         razorpayCheckout.on(
//           "payment.failed",
//           (failure: RazorpayPaymentFailure) => {
//             toast("Payment failed", {
//               description:
//                 failure.error?.description || "Please try again.",
//               variant: "error",
//             });

//             finishPaymentAttempt();
//           },
//         );

//         /**
//          * 5. Open Razorpay modal.
//          */
//         paymentCheckoutRef.current = razorpayCheckout as unknown as RazorpayCheckoutInstance;
//         setIsPaymentModalOpen(true);
//         razorpayCheckout.open();
//       } catch (error) {
//         // Clear any active timeouts on error
//         // Note: We don't have references to the timeouts here, but they will fire and abort
//         toast("Checkout failed", {
//           description:
//             error instanceof Error
//               ? error.message
//               : "Something went wrong. Please try again.",
//           variant: "error",
//         });

//         finishPaymentAttempt();
//       }
//   };

//   /**
//    * Empty cart state.
//    */
//   if (items.length === 0 && !isSubmitting) {
//     return (
//       <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
//         <div className="mx-auto max-w-7xl px-6 py-20">
//           <div className="mx-auto max-w-md text-center">
//             <h1 className="mb-4 font-serif text-3xl text-[var(--color-foreground)]">
//               Nothing to Checkout
//             </h1>

//             <p className="mb-8 text-[var(--color-cream-dark)]/70">
//               Your cart is empty. Add some beautiful pieces before checking
//               out.
//             </p>

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
//       <div className="mx-auto max-w-7xl px-6 py-12">
//         {/* Header */}
//         <div className="mb-10">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="mb-6 flex items-center gap-2 font-poppins text-sm text-[var(--color-cream-dark)] transition-colors hover:text-[var(--color-gold)]"
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>

//           <p className="mb-3 text-xs font-medium tracking-[0.2em] text-gold">
//             Checkout
//           </p>

//           <h1 className="font-serif text-fluid-h3 text-[var(--color-foreground)]">
//             Complete Your Order
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm text-gold-muted">
//             Enter your delivery address and complete your order with secure
//             Razorpay checkout.
//           </p>
//         </div>

//         <div className="grid gap-10 lg:grid-cols-3">
//           {/* Delivery details */}
//           <div className="space-y-6 lg:col-span-2">
//             <section className="rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 md:p-8">
//               <h2 className="mb-6 font-serif text-fluid-h3 text-[var(--color-foreground)]">
//                 Delivery Details
//               </h2>

//               <form
//                 onSubmit={handleSubmit(onSubmit)}
//                 className="space-y-5 font-poppins"
//                 noValidate
//               >
//                 {/* Full name + mobile */}
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       Full name
//                     </label>

//                     <input
//                       {...register("fullName", {
//                         required: "Full name is required",
//                       })}
//                       aria-invalid={!!errors.fullName}
//                       className={
//                         errors.fullName ? inputErrCls : inputCls
//                       }
//                       placeholder="John Doe"
//                     />

//                     {errors.fullName && (
//                       <span className="block text-xs text-red-400">
//                         {errors.fullName.message}
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       Mobile Number
//                     </label>

//                     <input
//                       {...register("mobileNo", {
//                         required: "Mobile number is required",
//                         pattern: {
//                           value: /^\d+$/,
//                           message:
//                             "Mobile number must contain only digits",
//                         },
//                       })}
//                       type="tel"
//                       inputMode="numeric"
//                       aria-invalid={!!errors.mobileNo}
//                       className={
//                         errors.mobileNo ? inputErrCls : inputCls
//                       }
//                       placeholder="9876543210"
//                     />

//                     {errors.mobileNo && (
//                       <span className="block text-xs text-red-400">
//                         {errors.mobileNo.message}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Address line 1 */}
//                 <div className="space-y-2">
//                   <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                     Address Line 1
//                   </label>

//                   <input
//                     {...register("addressLine1", {
//                       required: "Address line 1 is required",
//                     })}
//                     aria-invalid={!!errors.addressLine1}
//                     className={
//                       errors.addressLine1 ? inputErrCls : inputCls
//                     }
//                     placeholder="123"
//                   />

//                   {errors.addressLine1 && (
//                     <span className="block text-xs text-red-400">
//                       {errors.addressLine1.message}
//                     </span>
//                   )}
//                 </div>

//                 {/* Address line 2 */}
//                 <div className="space-y-2">
//                   <label className="block text-sm text-[var(--color-cream-dark)]/80">
//                     Address Line 2
//                   </label>

//                   <input
//                     {...register("addressLine2")}
//                     className={inputCls}
//                     placeholder="Apt 4B"
//                   />
//                 </div>

//                 {/* City + state */}
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       City
//                     </label>

//                     <input
//                       {...register("city", {
//                         required: "City is required",
//                       })}
//                       aria-invalid={!!errors.city}
//                       className={errors.city ? inputErrCls : inputCls}
//                       placeholder="Mumbai"
//                     />

//                     {errors.city && (
//                       <span className="block text-xs text-red-400">
//                         {errors.city.message}
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       State
//                     </label>

//                     <input
//                       {...register("state", {
//                         required: "State is required",
//                       })}
//                       aria-invalid={!!errors.state}
//                       className={errors.state ? inputErrCls : inputCls}
//                       placeholder="Maharashtra"
//                     />

//                     {errors.state && (
//                       <span className="block text-xs text-red-400">
//                         {errors.state.message}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Country + postal code */}
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       Country
//                     </label>

//                     <input
//                       {...register("country", {
//                         required: "Country is required",
//                       })}
//                       aria-invalid={!!errors.country}
//                       className={
//                         errors.country ? inputErrCls : inputCls
//                       }
//                       placeholder="India"
//                     />

//                     {errors.country && (
//                       <span className="block text-xs text-red-400">
//                         {errors.country.message}
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
//                       Postal Code
//                     </label>

//                     <input
//                       {...register("postalCode", {
//                         required: "Postal code is required",
//                       })}
//                       aria-invalid={!!errors.postalCode}
//                       className={
//                         errors.postalCode ? inputErrCls : inputCls
//                       }
//                       placeholder="400001"
//                     />

//                     {errors.postalCode && (
//                       <span className="block text-xs text-red-400">
//                         {errors.postalCode.message}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Submit */}
//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     size="lg"
//                     variant="default"
//                     className="w-full md:w-auto"
//                     disabled={
//                       isSubmitting ||
//                       isKeyLoading ||
//                       !razorpayKeyId ||
//                       razorpayLoading
//                     }
//                   >
//                     {isSubmitting
//                       ? "Processing..."
//                       : "Proceed to Payment"}
//                   </Button>
//                   {isPaymentModalOpen && (
//                     <button
//                       type="button"
//                       onClick={cancelPaymentAttempt}
//                       className="mt-3 block text-sm text-[var(--color-cream-dark)] underline underline-offset-4 hover:text-gold"
//                     >
//                       Cancel payment
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </section>
//           </div>

//           {/* Order summary */}
//           <div className="lg:col-span-1">
//             <div className="rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 lg:sticky lg:top-24">
//               <h2 className="mb-6 font-serif text-fluid-h3 text-[var(--color-foreground)]">
//                 Items to Pay
//               </h2>

//               <div className="mb-6 space-y-4">
//                 {items.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-start gap-3 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
//                   >
//                     {/* Product image */}
//                     <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
//                       {item.image ? (
//                         <Image
//                           src={item.image}
//                           alt={item.title}
//                           fill
//                           className="object-cover"
//                           sizes="56px"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-cream-dark)]/40">
//                           No Image
//                         </div>
//                       )}
//                     </div>

//                     {/* Product information */}
//                     <div className="min-w-0 flex-1">
//                       <p className="line-clamp-2 text-xs font-medium text-[var(--color-foreground)]">
//                         {item.title}
//                       </p>

//                       <p className="text-xs text-gold-muted">
//                         Qty: {item.quantity}
//                       </p>

//                       <p className="mt-1 text-xs text-gold">
//                         {(item.price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pricing */}
//               <div className="space-y-2 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--color-cream-dark)]/70">
//                     Selected subtotal
//                   </span>

//                   <span className="text-[var(--color-foreground)]">
//                     {subtotal.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-[var(--color-cream-dark)]/70">
//                     Shipping
//                   </span>

//                   <span
//                     className={
//                       freeShipping
//                         ? "text-emerald-500"
//                         : "text-[var(--color-foreground)]"
//                     }
//                   >
//                     {freeShipping
//                       ? "Free"
//                       : formatPrice(shippingCost)}
//                   </span>
//                 </div>

//                 {!freeShipping && items.length > 0 && (
//                   <p className="text-xs text-[var(--color-gold-muted)]">
//                     Add {formatPrice(25000 - subtotal)} more for free
//                     shipping
//                   </p>
//                 )}
//               </div>

//               {/* Total */}
//               <div className="mb-4 mt-6 flex justify-between text-base font-semibold">
//                 <span className="text-[var(--color-foreground)]">
//                   Total
//                 </span>

//                 <span className="text-[var(--color-foreground)]">
//                   {total.toFixed(2)}
//                 </span>
//               </div>

//               {/* Razorpay status */}
//               <p className="mt-4 text-center text-xs text-gold-muted">
// {keyError
//                    ? `Payment configuration error: ${keyError}`
//                    : razorpayError
//                      ? `Razorpay failed to load: ${razorpayError}`
//                      : razorpayLoading || isKeyLoading
//                        ? "Loading secure payment checkout..."
//                        : "Payments are processed securely through Razorpay."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/use-razorpay-safe";
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

type RazorpayCheckoutInstance = {
  close?: () => void;
};

type CheckoutData = {
  orderId: number;
  orderNumber: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  currency:"INR";
  paymentId: number;
  razorpayOrderId: string;
  status: string;
};

type CheckoutSuccessResponse = {
  status: boolean;
  message: string;
  data: CheckoutData;
};

type ApiErrorResponse = {
  status?: boolean;
  message?: string;
  error?: string;
};

type PaymentVerificationResponse = {
  status?: boolean;
  message?: string;
  data?: {
    orderId?: number;
    orderNumber?: string;
  };
};

type CheckoutPricing = {
  subtotal: number;
  discount: number;
  totalAmount: number;
  currency: string;
};

const inputCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none focus:border-[var(--color-gold)] border-[var(--color-border-subtle)]";

const inputErrCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none border-red-400 focus:border-red-500";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const removeSelectedItems = useCartStore(
    (state) => state.removeSelectedItems,
  );

  const user = useUserStore((state) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);

  const [isKeyLoading, setIsKeyLoading] = useState(true);

  const [keyError, setKeyError] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  /**
   * Pricing returned by the backend.
   *
   * This is the source of truth after /checkout/buy-now
   * has successfully completed.
   */
  const [checkoutPricing, setCheckoutPricing] =
    useState<CheckoutPricing | null>(null);

  const {
    Razorpay,
    isLoading: razorpayIsLoading,
    error: razorpayError,
  } = useRazorpay();

  const [razorpayLoading, setRazorpayLoading] = useState(false);

  const paymentCheckoutRef = useRef<RazorpayCheckoutInstance | null>(null);

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
   * Keep local Razorpay loading state synchronized
   * with the Razorpay SDK hook.
   */
  useEffect(() => {
    setRazorpayLoading(razorpayIsLoading);
  }, [razorpayIsLoading]);

  /**
   * Load Razorpay public key.
   *
   * Only the public key_id is exposed to the browser.
   * The Razorpay secret must remain on the backend.
   */
  useEffect(() => {
    let isMounted = true;

    async function fetchKey(): Promise<void> {
      setIsKeyLoading(true);
      setKeyError(null);

      try {
        const response = await fetch("/api/razorpay", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const payload = (await response.json().catch(() => null)) as {
          key_id?: string;
          error?: string;
        } | null;

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
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const fallbackKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

        if (fallbackKey) {
          setRazorpayKeyId(fallbackKey);
          return;
        }

        setKeyError(
          error instanceof Error
            ? error.message
            : "Unable to load Razorpay public key.",
        );
      } finally {
        if (isMounted) {
          setIsKeyLoading(false);
        }
      }
    }

    void fetchKey();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Local subtotal is only used before the backend
   * returns the authoritative checkout pricing.
   *
   * The final payment amount MUST come from the backend.
   */
  const cartSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const freeShipping = cartSubtotal >= 25000;

  const shippingCost =
    freeShipping && items.length > 0 ? 0 : items.length > 0 ? 150 : 0;

  const estimatedTotal = cartSubtotal + shippingCost;

  /**
   * Convert cart item IDs into the backend format.
   */
  function createCartPayloadItem(item: (typeof items)[number]): {
    productId: number | string;
    quantity: number;
  } {
    const rawId = item.productId || item.id;

    const numericId = Number(rawId);

    const productId =
      Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

    return {
      productId,
      quantity: item.quantity,
    };
  }

  /**
   * Reset the current payment attempt.
   */
  function finishPaymentAttempt(): void {
    paymentCheckoutRef.current = null;
    setIsPaymentModalOpen(false);
    setIsSubmitting(false);
  }

  /**
   * Cancel the currently open Razorpay checkout.
   */
  function cancelPaymentAttempt(): void {
    paymentCheckoutRef.current?.close?.();
    finishPaymentAttempt();
  }

  /**
   * Create application order -> open Razorpay ->
   * verify Razorpay payment.
   */
  async function onSubmit(data: AddressFormValues): Promise<void> {
    if (items.length === 0) {
      toast("Cart is empty", {
        description: "Add items before checking out.",
        variant: "error",
      });

      return;
    }

    if (keyError || (!isKeyLoading && !razorpayKeyId)) {
      toast("Payment unavailable", {
        description: keyError || "Razorpay key is not configured.",
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

    /**
     * Capture the exact cart entries used to create
     * this checkout.
     */
    const purchasedItemIds = items.map((item) => item.id);

    setIsSubmitting(true);

    /**
     * Keep your existing authentication approach here.
     *
     * If your authentication has moved completely to
     * an in-memory access-token provider, replace this
     * localStorage lookup with that provider.
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
       * =========================================================
       * 1. CREATE APPLICATION ORDER
       * =========================================================
       *
       * The backend creates:
       *
       * - application order
       * - payment record
       * - Razorpay order
       *
       * The backend response is authoritative for pricing.
       */
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 15000);

      let checkoutResponse: Response;

      try {
        checkoutResponse = await fetch(
          `${API_BASE_URL}/api/v1/checkout/buy-now`,
          {
            method: "POST",
            headers: checkoutHeaders,
            body: JSON.stringify({
              cartItems: items.map(createCartPayloadItem),
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
            signal: controller.signal,
          },
        );
      } finally {
        clearTimeout(timeout);
      }

      const checkoutPayload = (await checkoutResponse
        .json()
        .catch(() => null)) as
        | CheckoutSuccessResponse
        | ApiErrorResponse
        | null;

      if (!checkoutResponse.ok) {
        const message =
          checkoutPayload &&
          "message" in checkoutPayload &&
          typeof checkoutPayload.message === "string"
            ? checkoutPayload.message
            : checkoutPayload &&
                "error" in checkoutPayload &&
                typeof checkoutPayload.error === "string"
              ? checkoutPayload.error
              : "Checkout failed. Please try again.";

        throw new Error(message);
      }

      if (
        !checkoutPayload ||
        !("data" in checkoutPayload) ||
        !checkoutPayload.data
      ) {
        throw new Error("Invalid checkout response received from the server.");
      }

      const checkoutData = checkoutPayload.data;

      /**
       * Validate the backend response.
       */
      if (
        typeof checkoutData.totalAmount !== "number" ||
        !Number.isFinite(checkoutData.totalAmount)
      ) {
        throw new Error("Invalid total amount returned by the backend.");
      }

      if (
        typeof checkoutData.subtotal !== "number" ||
        !Number.isFinite(checkoutData.subtotal)
      ) {
        throw new Error("Invalid subtotal returned by the backend.");
      }

      if (
        typeof checkoutData.discount !== "number" ||
        !Number.isFinite(checkoutData.discount)
      ) {
        throw new Error("Invalid discount returned by the backend.");
      }

      if (!checkoutData.razorpayOrderId) {
        throw new Error("Razorpay order ID was not returned by the backend.");
      }

      if (!checkoutData.currency) {
        throw new Error("Payment currency was not returned by the backend.");
      }

      /**
       * IMPORTANT:
       *
       * From this point onward, the backend response
       * becomes the source of truth for pricing.
       */
      setCheckoutPricing({
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        totalAmount: checkoutData.totalAmount,
        currency: checkoutData.currency,
      });

      /**
       * =========================================================
       * 2. OPEN RAZORPAY
       * =========================================================
       *
       * API:
       *
       * totalAmount = 462000 INR
       *
       * Razorpay:
       *
       * amount = 46200000 paise
       *
       * There is intentionally NO Math.round().
       *
       * The backend totalAmount is used directly.
       */
      const razorpayAmount = checkoutData.totalAmount * 100;

      const razorpayCheckout = new Razorpay({
        key: razorpayKeyId,

        amount: razorpayAmount,

        currency: checkoutData.currency,

        name: "Ratna Treasure",

        description: `Order ${checkoutData.orderNumber}`,

        order_id: checkoutData.razorpayOrderId,

        prefill: {
          name: data.fullName,
          email: user?.email || "",
          contact: data.mobileNo,
        },

        theme: {
          color: "#c9a84c",
        },

        redirect: false,

        /**
         * =====================================================
         * 3. PAYMENT SUCCESS
         * =====================================================
         */
        handler: async (
          paymentResult: RazorpayPaymentResult,
        ): Promise<void> => {
          paymentCheckoutRef.current = null;

          setIsPaymentModalOpen(false);

          try {
            const razorpayOrderId =
              paymentResult.razorpay_order_id || checkoutData.razorpayOrderId;

            const razorpayPaymentId = paymentResult.razorpay_payment_id;

            const razorpaySignature = paymentResult.razorpay_signature;

            if (!razorpayOrderId) {
              throw new Error("Razorpay order ID was not returned.");
            }

            if (!razorpayPaymentId) {
              throw new Error("Razorpay payment ID was not returned.");
            }

            if (!razorpaySignature) {
              throw new Error("Razorpay payment signature was not returned.");
            }

            /**
             * =================================================
             * 4. VERIFY PAYMENT
             * =================================================
             *
             * Signature verification happens ONLY
             * on the backend.
             */
            const verifyController = new AbortController();

            const verifyTimeout = setTimeout(() => {
              verifyController.abort();
            }, 30000);

            let verifyResponse: Response;

            try {
              verifyResponse = await fetch(
                `${API_BASE_URL}/api/v1/payments/verify`,
                {
                  method: "POST",
                  headers: verifyHeaders,
                  body: JSON.stringify({
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature,
                  }),
                  signal: verifyController.signal,
                },
              );
            } finally {
              clearTimeout(verifyTimeout);
            }

            const verifyPayload = (await verifyResponse
              .json()
              .catch(() => null)) as PaymentVerificationResponse | null;

            if (!verifyResponse.ok) {
              throw new Error(
                verifyPayload?.message || "Payment verification failed.",
              );
            }

            /**
             * Payment is verified by backend.
             *
             * Only now remove the purchased items.
             */
            removeSelectedItems(purchasedItemIds);

            toast("Payment successful", {
              description:
                "Your payment has been verified and your order is confirmed.",
              variant: "success",
            });

            finishPaymentAttempt();

            /**
             * Navigate using the application order ID
             * returned by /checkout/buy-now.
             */
            router.push(
              `/order/success?orderId=${encodeURIComponent(
                String(checkoutData.orderId),
              )}`,
            );
          } catch (verifyError) {
            toast("Verification failed", {
              description:
                verifyError instanceof Error
                  ? verifyError.message
                  : "Payment succeeded but verification failed.",
              variant: "error",
            });

            finishPaymentAttempt();
          }
        },

        /**
         * Razorpay payment failure.
         */
        modal: {
          ondismiss: () => {
            finishPaymentAttempt();
          },

          confirm_close: true,
        },
      });

      razorpayCheckout.on(
        "payment.failed",
        (failure: RazorpayPaymentFailure) => {
          toast("Payment failed", {
            description: failure.error?.description || "Please try again.",
            variant: "error",
          });

          finishPaymentAttempt();
        },
      );

      paymentCheckoutRef.current =
        razorpayCheckout as unknown as RazorpayCheckoutInstance;

      setIsPaymentModalOpen(true);

      razorpayCheckout.open();
    } catch (error) {
      toast("Checkout failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "error",
      });

      finishPaymentAttempt();
    }
  }

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
              Your cart is empty. Add some beautiful pieces before checking out.
            </p>

            <Button asChild size="lg" variant="default" className="px-8">
              <Link href="/product">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /**
   * Use backend pricing after buy-now succeeds.
   *
   * Before that, show the local estimate.
   */
  const displaySubtotal = checkoutPricing?.subtotal ?? cartSubtotal;

  const displayDiscount = checkoutPricing?.discount ?? 0;

  const displayTotal = checkoutPricing?.totalAmount ?? estimatedTotal;

  const displayCurrency = checkoutPricing?.currency ?? "INR";

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
                      className={errors.fullName ? inputErrCls : inputCls}
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
                          message: "Mobile number must contain only digits",
                        },
                      })}
                      type="tel"
                      inputMode="numeric"
                      aria-invalid={!!errors.mobileNo}
                      className={errors.mobileNo ? inputErrCls : inputCls}
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
                    className={errors.addressLine1 ? inputErrCls : inputCls}
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
                      className={errors.country ? inputErrCls : inputCls}
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
                      className={errors.postalCode ? inputErrCls : inputCls}
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
                      razorpayLoading
                    }
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>

                  {isPaymentModalOpen && (
                    <button
                      type="button"
                      onClick={cancelPaymentAttempt}
                      className="mt-3 block text-sm text-[var(--color-cream-dark)] underline underline-offset-4 hover:text-gold"
                    >
                      Cancel payment
                    </button>
                  )}
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
                {items.map((item) => (
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
                    Subtotal
                  </span>

                  <span className="text-[var(--color-foreground)]">
                    {formatPrice(displaySubtotal)}
                  </span>
                </div>

                {displayDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-cream-dark)]/70">
                      Discount
                    </span>

                    <span className="text-emerald-500">
                      -{formatPrice(displayDiscount)}
                    </span>
                  </div>
                )}

                {!checkoutPricing && !freeShipping && items.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-cream-dark)]/70">
                      Shipping
                    </span>

                    <span className="text-[var(--color-foreground)]">
                      {formatPrice(shippingCost)}
                    </span>
                  </div>
                )}
              </div>

              {!checkoutPricing && !freeShipping && items.length > 0 && (
                <p className="mt-2 text-xs text-[var(--color-gold-muted)]">
                  Add {formatPrice(Math.max(25000 - cartSubtotal, 0))} more for
                  free shipping
                </p>
              )}

              {/* Final total */}
              <div className="mb-4 mt-6 flex justify-between text-base font-semibold">
                <span className="text-[var(--color-foreground)]">Total</span>

                <span className="text-[var(--color-foreground)]">
                  {formatPrice(displayTotal)}
                </span>
              </div>

              {/* Currency */}
              {checkoutPricing && (
                <p className="text-center text-xs text-[var(--color-cream-dark)]/50">
                  Currency: {displayCurrency}
                </p>
              )}

              {/* Razorpay status */}
              <p className="mt-4 text-center text-xs text-gold-muted">
                {keyError
                  ? `Payment configuration error: ${keyError}`
                  : razorpayError
                    ? `Razorpay failed to load: ${razorpayError}`
                    : razorpayLoading || isKeyLoading
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
