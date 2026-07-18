import { fetchAllProperties } from "@/lib/data/properties";
import { fetchAllNewLaunchProjects } from "@/lib/data/newLaunchProjects";
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
import NewLaunchSection from "@/components/NewLaunchSection";
import HomeClosingSection from "@/components/HomeClosingSection";

export default async function Home() {
  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const properties = await fetchAllProperties(supabase);
  const newLaunchProjects = (await fetchAllNewLaunchProjects(supabase)).slice(0, 3);
  const testimonials = await fetchPublishedTestimonials(supabase);
  const articles = (await fetchPublishedPosts(supabase)).slice(0, 3);
  const availableProperties = properties.filter(
    (p) => p.status === "Available" || p.status === "For Rent"
  );
  const featuredProperties = availableProperties.filter((p) => p.tier === 1);
  const districts = Array.from(new Set(properties.map((p) => p.district)));

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
          <SearchWidget districts={districts} />
        </div>
      </section>

      <HomeIntroSection />

      <MainFocusSection />

      <FeaturedSection properties={featuredProperties} />

      {newLaunchProjects.length > 0 && <NewLaunchSection projects={newLaunchProjects} />}

      <HomeClosingSection testimonials={testimonials} articles={articles} />
    </>
  );
}
