// "use client";

// import { useEffect, useRef, useState } from "react";
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

// type CheckoutData = {
//   orderId: number;
//   orderNumber: string;
//   subtotal: number;
//   discount: number;
//   totalAmount: number;
//   currency:"INR";
//   paymentId: number;
//   razorpayOrderId: string;
//   status: string;
// };

// type CheckoutSuccessResponse = {
//   status: boolean;
//   message: string;
//   data: CheckoutData;
// };

// type ApiErrorResponse = {
//   status?: boolean;
//   message?: string;
//   error?: string;
// };

// type PaymentVerificationResponse = {
//   status?: boolean;
//   message?: string;
//   data?: {
//     orderId?: number;
//     orderNumber?: string;
//   };
// };

// type CheckoutPricing = {
//   subtotal: number;
//   discount: number;
//   totalAmount: number;
//   currency: string;
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

//   /**
//    * Pricing returned by the backend.
//    *
//    * This is the source of truth after /checkout/buy-now
//    * has successfully completed.
//    */
//   const [checkoutPricing, setCheckoutPricing] =
//     useState<CheckoutPricing | null>(null);

//   const {
//     Razorpay,
//     isLoading: razorpayIsLoading,
//     error: razorpayError,
//   } = useRazorpay();

//   const [razorpayLoading, setRazorpayLoading] = useState(false);

//   const paymentCheckoutRef = useRef<RazorpayCheckoutInstance | null>(null);

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
//    * Keep local Razorpay loading state synchronized
//    * with the Razorpay SDK hook.
//    */
//   useEffect(() => {
//     setRazorpayLoading(razorpayIsLoading);
//   }, [razorpayIsLoading]);

//   /**
//    * Load Razorpay public key.
//    *
//    * Only the public key_id is exposed to the browser.
//    * The Razorpay secret must remain on the backend.
//    */
//   useEffect(() => {
//     let isMounted = true;

//     async function fetchKey(): Promise<void> {
//       setIsKeyLoading(true);
//       setKeyError(null);

//       try {
//         const response = await fetch("/api/razorpay", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//         });

//         const payload = (await response.json().catch(() => null)) as {
//           key_id?: string;
//           error?: string;
//         } | null;

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
//       } catch (error) {
//         if (!isMounted) {
//           return;
//         }

//         const fallbackKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

//         if (fallbackKey) {
//           setRazorpayKeyId(fallbackKey);
//           return;
//         }

//         setKeyError(
//           error instanceof Error
//             ? error.message
//             : "Unable to load Razorpay public key.",
//         );
//       } finally {
//         if (isMounted) {
//           setIsKeyLoading(false);
//         }
//       }
//     }

//     void fetchKey();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   /**
//    * Local subtotal is only used before the backend
//    * returns the authoritative checkout pricing.
//    *
//    * The final payment amount MUST come from the backend.
//    */
//   const cartSubtotal = items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );

//   const freeShipping = cartSubtotal >= 25000;

//   const shippingCost =
//     freeShipping && items.length > 0 ? 0 : items.length > 0 ? 150 : 0;

//   const estimatedTotal = cartSubtotal + shippingCost;

//   /**
//    * Convert cart item IDs into the backend format.
//    */
//   function createCartPayloadItem(item: (typeof items)[number]): {
//     productId: number | string;
//     quantity: number;
//   } {
//     const rawId = item.productId || item.id;

//     const numericId = Number(rawId);

//     const productId =
//       Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

//     return {
//       productId,
//       quantity: item.quantity,
//     };
//   }

//   /**
//    * Reset the current payment attempt.
//    */
//   function finishPaymentAttempt(): void {
//     paymentCheckoutRef.current = null;
//     setIsPaymentModalOpen(false);
//     setIsSubmitting(false);
//   }

//   /**
//    * Cancel the currently open Razorpay checkout.
//    */
//   function cancelPaymentAttempt(): void {
//     paymentCheckoutRef.current?.close?.();
//     finishPaymentAttempt();
//   }

//   /**
//    * Create application order -> open Razorpay ->
//    * verify Razorpay payment.
//    */
//   async function onSubmit(data: AddressFormValues): Promise<void> {
//     if (items.length === 0) {
//       toast("Cart is empty", {
//         description: "Add items before checking out.",
//         variant: "error",
//       });

//       return;
//     }

//     if (keyError || (!isKeyLoading && !razorpayKeyId)) {
//       toast("Payment unavailable", {
//         description: keyError || "Razorpay key is not configured.",
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

//     /**
//      * Capture the exact cart entries used to create
//      * this checkout.
//      */
//     const purchasedItemIds = items.map((item) => item.id);

//     setIsSubmitting(true);

//     /**
//      * Keep your existing authentication approach here.
//      *
//      * If your authentication has moved completely to
//      * an in-memory access-token provider, replace this
//      * localStorage lookup with that provider.
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

//     try {
//       /**
//        * =========================================================
//        * 1. CREATE APPLICATION ORDER
//        * =========================================================
//        *
//        * The backend creates:
//        *
//        * - application order
//        * - payment record
//        * - Razorpay order
//        *
//        * The backend response is authoritative for pricing.
//        */
//       const controller = new AbortController();

//       const timeout = setTimeout(() => {
//         controller.abort();
//       }, 15000);

//       let checkoutResponse: Response;

//       try {
//         checkoutResponse = await fetch(
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
//             signal: controller.signal,
//           },
//         );
//       } finally {
//         clearTimeout(timeout);
//       }

//       const checkoutPayload = (await checkoutResponse
//         .json()
//         .catch(() => null)) as
//         | CheckoutSuccessResponse
//         | ApiErrorResponse
//         | null;

//       if (!checkoutResponse.ok) {
//         const message =
//           checkoutPayload &&
//           "message" in checkoutPayload &&
//           typeof checkoutPayload.message === "string"
//             ? checkoutPayload.message
//             : checkoutPayload &&
//                 "error" in checkoutPayload &&
//                 typeof checkoutPayload.error === "string"
//               ? checkoutPayload.error
//               : "Checkout failed. Please try again.";

//         throw new Error(message);
//       }

//       if (
//         !checkoutPayload ||
//         !("data" in checkoutPayload) ||
//         !checkoutPayload.data
//       ) {
//         throw new Error("Invalid checkout response received from the server.");
//       }

//       const checkoutData = checkoutPayload.data;

//       /**
//        * Validate the backend response.
//        */
//       if (
//         typeof checkoutData.totalAmount !== "number" ||
//         !Number.isFinite(checkoutData.totalAmount)
//       ) {
//         throw new Error("Invalid total amount returned by the backend.");
//       }

//       if (
//         typeof checkoutData.subtotal !== "number" ||
//         !Number.isFinite(checkoutData.subtotal)
//       ) {
//         throw new Error("Invalid subtotal returned by the backend.");
//       }

//       if (
//         typeof checkoutData.discount !== "number" ||
//         !Number.isFinite(checkoutData.discount)
//       ) {
//         throw new Error("Invalid discount returned by the backend.");
//       }

//       if (!checkoutData.razorpayOrderId) {
//         throw new Error("Razorpay order ID was not returned by the backend.");
//       }

//       if (!checkoutData.currency) {
//         throw new Error("Payment currency was not returned by the backend.");
//       }

//       /**
//        * IMPORTANT:
//        *
//        * From this point onward, the backend response
//        * becomes the source of truth for pricing.
//        */
//       setCheckoutPricing({
//         subtotal: checkoutData.subtotal,
//         discount: checkoutData.discount,
//         totalAmount: checkoutData.totalAmount,
//         currency: checkoutData.currency,
//       });

//       /**
//        * =========================================================
//        * 2. OPEN RAZORPAY
//        * =========================================================
//        *
//        * API:
//        *
//        * totalAmount = 462000 INR
//        *
//        * Razorpay:
//        *
//        * amount = 46200000 paise
//        *
//        * There is intentionally NO Math.round().
//        *
//        * The backend totalAmount is used directly.
//        */
//       const razorpayAmount = checkoutData.totalAmount * 100;

//       const razorpayCheckout = new Razorpay({
//         key: razorpayKeyId,

//         amount: razorpayAmount,

//         currency: checkoutData.currency,

//         name: "Ratna Treasure",

//         description: `Order ${checkoutData.orderNumber}`,

//         order_id: checkoutData.razorpayOrderId,

//         prefill: {
//           name: data.fullName,
//           email: user?.email || "",
//           contact: data.mobileNo,
//         },

//         theme: {
//           color: "#c9a84c",
//         },

//         redirect: false,

//         /**
//          * =====================================================
//          * 3. PAYMENT SUCCESS
//          * =====================================================
//          */
//         handler: async (
//           paymentResult: RazorpayPaymentResult,
//         ): Promise<void> => {
//           paymentCheckoutRef.current = null;

//           setIsPaymentModalOpen(false);

//           try {
//             const razorpayOrderId =
//               paymentResult.razorpay_order_id || checkoutData.razorpayOrderId;

//             const razorpayPaymentId = paymentResult.razorpay_payment_id;

//             const razorpaySignature = paymentResult.razorpay_signature;

//             if (!razorpayOrderId) {
//               throw new Error("Razorpay order ID was not returned.");
//             }

//             if (!razorpayPaymentId) {
//               throw new Error("Razorpay payment ID was not returned.");
//             }

//             if (!razorpaySignature) {
//               throw new Error("Razorpay payment signature was not returned.");
//             }

//             /**
//              * =================================================
//              * 4. VERIFY PAYMENT
//              * =================================================
//              *
//              * Signature verification happens ONLY
//              * on the backend.
//              */
//             const verifyController = new AbortController();

//             const verifyTimeout = setTimeout(() => {
//               verifyController.abort();
//             }, 30000);

//             let verifyResponse: Response;

//             try {
//               verifyResponse = await fetch(
//                 `${API_BASE_URL}/api/v1/payments/verify`,
//                 {
//                   method: "POST",
//                   headers: verifyHeaders,
//                   body: JSON.stringify({
//                     razorpayOrderId,
//                     razorpayPaymentId,
//                     razorpaySignature,
//                   }),
//                   signal: verifyController.signal,
//                 },
//               );
//             } finally {
//               clearTimeout(verifyTimeout);
//             }

//             const verifyPayload = (await verifyResponse
//               .json()
//               .catch(() => null)) as PaymentVerificationResponse | null;

//             if (!verifyResponse.ok) {
//               throw new Error(
//                 verifyPayload?.message || "Payment verification failed.",
//               );
//             }

//             /**
//              * Payment is verified by backend.
//              *
//              * Only now remove the purchased items.
//              */
//             removeSelectedItems(purchasedItemIds);

//             toast("Payment successful", {
//               description:
//                 "Your payment has been verified and your order is confirmed.",
//               variant: "success",
//             });

//             finishPaymentAttempt();

//             /**
//              * Navigate using the application order ID
//              * returned by /checkout/buy-now.
//              */
//             router.push(
//               `/order/success?orderId=${encodeURIComponent(
//                 String(checkoutData.orderId),
//               )}`,
//             );
//           } catch (verifyError) {
//             toast("Verification failed", {
//               description:
//                 verifyError instanceof Error
//                   ? verifyError.message
//                   : "Payment succeeded but verification failed.",
//               variant: "error",
//             });

//             finishPaymentAttempt();
//           }
//         },

//         /**
//          * Razorpay payment failure.
//          */
//         modal: {
//           ondismiss: () => {
//             finishPaymentAttempt();
//           },

//           confirm_close: true,
//         },
//       });

//       razorpayCheckout.on(
//         "payment.failed",
//         (failure: RazorpayPaymentFailure) => {
//           toast("Payment failed", {
//             description: failure.error?.description || "Please try again.",
//             variant: "error",
//           });

//           finishPaymentAttempt();
//         },
//       );

//       paymentCheckoutRef.current =
//         razorpayCheckout as unknown as RazorpayCheckoutInstance;

//       setIsPaymentModalOpen(true);

//       razorpayCheckout.open();
//     } catch (error) {
//       toast("Checkout failed", {
//         description:
//           error instanceof Error
//             ? error.message
//             : "Something went wrong. Please try again.",
//         variant: "error",
//       });

//       finishPaymentAttempt();
//     }
//   }

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
//               Your cart is empty. Add some beautiful pieces before checking out.
//             </p>

//             <Button asChild size="lg" variant="default" className="px-8">
//               <Link href="/product">Explore Collection</Link>
//             </Button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /**
//    * Use backend pricing after buy-now succeeds.
//    *
//    * Before that, show the local estimate.
//    */
//   const displaySubtotal = checkoutPricing?.subtotal ?? cartSubtotal;

//   const displayDiscount = checkoutPricing?.discount ?? 0;

//   const displayTotal = checkoutPricing?.totalAmount ?? estimatedTotal;

//   const displayCurrency = checkoutPricing?.currency ?? "INR";

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
//                       className={errors.fullName ? inputErrCls : inputCls}
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
//                           message: "Mobile number must contain only digits",
//                         },
//                       })}
//                       type="tel"
//                       inputMode="numeric"
//                       aria-invalid={!!errors.mobileNo}
//                       className={errors.mobileNo ? inputErrCls : inputCls}
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
//                     className={errors.addressLine1 ? inputErrCls : inputCls}
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
//                       className={errors.country ? inputErrCls : inputCls}
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
//                       className={errors.postalCode ? inputErrCls : inputCls}
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
//                     {isSubmitting ? "Processing..." : "Proceed to Payment"}
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
//                         {formatPrice(item.price * item.quantity)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pricing */}
//               <div className="space-y-2 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--color-cream-dark)]/70">
//                     Subtotal
//                   </span>

//                   <span className="text-[var(--color-foreground)]">
//                     {formatPrice(displaySubtotal)}
//                   </span>
//                 </div>

//                 {displayDiscount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-[var(--color-cream-dark)]/70">
//                       Discount
//                     </span>

//                     <span className="text-emerald-500">
//                       -{formatPrice(displayDiscount)}
//                     </span>
//                   </div>
//                 )}

//                 {!checkoutPricing && !freeShipping && items.length > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-[var(--color-cream-dark)]/70">
//                       Shipping
//                     </span>

//                     <span className="text-[var(--color-foreground)]">
//                       {formatPrice(shippingCost)}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {!checkoutPricing && !freeShipping && items.length > 0 && (
//                 <p className="mt-2 text-xs text-[var(--color-gold-muted)]">
//                   Add {formatPrice(Math.max(25000 - cartSubtotal, 0))} more for
//                   free shipping
//                 </p>
//               )}

//               {/* Final total */}
//               <div className="mb-4 mt-6 flex justify-between text-base font-semibold">
//                 <span className="text-[var(--color-foreground)]">Total</span>

//                 <span className="text-[var(--color-foreground)]">
//                   {formatPrice(displayTotal)}
//                 </span>
//               </div>

//               {/* Currency */}
//               {checkoutPricing && (
//                 <p className="text-center text-xs text-[var(--color-cream-dark)]/50">
//                   Currency: {displayCurrency}
//                 </p>
//               )}

//               {/* Razorpay status */}
//               <p className="mt-4 text-center text-xs text-gold-muted">
//                 {keyError
//                   ? `Payment configuration error: ${keyError}`
//                   : razorpayError
//                     ? `Razorpay failed to load: ${razorpayError}`
//                     : razorpayLoading || isKeyLoading
//                       ? "Loading secure payment checkout..."
//                       : "Payments are processed securely through Razorpay."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/use-razorpay-safe";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "@/store/toast";
import { isValidInternationalPhone, PhoneNumberInput } from "@/components/ui/phone-number-input";

type AddressFormValues = {
  fullName: string;
  mobileNo: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  countryId: string;
  stateId: string;
};

type LocationOption = { id: number; name: string };

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
  currency: "INR";
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

/** Shipping rules: free within India, flat fee everywhere else. */
const INTERNATIONAL_SHIPPING_COST = 10000;

/* ----------------------------- Payment logos (CDN) ----------------------------- */

const PAYMENT_LOGO = {
  upi: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
  visa: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/visa.svg",
  mastercard:
    "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/mastercard.svg",
  amex: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/amex.svg",
  diners:
    "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/diners.svg",
  maestro:
    "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/maestro.svg",
  rupay:
    "https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/cards/rupay.svg",
  paytm: "https://cdn.simpleicons.org/paytm",
  amazonpay:
    "https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/apm/amazon-pay.svg",
  grab: "https://cdn.simpleicons.org/grab",
  hsbc: "https://cdn.simpleicons.org/hsbc",
} as const;

/** Inline SVGs for methods with no reliable public CDN (match screenshot tiles). */
const INLINE = {
  netbanking:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M10 34h28v3H10v-3zm2-14h4v12h-4V20zm8 0h4v12h-4V20zm8 0h4v12h-4V20zm-16-4 14-8 14 8v3H12v-3z" fill="#111"/></svg>`,
    ),
  freecharge:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M28 8c-6 8-4 12-2 16-6-2-10 2-10 8 0 6 5 10 10 10 8 0 12-6 12-14 0-10-6-14-10-20z" fill="#E53935"/></svg>`,
    ),
  mobikwik:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M12 14h6l4 12 4-12h6l-7 20h-6L12 14z" fill="#00BFA5"/><path d="M34 18h6v16h-4.5c-3 0-5-1.5-5-4.5 0-2.5 1.5-4 4-4.5L34 18zm4 8.5c-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5H40v-3h-2z" fill="#00BFA5"/></svg>`,
    ),
  airtel:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><rect x="14" y="14" width="20" height="20" rx="3" fill="#E53935"/><path d="M20 20h8v3h-2.5v8h-3v-8H20v-3z" fill="#fff"/></svg>`,
    ),
  ola:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><circle cx="24" cy="24" r="12" fill="#000"/><path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#fff" stroke-width="3" fill="none"/></svg>`,
    ),
  payzapp:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M14 14h12c5 0 8 3 8 7.5S31 29 26 29h-6v5h-6V14zm6 10h5c1.7 0 2.5-.8 2.5-2.5S26.7 19 25 19h-5v5z" fill="#00A0E3"/></svg>`,
    ),
  fpx:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="14" fill="#1A73E8">FPX</text></svg>`,
    ),
  touchngo:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><text x="24" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="9" fill="#0033A0">Touch</text><text x="24" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="8" fill="#00A651">'n Go</text></svg>`,
    ),
  mcash:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><text x="24" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="11" fill="#00A651">MCash</text></svg>`,
    ),
  boost:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><text x="24" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="12" fill="#E53935">Boost</text></svg>`,
    ),
} as const;

/** Order matches your screenshot (4 columns). */
const POPUP_PAYMENT_METHODS: { name: string; logo: string }[] = [
  { name: "Netbanking", logo: INLINE.netbanking },
  { name: "RuPay", logo: PAYMENT_LOGO.rupay },
  { name: "Paytm", logo: PAYMENT_LOGO.paytm },
  { name: "American Express", logo: PAYMENT_LOGO.amex },

  { name: "Diners Club", logo: PAYMENT_LOGO.diners },
  { name: "Maestro", logo: PAYMENT_LOGO.maestro },
  { name: "Freecharge", logo: INLINE.freecharge },
  { name: "Amazon Pay", logo: PAYMENT_LOGO.amazonpay },

  { name: "Ola Money", logo: INLINE.ola },
  { name: "Airtel Money", logo: INLINE.airtel },
  { name: "PayZapp", logo: INLINE.payzapp },
  { name: "MobiKwik", logo: INLINE.mobikwik },

  { name: "FPX", logo: INLINE.fpx },
  { name: "GrabPay", logo: PAYMENT_LOGO.grab },
  { name: "Touch 'n Go", logo: INLINE.touchngo },
  { name: "mCash", logo: INLINE.mcash },

  { name: "HSBC", logo: PAYMENT_LOGO.hsbc },
  { name: "Boost", logo: INLINE.boost },
];
const inputCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none focus:border-[var(--color-gold)] border-[var(--color-border-subtle)]";

const inputErrCls =
  "w-full rounded-md border bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-foreground)] font-poppins focus:outline-none border-red-400 focus:border-red-500";

const cardCls =
  "rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 md:p-8";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-poppins text-sm text-[var(--color-cream-dark)]/80">
        {label}
      </label>
      {children}
      {error && <span className="block text-xs text-red-400">{error}</span>}
    </div>
  );
}

function SearchableDropdown({
  value,
  options,
  placeholder,
  onChange,
  message,
  invalid,
}: {
  value: string;
  options: LocationOption[];
  placeholder: string;
  onChange: (value: string) => void;
  message?: string;
  invalid?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const filtered = options.filter((option) =>
    option.name.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-expanded={isOpen ? "true" : "false"}
        aria-controls={listboxId}
        role="combobox"
        aria-autocomplete="list"
        className={invalid ? inputErrCls : inputCls}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
      />
      {isOpen && (
        <div id={listboxId} role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] py-1 shadow-xl">
          {message ? (
            <p className="px-3 py-2 text-sm text-[var(--color-cream-dark)]/75">{message}</p>
          ) : filtered.length ? (
            filtered.map((option) => (
              <button
                type="button"
                key={option.id}
                className="block w-full px-3 py-2 text-left text-sm text-[var(--color-foreground)] hover:bg-[var(--color-gold)]/15 focus:bg-[var(--color-gold)]/15 focus:outline-none"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-[var(--color-cream-dark)]/75">No matches found</p>
          )}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 font-serif text-fluid-h3 text-[var(--color-foreground)]">
      {children}
    </h2>
  );
}

function PaymentLogoImg({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={38}
      height={24}
      className={`rounded border border-[var(--color-border-subtle)] bg-white object-contain p-0.5 ${className}`}
      loading="lazy"
    />
  );
}

function PopupMethodTile({ name, logo }: { name: string; logo?: string }) {
  return (
    <div
      className="flex h-10 w-14 items-center justify-center rounded-md bg-white p-1 shadow-sm"
      title={name}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="px-0.5 text-center text-[9px] font-semibold leading-tight text-neutral-700">
          {name}
        </span>
      )}
    </div>
  );
}

/**
 * Popover-style popup (not a full-screen dialog).
 * Anchored above the "+18" trigger, dark rounded card + arrow.
 */
function PaymentMethodsPopup({
  onClose,
  anchorRef,
}: {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    function onPointerDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (
        popupRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-label="Accepted payment methods"
      className="absolute bottom-full right-0 z-50 mb-2 w-[min(280px,calc(100vw-2rem))]"
    >
      <div className="rounded-xl bg-neutral-900 p-3 shadow-2xl ring-1 ring-white/10">
        <div className="grid grid-cols-4 gap-2">
          {POPUP_PAYMENT_METHODS.map((method) => (
            <PopupMethodTile
              key={method.name}
              name={method.name}
              logo={method.logo}
            />
          ))}
        </div>
      </div>

      {/* arrow pointing down toward the +18 button */}
      <div
        className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-neutral-900"
        aria-hidden
      />
    </div>
  );
}

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
  const [isMethodsPopupOpen, setIsMethodsPopupOpen] = useState(false);

  /**
   * Pricing returned by the backend.
   * This is the source of truth after /checkout/buy-now has successfully completed.
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
  const methodsTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: user?.name || "",
      mobileNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      countryId: "",
      stateId: "",
    },
  });

  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const watchedCountry = watch("country");
  const selectedCountryId = watch("countryId");
  const selectedState = watch("state");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setIsLoadingCountries(true);
      try {
        const url = new URL(`${API_BASE_URL}/api/v1/public/country`, window.location.origin);
        url.searchParams.set("page", "0");
        url.searchParams.set("size", "100");
        if (watchedCountry.trim()) url.searchParams.set("search", watchedCountry.trim());
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load countries");
        const payload = await response.json();
        const options = Array.isArray(payload?.data?.content) ? payload.data.content : [];
        if (!active) return;
        setCountries(options.filter((item: any) => item?.id != null && item?.name));
      } catch (error) {
        if (active) console.error("Country list request failed", error);
      } finally {
        if (active) setIsLoadingCountries(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [watchedCountry, setValue]);

  useEffect(() => {
    let active = true;
    if (!selectedCountryId) {
      setStates([]);
      setIsLoadingStates(false);
      return () => { active = false; };
    }
    const timer = window.setTimeout(async () => {
      setIsLoadingStates(true);
      try {
        const url = new URL(`${API_BASE_URL}/api/v1/public/country/${encodeURIComponent(selectedCountryId)}/states`, window.location.origin);
        url.searchParams.set("page", "0");
        url.searchParams.set("size", "100");
        if (selectedState.trim()) url.searchParams.set("search", selectedState.trim());
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load states");
        const payload = await response.json();
        const options = Array.isArray(payload?.data?.content) ? payload.data.content : [];
        if (active) setStates(options.filter((item: any) => item?.id != null && item?.name));
      } catch (error) {
        if (active) console.error("State list request failed", error);
      } finally {
        if (active) setIsLoadingStates(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [selectedCountryId, selectedState]);

  const countryEntered = (watchedCountry || "").trim().length > 0;
  const isIndia = (watchedCountry || "").trim().toLowerCase() === "india";

  useEffect(() => {
    setRazorpayLoading(razorpayIsLoading);
  }, [razorpayIsLoading]);

  /**
   * Load Razorpay public key (only key_id is exposed to the browser).
   */
  useEffect(() => {
    let isMounted = true;

    async function fetchKey(): Promise<void> {
      setIsKeyLoading(true);
      setKeyError(null);

      try {
        const response = await fetch("/api/razorpay", {
          method: "GET",
          headers: { Accept: "application/json" },
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
        if (!isMounted) return;

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
   * Local estimate, used only until the backend returns authoritative pricing.
   * Shipping: free within India, flat INTERNATIONAL_SHIPPING_COST elsewhere.
   */
  const cartSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingCost =
    items.length === 0 || !countryEntered
      ? 0
      : isIndia
        ? 0
        : INTERNATIONAL_SHIPPING_COST;

  const estimatedTotal = cartSubtotal + shippingCost;

  function createCartPayloadItem(item: (typeof items)[number]): {
    productId: number | string;
    quantity: number;
  } {
    const rawId = item.productId || item.id;
    const numericId = Number(rawId);
    const productId =
      Number.isFinite(numericId) && numericId > 0 ? numericId : rawId;

    return { productId, quantity: item.quantity };
  }

  function finishPaymentAttempt(): void {
    paymentCheckoutRef.current = null;
    setIsPaymentModalOpen(false);
    setIsSubmitting(false);
  }

  function cancelPaymentAttempt(): void {
    paymentCheckoutRef.current?.close?.();
    finishPaymentAttempt();
  }

  /**
   * Razorpay filters payment methods by the customer's phone number.
   * Send Indian numbers with the +91 prefix so the full Indian method list is offered.
   */
  function formatRazorpayContact(
    mobileNo: string,
    indiaOrder: boolean,
  ): string {
    const digits = mobileNo.replace(/\D/g, "");

    if (indiaOrder && digits.length === 10) {
      return `+91${digits}`;
    }

    return digits ? `+${digits}` : "";
  }

  /**
   * Create application order -> open Razorpay -> verify payment.
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

    const purchasedItemIds = items.map((item) => item.id);
    const orderIsIndia = data.country.trim().toLowerCase() === "india";

    setIsSubmitting(true);

    const accessToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    const authHeaders: Record<string, string> = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const jsonHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    };

    try {
      /**
       * 1. CREATE APPLICATION ORDER
       */
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      let checkoutResponse: Response;

      try {
        checkoutResponse = await fetch(
          `${API_BASE_URL}/api/v1/checkout/buy-now`,
          {
            method: "POST",
            headers: jsonHeaders,
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
                countryId: Number(data.countryId),
                stateId: Number(data.stateId),
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

      setCheckoutPricing({
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        totalAmount: checkoutData.totalAmount,
        currency: checkoutData.currency,
      });

      /**
       * 2. OPEN RAZORPAY
       * Backend totalAmount (INR) -> paise. No Math.round().
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
          contact: formatRazorpayContact(data.mobileNo, orderIsIndia),
        },

        theme: { color: "#c9a84c" },

        redirect: false,
        remember_customer: false,

        config: {
          display: {
            language: "en",
          },
        },

        /**
         * 3. PAYMENT SUCCESS
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
             * 4. VERIFY PAYMENT (signature check happens on the backend)
             */
            const verifyController = new AbortController();
            const verifyTimeout = setTimeout(
              () => verifyController.abort(),
              30000,
            );

            let verifyResponse: Response;

            try {
              verifyResponse = await fetch(
                `${API_BASE_URL}/api/v1/payments/verify`,
                {
                  method: "POST",
                  headers: jsonHeaders,
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

            removeSelectedItems(purchasedItemIds);

            toast("Payment successful", {
              description:
                "Your payment has been verified and your order is confirmed.",
              variant: "success",
            });

            finishPaymentAttempt();

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

  const displaySubtotal = checkoutPricing?.subtotal ?? cartSubtotal;
  const displayDiscount = checkoutPricing?.discount ?? 0;
  const displayTotal = checkoutPricing?.totalAmount ?? estimatedTotal;
  const displayCurrency = checkoutPricing?.currency ?? "INR";

  /** Once the backend has priced the order, derive shipping from its total. */
  const displayShipping = checkoutPricing
    ? Math.max(
        checkoutPricing.totalAmount -
          checkoutPricing.subtotal +
          checkoutPricing.discount,
        0,
      )
    : shippingCost;

  const payDisabled =
    isSubmitting || isKeyLoading || !razorpayKeyId || razorpayLoading;

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
          {/* ===================== Left column: single form ===================== */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6 font-poppins lg:col-span-2"
          >
            {/* Delivery details */}
            <section className={cardCls}>
              <SectionTitle>Delivery Details</SectionTitle>

              <div className="space-y-5">
                  <Field label="Full name" error={errors.fullName?.message}>
                    <input
                      {...register("fullName", {
                        required: "Full name is required",
                        validate: (value) => value.trim().length >= 2 || "Enter a valid full name",
                        maxLength: { value: 100, message: "Full name must be 100 characters or fewer" },
                      })}
                      aria-invalid={!!errors.fullName}
                      className={errors.fullName ? inputErrCls : inputCls}
                      placeholder="John Doe"
                    />
                  </Field>


                <Field
                  label="Address Line 1"
                  error={errors.addressLine1?.message}
                >
                  <input
                    {...register("addressLine1", {
                      required: "Address line 1 is required",
                      validate: (value) => value.trim().length >= 3 || "Enter a valid address",
                      maxLength: { value: 200, message: "Address must be 200 characters or fewer" },
                    })}
                    aria-invalid={!!errors.addressLine1}
                    className={errors.addressLine1 ? inputErrCls : inputCls}
                    placeholder="123"
                  />
                </Field>

                <Field label="Address Line 2">
                  <input
                    {...register("addressLine2")}
                    className={inputCls}
                    placeholder="Apt 4B"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Country" error={errors.country?.message}>
                    <>
                      <input type="hidden" {...register("country", {
                        required: "Country is required",
                        validate: (value) => countries.some((item) => item.name.toLowerCase() === value.trim().toLowerCase()) || "Select a country from the list",
                      })} />
                      <input type="hidden" {...register("countryId", { required: "Country is required" })} />
                      <SearchableDropdown
                        value={watchedCountry || ""}
                        options={countries}
                        placeholder={isLoadingCountries ? "Loading countries…" : "Search country"}
                        invalid={!!errors.country}
                        onChange={(value) => {
                          const country = countries.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
                          setValue("country", value, { shouldValidate: true });
                          setValue("countryId", country ? String(country.id) : "", { shouldValidate: true });
                          setValue("state", "", { shouldValidate: true });
                          setValue("stateId", "", { shouldValidate: true });
                        }}
                      />
                    </>
                  </Field>

                  <Field label="State" error={errors.state?.message}>
                    <>
                      <input type="hidden" {...register("state", {
                          required: "State is required",
                          validate: (value) => states.some((item) => item.name.toLowerCase() === value.trim().toLowerCase()) || "Select a state from the list",
                      })} />
                      <input type="hidden" {...register("stateId", { required: "State is required" })} />
                      <SearchableDropdown
                        value={selectedState || ""}
                        options={states}
                        placeholder={isLoadingStates ? "Loading states…" : "Search state"}
                        invalid={!!errors.state}
                        message={!selectedCountryId ? "Please select a country first" : undefined}
                        onChange={(value) => {
                          const state = states.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
                          setValue("state", value, { shouldValidate: true });
                          setValue("stateId", state ? String(state.id) : "", { shouldValidate: true });
                        }}
                      />
                    </>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="City" error={errors.city?.message}>
                    <input
                      {...register("city", {
                        required: "City is required",
                        validate: (value) => value.trim().length >= 2 || "Enter a valid city",
                        maxLength: { value: 100, message: "City must be 100 characters or fewer" },
                      })}
                      aria-invalid={!!errors.city}
                      className={errors.city ? inputErrCls : inputCls}
                      placeholder="Mumbai"
                    />
                  </Field>

                  <Field label="Postal Code" error={errors.postalCode?.message}>
                    <input
                      {...register("postalCode", {
                        required: "Postal code is required",
                        pattern: { value: /^[A-Za-z0-9 -]{3,12}$/, message: "Enter a valid postal code" },
                      })}
                      aria-invalid={!!errors.postalCode}
                      className={errors.postalCode ? inputErrCls : inputCls}
                      placeholder="400001"
                    />
                  </Field>
                </div>

                <Field label="Mobile Number" error={errors.mobileNo?.message}>
                  <Controller
                    name="mobileNo"
                    control={control}
                    rules={{
                      required: "Mobile number is required",
                      validate: (value) => isValidInternationalPhone(value) || "Enter a valid phone number for the selected country",
                    }}
                    render={({ field }) => (
                      <PhoneNumberInput
                        id="checkout-mobileNo"
                        name={field.name}
                        value={field.value || ""}
                        onChange={(value) => field.onChange(value)}
                        country=""
                        invalid={!!errors.mobileNo}
                      />
                    )}
                  />
                </Field>
              </div>
            </section>

            {/* Shipping method */}
            <section className={cardCls}>
              <SectionTitle>Shipping Method</SectionTitle>

              {!countryEntered ? (
                <div className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-cream-dark)]/70">
                  Enter your shipping address to view available shipping
                  methods.
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-[var(--color-gold)] bg-[var(--color-surface)] p-4">
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked
                      readOnly
                      className="h-4 w-4 accent-[var(--color-gold)]"
                    />

                    <span>
                      <span className="block text-sm font-medium text-[var(--color-foreground)]">
                        {isIndia
                          ? "Free shipping (Pan India)"
                          : "International shipping"}
                      </span>

                      {!isIndia && (
                        <span className="block text-xs text-[var(--color-cream-dark)]/60">
                          Flat rate for deliveries outside India
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {isIndia
                      ? "Free"
                      : formatPrice(INTERNATIONAL_SHIPPING_COST)}
                  </span>
                </label>
              )}
            </section>

            {/* Payment */}
            <section className={cardCls}>
              <SectionTitle>Payment</SectionTitle>

              <p className="-mt-4 mb-4 text-sm text-[var(--color-cream-dark)]/70">
                All transactions are secure and encrypted.
              </p>

              <div
                role="radiogroup"
                aria-label="Payment method"
                className="overflow-visible rounded-md border border-[var(--color-gold)] bg-[var(--color-surface)]"
              >
                <div className="flex items-center justify-between gap-4 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked
                      readOnly
                      className="h-4 w-4 accent-[var(--color-gold)]"
                    />

                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      Razorpay Secure (UPI, Cards, Netbanking, Wallets)
                    </span>
                  </label>

                  {/* Desktop logos + +18 popup */}
                  <div className="relative hidden shrink-0 items-center gap-1.5 sm:flex">
                    <PaymentLogoImg src={PAYMENT_LOGO.upi} alt="UPI" />
                    <PaymentLogoImg src={PAYMENT_LOGO.visa} alt="Visa" />
                    <PaymentLogoImg
                      src={PAYMENT_LOGO.mastercard}
                      alt="Mastercard"
                    />

                    <button
                      ref={methodsTriggerRef}
                      type="button"
                      onClick={() => setIsMethodsPopupOpen((open) => !open)}
                      aria-expanded={isMethodsPopupOpen}
                      aria-haspopup="dialog"
                      aria-label="See all accepted payment methods"
                      className="flex h-6 items-center rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-2 text-[11px] font-semibold text-[var(--color-cream-dark)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                    >
                      +18
                    </button>

                    {isMethodsPopupOpen && (
                      <PaymentMethodsPopup
                        onClose={() => setIsMethodsPopupOpen(false)}
                        anchorRef={methodsTriggerRef}
                      />
                    )}
                  </div>
                </div>

                {/* Mobile logos row */}
                <div className="relative flex items-center gap-1.5 px-4 pb-4 sm:hidden">
                  <PaymentLogoImg src={PAYMENT_LOGO.upi} alt="UPI" />
                  <PaymentLogoImg src={PAYMENT_LOGO.visa} alt="Visa" />
                  <PaymentLogoImg
                    src={PAYMENT_LOGO.mastercard}
                    alt="Mastercard"
                  />

                  <button
                    type="button"
                    onClick={() => setIsMethodsPopupOpen((open) => !open)}
                    aria-expanded={isMethodsPopupOpen}
                    aria-haspopup="dialog"
                    aria-label="See all accepted payment methods"
                    className="flex h-6 items-center rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-2 text-[11px] font-semibold text-[var(--color-cream-dark)]"
                  >
                    +18
                  </button>

                  {isMethodsPopupOpen && (
                    <PaymentMethodsPopup
                      onClose={() => setIsMethodsPopupOpen(false)}
                      anchorRef={methodsTriggerRef}
                    />
                  )}
                </div>

                <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 py-6 text-center text-sm text-[var(--color-cream-dark)]/70">
                  You&apos;ll be redirected to Razorpay Secure (UPI, Card, Int&apos;l
                  Card, Apple Pay) to complete your purchase{" "}
                </div>
              </div>

              <p className="mt-4 text-xs text-gold-muted">
                {keyError
                  ? `Payment configuration error: ${keyError}`
                  : razorpayError
                    ? `Razorpay failed to load: ${razorpayError}`
                    : razorpayLoading || isKeyLoading
                      ? "Loading secure payment checkout..."
                      : "Payments are processed securely through Razorpay."}
              </p>
            </section>

            {/* Pay now (last) */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="w-full"
                disabled={payDisabled}
              >
                {isSubmitting ? "Processing..." : "Pay now"}
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

          {/* ===================== Right column: order summary ===================== */}
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

                <div className="flex justify-between">
                  <span className="text-[var(--color-cream-dark)]/70">
                    Shipping
                  </span>
                  <span className="text-[var(--color-foreground)]">
                    {displayShipping > 0
                      ? formatPrice(displayShipping)
                      : "Free"}
                  </span>
                </div>
              </div>

              <div className="mb-4 mt-6 flex justify-between text-base font-semibold">
                <span className="text-[var(--color-foreground)]">Total</span>
                <span className="text-[var(--color-foreground)]">
                  {formatPrice(displayTotal)}
                </span>
              </div>

              {checkoutPricing && (
                <p className="text-center text-xs text-[var(--color-cream-dark)]/50">
                  Currency: {displayCurrency}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
