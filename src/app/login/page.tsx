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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif text-neutral-900 mb-1 block">Ratnagiri</Link>
          <p className="text-neutral-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2" required />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2" required />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full h-11 bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm font-medium rounded-sm transition-colors disabled:opacity-50">
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-4">
          Demo mode: any email and password will sign you in.
        </p>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#C9A84C] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
