"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  MoonStar,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { getCategories } from "@/lib/api";
import { useTheme } from "@/app/providers";
import type { Category } from "@/types";
import { useSearchParams } from "next/navigation";

const TOP_LINKS = [
  // { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/stories", label: "Stories" },
  { href: "/contact", label: "Contact Us" },
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
    const params = useSearchParams();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [search,setSearch]=useState(params.get("search")||"");
  const catRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);
  const itemCount = useCartStore((s) =>
    s.items.reduce((a, b) => a + b.quantity, 0),
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
 useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params.get("search")]);
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

  function handleLogoutRequest() {
    setShowUserMenu(false);
    setLogoutConfirmOpen(true);
  }

  function handleConfirmLogout() {
    clearUser();
    setLogoutConfirmOpen(false);
  }

  return (


    <header className="sticky top-0 z-50 bg-[#131313] text-white border-b border-[#3a3428] shadow-[0_4px_30px_rgba(0,0,0,0.25)]">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-[#1e1e1e] text-[#e9c176] text-center text-[11px] tracking-[0.2em] py-2.5 border-b border-[#3a3428]"
      >
        ✦ Worldwide Shipping &nbsp;·&nbsp; 15+ Years of Trust &nbsp;·&nbsp;
        Authentic Himalayan Handicraft
      </motion.div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white hover:text-[#e9c176] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex items-center gap-4">
              <img
                src="/header.png"
                alt="Ratna Treasure Handicraft"
                className="h-auto w-44"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="tracking-[0.2em] text-white hover:text-[#e9c176] transition-colors duration-300"
            >
              Home
            </Link>

            <Link
              href="/product"
              className="tracking-[0.2em] text-white hover:text-[#e9c176] transition-colors duration-300"
            >
              Product
            </Link>

            {/* Categories */}
            <div ref={catRef} className="relative">
              <button
                onMouseEnter={() => setCatOpen(true)}
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 text-sm tracking-[0.2em] text-white hover:text-[#e9c176] transition-colors duration-300"
              >
                Categories
                <motion.span
                  animate={{ rotate: catOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3 text-white" />
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
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-60 bg-[#1e1e1e] border border-[#3a3428] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 overflow-hidden origin-top"
                  >
                    <div className="max-h-80 overflow-y-auto overscroll-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {categories.length === 0 ? (
                        <div className="px-4 py-2.5 text-sm text-[#d9b66c]">
                          Loading...
                        </div>
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
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[rgba(201,168,76,0.08)] hover:text-[#e9c176] transition-colors duration-150"
                            >
                              <span className="w-5 h-5 rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center text-xs text-[#e9c176]">
                                ✦
                              </span>

                              <span className="tracking-wide">{cat.title}</span>
                            </Link>
                          </motion.div>
                        ))
                      )}
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e9c176] to-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Links */}
            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="tracking-[0.2em] text-white hover:text-[#e9c176] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-3 text-white">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white hover:text-[#e9c176] transition-colors"
              aria-label="Search"
            >
              <Search className="size-6 text-white" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center text-white transition hover:text-[#e9c176]"
            >
              {theme === "dark" ? (
                <SunMedium className="size-6 text-white" />
              ) : (
                <MoonStar className="size-6 text-white" />
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-white hover:text-[#e9c176] transition-colors"
                aria-label="Open user menu"
              >
                <User className="size-6 text-white" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#1e1e1e] border border-[#3a3428] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.4)] py-2 z-50">
                  {user ? (
                    <>
                      <p className="px-4 py-1.5 text-xs text-[#d9b66c] truncate">
                        {user.email}
                      </p>

                      <hr className="my-1 border-[#3a3428]" />

                      <button
                        onClick={handleLogoutRequest}
                        className="w-full text-left px-4 py-1.5 text-sm text-white hover:bg-[rgba(201,168,76,0.08)] hover:text-[#e9c176]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-1.5 text-sm text-white hover:bg-[rgba(201,168,76,0.08)] hover:text-[#e9c176]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/register"
                        className="block px-4 py-1.5 text-sm text-white hover:bg-[rgba(201,168,76,0.08)] hover:text-[#e9c176]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-white hover:text-[#e9c176] transition-colors"
            >
              <ShoppingBag className="size-6 text-white" />

              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#e9c176] text-[#0a0a0a] text-[10px] flex items-center justify-center font-semibold"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form action="/product" method="GET" className="py-4 flex gap-2">
                <Input
                  name="search"
                  placeholder="Search products..."
                  className="flex-1 bg-[#1e1e1e] border-[#3a3428] text-white placeholder:text-[#9a7b2c] focus:border-[#e9c176] focus:ring-[#e9c176]"
                  autoFocus
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />

                <Button
                  type="submit"
                  className="bg-[#e9c176] hover:bg-[#c5a059] text-[#0a0a0a] font-medium tracking-wider text-xs"
                >
                  Search
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#131313] border-t border-[#3a3428]"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Theme Toggle */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3428] bg-[#1e1e1e] text-white hover:text-[#e9c176] transition-colors"
                >
                  {theme === "dark" ? (
                    <SunMedium className="h-4 w-4 text-white" />
                  ) : (
                    <MoonStar className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>

              <Link
                href="/product"
                className="block text-sm tracking-wide text-white hover:text-[#e9c176]"
                onClick={() => setMobileOpen(false)}
              >
                All Products
              </Link>

              <div className="pb-1">
                <p className="text-[10px] tracking-widest text-[#d9b66c] mb-2 px-1">
                  Statues
                </p>

                <div className="space-y-2 pl-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-[#d9b66c] pl-2">Loading...</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/product?categoryId=${cat.id}`}
                        className="flex items-center gap-2 text-sm tracking-wide text-white hover:text-[#e9c176]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-xs text-[#e9c176]">✦</span>

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
                  className="block text-sm tracking-wide text-white hover:text-[#e9c176]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Logout
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-sm text-[var(--color-foreground)]">
            Are you sure you want to sign out? Your cart and theme preferences
            will be preserved.
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmLogout}
              className="flex-1 bg-[var(--color-gold)] text-[#0a0a0a] hover:bg-[var(--color-gold-dark)]"
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
