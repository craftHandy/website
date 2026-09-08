import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { getCategories } from "@/lib/api";

const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Our Blog", href: "/stories" },
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
            <h3 className="text-2xl font-serif text-[var(--color-foreground)] tracking-wider mb-4">
              RATNA TREASURE HANDICRAFT
            </h3>
            <p className="text-sm leading-relaxed mb-6 text-[var(--color-cream-dark)] font-poppins">
              Curating the Himalaya&apos;s finest handcrafted treasures —
              statues, ritual art, and timeless heritage pieces from Nepal and
              Tibet.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/ratna_treasure_handicraft/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/p/Ratna-Treasure-Handicraft-100086415617036/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.threads.com/@ratna_treasure_handicraft?xmt=AQG00hwbb6uE2xJZ3tSjr_-8eBQsYvgnHN5K_qfZ-Yjy9u8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="text-[var(--color-gold-muted)] transition-colors hover:text-[var(--color-gold)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M12.186 2C6.605 2 3.5 5.395 3.5 11.5c0 6.227 3.207 10.5 9.186 10.5 5.304 0 8.814-2.806 8.814-7.09 0-3.793-2.687-6.02-7.018-6.02-1.338 0-2.465.223-3.357.658-.144-1.688.62-2.748 2.31-2.748 1.182 0 2.054.525 2.603 1.564l2.167-.921c-.854-1.882-2.535-2.89-4.77-2.89-3.147 0-4.88 2.005-4.52 5.356.847-.355 1.906-.56 3.19-.56 3.016 0 4.72 1.307 4.72 3.69 0 2.578-2.01 4.15-5.12 4.15-3.484 0-5.485-2.306-5.485-6.309C6.22 7.216 8.4 4.43 12.19 4.43c3.1 0 5.112 1.72 5.65 4.59l2.35-.53C19.47 4.6 16.5 2 12.186 2Zm-.04 11.25c2.02 0 2.98.62 2.98 1.65 0 1.055-1.07 1.74-2.83 1.74-1.48 0-2.52-.58-2.52-1.67 0-1.05.84-1.72 2.37-1.72Z" />
                </svg>
              </a>

              <a
                href="mailto:ratnacraft@gmail.com"
                className="text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">
              Categories
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/jewelry?category=${cat.slug}`}
                    className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors font-poppins"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">
              About
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors font-poppins"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest  text-[var(--color-gold)] mb-4 font-medium">
              Support
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors font-poppins"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border-subtle)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center font-poppins">
          <p className="text-xs text-[var(--color-gold-muted)]">
            &copy; {new Date().getFullYear()} Ratna Treasue Handicraft. All
            rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
