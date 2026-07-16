import { fetchAllProperties } from "@/lib/data/properties";
import { fetchPublishedPosts } from "@/lib/data/posts";
import { fetchPublishedTestimonials } from "@/lib/data/testimonials";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import SearchWidget from "@/components/SearchWidget";
import HeroBackground from "@/components/HeroBackground";
import HeroSlider from "@/components/HeroSlider";
import HomeIntroSection from "@/components/HomeIntroSection";
import MainFocusSection from "@/components/MainFocusSection";
import FeaturedSection from "@/components/FeaturedSection";
import HomeClosingSection from "@/components/HomeClosingSection";

export default async function Home() {
  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const properties = await fetchAllProperties(supabase);
  const testimonials = await fetchPublishedTestimonials(supabase);
  const articles = (await fetchPublishedPosts(supabase)).slice(0, 3);
  const availableProperties = properties.filter(
    (p) => p.status === "Available" || p.status === "For Rent"
  );
  const featuredProperties = availableProperties.filter((p) => p.tier === 1);
  const spotlight = availableProperties[0] ?? properties[0];
  const spotlightThumb = availableProperties[1] ?? availableProperties[0] ?? properties[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon text-cream">
        <HeroBackground />
        <div className="relative">
          <HeroSlider />
        </div>

        {/* Search widget overlapping hero */}
        <div className="relative px-5 pb-16 lg:px-8">
          <SearchWidget />
        </div>
      </section>

      <HomeIntroSection spotlight={spotlight} spotlightThumb={spotlightThumb} />

      <MainFocusSection />

      <FeaturedSection properties={featuredProperties} />

      <HomeClosingSection testimonials={testimonials} articles={articles} />
    </>
  );
}
