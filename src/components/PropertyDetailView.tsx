"use client";

import Link from "next/link";
import { CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import type { Property } from "@/lib/types";
import { getAmenities } from "@/lib/amenities";
import { formatBaht, propertyTypeLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import ShareButton from "@/components/ShareButton";
import { FacebookIcon, InstagramIcon, LineIcon } from "@/components/icons";
import { socialLinks } from "@/lib/social";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream-dark/70 py-3 text-sm last:border-none">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium text-maroon-dark">{value}</span>
    </div>
  );
}

export default function PropertyDetailView({
  property,
  relatedProperties,
  isAdmin,
}: {
  property: Property;
  relatedProperties: Property[];
  isAdmin: boolean;
}) {
  const { t, lang } = useTranslation();

  const investorRows = [
    { label: "ROI", value: `${property.investor.roiPercent}%` },
    { label: "Rental Yield", value: `${property.investor.rentalYieldPercent}%` },
    { label: "Occupancy Rate", value: `${property.investor.occupancyPercent}%` },
    { label: t.propertyDetail.cashflowLabel, value: formatBaht(property.investor.cashflowPerMonth) },
  ];

  const mapQuery = encodeURIComponent(`${property.address}, ${property.district}, กรุงเทพฯ`);
  const amenities = getAmenities(property.type, lang);
  const mapTitle = lang === "en" ? `Map of ${property.name}` : `แผนที่ ${property.name}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/properties" className="hover:text-gold-dark">
          {t.propertyDetail.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{property.name}</span>
      </nav>

      {/* Gallery */}
      <PropertyGallery images={property.images} name={property.name} status={property.status} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
              {propertyTypeLabel(property.type, lang)} · {property.district}
            </span>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-maroon-dark">
              {property.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/60">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {property.address}
            </p>
            <p className="mt-4 leading-relaxed text-ink/80">{property.description}</p>
          </div>

          {/* General info */}
          <section className="mt-8 rounded-2xl border border-gold-light/40 bg-cream-dark/40 p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              {t.propertyDetail.generalInfo}
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow
                label={t.propertyDetail.areaLabel}
                value={`${property.areaSqm} ${t.units.sqmSuffix}`}
              />
              <InfoRow
                label={t.propertyDetail.bedroomsBathroomsLabel}
                value={`${property.bedrooms} / ${property.bathrooms}`}
              />
              <InfoRow label={t.propertyDetail.floorLabel} value={property.floor} />
              <InfoRow label={t.propertyDetail.facingLabel} value={property.facing} />
              {property.salePrice && (
                <InfoRow
                  label={t.propertyDetail.salePriceLabel}
                  value={`${formatBaht(property.salePrice)} (${formatBaht(
                    Math.round(property.salePrice / property.areaSqm)
                  )}/${t.units.sqmSuffix})`}
                />
              )}
              {property.rentPrice && (
                <InfoRow
                  label={t.propertyDetail.rentPriceLabel}
                  value={`${formatBaht(property.rentPrice)}${t.propertyDetail.rentPriceSuffix}`}
                />
              )}
            </div>
          </section>

          {/* Amenities */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              {t.propertyDetail.amenities}
            </h2>
            <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {amenities.map((a) => (
                <div key={a} className="flex items-center gap-2.5 text-sm text-ink/75">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-maroon" strokeWidth={1.75} aria-hidden />
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* Costs */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              {t.propertyDetail.costs}
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow
                label={t.propertyDetail.commonFeeLabel}
                value={
                  property.commonFeePerSqm
                    ? `${property.commonFeePerSqm} ฿/${t.units.sqmSuffix}${t.units.perMonth}`
                    : t.propertyDetail.noData
                }
              />
              <InfoRow
                label={t.propertyDetail.avgRentLabel}
                value={
                  property.avgRentInArea
                    ? `${formatBaht(property.avgRentInArea)}${t.units.perMonth}`
                    : t.propertyDetail.noData
                }
              />
              <InfoRow
                label={t.propertyDetail.transferFeeLabel}
                value={
                  property.transferFeeEstimate
                    ? formatBaht(property.transferFeeEstimate)
                    : t.propertyDetail.noData
                }
              />
            </div>
          </section>

          {/* Transit + location */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              {t.propertyDetail.transit}
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow
                label={t.propertyDetail.nearestStationLabel}
                value={`${property.transit.line} ${property.transit.station}`}
              />
              <InfoRow
                label={t.propertyDetail.distanceLabel}
                value={`${property.transit.distanceMeters.toLocaleString()} ${t.units.meterSuffix}`}
              />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={mapTitle}
              />
            </div>
          </section>

          {/* Investor data */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-maroon p-6 text-cream">
            <h2 className="font-heading text-lg font-semibold text-gold-light">
              {t.propertyDetail.investorInfo}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {investorRows.map((r) => (
                <div key={r.label} className="rounded-xl bg-cream/10 p-4 text-center">
                  <p className="text-xs text-cream/60">{r.label}</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-gold-light">
                    {r.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            {property.salePrice && (
              <p className="font-heading text-2xl font-semibold text-gold-dark">
                {formatBaht(property.salePrice)}
              </p>
            )}
            {property.rentPrice && (
              <p className="text-sm text-ink/60">
                {t.propertyDetail.orRent} {formatBaht(property.rentPrice)}
                {t.propertyDetail.rentPriceSuffix}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={`/booking?property=${property.slug}`}
                className="bg-gold px-5 py-3 text-center text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
              >
                {t.propertyDetail.bookViewing}
              </Link>
              {property.salePrice && isAdmin && (
                <Link
                  href={`/mortgage-calculator?price=${property.salePrice}`}
                  className="border border-gold-dark px-5 py-3 text-center text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
                >
                  {t.propertyDetail.calculateMortgage}
                </Link>
              )}
              <ShareButton />
            </div>
          </div>

          {/* Agent card */}
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon font-heading text-xl font-semibold text-gold-light">
              P
            </span>
            <p className="mt-3 font-heading text-base font-semibold text-maroon-dark">
              {t.propertyDetail.salesTeam}
            </p>
            <p className="text-xs text-ink/50">{t.propertyDetail.estateAgent}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-gold-dark">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
              ))}
            </div>
            <a
              href="tel:0957895692"
              className="mt-4 flex items-center justify-center gap-2 border border-gold-dark px-5 py-2.5 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              095-789-5692
            </a>
            <a
              href={socialLinks.line.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-2 bg-[#06C755] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <LineIcon className="h-4 w-4" />
              {t.propertyDetail.contactLine}
            </a>
            <div className="mt-4 flex justify-center gap-2.5">
              {[FacebookIcon, InstagramIcon].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-dark text-ink/50 transition-colors hover:border-gold-dark hover:text-gold-dark"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related properties */}
      {relatedProperties.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold text-maroon-dark">
            {t.propertyDetail.relatedProperties}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProperties.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
