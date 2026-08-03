import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Ratnagiri — Handcrafted Indian Jewelry",
    template: "%s | Ratnagiri",
  },
  description: "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces. Each tells a story of heritage and artistry.",
  keywords: ["Indian jewelry", "Temple jewelry", "Kundan jewelry", "Jadau jewelry", "handcrafted jewelry", "silver jewelry", "gemstone jewelry", "traditional jewelry"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ratnagiri",
    title: "Ratnagiri — Handcrafted Indian Jewelry",
    description: "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
        <a
          href="https://wa.me/9818504933?text=Hello%20Ratnagiri%2C%20I%20would%20like%20to%20chat%20with%20you."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-4 right-4 z-60 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </body>
    </html>
  );
}