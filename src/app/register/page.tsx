"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/user";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setUser({
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      role: "customer",
    });

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif text-[var(--color-foreground)] mb-1 block">Ratnagiri</Link>
          <p className="text-[var(--color-cream-dark)] text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]" />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]" required />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]" required minLength={6} />
          </div>

          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-sm">{error}</p>}

          <button type="submit" className="w-full h-11 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[#0a0a0a] text-sm font-medium rounded-sm transition-colors">
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-4">
          Demo mode: your account is stored locally in this browser only.
        </p>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
