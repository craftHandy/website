"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  inputClassName?: string;
  id?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, inputClassName, id, disabled, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("relative", className)}>
        <input
          id={inputId}
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={props["aria-invalid"]}
          className={cn(
            "w-full h-11 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] font-poppins disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName,
            "pl-3 pr-11"
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          aria-controls={inputId}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-[var(--color-cream-dark)] hover:text-[var(--color-gold)] focus-visible:outline-none transition-colors"
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" className="pointer-events-none" />
          ) : (
            <Eye size={18} aria-hidden="true" className="pointer-events-none" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
