"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { propertyTypes } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import SelectDropdown from "@/components/SelectDropdown";
import { propertyTypeLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Property, PropertyType } from "@/lib/types";

const MIN_PRICE = 0;
const MAX_PRICE = 50_000_000;

export default function PropertiesBrowser({ initialProperties }: { initialProperties: Property[] }) {
  const { t: tr, lang } = useTranslation();
  const properties = initialProperties;
  const districts = useMemo(
    () => Array.from(new Set(properties.map((p) => p.district))),
    [properties]
  );
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as PropertyType | null;
  const initialDistrict = searchParams.get("district");
  const initialPurpose = searchParams.get("purpose") as "ซื้อ" | "เช่า" | null;

  const [type, setType] = useState<PropertyType | "ทั้งหมด">(initialType ?? "ทั้งหมด");
  const [district, setDistrict] = useState(initialDistrict ?? "ทั้งหมด");
  const [purpose, setPurpose] = useState<"ทั้งหมด" | "ซื้อ" | "เช่า">(initialPurpose ?? "ทั้งหมด");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type !== "ทั้งหมด" && p.type !== type) return false;
      if (district !== "ทั้งหมด" && p.district !== district) return false;
      if (purpose === "ซื้อ" && !p.salePrice) return false;
      if (purpose === "เช่า" && !p.rentPrice) return false;
      const effectivePrice = p.salePrice ?? p.rentPrice ?? 0;
      if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [type, district, purpose, minPrice, maxPrice, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
          {tr.properties.title}
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-10 grid gap-4 border border-gold-light/40 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            {tr.properties.searchLabel}
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr.properties.searchPlaceholder}
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            {tr.properties.typeLabel}
          </label>
          <SelectDropdown
            value={type}
            onChange={(v) => setType(v as PropertyType | "ทั้งหมด")}
            options={[
              { value: "ทั้งหมด", label: tr.properties.all },
              ...propertyTypes.map((pt) => ({ value: pt, label: propertyTypeLabel(pt, lang) })),
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            {tr.properties.districtLabel}
          </label>
          <SelectDropdown
            value={district}
            onChange={setDistrict}
            options={[
              { value: "ทั้งหมด", label: tr.properties.all },
              ...districts.map((d) => ({ value: d, label: d })),
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            {tr.properties.purposeLabel}
          </label>
          <SelectDropdown
            value={purpose}
            onChange={(v) => setPurpose(v as "ทั้งหมด" | "ซื้อ" | "เช่า")}
            options={[
              { value: "ทั้งหมด", label: tr.properties.all },
              { value: "ซื้อ", label: tr.search.buyOption },
              { value: "เช่า", label: tr.search.rentOption },
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            {tr.properties.priceRangeLabel}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={100_000}
              value={minPrice}
              onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))}
              placeholder={tr.properties.minPlaceholder}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <span className="text-ink/40">—</span>
            <input
              type="number"
              min={0}
              step={100_000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              placeholder={tr.properties.maxPlaceholder}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          {tr.properties.noResults}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
