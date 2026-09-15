"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel as EmblaCarousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { FadeIn, StaggerContainer, StaggerItem } from "../animations/motion";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { ArrowRight } from "lucide-react";
import { ProductCard } from "../shared/product-card";
import type { Product, Category, Collection } from "@/types";

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

const trustPillars = [
  {
    icon: "workspace_premium",
    title: "Made with intention",
    description:
      "Handcrafted pieces selected for their character, detail, and lasting beauty.",
  },
  {
    icon: "verified_user",
    title: "Authentic materials",
    description:
      "Thoughtfully sourced wood, stone, metal, and natural finishes.",
  },
  {
    icon: "public",
    title: "Delivered with care",
    description:
      "Secure packaging and dependable delivery, wherever your sanctuary is.",
  },
];

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

function AnimatedRule({
  reduceMotion,
  className = "",
}: {
  reduceMotion: boolean | null;
  className?: string;
}) {
  return (
    <motion.div
      className={`h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

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

  const hasApiHeroSlides = Boolean(existingSlides?.length);
  const slides = hasApiHeroSlides ? existingSlides : [heroSlides[0]];
  const hasHeroCarousel = hasApiHeroSlides && slides.length > 1;
  const hasHeroImage = Boolean(slides[0]?.image);
  const autoplayPlugins =
    autoplayMounted && hasHeroCarousel && !shouldReduceMotion
      ? [
          Autoplay({
            delay: 8000,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]
      : [];

  const hasCategories = categories.length > 0;
  const showcaseProducts = featuredProducts.slice(0, 8);
  const arrivals = newArrivalProducts.slice(0, 8);

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Hero */}

      <section className="relative h-[48vh] lg:h-[80vh] w-full overflow-hidden bg-[var(--color-background)] bg-cover lg:bg-center">
        <EmblaCarousel
          opts={{ loop: hasHeroCarousel, align: "start" }}
          plugins={autoplayPlugins}
          className="h-full"
        >
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem
                key={slide.id ?? `${slide.title}-${index}`}
                className="h-full basis-full pl-0"
              >
                <div className="relative h-[48vh] min-h-[360px] lg:h-[80vh] lg:min-h-[640px] w-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-[80%_center] sm:bg-[75%_center] lg:bg-center"
                    style={{
                      backgroundImage: slide.image
                        ? `url(${slide.image})`
                        : undefined,
                    }}
                    initial={shouldReduceMotion ? false : { scale: 1.08 }}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { scale: [1.08, 1.02, 1.08], x: [0, -8, 0] }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { duration: 16, ease: "easeInOut", repeat: Infinity }
                    }
                  />

                  <div
                    className={
                      hasHeroImage
                        ? "absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75"
                        : "absolute inset-0 bg-gradient-to-b from-[#1b120d]/70 via-[#1b120d]/35 to-[#1b120d]/60"
                    }
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/20" />

                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,76,0.16),_transparent_52%)]"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            opacity: [0.55, 0.9, 0.55],
                            scale: [0.96, 1.06, 0.96],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { duration: 7, ease: "easeInOut", repeat: Infinity }
                    }
                  />

                  {/* Left aligned hero content */}
                  <div className="relative z-10 flex h-full items-center px-4 md:px-16">
                    <div className="w-full max-w-3xl text-left max-md:px-4">
                      <motion.h1
                        className="mb-1.5 lg:mb-6 font-serif font-medium leading-[0.95] tracking-[-0.035em] text-[#e8c779]/70 text-fluid-h3 sm:text-fluid-display"
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 28 }
                        }
                        animate={
                          shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                        }
                        transition={{
                          duration: 0.85,
                          delay: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.span
                        className="mb-1.5 lg:mb-5 flex items-center justify-start gap-3 text-[10px] sm:text-xs font-semibold tracking-[0.28em] text-[#e8c779]"
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 14 }
                        }
                        animate={
                          shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                        }
                        transition={{
                          duration: 0.65,
                          delay: 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <span className="h-px w-6 lg:w-8 bg-[#e8c779]/70" />
                        {slide.eyebrow || "Handcrafted with devotion"}
                        <span className="h-px w-6 lg:w-8 bg-[#e8c779]/70" />
                      </motion.span>

                      <motion.p
                        className="max-w-xl text-left w-full text-fluid-body leading-tight lg:leading-relaxed text-white md:text-fluid-h3 font-poppins"
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 20 }
                        }
                        animate={
                          shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                        }
                        transition={{
                          duration: 0.7,
                          delay: 0.46,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {slide.subtitle ||
                          "Discover pieces made to bring warmth, craft, and meaning into your space."}
                      </motion.p>

                      <div className="flex max-md:flex-col gap-2 lg:gap-4 md:items-center mt-3 lg:mt-10">
                        <motion.div
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 16 }
                          }
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : { opacity: 1, y: 0 }
                          }
                          transition={{
                            duration: 0.6,
                            delay: 0.62,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href="/product"
                            className="inline-flex text-[11px] lg:text-sm items-center justify-center rounded-full border border-[#f5d98e]/70 bg-gold-dark px-5 py-2.5 lg:px-8 lg:py-4 text-white font-semibold tracking-[0.2em] text-[#21170b] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
                          >
                            Explore the Collection
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 16 }
                          }
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : { opacity: 1, y: 0 }
                          }
                          transition={{
                            duration: 0.6,
                            delay: 0.62,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href="https://wa.me/+91 98714 82162?text=Hello%20Ratnagiri%2C%20I%20would%20like%20to%20chat%20with%20you."
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Chat with us on WhatsApp"
                            className="inline-flex text-[11px] lg:text-sm gap-2 items-center justify-center rounded-full border text-white px-5 py-2.5 lg:px-8 lg:py-4 font-semibold tracking-[0.2em] text-[#21170b] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
                          >
                            Contact on Whatsapp
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5 lg:h-5 lg:w-5"
                              fill="currentColor"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              <path d="M20.52 3.449A11.87 11.87 0 0012.05 0C5.495 0 .16 5.335.157 11.89c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.933 11.933 0 005.684 1.447h.005c6.554 0 11.89-5.335 11.893-11.893a11.87 11.87 0 00-3.423-8.451zm-8.47 18.275h-.004a9.92 9.92 0 01-5.055-1.386l-.362-.215-3.742.982.999-3.648-.235-.374a9.91 9.91 0 011.514-12.474 9.935 9.935 0 017.071-2.934 9.93 9.93 0 017.067 2.931 9.93 9.93 0 012.92 7.075c-.003 5.505-4.482 9.983-9.973 9.983z" />
                            </svg>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hero-fade-overlay" aria-hidden="true" />

          {hasHeroCarousel && (
            <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
              <CarouselDots />
            </div>
          )}
        </EmblaCarousel>
      </section>
      {/* Categories */}
      {hasCategories ? (
        <section className="border-y border-[var(--color-gold)]/10 bg-[var(--color-background)] px-6  py-8 lg:py-16 ">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="mb-16 text-center">
                <p className="mb-3  font-medium tracking-[0.25em] text-[var(--color-gold)]">
                  Handicraft Traditions{" "}
                </p>

                <h2 className="font-serif text-fluid-h3 text-[var(--color-foreground)] md:text-fluid-display">
                  Browse our Collections
                </h2>

                <AnimatedRule
                  reduceMotion={shouldReduceMotion}
                  className="mt-5 w-24 mx-auto"
                />
              </div>
            </FadeIn>

            <StaggerContainer
              className="grid gap-3 md:grid-cols-3 md:gap-2 lg:grid-cols-4"
              staggerDelay={0.1}
            >
              {categories.slice(0, 8).map((category: Category) => (
                <StaggerItem key={category.id}>
                  <Link
                    href={`/product?categoryId=${category.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[2/2] overflow-hidden rounded-xl bg-[var(--color-surface-elevated)]">
                      {/* Image */}
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category?.image}
                          alt={category.title || ""}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-[var(--color-gold)]/30">
                          ✦
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5 transition-all duration-500 group-hover:from-black/90" />

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 p-5 text-center bg-black/20 transition-all duration-500 ">
                        <h3 className="font-serif text-sm font-semibold uppercase tracking-[0.12em] text-white drop-shadow-md md:text-base">
                          {category.title}
                        </h3>

                        <span className="font-poppins mt-2 text-[10px] font-medium  tracking-[0.16em] text-white/90 transition-all duration-500 group-hover:tracking-[0.2em] md:text-xs">
                          View Collection
                          <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </span>

                        {/* Gold underline */}
                        <span className="mt-2 h-px w-0 bg-[var(--color-gold)] transition-all duration-500 group-hover:w-10" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : (
        <section className="border-y border-[var(--color-gold)]/10 bg-[var(--color-background)] px-6 py-24">
          <div className="mx-auto max-w-7xl text-left">
            <FadeIn>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-gold)]/15 bg-[var(--color-surface-elevated)]">
                <span className="text-2xl text-[var(--color-gold)]">✦</span>
              </div>

              <h2 className="mb-3 font-serif text-2xl text-[var(--color-foreground)] md:text-3xl">
                Categories Coming Soon
              </h2>

              <p className="max-w-md text-[var(--color-gold)]/60">
                We&apos;re curating our handicraft traditions. Check back soon
                to explore our collections.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {arrivals.length > 0 && (
        <section className="bg-[url('/bg.jpeg')] bg-cover bg-center bg-no-repeat px-6 py-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <div className="mb-14 flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[var(--color-gold)]">
                    Just Arrived
                  </p>

                  <h2 className="font-serif text-fluid-h3 text-white md:text-fluid-display">
                    New Arrivals
                  </h2>

                  <AnimatedRule
                    reduceMotion={shouldReduceMotion}
                    className="mx-auto mt-5 w-24"
                  />
                </div>

                <Link
                  href="/product"
                  className="flex w-fit items-center gap-2 pb-1 font-poppins text-xs font-semibold tracking-[0.2em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>

            <EmblaCarousel
              opts={{ align: "start", loop: false }}
              className="relative"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {arrivals.map((product, index) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 md:pl-6 basis-[78%] sm:basis-[46%] lg:basis-1/4"
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      section="new-arrivals"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {arrivals.length > 1 && (
                <>
                  <CarouselPrevious className="-left-3 md:-left-6 h-10 w-10 md:h-12 md:w-12 border border-[var(--color-gold)]/60 bg-[#0a0a0a]/85 text-[#e8c779] shadow-xl backdrop-blur hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] hover:opacity-100 disabled:opacity-30" />
                  <CarouselNext className="-right-3 md:-right-6 h-10 w-10 md:h-12 md:w-12 border border-[var(--color-gold)]/60 bg-[#0a0a0a]/85 text-[#e8c779] shadow-xl backdrop-blur hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] hover:opacity-100 disabled:opacity-30" />
                </>
              )}
            </EmblaCarousel>
            {arrivals.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
                <span className="text-[11px] tracking-[0.2em] text-[var(--color-gold)]">
                  SWIPE TO EXPLORE
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Devotional Art */}
      <section className="relative overflow-hidden bg-[var(--color-surface-elevated)] py-8 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(201,168,76,0.1),transparent_30%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-4 md:grid-cols-2 md:px-16">
          <FadeIn
            className="order-2 flex flex-col items-start justify-center text-left md:order-1"
            direction="right"
          >
            <h2 className="font-serif text-fluid-h3 text-[var(--color-foreground)] md:text-fluid-display">
              Devotional Art
            </h2>

            <motion.div
              className="mb-8 h-px w-16 bg-[var(--color-gold)]"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
            />

            <p className="mb-8 text-lg leading-relaxed text-[var(--color-cream-dark)] font-poppins">
              Our collection of devotional wall art and tapestries brings the
              ethereal into your physical space. Each piece is crafted by
              artisans who approach their work as a meditative practice, using
              natural pigments and woven textures to create focal points for
              your sanctuary.
            </p>

            <Link
              href="/stories"
              className="flex items-center gap-2 font-label-caps text-label-caps text-[var(--color-gold)] transition-colors hover:text-[var(--color-foreground)] group"
            >
              DISCOVER THE ART
              <span className="material-symbols-outlined transform transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </FadeIn>

          <motion.div
            className="relative order-1 md:order-2"
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 32 }
            }
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg shadow-[0_0_40px_rgba(197,160,89,0.15)]"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
            >
              <motion.img
                alt="Devotional Art"
                className="h-full w-full object-cover"
                src={"/devotional-art.jpeg"}
                initial={shouldReduceMotion ? false : { scale: 1.1 }}
                whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -left-8 hidden h-48 w-48 rounded-full border border-[var(--color-gold)]/20 mix-blend-overlay md:block"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {showcaseProducts.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4  md:px-16 py-8 lg:py-16">
          <FadeIn
            className="mb-12 flex items-center justify-between"
            direction="none"
          >
            <div className="text-left">
              <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[var(--color-gold)]">
                Handpicked for you
              </p>

              <h2 className="font-serif text-fluid-h3 text-[var(--color-foreground)] md:text-fluid-display">
                Featured Products
              </h2>

              <AnimatedRule
                reduceMotion={shouldReduceMotion}
                className="mt-5 w-24"
              />
            </div>

             <Link
                  href="/product"
                  className="flex w-fit items-center gap-2 pb-1 font-poppins text-xs font-semibold tracking-[0.2em] text-[var(--color-gold)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>
          </FadeIn>

          <EmblaCarousel
            opts={{ align: "start", loop: false }}
            className="relative"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {showcaseProducts.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 md:pl-6 basis-[78%] sm:basis-[46%] lg:basis-1/4"
                >
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {showcaseProducts.length > 1 && (
              <>
                <CarouselPrevious className="-left-3 md:-left-6 h-10 w-10 md:h-12 md:w-12 border border-[var(--color-gold)]/60 bg-[#0a0a0a]/85 text-[#e8c779] shadow-xl backdrop-blur hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] hover:opacity-100 disabled:opacity-30" />
                <CarouselNext className="-right-3 md:-right-6 h-10 w-10 md:h-12 md:w-12 border border-[var(--color-gold)]/60 bg-[#0a0a0a]/85 text-[#e8c779] shadow-xl backdrop-blur hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] hover:opacity-100 disabled:opacity-30" />
              </>
            )}
          </EmblaCarousel>
        </section>
      )}

      {/* Trust Pillars */}
      <section className="border-y border-[var(--color-gold)]/10 bg-[var(--color-surface-elevated)] px-6 py-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer
            className="grid gap-8 md:grid-cols-3 md:gap-0"
            staggerDelay={0.04}
            staggerChildren={0.12}
          >
            {trustPillars.map((pillar, index) => (
              <StaggerItem key={pillar.title}>
                <div
                  className={`flex items-center gap-5 text-left ${
                    index < trustPillars.length - 1
                      ? "md:border-r md:border-[var(--color-gold)]/15 md:pr-10"
                      : ""
                  } ${index > 0 ? "md:pl-10" : ""}`}
                >
                  <motion.span
                    className="material-symbols-outlined mt-0.5 shrink-0 text-2xl text-[var(--color-gold)]"
                    aria-hidden="true"
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 0.6,
                            rotate: -10,
                          }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? undefined
                        : {
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }
                    }
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.12,
                            rotate: 5,
                          }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {pillar.icon}
                  </motion.span>

                  <div className="text-left">
                    <h3 className="mb-2 font-serif text-fluid-h3 text-[var(--color-foreground)]">
                      {pillar.title}
                    </h3>

                    <p className="max-w-xs text-sm leading-relaxed text-[var(--color-cream-dark)] font-poppins">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Generations of Devotion */}
      <section className="relative overflow-hidden py-8 lg:py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1596773347514-61c0e3592bc2?q=80&w=2874&auto=format&fit=crop)",
          }}
        />

        <div className="absolute inset-0 bg-[var(--color-background)]/90" />

        <FadeIn
          className="relative z-10 mx-auto max-w-4xl px-4 text-left md:px-16"
          direction="none"
          duration={0.8}
        >
          <motion.span
            className="material-symbols-outlined text-5xl text-[var(--color-gold)]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -7, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            workspace_premium
          </motion.span>

          <h2 className="mt-6 font-serif text-fluid-h2 text-[var(--color-foreground)] md:text-fluid-display">
            Generations of Devotion
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-cream-dark)] font-poppins">
            “Our craft is not merely shaping material; it is a meditation. Each
            strike of the chisel is a mantra, each polished surface a reflection
            of the divine within. We do not make statues; we coax the sacred out
            of the stone.”
          </p>

          <p className="mt-8 text-[11px] font-semibold tracking-[0.25em] text-[var(--color-gold)]">
            — The Master Carvers of Jaipur
          </p>
        </FadeIn>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1280px] px-4  md:px-16 py-8 lg:py-16">
        <FadeIn className="mb-12 text-center" direction="none">
          <h2 className="font-serif text-fluid-h3 text-[var(--color-foreground)] md:text-fluid-display">
            Sanctuaries Realized
          </h2>

          <p className="mt-3 text-lg text-[var(--color-cream-dark)]">
            How our patrons invite the divine into their homes.
          </p>

          <AnimatedRule
            reduceMotion={shouldReduceMotion}
            className="mt-5 w-28 mx-auto"
          />
        </FadeIn>

        <StaggerContainer
          className="grid gap-8 md:grid-cols-3"
          staggerDelay={0.05}
          staggerChildren={0.14}
        >
          {testimonials.map((item) => (
            <StaggerItem key={item.name}>
              <motion.div
                className="flex flex-col text-left"
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <div className="mb-6 h-80 overflow-hidden rounded-lg">
                  <motion.img
                    alt={item.name}
                    className="h-full w-full object-cover"
                    src={item.image}
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.05 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                </div>

                <div className="px-2 text-left">
                  <div className="mb-4 flex text-[var(--color-gold)]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className="material-symbols-outlined text-sm"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <p className="mb-4 text-lg italic leading-relaxed text-[var(--color-cream-dark)] font-poppins">
                    “{item.quote}”
                  </p>

                  <span className="text-[11px] font-semibold tracking-[0.2em] text-[var(--color-foreground)]">
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
