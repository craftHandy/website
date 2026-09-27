"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 w-full max-h-[90vh] bg-[var(--color-surface-elevated)] border-t border-[var(--color-border-subtle)] rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        top: "inset-x-0 top-0 rounded-t-none rounded-b-2xl data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r rounded-tr-2xl rounded-br-2xl border-l data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l rounded-tl-2xl rounded-bl-2xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  },
);

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right";
  }
>(({ side = "bottom", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center px-4 py-3  border-[var(--color-border-subtle)]">
          <div
            className="w-10 h-1 rounded-full bg-[var(--color-border-subtle)]"
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--color-cream-dark)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-elevated)] disabled:pointer-events-none" aria-label="Close">
        <X className="h-5 w-5" />
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 px-6 pb-4 text-left",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pt-4 border-t border-[var(--color-border-subtle)]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold text-[var(--color-foreground)]", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-cream-dark)]", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};