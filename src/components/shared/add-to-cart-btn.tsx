"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import type { CartItemType } from "@/types";

interface AddToCartBtnProps {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
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
  variant = "default",
  size = "default",
  className,
  children,
  disabled = false,
}: AddToCartBtnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsAdding(true);

    const cartItem: CartItemType = {
      id: `${productId}-${Date.now()}`,
      productId,
      slug,
      title,
      price,
      quantity,
      image,
    };

    addItem(cartItem);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setIsAdding(false);
  };

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={isAdding || disabled}
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
