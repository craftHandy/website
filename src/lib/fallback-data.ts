import type { Product, Category, Collection, BlogPost } from "@/types";

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  order: number;
  active: boolean;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

function img(seed: string): string {
  return `https://picsum.photos/seed/${seed}/900/1100`;
}

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-temple",
    title: "Temple Jewelry",
    slug: "temple-jewelry",
    description: "Sacred ornaments inspired by temple traditions of South India.",
  },
  {
    id: "cat-kundan",
    title: "Kundan Jewelry",
    slug: "kundan-jewelry",
    description: "Rajasthani Kundan setting with uncut stones in gold foil.",
  },
  {
    id: "cat-jadau",
    title: "Jadau Jewelry",
    slug: "jadau-jewelry",
    description: "The royal art of Jadau — enamel and uncut diamond work from the Mughal courts.",
  },
  {
    id: "cat-silver",
    title: "Silver Jewelry",
    slug: "silver-jewelry",
    description: "Oxidised and sterling silver pieces for everyday grace.",
  },
  {
    id: "cat-brass",
    title: "Brass Jewelry",
    slug: "brass-jewelry",
    description: "Handcrafted brass ornaments with a warm, antique finish.",
  },
  {
    id: "cat-gemstone",
    title: "Gemstone Jewelry",
    slug: "gemstone-jewelry",
    description: "Rings and pendants set with natural, ethically sourced gemstones.",
  },
];

export const FALLBACK_COLLECTIONS: Collection[] = [
  {
    id: "col-sacred",
    title: "Sacred Statues",
    slug: "sacred-statues",
    description: "Divine statues of Nepal and Tibet, hand-cast with sacred precision by master sculptors.",
  },
  {
    id: "col-ritual",
    title: "Ritual Objects",
    slug: "ritual-objects",
    description: "Singing bowls, prayer wheels and ritual artifacts that carry centuries of devotion.",
  },
  {
    id: "col-bridal",
    title: "Bridal Heritage",
    slug: "bridal-heritage",
    description: "Heirloom-worthy bridal sets — from Kundan necklaces to Jadau chokers.",
  },
  {
    id: "col-everyday",
    title: "Everyday Treasures",
    slug: "everyday-treasures",
    description: "Understated pieces designed for daily wear, crafted to be treasured forever.",
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p-sacred-buddha-statue",
    title: "Amitabha Buddha Statue",
    slug: "amitabha-buddha-statue",
    price: 45000,
    discountPrice: 39900,
    description:
      "A hand-cast copper Amitabha Buddha statue from the Kathmandu Valley. Each statue is crafted using the traditional lost-wax method and finished with 24k gold plating.",
    materials: ["Copper", "24k Gold Plating", "Natural Pigments"],
    craftType: "Lost-Wax Casting",
    origin: "Kathmandu, Nepal",
    occasion: ["Meditation", "Temple", "Gifting"],
    images: [{ url: img("buddha-statue"), alt: "Amitabha Buddha Statue" }],
    stockStatus: "In Stock",
    featured: true,
    categoryId: "cat-temple",
    category: undefined,
    collectionId: "col-sacred",
    collection: undefined,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "p-tibetan-singing-bowl",
    title: "Tibetan Singing Bowl Set",
    slug: "tibetan-singing-bowl-set",
    price: 8500,
    discountPrice: 7200,
    description:
      "A hand-hammered seven-metal singing bowl from the foothills of Tibet, complete with a wooden striker and cushion. Perfect for meditation and sound healing.",
    materials: ["Seven Sacred Metals", "Wood"],
    craftType: "Hand-Hammered",
    origin: "Tibet",
    occasion: ["Meditation", "Sound Healing", "Gifting"],
    images: [{ url: img("singing-bowl"), alt: "Tibetan Singing Bowl" }],
    stockStatus: "In Stock",
    featured: true,
    categoryId: "cat-brass",
    category: undefined,
    collectionId: "col-ritual",
    collection: undefined,
    createdAt: "2026-01-18T10:00:00.000Z",
  },
  {
    id: "p-temple-jhumka-earrings",
    title: "Temple Jhumka Earrings",
    slug: "temple-jhumka-earrings",
    price: 12900,
    discountPrice: 9990,
    description:
      "Handcrafted gold-plated temple jhumkas inspired by the deities of South Indian temples, with intricate filigree and drop pearls.",
    materials: ["Gold Plated Brass", "Pearls"],
    craftType: "Filigree Work",
    origin: "Jaipur, India",
    occasion: ["Weddings", "Festivals", "Temple"],
    images: [{ url: img("temple-jhumka"), alt: "Temple Jhumka Earrings" }],
    stockStatus: "Limited Stock",
    featured: true,
    categoryId: "cat-temple",
    category: undefined,
    collectionId: "col-bridal",
    collection: undefined,
    createdAt: "2026-01-22T10:00:00.000Z",
  },
  {
    id: "p-kundan-choker-necklace",
    title: "Kundan Choker Necklace",
    slug: "kundan-choker-necklace",
    price: 78000,
    discountPrice: 64900,
    description:
      "A regal Kundan choker set with uncut stones, set in gold foil and finished with Meenakari enamel from the ateliers of Jaipur.",
    materials: ["Uncut Stones", "Gold Foil", "Meenakari Enamel"],
    craftType: "Kundan Setting",
    origin: "Jaipur, India",
    occasion: ["Bridal", "Weddings", "Receptions"],
    images: [{ url: img("kundan-choker"), alt: "Kundan Choker Necklace" }],
    stockStatus: "Pre-order",
    featured: true,
    categoryId: "cat-kundan",
    category: undefined,
    collectionId: "col-bridal",
    collection: undefined,
    createdAt: "2026-01-25T10:00:00.000Z",
  },
  {
    id: "p-jadau-bangle-set",
    title: "Jadau Bangle Set",
    slug: "jadau-bangle-set",
    price: 32000,
    discountPrice: 28500,
    description:
      "A pair of hand-fabricated Jadau bangles in the royal tradition, with uncut diamonds and rich green enamel work.",
    materials: ["Uncut Diamonds", "Gold", "Enamel"],
    craftType: "Jadau Work",
    origin: "Jaipur, India",
    occasion: ["Bridal", "Weddings", "Heritage"],
    images: [{ url: img("jadau-bangle"), alt: "Jadau Bangle Set" }],
    stockStatus: "In Stock",
    featured: false,
    categoryId: "cat-jadau",
    category: undefined,
    collectionId: "col-bridal",
    collection: undefined,
    createdAt: "2026-02-02T10:00:00.000Z",
  },
  {
    id: "p-oxidised-silver-set",
    title: "Oxidised Silver Jewellery Set",
    slug: "oxidised-silver-jewellery-set",
    price: 6500,
    discountPrice: 5490,
    description:
      "A bohemian oxidised silver set of necklace and earrings, hand-finished with traditional jali work.",
    materials: ["Sterling Silver", "Oxidised Finish"],
    craftType: "Jali Work",
    origin: "Jaipur, India",
    occasion: ["Everyday", "Festivals", "Office"],
    images: [{ url: img("silver-set"), alt: "Oxidised Silver Jewellery Set" }],
    stockStatus: "In Stock",
    featured: false,
    categoryId: "cat-silver",
    category: undefined,
    collectionId: "col-everyday",
    collection: undefined,
    createdAt: "2026-02-06T10:00:00.000Z",
  },
  {
    id: "p-emerald-ring",
    title: "Emerald & Gold Ring",
    slug: "emerald-gold-ring",
    price: 24000,
    discountPrice: 21500,
    description:
      "A solitaire Zambian emerald in a handcrafted 22k gold ring, surrounded by a halo of diamonds.",
    materials: ["Zambian Emerald", "22k Gold", "Diamonds"],
    craftType: "Stone Setting",
    origin: "Jaipur, India",
    occasion: ["Everyday", "Gifting", "Anniversary"],
    images: [{ url: img("emerald-ring"), alt: "Emerald and Gold Ring" }],
    stockStatus: "Limited Stock",
    featured: false,
    categoryId: "cat-gemstone",
    category: undefined,
    collectionId: "col-everyday",
    collection: undefined,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "p-brass-diwali-diya",
    title: "Handcrafted Brass Diya",
    slug: "handcrafted-brass-diya",
    price: 1800,
    description:
      "A traditional hand-hammered brass oil lamp for your altar, cast in the workshops of Kathmandu.",
    materials: ["Brass"],
    craftType: "Hand-Hammered",
    origin: "Kathmandu, Nepal",
    occasion: ["Festivals", "Temple", "Home Decor"],
    images: [{ url: img("brass-diya"), alt: "Handcrafted Brass Diya" }],
    stockStatus: "In Stock",
    featured: false,
    categoryId: "cat-brass",
    category: undefined,
    collectionId: "col-ritual",
    collection: undefined,
    createdAt: "2026-02-14T10:00:00.000Z",
  },
];

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    title: "Heritage in Every Halo",
    subtitle: "Handcrafted jewellery carrying centuries of Indian and Himalayan artistry.",
    ctaText: "Explore Collection",
    ctaLink: "/jewelry",
    order: 1,
    active: true,
  },
  {
    id: "hero-2",
    title: "Sacred Art, Sacred Craft",
    subtitle: "Divine statues and ritual objects cast by master artisans of Nepal and Tibet.",
    ctaText: "Discover Collections",
    ctaLink: "/collections",
    order: 2,
    active: true,
  },
  {
    id: "hero-3",
    title: "The Stories We Keep",
    subtitle: "Read the journal of our artisans, traditions and living heritage.",
    ctaText: "Read Our Stories",
    ctaLink: "/stories",
    order: 3,
    active: true,
  },
];

export const FALLBACK_SETTINGS: SiteSetting[] = [
  { key: "heroTitle", value: "Where Heritage Meets Elegance" },
  { key: "heroSubtitle", value: "Discover jewellery that carries centuries of Indian craftsmanship — each piece a testament to the artisans of Ratnagiri." },
];

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "The Lost-Wax Art of Kathmandu's Statue Makers",
    slug: "lost-wax-art-of-kathmandu",
    excerpt:
      "For a thousand years, the sculptors of the Kathmandu Valley have cast divine statues using a technique unchanged since antiquity.",
    content:
      "## A Living Tradition\n\nThe lost-wax method begins with a clay core, shaped by hand and covered in beeswax. Into the wax, the artisan carves every detail — the folds of a robe, the curve of a lotus, the gaze of a deity.\n\n## The Sacred Cast\n\nOnce the wax model is complete, it is encased in a clay mould and heated. The wax melts away, leaving a perfect negative space into which molten copper or bronze is poured.\n\n## The Final Polish\n\nAfter cooling, the statue is chased, gilded with 24k gold, and painted with natural pigments. The result is not merely an object but a vessel of devotion.\n\nAt Ratnagiri, we work directly with these master craftspeople, ensuring the tradition endures and the artisans are honoured.",
    coverImage: "https://picsum.photos/seed/kathmandu-statue/1200/900",
    author: "Ananya Sharma",
    publishedAt: "2026-02-01T10:00:00.000Z",
    tags: ["Heritage", "Nepal", "Craftsmanship"],
  },
  {
    id: "post-2",
    title: "Kundan: The Royal Setting of Jaipur",
    slug: "kundan-royal-setting-of-jaipur",
    excerpt:
      "Discover the painstaking art of Kundan — where uncut stones are wrapped in pure gold foil, a craft born in the Mughal courts.",
    content:
      "## A Courtly Origin\n\nKundan jewellery was born in the royal courts of the Mughal era and perfected in Jaipur, where it remains the crowning jewel of Indian bridal adornment.\n\n## The Setting\n\nUnlike modern stone setting, Kundan uses no prongs. Each uncut stone is framed by strips of pure gold foil, burnished by hand until the stone sits in a luminous golden cradle.\n\n## The Enamel\n\nBeneath the stones, Meenakari enamel — vibrant blue, green and red — adds a hidden world of colour that catches the light when the piece moves.\n\nEvery Kundan piece at Ratnagiri is made in the ateliers of Jaipur by families who have practised the art for generations.",
    coverImage: "https://picsum.photos/seed/kundan-royal/1200/900",
    author: "Rohan Mehta",
    publishedAt: "2026-01-20T10:00:00.000Z",
    tags: ["Jaipur", "Kundan", "Bridal"],
  },
  {
    id: "post-3",
    title: "The Sound of the Singing Bowl",
    slug: "sound-of-the-singing-bowl",
    excerpt:
      "Hand-hammered from seven sacred metals, the Tibetan singing bowl is an instrument of stillness — and one of the Himalaya's great crafts.",
    content:
      "## Seven Metals\n\nA traditional singing bowl is forged from seven metals — gold, silver, mercury, copper, iron, tin and lead — each representing a celestial body.\n\n## The Hammer\n\nThere are no machines. Each bowl is beaten into shape over days by a single craftsman, then tuned so that its note rings clear and long.\n\n## A Practice of Presence\n\nThe bowl is more than an object; it is a companion to meditation, a call to stillness, and a reminder of the patience of the hands that made it.",
    coverImage: "https://picsum.photos/seed/singing-bowl-story/1200/900",
    author: "Tenzing Dolma",
    publishedAt: "2026-01-08T10:00:00.000Z",
    tags: ["Tibet", "Meditation", "Ritual"],
  },
];

export const FALLBACK_PAGES: PageContent[] = [
  {
    id: "page-heritage",
    title: "Our Heritage",
    slug: "our-heritage",
    content:
      "## The Mountain of Gems\n\nRatnagiri — the mountain of gems — was born of a simple belief: that the Himalaya and India hold the world's most extraordinary craftsmanship, and that it deserves to be treasured.\n\n## A Living Legacy\n\nFrom the master sculptors of Nepal to the Kundan ateliers of Jaipur, we partner with families who have practised their crafts for generations. Every piece we carry is made by hand, with intention, and with love.\n\n## The Promise\n\nWhen you bring a Ratnagiri piece into your home, you carry forward a story of devotion that began long before us — and that will endure long after.",
    published: true,
  },
  {
    id: "page-craftsmanship",
    title: "Craftsmanship",
    slug: "craftsmanship",
    content:
      "## Hand, Not Machine\n\nAt Ratnagiri, we believe the soul of a piece lives in the hands that made it. We work exclusively with master artisans who practise traditional techniques — lost-wax casting, Kundan setting, Meenakari enameling and hand-hammered metalwork.\n\n## Materials With Meaning\n\nWe source responsibly — recycled metals, ethically mined stones, and natural pigments. Nothing is plated to deceive; everything is made to last.\n\n## Made To Be Treasured\n\nEach piece passes through the hands of many craftspeople before it reaches you. It is not fast, and it is not cheap. But it is true — and it will outlive trends.",
    published: true,
  },
];

export const fallbackSettingsRecord: Record<string, any> = FALLBACK_SETTINGS.reduce(
  (acc, s) => {
    acc[s.key] = s.value;
    return acc;
  },
  {} as Record<string, any>
);
