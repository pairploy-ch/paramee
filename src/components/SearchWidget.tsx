"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { districts, propertyTypes } from "@/lib/properties";
import { propertyTypeLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function SearchWidget() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [district, setDistrict] = useState("ทั้งหมด");
  const [type, setType] = useState("ทั้งหมด");
  const [purpose, setPurpose] = useState("ทั้งหมด");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district !== "ทั้งหมด") params.set("district", district);
    if (type !== "ทั้งหมด") params.set("type", type);
    if (purpose !== "ทั้งหมด") params.set("purpose", purpose);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 mx-auto -mt-10 flex max-w-5xl flex-col gap-3 rounded-2xl border border-gold-light/40 bg-white p-4 shadow-xl sm:flex-row sm:items-end lg:-mt-12"
    >
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold text-ink/50">{t.properties.districtLabel}</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="ทั้งหมด">{t.properties.all}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold text-ink/50">{t.properties.typeLabel}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="ทั้งหมด">{t.properties.all}</option>
          {propertyTypes.map((pt) => (
            <option key={pt} value={pt}>
              {propertyTypeLabel(pt, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold text-ink/50">{t.properties.purposeLabel}</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="ทั้งหมด">{t.properties.all}</option>
          <option value="ซื้อ">{t.search.buyOption}</option>
          <option value="เช่า">{t.search.rentOption}</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-gold px-8 py-2.5 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
      >
        {t.search.submit}
      </button>
    </form>
  );
}
