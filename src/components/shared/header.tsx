"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, ChevronDown, MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { getCategories } from "@/lib/api";
import { useTheme } from "@/app/providers";
import type { Category } from "@/types";

const TOP_LINKS = [
  // { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/stories", label: "Stories" },
];

const staggerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" as const },
  }),
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scaleY: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.95,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);
  const itemCount = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesQuery.data ?? [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearUser();
    setShowUserMenu(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border-subtle)] shadow-[0_4px_30px_rgba(15,23,42,0.08)]">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-[var(--color-surface-elevated)] text-[var(--color-gold)] text-center text-[11px] tracking-[0.2em] py-2.5  border-b border-[var(--color-border-subtle)]"
      >
        ✦ Worldwide Shipping &nbsp;·&nbsp; 15+ Years of Trust &nbsp;·&nbsp; Authentic Himalayan Handicraft
      </motion.div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <Link href="/" className="group">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Ratna Treasure Handicraft"
                className="h-auto w-44 invert brightness-0 sepia hue-rotate-[-10deg] saturate-[3]"
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/product"
              className="text-xs tracking-[0.2em]  text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors duration-300"
            >
              Product
            </Link>
            <div ref={catRef} className="relative">
              <button
                onMouseEnter={() => setCatOpen(true)}
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 text-xs tracking-[0.2em]  text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                Categories
                <motion.span
                  animate={{ rotate: catOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3" />
                </motion.span>
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-60 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 overflow-hidden origin-top"
                  >
                    <div className="max-h-80 overflow-y-auto overscroll-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {categories.length === 0 ? (
                        <div className="px-4 py-2.5 text-sm text-[var(--color-gold-muted)]">Loading...</div>
                      ) : (
                        categories.map((cat, i) => (
                          <motion.div
                            key={cat.id}
                            variants={staggerVariants}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                          >
                            <Link
                              href={`/product?categoryId=${cat.id}`}
                              onClick={() => setCatOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--color-gold)] transition-colors duration-150"
                            >
                              <span className="w-5 h-5 rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center text-xs text-[var(--color-gold)]">
                                ✦
                              </span>
                              <span className="tracking-wide">{cat.title}</span>
                            </Link>
                          </motion.div>
                        ))
                      )}
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.2em]  text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-[var(--color-foreground)]">
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-[var(--color-gold)] transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center text-[var(--color-foreground)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 hover:text-[var(--color-gold)] transition-colors" aria-label="Open user menu">
                <User className="h-5 w-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 z-50">
                  {user ? (
                    <>
                      <p className="px-4 py-1.5 text-xs text-[var(--color-gold-muted)] truncate">{user.email}</p>
                      <hr className="my-1 border-[var(--color-border-subtle)]" />
                      <Link href="/orders" className="block px-4 py-1.5 text-sm text-[var(--color-foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--color-gold)]" onClick={() => setShowUserMenu(false)}>
                        My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-1.5 text-sm text-[var(--color-foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--color-gold)]">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-1.5 text-sm text-[var(--color-foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--color-gold)]" onClick={() => setShowUserMenu(false)}>
                        Sign In
                      </Link>
                      <Link href="/register" className="block px-4 py-1.5 text-sm text-[var(--color-foreground)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--color-gold)]" onClick={() => setShowUserMenu(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/cart" className="relative p-2 hover:text-[var(--color-gold)] transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--color-gold)] text-[#0a0a0a] text-[10px] flex items-center justify-center font-semibold"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form action="/product" method="GET" className="py-4 flex gap-2">
                <Input name="search" placeholder="Search products..." className="flex-1 bg-[var(--color-surface-elevated)] border-[var(--color-border-subtle)] text-[var(--color-foreground)] placeholder:text-[var(--color-gold-muted)] focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]" autoFocus />
                <Button type="submit" className="bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[#0a0a0a] font-medium tracking-wider  text-xs">Search</Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[var(--color-background)] border-t border-[var(--color-border-subtle)]"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] hover:text-[var(--color-gold)] transition-colors"
                >
                  {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                </button>
              </div>
              <Link
                href="/product"
                className="block text-sm tracking-wide text-[var(--color-foreground)] hover:text-[var(--color-gold)]"
                onClick={() => setMobileOpen(false)}
              >
                All Products
              </Link>
              <div className="pb-1">
                <p className="text-[10px] tracking-widest  text-[var(--color-gold-muted)] mb-2 px-1">
                  Statues
                </p>
                <div className="space-y-2 pl-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-[var(--color-gold-muted)] pl-2">Loading...</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/product?categoryId=${cat.id}`}
                        className="flex items-center gap-2 text-sm tracking-wide text-[var(--color-foreground)] hover:text-[var(--color-gold)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-xs text-[var(--color-gold)]">✦</span>
                        <span>{cat.title}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              {TOP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm tracking-wide text-[var(--color-foreground)] hover:text-[var(--color-gold)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
