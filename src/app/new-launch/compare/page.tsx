import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { fetchAllNewLaunchProjects } from "@/lib/data/newLaunchProjects";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import type { NewLaunchProject } from "@/lib/types";

export const metadata: Metadata = {
  title: "เปรียบเทียบโครงการมือ 1 | Paramee",
};

function fmtPriceRange(min: number | null, max: number | null) {
  if (min == null && max == null) return "-";
  const fmt = (n: number) => n.toLocaleString("th-TH");
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)} บาท`;
  if (min != null) return `เริ่มต้น ${fmt(min)} บาท`;
  return `สูงสุด ${fmt(max as number)} บาท`;
}

const rows: { label: string; render: (p: NewLaunchProject) => string }[] = [
  { label: "ประเภท", render: (p) => p.projectType },
  { label: "ทำเล", render: (p) => p.region ?? "-" },
  { label: "ผู้พัฒนาโครงการ", render: (p) => p.developer || "-" },
  { label: "ช่วงราคา", render: (p) => fmtPriceRange(p.priceMin, p.priceMax) },
  { label: "ปล่อยเช่าได้ในราคา", render: (p) => p.rentYieldPrice || "-" },
  { label: "จำนวนแบบ", render: (p) => p.unitTypesCount || "-" },
  { label: "จำนวนยูนิต", render: (p) => p.unitCount || "-" },
  { label: "จำนวนอาคาร", render: (p) => p.buildingCount || "-" },
  { label: "ปีที่สร้างเสร็จ", render: (p) => p.completionYear || "-" },
  { label: "ส่วนกลาง", render: (p) => p.commonAreaFacilities || "-" },
  { label: "เงินจอง / เงินดาวน์", render: (p) => p.reservationDeposit || "-" },
  { label: "โปรโมชั่นล่าสุด", render: (p) => p.latestPromotion || "-" },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string }>;
}) {
  const { slugs: slugsParam } = await searchParams;
  const requestedSlugs = (slugsParam ?? "").split(",").filter(Boolean).slice(0, 3);

  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const allProjects = await fetchAllNewLaunchProjects(supabase);
  const projects = requestedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter((p): p is NewLaunchProject => Boolean(p));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/new-launch" className="hover:text-gold-dark">
          โครงการมือ 1
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">เปรียบเทียบ</span>
      </nav>
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">เปรียบเทียบโครงการ</h1>

      {projects.length < 2 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          กรุณาเลือกอย่างน้อย 2 โครงการเพื่อเปรียบเทียบ
          <div className="mt-4">
            <Link
              href="/new-launch"
              className="inline-block bg-gold px-6 py-3 text-sm font-medium text-maroon-dark hover:bg-gold-light"
            >
              ไปเลือกโครงการ
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
          <table className="w-full min-w-[640px] table-fixed text-left text-sm">
            <thead>
              <tr className="border-b border-cream-dark">
                <th className="w-40 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-ink/40">
                  รายการ
                </th>
                {projects.map((p) => (
                  <th key={p.slug} className="px-4 py-4 align-top">
                    <div className="relative mb-2 h-28 w-full overflow-hidden rounded-lg bg-cream-dark">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill sizes="220px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink/30">
                          <Building2 className="h-8 w-8" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/new-launch/${p.slug}`}
                      className="font-heading text-sm font-semibold text-maroon-dark hover:text-maroon"
                    >
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-cream-dark last:border-none">
                  <td className="px-4 py-3 text-xs font-semibold text-ink/50">{row.label}</td>
                  {projects.map((p) => (
                    <td key={p.slug} className="px-4 py-3 text-ink/80">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
