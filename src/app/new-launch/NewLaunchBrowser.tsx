"use client";

import { useMemo, useState } from "react";
import NewLaunchProjectCard from "@/components/NewLaunchProjectCard";
import SelectDropdown from "@/components/SelectDropdown";
import CompareBar from "@/components/CompareBar";
import { propertyTypes } from "@/lib/properties";
import { newLaunchRegions } from "@/lib/types";
import type { NewLaunchProject, PropertyType } from "@/lib/types";

const MIN_PRICE = 0;
const MAX_PRICE = 50_000_000;

export default function NewLaunchBrowser({ initialProjects }: { initialProjects: NewLaunchProject[] }) {
  const projects = initialProjects;
  const developers = useMemo(
    () => Array.from(new Set(projects.map((p) => p.developer).filter((d) => d.trim()))),
    [projects]
  );

  const [query, setQuery] = useState("");
  const [projectType, setProjectType] = useState<PropertyType | "ทั้งหมด">("ทั้งหมด");
  const [region, setRegion] = useState("ทั้งหมด");
  const [developer, setDeveloper] = useState("ทั้งหมด");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (projectType !== "ทั้งหมด" && p.projectType !== projectType) return false;
      if (region !== "ทั้งหมด" && p.region !== region) return false;
      if (developer !== "ทั้งหมด" && p.developer !== developer) return false;
      const effectivePrice = p.priceMin ?? p.priceMax ?? 0;
      if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [projects, projectType, region, developer, minPrice, maxPrice, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 pb-28 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">โครงการมือ 1</h1>
        <p className="mt-2 text-sm text-ink/60">
          โครงการเปิดใหม่จากผู้พัฒนาชั้นนำ พร้อมข้อมูลราคาและโปรโมชั่นล่าสุด — เลือกได้สูงสุด 3 โครงการเพื่อเปรียบเทียบ
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 grid gap-4 border border-gold-light/40 bg-white p-5 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ค้นหาชื่อโครงการ</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ชื่อโครงการ..."
            className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ประเภทโครงการ</label>
          <SelectDropdown
            value={projectType}
            onChange={(v) => setProjectType(v as PropertyType | "ทั้งหมด")}
            options={[
              { value: "ทั้งหมด", label: "ทั้งหมด" },
              ...propertyTypes.map((pt) => ({ value: pt, label: pt })),
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ทำเล</label>
          <SelectDropdown
            value={region}
            onChange={setRegion}
            options={[
              { value: "ทั้งหมด", label: "ทั้งหมด" },
              ...newLaunchRegions.map((r) => ({ value: r, label: r })),
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ผู้พัฒนาโครงการ</label>
          <SelectDropdown
            value={developer}
            onChange={setDeveloper}
            options={[
              { value: "ทั้งหมด", label: "ทั้งหมด" },
              ...developers.map((d) => ({ value: d, label: d })),
            ]}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ช่วงราคา (บาท)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={100_000}
              value={minPrice}
              onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))}
              placeholder="ต่ำสุด"
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <span className="text-ink/40">—</span>
            <input
              type="number"
              min={0}
              step={100_000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              placeholder="สูงสุด"
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          ไม่พบโครงการที่ตรงกับเงื่อนไข ลองปรับตัวกรองใหม่
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <NewLaunchProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}

      <CompareBar projects={projects} />
    </div>
  );
}
