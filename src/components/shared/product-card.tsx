"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? calculateDiscount(product.price, product.discountPrice!) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface-elevated)] rounded-sm mb-4 border border-[var(--color-border-subtle)] group-hover:border-[rgba(201,168,76,0.35)] transition-all duration-500 luxe-card">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-muted">
              No Image
            </div>
          )}
          {hasDiscount && (
            <Badge variant="sale" className="absolute top-3 left-3">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.stockStatus === "Limited Stock" && (
            <Badge variant="limited" className="absolute top-3 right-3">
              Limited
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>
        <div className="space-y-1.5">
          {product.category && (
            <p className="text-[10px] tracking-widest  text-gold font-medium">
              {product.category.title}
            </p>
          )}
          <h3 className="text-sm font-medium text-[var(--color-foreground)] group-hover:text-gold transition-colors line-clamp-2">
            {product.title}
          </h3>
          {product.craftType && (
            <p className="text-[11px] text-gold-muted">{product.craftType}</p>
          )}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base font-semibold text-[var(--color-foreground)]">
              {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gold-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
