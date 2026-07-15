"use client";

import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatCompactBaht, formatBaht, propertyTypeLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import PropertyImage from "./PropertyImage";
import StatusBadge from "./StatusBadge";
import BookmarkButton from "./BookmarkButton";

export default function PropertyCard({ property }: { property: Property }) {
  const { t, lang } = useTranslation();

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex h-full flex-col overflow-hidden bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative">
        <PropertyImage images={property.images} name={property.name} className="h-48 w-full" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          <span className="rounded-full bg-maroon-dark/80 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
            {propertyTypeLabel(property.type, lang)}
          </span>
          <BookmarkButton slug={property.slug} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent px-4 py-2.5 text-xs text-cream/90">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          {property.district} · {property.transit.line} {property.transit.station} ·{" "}
          {property.transit.distanceMeters} {t.units.meterSuffix}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          {property.salePrice ? (
            <p className="font-heading text-lg font-semibold text-gold-dark">
              {formatCompactBaht(property.salePrice, lang)}
            </p>
          ) : (
            <p className="font-heading text-lg font-semibold text-gold-dark">
              {formatBaht(property.rentPrice ?? 0)}
              <span className="text-xs font-normal text-ink/50">{t.units.perMonth}</span>
            </p>
          )}
        </div>

        <h3 className="mt-1 font-heading text-lg font-semibold text-maroon-dark group-hover:text-maroon">
          {property.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/55">{property.description}</p>

        <div className="mt-4 flex items-center gap-4 border-y border-cream-dark py-3 text-xs text-ink/60">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {property.bedrooms}{" "}
              {t.units.bedroomsSuffix}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {property.bathrooms}{" "}
              {t.units.bathroomsSuffix}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {property.areaSqm} {t.units.sqmSuffix}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon font-heading text-xs font-semibold text-gold-light">
              P
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-ink/80">{t.propertyDetail.salesTeam}</p>
              <p className="text-[11px] text-ink/45">{t.propertyDetail.estateAgent}</p>
            </div>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-light/50 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-maroon-dark">
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  );
}
