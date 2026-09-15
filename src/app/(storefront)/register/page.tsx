"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/api";
import { toast } from "@/store/toast";

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

const inputCls =
  "w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] font-poppins";
const labelCls =
  "block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5 font-poppins";
const errCls = "text-red-600 text-xs mt-1 font-poppins";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  async function onSubmit(data: RegisterForm) {
    try {
      await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast("Account created", {
        description: "Redirecting you to login...",
        variant: "success",
      });
      setTimeout(() => router.push("/login"), 800);
    } catch (e: any) {
      toast("Registration failed", {
        description: e?.message || "Please try again.",
        variant: "error",
      });
    }
  }

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-foreground)] flex justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-fluid-h3 font-serif text-[var(--color-foreground)] mb-1">Create your account</h1>
          <p className="text-[var(--color-cream-dark)] text-fluid-small font-poppins">Join Ratna Treasure Handicraft</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className={inputCls}
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              className={inputCls}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel"
              placeholder="+9779841234669"
              className={inputCls}
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input
              type="text"
              placeholder="Kathmandu, Nepal"
              className={inputCls}
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className={errCls}>{errors.address.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${inputCls} pr-11`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cream-dark)] hover:text-[var(--color-foreground)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className={errCls}>{errors.password.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`${inputCls} pr-11`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cream-dark)] hover:text-[var(--color-foreground)] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className={errCls}>{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[#0a0a0a] text-sm font-medium font-poppins rounded-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-cream-dark)] mt-6 font-poppins">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
