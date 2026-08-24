"use client";

import { useEffect, useRef, useState, WheelEvent, TouchEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Carousel as EmblaCarousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";

export function ExpandingHero({
  slides,
  hasHeroCarousel,
  hasHeroImage,
  autoplayPlugins,
  shouldReduceMotion,
}: {
  slides: any[];
  hasHeroCarousel: boolean;
  hasHeroImage: boolean;
  autoplayPlugins: any[];
  shouldReduceMotion: boolean | null;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart as unknown as EventListener, { passive: false });
    window.addEventListener("touchmove", handleTouchMove as unknown as EventListener, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel as unknown as EventListener);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart as unknown as EventListener);
      window.removeEventListener("touchmove", handleTouchMove as unknown as EventListener);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidthPct = 60 + scrollProgress * (isMobileState ? 38 : 40); // 60% -> 100%
  const mediaHeightVh = 55 + scrollProgress * 45; // 55vh -> 100vh
  const mediaRadius = 32 - scrollProgress * 32; // rounded -> square as it fills screen
  const textTranslateX = scrollProgress * (isMobileState ? 40 : 60);

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[var(--color-background)]">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          style={{
            width: `${mediaWidthPct}%`,
            height: `${mediaHeightVh}vh`,
            maxHeight: "100vh",
            borderRadius: `${mediaRadius}px`,
            transition: "border-radius 0.2s linear",
          }}
        >
          <EmblaCarousel opts={{ loop: hasHeroCarousel, align: "start" }} plugins={autoplayPlugins} className="h-full">
            <CarouselContent className="h-full">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.id ?? `${slide.title}-${index}`} className="h-full basis-full pl-0">
                  <div className="relative h-full w-full overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }}
                      initial={shouldReduceMotion ? false : { scale: 1.08 }}
                      animate={shouldReduceMotion ? undefined : { scale: [1.08, 1.02, 1.08], x: [0, -8, 0] }}
                      transition={shouldReduceMotion ? undefined : { duration: 16, ease: "easeInOut", repeat: Infinity }}
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
                      animate={shouldReduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [0.96, 1.06, 0.96] }}
                      transition={shouldReduceMotion ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
                    />

                    <div className="relative z-10 flex h-full items-center justify-center px-4 md:px-16">
                      <div className="mx-auto max-w-3xl text-center">
                        <motion.span
                          className="mb-5 flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e8c779]"
                          style={{ transform: `translateX(-${textTranslateX}px)` }}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="h-px w-8 bg-[#e8c779]/70" />
                          {slide.eyebrow || "Handcrafted with devotion"}
                          <span className="h-px w-8 bg-[#e8c779]/70" />
                        </motion.span>

                        {/* Title splits apart as media expands, like ScrollExpandMedia */}
                        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3">
                          <motion.h1
                            className="font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#fffaf1] md:text-7xl"
                            style={{ transform: `translateX(-${textTranslateX}px)` }}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {slide.title?.split(" ")[0]}
                          </motion.h1>
                          <motion.h1
                            className="font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#fffaf1] md:text-7xl"
                            style={{ transform: `translateX(${textTranslateX}px)` }}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {slide.title?.split(" ").slice(1).join(" ")}
                          </motion.h1>
                        </div>

                        <motion.p
                          className="mx-auto max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {slide.subtitle || "Discover pieces made to bring warmth, craft, and meaning into your space."}
                        </motion.p>

                        <motion.div
                          className="mt-10 flex justify-center gap-4"
                          animate={{ opacity: showContent || scrollProgress > 0.5 ? 1 : 0.4 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Link
                            href="/jewelry"
                            className="inline-flex items-center justify-center rounded-full border border-[#f5d98e]/70 bg-gradient-to-r from-[#bd9140] via-[#efd38a] to-[#bd9140] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#21170b] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
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
            {hasHeroCarousel && (
              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
                <CarouselDots />
              </div>
            )}
          </EmblaCarousel>
        </div>

        {!mediaFullyExpanded && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-[11px] tracking-[0.25em] text-white/50">
            SCROLL TO EXPAND
          </p>
        )}
      </section>
    </div>
  );
}