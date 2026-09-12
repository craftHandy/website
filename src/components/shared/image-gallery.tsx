"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm flex items-center justify-center text-gold-muted">
        No images available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];
  const hasMultiple = images.length > 1;
  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setSelectedIndex((i) => (i + 1) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
        <div
          className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm cursor-zoom-in luxe-card"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 img-fill-responsive"
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || ""}
                fill
                className={cn(
                  "object-cover transition-transform duration-500",
                  isZoomed && "scale-[2]"
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      }
                    : undefined
                }
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 hover:text-gold active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 hover:text-gold active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative flex-shrink-0 aspect-square w-16 h-16 overflow-hidden rounded-sm transition-all duration-200 border-2 bg-[var(--color-surface-elevated)]",
                index === selectedIndex
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
