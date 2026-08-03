import { getFeaturedProducts, getCategories, getCollections, getHeroSlides, getSiteSettings } from "@/lib/api";
import { HomePageClient } from "@/components/home/home-page-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories, collections, heroSlides, settings] = await Promise.all([
    Promise.resolve(getFeaturedProducts(8)),
    Promise.resolve(getCategories()),
    Promise.resolve(getCollections()),
    Promise.resolve(getHeroSlides()),
    Promise.resolve(getSiteSettings()),
  ]);

  return (
    <HomePageClient
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      categories={JSON.parse(JSON.stringify(categories))}
      collections={JSON.parse(JSON.stringify(collections))}
      heroSlides={JSON.parse(JSON.stringify(heroSlides))}
      settings={settings}
    />
  );
}
