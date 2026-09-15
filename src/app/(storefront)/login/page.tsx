"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/user";
import {
  loginUser,
  getAccessTokenFromLoginResponse,
  decodeJwtPayload,
} from "@/lib/api";
import { toast } from "@/store/toast";

interface LoginForm {
  email: string;
  password: string;
}

const inputCls =
  "w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] font-poppins";
const labelCls =
  "block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5 font-poppins";
const errCls = "text-red-600 text-xs mt-1 font-poppins";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const setUser = useUserStore((s) => s.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: "", password: "" } });

  async function onSubmit(data: LoginForm) {
    try {
      const payload = await loginUser({
        email: data.email.trim(),
        password: data.password,
      });

      // Store access token exactly like Google sign-in (login-success page)
      const token = getAccessTokenFromLoginResponse(payload);
      if (!token) throw new Error("Login succeeded but no access token was returned.");

      localStorage.setItem("access_token", token);

      const decoded = decodeJwtPayload(token) || (payload?.data ?? payload ?? {});
      setUser({
        id: String(decoded.sub || decoded.userId || decoded.id || `usr-${Date.now().toString(36)}`),
        name: String(
          decoded.name ||
            decoded.fullName ||
            decoded.given_name ||
            data.email.split("@")[0]
        ),
        email: String(decoded.email || decoded.username || data.email.trim()),
        role: String(decoded.role || decoded.authority || "customer"),
      });

      toast("Signed in", { description: "Welcome back!", variant: "success" });
      router.push(redirect);
    } catch (e: any) {
      toast("Sign in failed", {
        description: e?.message || "Invalid email or password.",
        variant: "error",
      });
    }
  }

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-foreground)] flex justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-fluid-h3 font-serif text-[var(--color-foreground)] mb-1">Welcome back</h1>
          <p className="text-[var(--color-cream-dark)] text-fluid-small font-poppins">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              className={inputCls}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input
              type="password"
              className={inputCls}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className={errCls}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[#0a0a0a] text-sm font-medium font-poppins rounded-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          <span className="text-xs text-[var(--color-cream-dark)] font-poppins">or</span>
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
        </div>

        <a
          href="https://backend-4gle.onrender.com/oauth2/authorization/google"
          className="w-full h-11 flex items-center justify-center gap-2.5 border border-[var(--color-border-subtle)] rounded-sm text-sm font-medium font-poppins text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </a>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-6 font-poppins">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
