"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Calendar, LayoutGrid } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import CompareToggleButton from "./CompareToggleButton";
import type { NewLaunchProject } from "@/lib/types";

function formatPriceRange(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  const fmt = (n: number) => n.toLocaleString("th-TH");
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)} บาท`;
  if (min != null) return `เริ่มต้น ${fmt(min)} บาท`;
  return `สูงสุด ${fmt(max as number)} บาท`;
}

export default function NewLaunchProjectCard({ project }: { project: NewLaunchProject }) {
  const priceLabel = formatPriceRange(project.priceMin, project.priceMax);
  const cover = project.images[0];

  return (
    <Link
      href={`/new-launch/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden bg-cream-dark">
          {cover ? (
            <Image
              src={cover}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/30">
              <Building2 className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            เปิดจอง{project.region && ` · ${project.region}`}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          <span className="rounded-full bg-maroon-dark/80 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
            {project.projectType}
          </span>
          <div className="flex gap-2">
            <CompareToggleButton slug={project.slug} />
            <BookmarkButton slug={project.slug} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          {priceLabel && <p className="font-heading text-lg font-semibold text-gold-dark">{priceLabel}</p>}
        </div>

        <h3 className="mt-1 font-heading text-lg font-semibold text-maroon-dark group-hover:text-maroon">
          {project.name}
          {project.projectCode.trim() && (
            <span className="ml-1.5 text-xs font-normal text-ink/40">({project.projectCode})</span>
          )}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/55">{project.locationHighlight}</p>

        <div className="mt-4 flex items-center gap-4 border-y border-cream-dark py-3 text-xs text-ink/60">
          {project.unitTypesCount.trim() && (
            <span className="flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {project.unitTypesCount} แบบ
            </span>
          )}
          {project.unitCount.trim() && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" strokeWidth={1.75} aria-hidden /> {project.unitCount} ยูนิต
            </span>
          )}
          {project.completionYear.trim() && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" strokeWidth={1.75} aria-hidden /> เสร็จปี {project.completionYear}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon text-gold-light">
              <Building2 className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold text-ink/80">
                {project.developer.trim() || "Paramee Asset"}
              </p>
              <p className="text-[11px] text-ink/45">ผู้พัฒนาโครงการ</p>
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
