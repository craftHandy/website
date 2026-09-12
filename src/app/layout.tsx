import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { Providers } from "./providers";
import { WhatsAppWidget } from "@/components/shared/whatsappWidget";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Ratna Treasure Handicraft — Handcrafted Indian Jewelry",
    template: "%s | Ratna Treasure Handicraft",
  },
  description:
    "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces. Each tells a story of heritage and artistry.",
  keywords: [
    "handcrafted jewelry",
    "jewelry",
    "indian",
    "murti",
    "temple",
    "gold",
    "brass",
    "wood",
    "silver",
    "gemstone",
    "kundan",
    "jadau",
    "heritage",
    "handmade",
    "artisan",
    "craftsmanship",
    "sacred",
    "spiritual",
    "ritual",
    "decorative",
    "collectible",
    "home decor",
    "gift",
    "wedding",
    "bridal",
    "traditional",
    "cultural",
    "ethnic",
    "luxury",
    "exclusive",
    "limited edition",
    "custom",
    "personalized",
    "heirloom",
    "timeless",
    "elegant",
    "unique",
    "authentic",
    "quality",
    "design",
    "style",
    "fashion",
    "accessory",
    "ornament",
    "statement piece",
    "artistic",
    "creative",
    "inspired",
    "symbolic",
    "meaningful",
    "spirituality",
    "meditation",
    "yoga",
    "zen",
    "mindfulness",
    "wellness",
    "harmony",
    "balance",
    "energy",
    "chakra",
    "aura",
    "protection",
    "blessing",
    "ritualistic",
    "ceremonial",
    "festive",
    "celebration",
    "cultural heritage",
    "traditional craftsmanship",
    "artisanal",
    "handmade jewelry",
    "custom design",
    "bespoke",
    "one-of-a-kind",
    "limited edition jewelry",
    "exclusive collection",
    "heritage pieces",
    "sacred art",
    "spiritual jewelry",
    "ritual objects",
    "decorative art",
    "collectible items",
    "home decor accents",
    "gift ideas",
    "wedding accessories",
    "bridal jewelry",
    "traditional designs",
    "cultural significance",
    "ethnic fashion",
    "luxury craftsmanship",
    "exclusive designs",
    "limited edition pieces",
    "customized jewelry",
    "personalized gifts",
    "heirloom quality",
    "timeless elegance",
    "unique creations",
    "authentic craftsmanship",
    "quality materials",
    "artistic expression",
    "creative designs",
    "inspired by tradition",
    "symbolic meanings",
    "meaningful gifts",
    "spiritual significance",
    "meditative practices",

    "murti",
    "murtis",
    "murti collection",
    "Indian murtis",
    "Hindu murtis",
    "Hindu idols",
    "Hindu statues",
    "Indian idols",
    "Indian statues",
    "deity statues",
    "deity idols",
    "God statues",
    "God idols",
    "spiritual statues",
    "sacred statues",
    "sacred idols",

    // Deities
    "Shiva murti",
    "Krishna murti",
    "Ganesha murti",
    "Ganesh statue",
    "Lakshmi murti",
    "Durga murti",
    "Vishnu murti",
    "Hanuman murti",
    "Radha Krishna murti",
    "Buddha statue",
    "Nataraja statue",

    // Materials
    "brass murti",
    "bronze murti",
    "gold plated murti",
    "silver murti",
    "wooden murti",
    "stone murti",
    "metal statue",
    "brass statue",
    "bronze statue",
    "handcrafted brass idols",
    "handcrafted bronze statues",

    // Antique & vintage
    "antique murti",
    "antique murtis",
    "antique idols",
    "antique statues",
    "antique Indian statues",
    "antique Hindu idols",
    "vintage statues",
    "vintage idols",
    "heritage statues",
    "heritage idols",
    "heritage collectibles",
    "antique collectibles",
    "rare collectibles",
    "collectible statues",
    "collectible idols",
    "timeless artifacts",
    "heritage artifacts",
    "Indian artifacts",
    "traditional artifacts",
    "sacred artifacts",

    // Handcraft & artistry
    "handcrafted murti",
    "handmade murti",
    "handcrafted idols",
    "handmade idols",
    "handcrafted statues",
    "handmade statues",
    "artisan crafted",
    "Indian craftsmanship",
    "traditional craftsmanship",
    "traditional Indian art",
    "Indian handicrafts",
    "Indian artisan crafts",
    "artisanal statues",
    "artisan made idols",
    "master craftsmanship",
    "traditional artistry",
    "heritage craftsmanship",

    // Temple & spiritual decor
    "temple decor",
    "home temple decor",
    "pooja room decor",
    "puja room decor",
    "mandir decor",
    "Indian temple art",
    "sacred decor",
    "spiritual decor",
    "religious decor",
    "devotional decor",
    "meditation decor",
    "spiritual home decor",
    "sacred art",
    "devotional art",
    "ritual objects",
    "ceremonial objects",

    // Home & interior
    "Indian home decor",
    "traditional home decor",
    "luxury home decor",
    "heritage home decor",
    "antique home decor",
    "spiritual home decor",
    "decorative statues",
    "decorative idols",
    "statement statues",
    "sculptural decor",
    "interior decor",
    "luxury decor",
    "collector decor",

    // Collections & premium positioning
    "exclusive murtis",
    "exclusive statues",
    "premium murtis",
    "premium idols",
    "luxury murtis",
    "luxury statues",
    "rare murtis",
    "rare statues",
    "one of a kind statues",
    "one of a kind murtis",
    "limited edition statues",
    "limited edition murtis",
    "collector's pieces",
    "collector's statues",
    "heritage pieces",
    "heirloom pieces",
    "museum inspired art",
    "fine craftsmanship",
    "masterpiece statues",

    // Indian heritage
    "Indian heritage",
    "Indian cultural heritage",
    "Hindu heritage",
    "Indian traditional art",
    "Indian sculpture",
    "traditional Indian sculpture",
    "Indian religious art",
    "Hindu art",
    "traditional Hindu art",
    "sacred Indian art",
    "Indian cultural art",
    "heritage art",

    // Shopping intent
    "buy murti online",
    "buy idols online",
    "buy Hindu statues online",
    "buy brass murti online",
    "buy antique statues online",
    "buy Indian handicrafts online",
    "Indian statues online",
    "Indian murtis online",
    "traditional idols online",
    "spiritual decor online",
    "temple decor online",
    "unique home decor",
    "heritage gifts",
    "spiritual gifts",
    "Indian traditional gifts",
    "religious gifts",
    "devotional gifts",
    "unique gifts",

    // Brand positioning
    "Ratna Treasure Handicraft",
    "Ratna Treasure",
    "murti treasures",
    "treasured artifacts",
    "sacred treasures",
    "heritage treasures",
    "Indian treasures",
    "timeless treasures",
    "artisan treasures",
    "handcrafted treasures",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ratna Treasure Handicraft",
    title: "Ratna Treasure Handicraft — Handcrafted Indian Jewelry",
    description:
      "Discover exquisite handcrafted Indian jewelry — Temple, Kundan, Jadau, Silver, Brass & Gemstone pieces.",
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
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <Script id="theme-script" strategy="beforeInteractive">{`
          (() => {
            try {
              const savedTheme = localStorage.getItem(
                "sacred-sanctuary-theme"
              );

              const prefersLight = window.matchMedia(
                "(prefers-color-scheme: light)"
              ).matches;

              const nextTheme =
                savedTheme === "light" || savedTheme === "dark"
                  ? savedTheme
                  : prefersLight
                    ? "light"
                    : "dark";

              document.documentElement.setAttribute(
                "data-theme",
                nextTheme
              );
            } catch {
              document.documentElement.setAttribute(
                "data-theme",
                "dark"
              );
            }
          })();
        `}</Script>
      </head>

      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>

        <WhatsAppWidget />
        <Toaster />
      </body>
    </html>
  );
}
