"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { properties, propertyTypes, districts } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import type { PropertyType } from "@/lib/types";

export default function PropertiesBrowser() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as PropertyType | null;
  const initialDistrict = searchParams.get("district");
  const initialPurpose = searchParams.get("purpose") as "ซื้อ" | "เช่า" | null;

  const [type, setType] = useState<PropertyType | "ทั้งหมด">(initialType ?? "ทั้งหมด");
  const [district, setDistrict] = useState(initialDistrict ?? "ทั้งหมด");
  const [purpose, setPurpose] = useState<"ทั้งหมด" | "ซื้อ" | "เช่า">(initialPurpose ?? "ทั้งหมด");
  const [maxPrice, setMaxPrice] = useState(50_000_000);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type !== "ทั้งหมด" && p.type !== type) return false;
      if (district !== "ทั้งหมด" && p.district !== district) return false;
      if (purpose === "ซื้อ" && !p.salePrice) return false;
      if (purpose === "เช่า" && !p.rentPrice) return false;
      if (p.salePrice && p.salePrice > maxPrice) return false;
      if (
        query &&
        !`${p.name} ${p.district} ${p.address}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [type, district, purpose, maxPrice, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
          ทรัพย์ทั้งหมด
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          พบ {filtered.length} รายการ จากทั้งหมด {properties.length} รายการตัวอย่าง
          (ระบบเต็มรองรับ 300–500 รายการ)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 grid gap-4 border border-gold-light/40 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            ค้นหา
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ชื่อโครงการ, ทำเล..."
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            ประเภททรัพย์
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | "ทั้งหมด")}
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option>ทั้งหมด</option>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            ทำเล
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option>ทั้งหมด</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            วัตถุประสงค์
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as "ทั้งหมด" | "ซื้อ" | "เช่า")}
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option>ทั้งหมด</option>
            <option>ซื้อ</option>
            <option>เช่า</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">
            ราคาสูงสุด: {maxPrice.toLocaleString("th-TH")} บาท
          </label>
          <input
            type="range"
            min={1_000_000}
            max={50_000_000}
            step={500_000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2.5 w-full accent-gold"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          ไม่พบทรัพย์ที่ตรงกับเงื่อนไข ลองปรับตัวกรองใหม่
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
