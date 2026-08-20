import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { getCategories } from "@/lib/api";

const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Our Blog", href: "/blogs" },
    { label: "Collections", href: "/collections" },
    { label: "Contact Us", href: "/contact" },
  ],
  support: [
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Care Instructions", href: "/care" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-[var(--color-background)] text-[var(--color-foreground)] border-t border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-[var(--color-foreground)] tracking-wider mb-4">RATNAGIRI</h3>
            <p className="text-sm leading-relaxed mb-6 text-[var(--color-cream-dark)]">
              Curating the Himalaya&apos;s finest handcrafted treasures — statues, ritual art, and timeless heritage pieces from Nepal and Tibet.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/jewelry?category=${cat.slug}`} className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">About</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>

            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border-subtle)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[var(--color-gold-muted)]">&copy; {new Date().getFullYear()} Ratnagiri. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
