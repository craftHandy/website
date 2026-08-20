"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/user";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    setUser({
      id: `usr-${Date.now().toString(36)}`,
      name: email.split("@")[0],
      email: email.trim(),
      role: "customer",
    });

    router.push(redirect);
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif text-[var(--color-foreground)] mb-1 block">Ratnagiri</Link>
          <p className="text-[var(--color-cream-dark)] text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]" required />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]" required />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full h-11 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[#0a0a0a] text-sm font-medium rounded-sm transition-colors disabled:opacity-50">
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          <span className="text-xs text-[var(--color-cream-dark)]">or</span>
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
        </div>

        <a
          href="https://backend-4gle.onrender.com/oauth2/authorization/google"
          className="w-full h-11 flex items-center justify-center gap-2.5 border border-[var(--color-border-subtle)] rounded-sm text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </a>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-4">
          Demo mode: any email and password will sign you in.
        </p>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
