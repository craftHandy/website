"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import type { CartItemType } from "@/types";

interface AddToCartBtnProps {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
  stockQuantity?: number | null;
  variant?: "default" | "outline" | "gold-foil";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function AddToCartBtn({
  productId,
  slug,
  title,
  price,
  image,
  quantity = 1,
  stockQuantity = null,
  variant = "default",
  size = "default",
  className,
  children,
  disabled = false,
}: AddToCartBtnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const outOfStock = stockQuantity != null && stockQuantity <= 0;

  const handleAddToCart = () => {
    if (outOfStock) {
      toast("Out of stock", {
        description: `${title} is currently unavailable.`,
        variant: "error",
      });
      return;
    }

    const inCart = items
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
    const max = stockQuantity ?? null;

    if (max != null && inCart + quantity > max) {
      if (inCart >= max) {
        toast("Stock limit reached", {
          description: `Only ${max} available for ${title}.`,
          variant: "error",
        });
        return;
      }
      const cartItem: CartItemType = {
        id: `${productId}-${Date.now()}`,
        productId,
        slug,
        title,
        price,
        quantity: max - inCart,
        image,
        stockQuantity: max,
      };
      setIsAdding(true);
      addItem(cartItem);
      setIsAdding(false);
      toast("Stock limit reached", {
        description: `Only ${max} available — cart updated to max.`,
        variant: "error",
      });
      return;
    }

    setIsAdding(true);

    const cartItem: CartItemType = {
      id: `${productId}-${Date.now()}`,
      productId,
      slug,
      title,
      price,
      quantity,
      image,
      stockQuantity: max,
    };

    addItem(cartItem);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setIsAdding(false);
  };

  return (
    <motion.div whileTap={outOfStock || disabled ? undefined : { scale: 0.97 }} className="inline-block">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={isAdding || (disabled && !outOfStock)}
        aria-disabled={outOfStock || disabled}
      >
        <motion.span
          key={isAdded ? "added" : "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isAdded ? "Added to Cart \u2713" : children || "Add to Cart"}
        </motion.span>
      </Button>
    </motion.div>
  );
}
