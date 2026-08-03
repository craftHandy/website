"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, HoverScale } from "@/components/animations/motion";
import { Button } from "@/components/ui/button";
import { Carousel as EmblaCarousel, CarouselContent, CarouselItem, CarouselDots, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from "@/components/shared/product-card";
import type { Product, Category, Collection } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  "temple-jewelry": "🛕",
  "kundan-jewelry": "💎",
  "jadau-jewelry": "👑",
  "silver-jewelry": "✨",
  "brass-jewelry": "🔨",
  "gemstone-jewelry": "💠",
};

interface HomePageClientProps {
  featuredProducts: Product[];
  categories: Category[];
  collections: Collection[];
  heroSlides: any[];
  settings: Record<string, any>;
}

export function HomePageClient({ featuredProducts, categories, collections, heroSlides, settings }: HomePageClientProps) {
  const [autoplayMounted, setAutoplayMounted] = useState(false);
  useEffect(() => setAutoplayMounted(true), []);

  const newArrivals = featuredProducts.slice(0, 8);
  const hasCategories = categories.length > 0;
  const hasFeatured = featuredProducts.length > 0;
  const hasNewArrivals = newArrivals.length > 0;
  const hasHero = heroSlides.length > 0;
  const autoplayPlugins = autoplayMounted
    ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
    : [];

  return (
    <main>
      {hasHero ? (
        <EmblaCarousel
          opts={{ loop: true, align: "start" }}
          plugins={autoplayPlugins}
          className="relative"
        >
          <CarouselContent>
            {heroSlides.map((slide, idx) => (
              <CarouselItem key={slide.id}>
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-[1]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/80 z-[1]" />
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0a0a0a] z-0 flex items-center justify-center">
                      <div className="text-gold/10 text-[20rem] font-serif leading-none select-none">✦</div>
                    </div>
                  )}
                  <div className="relative z-10 px-6 max-w-4xl mx-auto md:ml-[10vw] md:mr-auto md:text-left md:max-w-2xl">
                    <FadeIn>
                      <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-medium">
                        Authentic Nepalese & Tibetan Handicrafts
                      </p>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream mb-6 leading-[1.1]">
                        {slide.title}
                      </h1>
                    </FadeIn>
                    {slide.subtitle && (
                      <FadeIn delay={0.2}>
                        <p className="text-cream-dark/80 text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
                          {slide.subtitle}
                        </p>
                      </FadeIn>
                    )}
                    {slide.ctaText && slide.ctaLink && (
                      <FadeIn delay={0.4}>
                        <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-[#0a0a0a] px-8 text-base tracking-wider font-medium">
                          <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                        </Button>
                      </FadeIn>
                    )}
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <CarouselDots />
          </div>
        </EmblaCarousel>
      ) : (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-[1]" />
          <div className="absolute inset-0 bg-[#1a1a1a] z-0 flex items-center justify-center">
            <div className="text-[#C9A84C]/10 text-[20rem] font-serif leading-none select-none">✦</div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <FadeIn>
              <p className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-6 font-medium">
                Handcrafted with Devotion
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1]">
                {settings.heroTitle || "Where Heritage Meets Elegance"}
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                {settings.heroSubtitle || "Discover jewelry that carries centuries of Indian craftsmanship — each piece a testament to the artisans of Ratnagiri."}
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#C9A84C] hover:bg-[#B8973A] text-white px-8 text-base tracking-wide">
                  <Link href="/jewelry">Explore Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 text-base tracking-wide">
                  <Link href="/blogs">Our Stories</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C9A84C]" />
          </div>
        </section>
      )}

      {hasCategories ? (
        <section className="py-24 px-6 bg-[#0a0a0a] border-y border-[rgba(201,168,76,0.1)]">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
                  Browse by Category
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-cream">
                  Handicraft Traditions
                </h2>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6" staggerDelay={0.1}>
              {categories.slice(0, 6).map((category: Category) => (
                <StaggerItem key={category.id}>
                  <Link href={`/jewelry?category=${category.slug}`}>
                    <HoverScale>
                      <div className="group text-center">
                        <div className="aspect-square rounded-sm overflow-hidden bg-[#141414] mb-4 flex items-center justify-center border border-[rgba(201,168,76,0.12)] group-hover:border-gold/40 transition-colors duration-300 relative luxe-card">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          ) : (
                            <span className="text-3xl">
                              {CATEGORY_ICONS[category.slug] || "✦"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-cream-dark group-hover:text-gold transition-colors tracking-wide">
                          {category.title}
                        </h3>
                      </div>
                    </HoverScale>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : (
        <section className="py-24 px-6 bg-[#0a0a0a] border-y border-[rgba(201,168,76,0.1)]">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#141414] border border-[rgba(201,168,76,0.15)] mb-6">
                <span className="text-2xl text-gold">✦</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-cream mb-3">
                Categories Coming Soon
              </h2>
              <p className="text-gold-muted max-w-md mx-auto">
                We&apos;re curating our handicraft traditions. Check back soon to explore our collections.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {hasFeatured ? (
        <section className="py-24 px-6 bg-[#141414]">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
                  Most Loved
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-cream">
                  Best Sellers
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <EmblaCarousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {featuredProducts.map((product: Product, index: number) => (
                    <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <ProductCard product={product} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </EmblaCarousel>
            </FadeIn>
          </div>
        </section>
      ) : (
        <section className="py-24 px-6 bg-[#141414]">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] border border-[rgba(201,168,76,0.15)] mb-6">
                <span className="text-2xl text-gold">💎</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-cream mb-3">
                Best Sellers on the Way
              </h2>
              <p className="text-gold-muted max-w-md mx-auto mb-6">
                Our most-loved pieces are being prepared. Be the first to discover them.
              </p>
              <Button asChild className="bg-gold hover:bg-gold-dark text-[#0a0a0a] px-8 font-medium tracking-wider">
                <Link href="/jewelry">Browse All Jewelry</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-28 px-6 bg-[#0a0a0a] border-y border-[rgba(201,168,76,0.1)] grain">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="aspect-[3/4] bg-[#141414] border border-[rgba(201,168,76,0.15)] rounded-sm overflow-hidden relative flex items-center justify-center gold-glow">
                <span className="text-gold/20 text-[12rem] font-serif select-none">✦</span>
              </div>
            </FadeIn>
            <div>
              <FadeIn direction="right">
                <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
                  The Art of Devotion
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6 leading-tight">
                  Centuries of Craft,<br />Treasured Today
                </h2>
              </FadeIn>
              <FadeIn direction="right" delay={0.2}>
                <p className="text-cream-dark/80 mb-4 leading-relaxed">
                  Himalayan handicraft traditions stretch back millennia — from the master sculptors of Nepal and Tibet who cast divine statues with sacred precision, to the artisans whose ritual objects and temple adornments remain unmatched. At Ratnagiri, we honor these living traditions by partnering with master craftspeople across the Himalayas.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.3}>
                <p className="text-cream-dark/80 mb-8 leading-relaxed">
                  Each piece — whether a copper statue, a singing bowl, or a ritual artifact — carries forward a legacy of devotion, skill, and artistry that transcends ornamentation. When you bring a Ratnagiri piece into your space, you bring these sacred stories with you.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.4}>
                <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-[#0a0a0a] tracking-wider">
                  <Link href="/blogs">Read Our Stories</Link>
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {hasNewArrivals ? (
        <section className="py-24 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
                    Just Arrived
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif text-cream">
                    New Arrivals
                  </h2>
                </div>
                <Link href="/jewelry" className="text-sm text-gold tracking-wider uppercase hover:text-gold-light hidden md:block transition-colors">
                  View All →
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.05}>
              {newArrivals.map((product: Product, index: number) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : (
        <section className="py-24 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#141414] border border-[rgba(201,168,76,0.15)] mb-6">
                <span className="text-2xl text-gold">✨</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-cream mb-3">
                New Arrivals Coming Soon
              </h2>
              <p className="text-gold-muted max-w-md mx-auto mb-6">
                We&apos;re adding new pieces to our collection. Stay tuned for fresh arrivals.
              </p>
              <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-[#0a0a0a] px-8 tracking-wider">
                <Link href="/jewelry">Browse All Jewelry</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-[#141414] border-t border-[rgba(201,168,76,0.1)]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
              Stay Connected
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">
              Join the Ratnagiri Circle
            </h2>
            <p className="text-cream-dark/80 mb-8">
              Be the first to discover new collections, artisan stories, and exclusive offers.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-12 px-4 bg-[#0a0a0a] border border-[rgba(201,168,76,0.2)] rounded-sm text-sm text-cream placeholder:text-gold-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-[#0a0a0a] font-medium tracking-wider px-8">
                Subscribe
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}