"use client";

import { useEffect, useState } from "react";
import { useRazorpay as useRazorpayOriginal } from "react-razorpay";

export function useRazorpay() {
  const { Razorpay, isLoading: originalLoading, error: razorpayError } = useRazorpayOriginal();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // The original useRazorpay sets isLoading to true on mount,
    // then sets it to false when the script loads.
    // If the script is already cached/window.Razorpay exists,
    // the original hook gets stuck with isLoading = true forever.
    // We fix this by checking if Razorpay is actually available.
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setIsLoading(false);
    } else if (!originalLoading) {
      setIsLoading(false);
    } else {
      setIsLoading(originalLoading);
    }
  }, [originalLoading, isClient, Razorpay]);

  return { Razorpay, isLoading, error: razorpayError };
}