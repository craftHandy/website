"use client";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
useEffect(() => {
  const timer = setTimeout(() => {
    setOpen(true);
  }, 3500);

  return () => clearTimeout(timer);
}, []);
  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {/* Chat bubble */}
      <div
        className={`
          absolute bottom-[calc(100%+14px)] right-0
          w-64 origin-bottom-right
          rounded-2xl border border-white/10
          bg-[#1A1A1A]
          p-4 text-white
          shadow-[0_15px_45px_rgba(0,0,0,0.25)]
          transition-all duration-300 ease-out
          ${
            open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible translate-y-3 scale-95 opacity-0"
          }
        `}
      >
        {/* Arrow */}
        <span
          className="
            absolute -bottom-2 right-5
            h-4 w-4 rotate-45
            border-r border-b border-white/10
            bg-[#1A1A1A]
          "
        />

        <div className="flex items-start justify-between gap-3 font-poppins">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Chat with us
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                We’re here to help you.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat widget"
            className="
              rounded-full p-1
              text-white/40
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <a
          href="https://wa.me/919871482162?text=Hello%20Ratna%20Treasure%20Handicraft%2C%20I%20would%20like%20to%20chat%20with%20you."
          target="_blank"
          rel="noreferrer"
          className="
            mt-4 flex items-center justify-center
            rounded-xl bg-[#25D366]
            px-4 py-2.5
            text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-[#20bd5a]
            hover:shadow-[0_5px_20px_rgba(37,211,102,0.25)]
            active:scale-[0.98] font-poppins
          "
        >
          Start a conversation
        </a>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open WhatsApp chat"
        className="
          relative flex h-14 w-14
          items-center justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-[0_8px_25px_rgba(37,211,102,0.35)]
          transition-all duration-300
          hover:scale-110
          hover:shadow-[0_12px_35px_rgba(37,211,102,0.45)]
          active:scale-95 cursor-pointer
        "
      >
        {/* Animated pulse */}
        {!open && (
          <span
            className="
              absolute inset-0
              rounded-full
              bg-[#25D366]
              animate-ping
              opacity-20
            "
          />
        )}

        <MessageCircle
          className={`
            relative z-10 h-7 w-7
            transition-all duration-300
            ${open ? "rotate-90 scale-90" : "rotate-0 scale-100"}
          `}
        />

        {/* Online indicator */}
        {!open && (
          <span
            className="
              absolute right-0.5 top-0.5
              h-3.5 w-3.5
              rounded-full
              border-2 border-white
              bg-[#25D366]
            "
          />
        )}
      </button>
    </div>
  );
}