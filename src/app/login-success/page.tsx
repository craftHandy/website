"use client";

import Link from "next/link";

export default function LoginSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mx-auto text-[var(--color-gold)] border border-[var(--color-border-subtle)]">
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
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
            Login Successful
          </h1>
          <p className="text-[var(--color-cream-dark)] text-sm">
            You have successfully signed in. Welcome back!
          </p>
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