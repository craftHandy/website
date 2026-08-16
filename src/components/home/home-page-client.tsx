"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel as EmblaCarousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import { FadeIn, HoverScale, StaggerContainer, StaggerItem } from "../animations/motion";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Product = {
  id: string;
  title: string;
  slug?: string;
  price?: number;
  discountPrice?: number;
  images?: { url: string; alt?: string }[];
  category?: { title: string } | null;
};

type Category = {
  id: string;
  title?: string;
  slug?: string;
  image?: string;
};

type Collection = {
  id: string;
  title?: string;
  image?: string;
};

interface HomePageClientProps {
  featuredProducts: Product[];
  newArrivalProducts: Product[];
  categories: Category[];
  collections: Collection[];
  heroSlides: any[];
  settings: Record<string, any>;
}

const heroSlides = [
  {
    id: "slide-1",
    eyebrow: "Sanctify Your Space",
    title: "Bring the Divine Home",
    subtitle:
      "Exquisite, handcrafted deities and devotional art to elevate the energy of your living sanctuary.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDv5AJNyQ-uR9YSpupyEJF_3nwM92Q_VHU43bIkMjxwfZltx1vYjfR_A8woTRuzVpMCy8KRlfoSD24AF5yMGXVHPnpJR9FMmKyEiyJr0QdMS8Wy4EbUhLxVU5iYCQb4B98JJD1N-FHGcWHpO_ZmktffCdGJ2-eY9xQtQPtQhkwh9jVQC0BhhlzhK0dXNy_NN2rUiRQ1w1lWjN--DRAmOi-u7Qte-AftokdgQCzB654YqqM8cssN6Fgi",
  },
  {
    id: "slide-2",
    eyebrow: "Inner Peace",
    title: "Cultivate Stillness",
    subtitle:
      "Discover serenity through our masterfully carved meditation pieces.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_1oEumLXxtrsJzgc8xP3200fBE0UT7cDKyGDC8st7tcb6YSofF5Bboxtreb68bN2prjc95k80E7_QMd0kTgSI1uM1Vlx-PxWV51OAMztpE8lszxYgvcIZlGn0P9PBSLwCMZoX0UmRGr3wWCKKRkfwjjsp21SFbapjzloL4TvrEBBFC-X03nZ1NDSZ8XSwCQe4AKy_SqC_Mb2xYq8yN8BNOYphKi7HKT0XpIrUD2aVpCAYLpRoFnmE",
  },
];

const collectionCards = [
  {
    title: "Ganesha",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApQ5Zu3v7gEBgjBOOGVpl1gyfMjAwhI3XN3_cHSF8k98LKeXvK1_XdT5IGsr3PGzt6dBsjz4TQDdBWBBztDcdO7u9dPfFNo-cGQMMQ6fTmU2hQPWp9s6KwE4gAxm6mmvA6TqbMVcp9x35Yve9pN6sAoAtj8_02sQcTq1pPe0Jna_K3bZNU2Gnt9O4UZcN1_9w_7ORUo7sqonaGKyGWsAWm6dJW7cbaexr30P4xQd4RSmQ4__hPi0ID",
  },
  {
    title: "Buddha",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYRyTS0Vv7EMesB1eS020fCSymC0j9c1eLUkoVQx3SAs0Lo19nA36R_X_MPtDo7MqQKAQskYDF-AxYwqilWY4aJkv5iKg4aZLPWjcxnVVzA1xkcc5VKJGy8AYytSWbH-ZqAAsvEVaIBDZbQInNJjU_oefYLzeU-372y_qLmr-2ge7oAXXwZ0cuH5VxtbdadRx73xFrpKRSQZm1Po_wzLmy1u1Qv8HrqnE8W90RCYP9D4KKvbhqxc2",
  },
  {
    title: "Shiva",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuNlz_TOJePeVIsUk8vOs3SUJfZ21kBioJiXTQc_NF3Zqd24oMs9cp6jHCGMT3DWYsCulGm4iYAZlzxqJUmABlzrBbYeyImJUC0GSWWl7nUPQats02XIYWqfi7GhzH8fPvGZFhj8d_rtVj06EsRtDy94dOJ2noFI3qWHN2fB5OfOpJwQLj_CVMhBxIXgtIy0YmM14HX6qwD-I0YWC4-ThF89kV8qshk1NkGgeyV5NLEhqlj_VC05GK",
  },
  {
    title: "Wall Art",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYq6xY3sRnvrgspz3TbpGNtKUOJEYmPCQVOu9JnoleTzvFXscR055dVTSXE96-JeaALhKYwKCbHOWBZQ2K3eqr-fDafqTWtR3St4xJ__8mhUckeLtS6EG1nZqc-m-TlaSPfk-rc8dWeAreBL9GHYUegFUWjxvZTPfYo90agYkej3NaruuEnSx_9UtGSaJuycGJTIj5wf5hdzgYyBwsqPAaH0qydW6UMz3V2b5cmydD9M2pd3p6pam0",
  },
];

const materialCards = [
  {
    icon: "nature",
    title: "Living Wood",
    text: "Ethically sourced Teak and Rosewood, chosen for its warmth and longevity.",
  },
  {
    icon: "diamond",
    title: "Eternal Stone",
    text: "Hand-carved marble and soapstone, carrying the silent wisdom of the earth.",
  },
  {
    icon: "hardware",
    title: "Sacred Alloys",
    text: "Traditional lost-wax bronze casting, creating timeless heirlooms.",
  },
];

const newArrivals = [
  {
    id: "arrival-1",
    title: "Gilded Lotus Murti",
    description: "Hand-carved mahogany with 24k gold leaf details.",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDumcnFo7_D3mpJdqvv23MjNLXtWZ58G49FQhntUgEA5xmLJ4oJlWoObWjnXJt8XFdSuIpA8zLLeoXjEiyT6MaRE4pPhG9RSyQ2e6Nj6uKK_uoxzLUbdMRBAIQoIKcpICTHKkO6-LdvYoIb0ZUFts9kAz4oXZiQlKb0O2TN-IbgiYmVeO0ZqWg9t_JR3djxgwZ2qg01hyeFw21GbGPgnXRQiaokWhohIwRD8gHdFQV6jZqFx5Jd-dYB",
    featured: true,
  },
  {
    id: "arrival-2",
    title: "Basalt Focus Stone",
    description: "Meditation stone with natural finish",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZUznThidsFSeK6Th164wtS1-IBKg31Jj7pVZtYaLCSP1spxVw7u4_TOFjgB101Fp9ag3dxYmKAvW_2jXQtH2wrBkMnFa06uJ52JgwEtHy5jRf-lZBj4XU314jOwVa-bF65kcIlnpqfyLUSpU9uMiXnHObcvx9iq9L2cj8J74MClxfYMK-FSzIEdXcXol_XeIA6xhmjsRNUjcyZu4PyvEZZ7uGe-fLPJFrsgph7obuiPvHenczNbfe",
    featured: false,
  },
  {
    id: "arrival-3",
    title: "Amber Votive",
    description: "Glowing glass votive holder for candlelight rituals",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRYFtHKyur3ptqIrQ_5KMeY6AqADpX-vyx-j_SEIK09_3yL_zvvnhz5ZjFw-uD1E-0OzusT260m_CBkL3zYdy5J6roQtypp6TwhKg5Mk4KzZ3VwwO2jRwixSbTrZXqEC95eCdrcTfvKGPV8YIaYHmofhXJu8NsiK4ccBppnVBoHBjk2LXBw4z26koteR3kOglqW67I3flJVAIJGOXwXj0gDHeWCEgpWts8mtdKPrwPOnFK4dMi3tED",
    featured: false,
  },
];

const devotionalArtImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCG_ui5TWIMZ9Ekl2V8WmFKg30ixvHKMZ64RO_Fer4XQrSNR4l0-LRa79Q-NVvJMZaODl2tjty-K3dIrk4sx9BRNxzPrhxTaPrJord20TjjzwvN2f-dqeFtyOdaF8_RFupyVVdkvnYCSwwKPQUN7VLEIGF1yK4rGy-Ja-3BHCWIYlFF-9nYPSQV2KcrPT88GT2m4Xoz2mPeW-srgdVizDyZuiHtqrVqlwO7hqOQ9RuZVkmYhJKdz8_U";

const testimonials = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuSsaQM8CqpE3iKm83oih3f_p4rgeyscaxyjeMv2aw6hrQuL9WxOQe8NY3uOPnSDdy6jrvJA0a7BM-pQHowu9B_TZ0iiw7y-89ynbSlFhtUDv2wGvI4Q2YfwtXIbKTze9o09CpuGpU2lB0Ypr_lUTbFj1COIrE2o0xY_0D-QEJo9d6O6PSLVwOZzsxSbbwOgyOIWT76iq3d5Zd9lvquzFl56UvAbvyTBvtd1f1reb7HVTCZOmUtDAD",
    quote:
      "The serene Buddha statue transformed my morning meditation space. The craftsmanship is truly beyond words.",
    name: "Elena R.",
    location: "London",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCf-lfvVNdkSlcdL-S602FDIqVg5L9XsUKOwP4DkE8HApNRcfFYKs7QLhcmRKraijYUDhC3Qp-kCB39JvzMXdKySjQCE8flDR0S3aiH5HWp5KU47ezBjPfTqBtebLPRagUydPD7VntDEpafDpVfbFGRB4T8wlYLlQw17N07EnZVVBDXBgDQ39DosOVv8nf2iX5KUPICguAPF56OuwWRWGKm8u0e2mdAPzK-dFOUaqkYrRB6wl9v_IO-",
    quote:
      "Our bronze Ganesha arrived safely and brings such a warm, grounding energy to our entryway. A genuine heirloom.",
    name: "Marcus T.",
    location: "New York",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfzEYPqMKpH-uBnB24q4Gna8Cu8i6D3TbldMyhP-wT_rZKtsBrS05ibje1mNsybuzwAPpbzjB19OcibLDaPkhoWuhqao_gCvWOMJN8zASwMX76v7m-EKhmpl9gYg2JwJkrq8uN9Lb8JWWaR-AxGtGSFG4no2jyJcz3sZbxAkGsQhbR_XOR2ZygBR7dvv9KWgW7ioBGeKEfCeu7UBw6Sl6QO2Rvr0g36zpQXxDHG8P_kTxcTXfpo0iI",
    quote:
      "The resonance of the brass singing bowl is so pure. It's the perfect complement to the lotus wall carving.",
    name: "Priya M.",
    location: "Toronto",
  },
];

export function HomePageClient({
  featuredProducts,
  newArrivalProducts,
  categories,
  collections,
  heroSlides: existingSlides,
  settings,
}: HomePageClientProps) {
  const [autoplayMounted, setAutoplayMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setAutoplayMounted(true);
  }, []);

  const slides = existingSlides && existingSlides.length ? existingSlides : heroSlides;
  const autoplayPlugins = autoplayMounted && !shouldReduceMotion
    ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
    : [];
  const hasCategories = categories.length > 0;
  const showcaseProducts = featuredProducts.slice(0, 6);
  const arrivals = newArrivalProducts.slice(0, 8);
  const featuredGridClassName =
    showcaseProducts.length === 1
      ? "max-w-2xl"
      : showcaseProducts.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#17120d]">
        <EmblaCarousel opts={{ loop: true, align: "start" }} plugins={autoplayPlugins} className="h-full">
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id ?? `${slide.title}-${index}`} className="h-full basis-full pl-0">
                <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.image || heroSlides[index % heroSlides.length].image})`,
                    }}
                    initial={shouldReduceMotion ? false : { scale: 1.08 }}
                    animate={shouldReduceMotion ? undefined : { scale: [1.08, 1.02, 1.08], x: [0, -8, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 16, ease: "easeInOut", repeat: Infinity }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/20" />
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,76,0.16),_transparent_52%)]"
                    animate={shouldReduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [0.96, 1.06, 0.96] }}
                    transition={shouldReduceMotion ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
                  />

                  <div className="relative z-10 flex h-full items-center justify-center px-4 md:px-16">
                    <div className="mx-auto max-w-3xl text-center">
                      <motion.span
                        className="mb-5 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e8c779]"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="h-px w-8 bg-[#e8c779]/70" />
                        {slide.eyebrow || "Sanctify Your Space"}
                        <span className="h-px w-8 bg-[#e8c779]/70" />
                      </motion.span>
                      <motion.h1
                        className="mb-6 font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#fffaf1] md:text-7xl"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {slide.title || "Bring the Divine Home"}
                      </motion.h1>
                      <motion.p
                        className="mx-auto max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {slide.subtitle ||
                          "Exquisite, handcrafted deities and devotional art to elevate the energy of your living sanctuary."}
                      </motion.p>
                      <motion.div
                        className="mt-10 flex justify-center gap-4"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href="/jewelry"
                          className="inline-flex items-center justify-center rounded-full border border-[#f5d98e]/70 bg-gradient-to-r from-[#bd9140] via-[#efd38a] to-[#bd9140] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#21170b] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
                        >
                          Explore the Collection
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hero-fade-overlay" aria-hidden="true" />
          <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
            <CarouselDots />
          </div>
        </EmblaCarousel>
      </section>

      {/* Browse by Category - Sacred Collections */}
      {/* <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-16">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-foreground)]">Browse by Category</h2>
          <div className="mx-auto mt-5 h-[2px] w-28 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {collectionCards.map((card) => (
            <div key={card.title} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-[var(--color-surface-elevated)]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                <h3 className="font-serif text-2xl text-white">{card.title}</h3>
                <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View Collection
                </span>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {hasCategories ? (
        <section className="py-24 px-6 bg-[var(--color-background)] border-y border-[var(--color-gold)]/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-[var(--color-gold)] tracking-[0.25em] uppercase text-xs font-medium mb-3">
                  Browse by Category
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)]">
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
                        <div className="aspect-square rounded-sm overflow-hidden bg-[var(--color-surface-elevated)] mb-4 flex items-center justify-center border border-[var(--color-gold)]/12 group-hover:border-[var(--color-gold)]/40 transition-colors duration-300 relative luxe-card">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title||""}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          ) : (
                            <span className="text-3xl text-[var(--color-gold)]">
                              { "✦"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-[var(--color-cream-dark)] group-hover:text-[var(--color-gold)] transition-colors tracking-wide">
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
        <section className="py-24 px-6 bg-[var(--color-background)] border-y border-[var(--color-gold)]/10">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-gold)]/15 mb-6">
                <span className="text-2xl text-[var(--color-gold)]">✦</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-foreground)] mb-3">
                Categories Coming Soon
              </h2>
              <p className="text-[var(--color-gold)]/60 max-w-md mx-auto">
                We&apos;re curating our handicraft traditions. Check back soon to explore our collections.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {showcaseProducts.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-16">
          <FadeIn className="mb-12 flex items-center justify-between" direction="none">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-gold)]">Handpicked for you</p>
              <h2 className="font-serif text-4xl text-[var(--color-foreground)] md:text-5xl">Featured Products</h2>
            </div>
            <Link href="/jewelry" className="border-b border-[var(--color-gold)]/30 pb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-foreground)]">
              View All
            </Link>
          </FadeIn>

          <div className={`grid grid-cols-1 gap-6 ${featuredGridClassName}`}>
            {showcaseProducts.map((product, index) => {
              const isLeadProduct = showcaseProducts.length >= 3 && index === 0;
              const image = product.images?.[0]?.url;
              const price = product.discountPrice ?? product.price;

              return (
                <Link key={product.id} href={product.slug ? `/jewelry/${product.slug}` : "/jewelry"} className="group block">
                  <motion.article
                    className={`relative overflow-hidden rounded-lg bg-[var(--color-surface-elevated)] ${isLeadProduct ? "h-[420px] md:col-span-2 md:row-span-2 md:h-[584px]" : showcaseProducts.length <= 2 ? "h-[420px]" : "h-[280px]"}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.32), ease: [0.22, 1, 0.36, 1] }}
                  >
                    {image ? (
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,168,76,0.2),transparent_34%),linear-gradient(135deg,var(--color-surface-elevated),var(--color-background))]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                    {!image && <span className="absolute right-7 top-5 font-serif text-7xl text-[var(--color-gold)]/25">✦</span>}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      {product.category?.title && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8c779]">{product.category.title}</p>}
                      <h3 className={`font-serif text-white ${isLeadProduct ? "text-3xl md:text-4xl" : "text-xl"}`}>{product.title}</h3>
                      {typeof price === "number" && <p className="mt-3 text-sm text-white/75">${price.toFixed(2)}</p>}
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Devotional Art Section */}
      <section className="bg-[var(--color-surface-elevated)] py-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 md:grid-cols-2 md:px-16">
          <FadeIn className="order-2 md:order-1 flex flex-col items-start justify-center" direction="right">
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-foreground)] mb-6">Devotional Art</h2>
            <div className="w-16 h-px bg-[var(--color-gold)] mb-8" />
            <p className="text-lg leading-relaxed text-[var(--color-cream-dark)] mb-8">
              Our collection of devotional wall art and tapestries brings the ethereal into your physical space. Each piece is crafted by artisans who approach their work as a meditative practice, using natural pigments and woven textures to create focal points for your sanctuary.
            </p>
            <Link href="/collections/devotional-art" className="flex items-center gap-2 font-label-caps text-label-caps text-[var(--color-gold)] hover:text-[var(--color-foreground)] transition-colors group">
              DISCOVER THE ART
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </FadeIn>

          <motion.div
            className="order-1 md:order-2 relative"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 32 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="aspect-[4/5] w-full max-w-md mx-auto relative rounded-lg overflow-hidden shadow-[0_0_40px_rgba(197,160,89,0.15)]"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <motion.img
                alt="Devotional Art"
                className="w-full h-full object-cover"
                src={devotionalArtImage}
                initial={shouldReduceMotion ? false : { scale: 1.1 }}
                whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
            {/* Decorative element */}
            <motion.div
              className="absolute -bottom-8 -left-8 w-48 h-48 border border-[var(--color-gold)]/20 rounded-full mix-blend-overlay hidden md:block"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={shouldReduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </section>

      {arrivals.length > 0 && (
        <section className="bg-[var(--color-background)] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="mb-14 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-gold)]">Just Arrived</p>
                  <h2 className="font-serif text-3xl text-[var(--color-foreground)] md:text-4xl">New Arrivals</h2>
                </div>
                <Link href="/jewelry" className="hidden border-b border-[var(--color-gold)]/30 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-foreground)] md:block">
                  View All
                </Link>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4" staggerDelay={0.05} staggerChildren={0.08}>
              {arrivals.map((product) => {
                const image = product.images?.[0]?.url;
                const hasDiscount = typeof product.discountPrice === "number" && typeof product.price === "number" && product.discountPrice < product.price;
                const price = product.discountPrice ?? product.price;
                const discountPercent = hasDiscount ? Math.round((1 - product.discountPrice! / product.price!) * 100) : 0;

                return (
                  <StaggerItem key={product.id}>
                    <Link href={product.slug ? `/jewelry/${product.slug}` : "/jewelry"} className="group block">
                      <motion.article whileHover={shouldReduceMotion ? undefined : { y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-sm border border-[var(--color-gold)]/10 bg-[var(--color-surface-elevated)] transition-colors duration-300 group-hover:border-[var(--color-gold)]/40">
                          {image ? (
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
                          ) : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(201,168,76,0.2),transparent_28%),linear-gradient(135deg,var(--color-surface-elevated),var(--color-background))]" />
                          )}
                          {!image && <span className="absolute right-4 top-3 font-serif text-5xl text-[var(--color-gold)]/30">✦</span>}
                          {hasDiscount && <span className="absolute left-3 top-3 rounded bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">{discountPercent}% OFF</span>}
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
                        </div>
                        <div>
                          {product.category?.title && <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-gold)]">{product.category.title}</p>}
                          <h3 className="line-clamp-2 text-sm font-medium text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-gold)]">{product.title}</h3>
                          {typeof price === "number" && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm font-semibold text-[var(--color-foreground)]">${price.toFixed(2)}</span>
                              {hasDiscount && <span className="text-xs text-[var(--color-gold-muted)] line-through">${product.price?.toFixed(2)}</span>}
                            </div>
                          )}
                        </div>
                      </motion.article>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1596773347514-61c0e3592bc2?q=80&w=2874&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-[var(--color-background)]/90" />

        <FadeIn className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-16" direction="none" duration={0.8}>
          <motion.span
            className="material-symbols-outlined text-5xl text-[var(--color-gold)]"
            animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            workspace_premium
          </motion.span>
          <h2 className="mt-6 font-serif text-4xl md:text-6xl text-[var(--color-foreground)]">Generations of Devotion</h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-cream-dark)]">
            “Our craft is not merely shaping material; it is a meditation. Each strike of the chisel is a mantra, each polished surface a reflection of the divine within. We do not make statues; we coax the sacred out of the stone.”
          </p>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            — The Master Carvers of Jaipur
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-16">
        <FadeIn className="mb-12 text-center" direction="none">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-foreground)]">Sanctuaries Realized</h2>
          <p className="mt-3 text-lg text-[var(--color-cream-dark)]">How our patrons invite the divine into their homes.</p>
          <div className="mx-auto mt-5 h-[2px] w-28 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
        </FadeIn>

        <StaggerContainer className="grid gap-8 md:grid-cols-3" staggerDelay={0.05} staggerChildren={0.14}>
          {testimonials.map((item) => (
            <StaggerItem key={item.name}>
              <motion.div className="flex flex-col" whileHover={shouldReduceMotion ? undefined : { y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <div className="mb-6 h-80 overflow-hidden rounded-lg">
                <motion.img
                  alt={item.name}
                  className="h-full w-full object-cover"
                  src={item.image}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="px-2">
                <div className="mb-4 flex text-[var(--color-gold)]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-lg italic leading-relaxed text-[var(--color-cream-dark)]">“{item.quote}”</p>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
                  — {item.name}, {item.location}
                </span>
              </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </main>
  );
}
