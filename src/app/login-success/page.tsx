"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user";

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );

    const json =
      typeof window !== "undefined"
        ? window.atob(padded)
        : Buffer.from(padded, "base64").toString("binary");

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const token =
      searchParams.get("access_token") ||
      searchParams.get("token") ||
      (() => {
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;

        const params = new URLSearchParams(hash || "");
        return params.get("access_token") || params.get("token");
      })();

    if (!token) {
      setIsProcessing(false);
      return;
    }

    const decoded = decodeJwtPayload(token) || {};
    const user = {
      id: decoded.sub || decoded.userId || `google-${Date.now().toString(36)}`,
      name: decoded.name || decoded.given_name || "Google User",
      email: decoded.email || "",
      role: decoded.role || "customer",
    };

    localStorage.setItem("access_token", token);
    setUser(user);

    const timer = window.setTimeout(() => {
      setIsProcessing(false);
      router.push("/");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router, searchParams, setUser]);

  const statusText = useMemo(() => {
    if (isProcessing) {
      return "Finalizing your Google sign-in...";
    }
    return "Sign-in was completed. Redirecting...";
  }, [isProcessing]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mx-auto text-[var(--color-gold)] border border-[var(--color-border-subtle)]">
          {isProcessing ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent" />
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
            {isProcessing ? "Signing You In" : "Login Successful"}
          </h1>
          <p className="text-[var(--color-cream-dark)] text-sm">{statusText}</p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-block w-full py-3 px-4 bg-[var(--color-gold)] text-[#0a0a0a] font-medium rounded-lg hover:bg-[var(--color-gold-dark)] transition-colors duration-200 shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}