"use client";

import Carousel from "./Carousel";
import PropertyCard from "./PropertyCard";
import type { Property } from "@/lib/types";

export default function FeaturedCarousel({ properties }: { properties: Property[] }) {
  return (
    <Carousel
      itemClassName="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-18px)]"
      dotsWrapperClassName="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-maroon-dark px-4 py-2.5"
      dotClassName={(active) =>
        `h-2 rounded-full transition-all ${
          active ? "w-7 bg-gold-light" : "w-2 bg-cream/30 hover:bg-cream/50"
        }`
      }
    >
      {properties.map((p) => (
        <PropertyCard key={p.slug} property={p} />
      ))}
    </Carousel>
  );
}
