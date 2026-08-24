import { getFeaturedProducts, getNewArrivals, getCategories, getCollections, getHeroSlides, getSiteSettings } from "@/lib/api";
import { HomePageClient } from "@/components/home/home-page-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, newArrivalProducts, categories, collections, heroSlides, settings] = await Promise.all([
    getFeaturedProducts(6),
    getNewArrivals(8),
    getCategories(),
    Promise.resolve(getCollections()),
    Promise.resolve(getHeroSlides()),
    Promise.resolve(getSiteSettings()),
  ]);

  return (
    <HomePageClient
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      newArrivalProducts={JSON.parse(JSON.stringify(newArrivalProducts))}
      categories={JSON.parse(JSON.stringify(categories))}
      collections={JSON.parse(JSON.stringify(collections))}
      heroSlides={JSON.parse(JSON.stringify(heroSlides))}
      settings={settings}
    />
  );
}
