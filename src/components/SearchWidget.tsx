"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { propertyTypes } from "@/lib/properties";
import { propertyTypeLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import SelectDropdown from "./SelectDropdown";

export default function SearchWidget({ districts }: { districts: string[] }) {
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
        <SelectDropdown
          value={district}
          onChange={setDistrict}
          options={[
            { value: "ทั้งหมด", label: t.properties.all },
            ...districts.map((d) => ({ value: d, label: d })),
          ]}
        />
      </div>

      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold text-ink/50">{t.properties.typeLabel}</label>
        <SelectDropdown
          value={type}
          onChange={setType}
          options={[
            { value: "ทั้งหมด", label: t.properties.all },
            ...propertyTypes.map((pt) => ({ value: pt, label: propertyTypeLabel(pt, lang) })),
          ]}
        />
      </div>

      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-semibold text-ink/50">{t.properties.purposeLabel}</label>
        <SelectDropdown
          value={purpose}
          onChange={setPurpose}
          options={[
            { value: "ทั้งหมด", label: t.properties.all },
            { value: "ซื้อ", label: t.search.buyOption },
            { value: "เช่า", label: t.search.rentOption },
          ]}
        />
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
