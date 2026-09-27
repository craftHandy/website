"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAccessTokenExpired } from "@/lib/api";
import { useUserStore } from "@/store/user";
import { ProfileDetailsCard } from "@/components/account/profile-card";

export default function ProfilePage() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("access_token");
    setAuthChecked(true);
    if (!savedToken || isAccessTokenExpired(savedToken)) {
      if (savedToken) clearUser();
      router.replace("/login?redirect=/profile");
      return;
    }
    setToken(savedToken);
  }, [clearUser, router]);

  if (!authChecked || !token)
    return <main className="min-h-screen bg-[var(--color-background)]" />;

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em] text-xs font-medium mb-3">
            Your Account
          </p>
          <h1 className="text-fluid-h3 font-serif">My Profile</h1>
        </div>

        <ProfileDetailsCard token={token} />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gold hover:underline text-sm font-medium font-poppins"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
