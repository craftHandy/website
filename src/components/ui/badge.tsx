import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold text-[#0a0a0a]",
        secondary: "border-transparent bg-[var(--color-surface-elevated)] text-[var(--color-cream-dark)] border border-[var(--color-border-subtle)]",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "text-[var(--color-cream)] border-[rgba(201,168,76,0.3)]",
        sale: "border-transparent bg-red-600 text-white",
        limited: "border-transparent bg-gold text-[#0a0a0a]",
        instock: "border-transparent bg-emerald-600 text-white",
        preorder: "border-transparent bg-blue-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };