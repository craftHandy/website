"use client";

import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animations/motion";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Shield, Heart, Gem, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Gem,
    title: "Authenticity",
    description:
      "Every piece at Ratnagiri is crafted using genuine gemstones, hallmarked gold, and ethically sourced materials. We guarantee the authenticity of every creation with a certificate of origin.",
  },
  {
    icon: Award,
    title: "Craftsmanship",
    description:
      "Our master artisans bring centuries-old techniques — from Kundan setting to Meenakari enameling — to every design. Each piece is a testament to the unrivaled skill of Rajasthan's finest craftspeople.",
  },
  {
    icon: Heart,
    title: "Heritage",
    description:
      "Rooted in the royal traditions of Jaipur, Ratnagiri honors the legacy of Indian jewelry-making. We draw inspiration from Mughal motifs, temple architecture, and the timeless elegance of bridal adornment.",
  },
  {
    icon: Shield,
    title: "Sustainability",
    description:
      "We are committed to responsible sourcing and ethical production. From recycled metals to fair-wage workshops, every step of our process respects both people and the planet.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Design",
    description:
      "Every Ratnagiri piece begins as a hand-sketched vision. Our designers study historical motifs, gemstone shapes, and modern silhouettes to create original works of art that honor tradition while embracing contemporary elegance.",
  },
  {
    number: "02",
    title: "Craft",
    description:
      "Master artisans bring the design to life using techniques passed down through generations. From delicate filigree work to precise stone setting, each step is performed by hand in our Jaipur atelier with painstaking attention to detail.",
  },
  {
    number: "03",
    title: "Finish",
    description:
      "The final stage is a meticulous process of polishing, quality inspection, and hallmarking. Each piece is cleaned, buffed, and examined under magnification before being presented in our signature packaging, ready for its journey to you.",
  },
];

const artisans = [
  {
    name: "Rajesh Soni",
    role: "Master Kundan Artisan",
    description:
      "With over forty years of experience, Rajesh is one of the few remaining masters of traditional Kundan setting. His steady hands and trained eye ensure every stone sits perfectly in its gold embrace.",
  },
  {
    name: "Meera Devi",
    role: "Meenakari Specialist",
    description:
      "Meera learned the art of Meenakari — the intricate enameling of jewelry — from her grandmother. She brings vibrant color and delicate detail to every piece she touches.",
  },
  {
    name: "Arun Verma",
    role: "Gemstone Cutter",
    description:
      "Arun's relationship with gemstones began in the mines of Jaipur. His ability to read the natural grain of a stone and cut it to maximize brilliance is nothing short of extraordinary.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* ── Hero Section ──helllo */}
      <section className="relative bg-surface-elevated overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--color-background)]" />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 75% 50%, #C9A84C 0%, transparent 50%)",
          }}
          animate={{ opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-40 text-center">
          <FadeIn delay={0.1}>
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-4">
              Since 1987
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-7xl font-serif text-[var(--color-foreground)] mb-6 leading-tight">
              Our Story
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-[var(--color-cream-dark)]/70 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              For over three generations, Ratnagiri has been synonymous with the finest Indian
              jewelry — a legacy of artistry, tradition, and an unwavering commitment to beauty
              that flows from the heart of Jaipur to the world.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Heritage & Craftsmanship ── */}
      <section className="bg-[var(--color-background)] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <StaggerContainer>
            <StaggerItem>
              <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
                Our Heritage
              </p>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-12 text-center">
                A Legacy of Light
              </h2>
            </StaggerItem>
          </StaggerContainer>

          <div className="space-y-8 text-[var(--color-cream-dark)]/70 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
            <FadeIn>
              <p>
                Ratnagiri &mdash; meaning &quot;mountain of gems&quot; &mdash; was born in the pink-hued city of Jaipur,
                the historic heart of India&apos;s gemstone and jewelry trade. What began as a small
                family workshop in the walled city&apos;s Johari Bazaar has blossomed into a celebrated
                atelier known for its uncompromising quality and deep reverence for traditional
                Indian craftsmanship.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>
                Our founders, the Agarwal family, were among the first to recognize that India&apos;s
                jewelry heritage was not merely ornamental but deeply cultural &mdash; each motif, each
                technique, each stone carried stories of dynasties, deities, and generations of
                love. From the intricate Jadau work of the Mughal courts to the temple jewelry of
                South India, they sought to preserve and reimagine these traditions for a new era.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                Today, Ratnagiri works with over fifty master artisans across Rajasthan, many of
                whom represent the fifth or sixth generation of their craft. Our atelier is a
                living museum of techniques &mdash; Kundan setting, Meenakari enameling, Thewa
                glasswork, and hand-fabricated filigree &mdash; each practiced exactly as it has been
                for centuries, yet infused with a modern sensibility that speaks to today&apos;s
                discerning wearer.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p>
                Every Ratnagiri creation carries a quiet promise: that it was made with intention,
                by hands that have spent a lifetime perfecting their art, using materials chosen
                not for their convenience but for their beauty and integrity. This is jewelry not
                merely to be worn, but to be passed down — a luminous thread connecting past,
                present, and future.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-[var(--color-background)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
              What We Stand For
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-14 text-center">
              Our Values
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <div className="group text-center p-8 border border-[var(--color-border-subtle)] hover:border-gold transition-colors duration-500 bg-[var(--color-surface-elevated)]">
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500 border border-[var(--color-border-subtle)]">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--color-foreground)] mb-3">{value.title}</h3>
                    <p className="text-[var(--color-cream-dark)]/70 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="bg-[var(--color-background)] py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
              From Vision to Creation
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-16 text-center">
              Our Process
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-[16.66%] right-[16.66%] h-px bg-gold-muted/30" />
            <StaggerContainer className="grid md:grid-cols-3 gap-12 md:gap-8">
              {processSteps.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="text-center relative">
                    <ScaleIn delay={0.2 * index}>
                      <span className="text-5xl md:text-7xl font-serif text-gold/20 block mb-4">
                        {step.number}
                      </span>
                    </ScaleIn>
                    <h3 className="text-xl font-serif text-[var(--color-foreground)] mb-4">{step.title}</h3>
                    <p className="text-[var(--color-cream-dark)]/70 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── Meet the Artisans ── */}
      <section className="bg-[var(--color-background)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
              The Hands Behind the Art
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-14 text-center">
              Meet the Artisans
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {artisans.map((artisan) => (
              <StaggerItem key={artisan.name}>
                <div className="luxe-card p-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--color-foreground)] mb-1">{artisan.name}</h3>
                  <p className="text-gold text-xs tracking-[0.15em]  font-medium mb-4">
                    {artisan.role}
                  </p>
                  <p className="text-[var(--color-cream-dark)]/70 text-sm leading-relaxed">{artisan.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-[var(--color-background)] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
              Begin Your Journey
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-foreground)] mb-6">
              Discover the Collection
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[var(--color-cream-dark)]/70 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
              From everyday elegance to heirloom masterpieces, each Ratnagiri creation carries the
              soul of India&apos;s finest jewelry traditions. Explore our collections and find a piece
              that speaks to your story.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Button asChild size="lg" variant="default">
              <Link href="/jewelry" className="px-10 py-3.5 text-sm tracking-[0.15em] ">Explore Jewelry</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
