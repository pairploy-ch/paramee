import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import { fetchNewLaunchProjectBySlug } from "@/lib/data/newLaunchProjects";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchNewLaunchProjectBySlug(
    slug,
    isSupabaseConfigured ? createPublicClient() : undefined
  );
  return { title: project ? `${project.name} | Paramee` : "ไม่พบโครงการ | Paramee" };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream-dark/70 py-3 text-sm last:border-none">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium text-maroon-dark">{value}</span>
    </div>
  );
}

export default async function NewLaunchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchNewLaunchProjectBySlug(
    slug,
    isSupabaseConfigured ? createPublicClient() : undefined
  );
  if (!project) notFound();

  const fmt = (n: number) => n.toLocaleString("th-TH");
  const priceLabel =
    project.priceMin != null || project.priceMax != null
      ? `${project.priceMin != null ? fmt(project.priceMin) : "-"} - ${
          project.priceMax != null ? fmt(project.priceMax) : "-"
        } บาท`
      : null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/new-launch" className="hover:text-gold-dark">
          โครงการมือ 1
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{project.name}</span>
      </nav>

      {project.images.length > 0 ? (
        <div className="grid h-[280px] grid-cols-3 gap-2 overflow-hidden rounded-2xl sm:h-[420px]">
          <div className="relative col-span-2">
            <Image
              src={project.images[0]}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <div className="flex h-full flex-col gap-2">
            {project.images.slice(1, 3).map((src, i) => (
              <div key={i} className="relative flex-1">
                <Image src={src} alt={`${project.name} รูปที่ ${i + 2}`} fill sizes="240px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[280px] items-center justify-center rounded-2xl bg-cream-dark text-ink/30 sm:h-[420px]">
          <Building2 className="h-12 w-12" strokeWidth={1.5} />
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
            {project.projectType}
            {project.region && ` · ${project.region}`}
            {project.developer.trim() && ` · ${project.developer}`}
          </span>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-maroon-dark">
            {project.name}
            {project.projectCode.trim() && (
              <span className="ml-2 align-middle text-sm font-medium text-ink/40">
                ({project.projectCode})
              </span>
            )}
          </h1>
          {project.locationHighlight.trim() && (
            <p className="mt-4 leading-relaxed text-ink/80">{project.locationHighlight}</p>
          )}

          <section className="mt-8 rounded-2xl border border-gold-light/40 bg-cream-dark/40 p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลโครงการ</h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              {project.unitTypesCount.trim() && (
                <InfoRow label="จำนวนแบบ" value={project.unitTypesCount} />
              )}
              {project.unitCount.trim() && <InfoRow label="จำนวนยูนิต" value={project.unitCount} />}
              {project.buildingCount.trim() && (
                <InfoRow label="จำนวนอาคาร" value={project.buildingCount} />
              )}
              {project.completionYear.trim() && (
                <InfoRow label="ปีที่สร้างเสร็จ" value={project.completionYear} />
              )}
              {project.rentYieldPrice.trim() && (
                <InfoRow label="ปล่อยเช่าได้ในราคา" value={project.rentYieldPrice} />
              )}
              {project.reservationDeposit.trim() && (
                <InfoRow label="เงินจอง / เงินดาวน์" value={project.reservationDeposit} />
              )}
            </div>
          </section>

          {project.commonAreaFacilities.trim() && (
            <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">ส่วนกลาง</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/80">
                {project.commonAreaFacilities}
              </p>
            </section>
          )}

          {project.latestPromotion.trim() && (
            <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">โปรโมชั่นล่าสุด</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/80">
                {project.latestPromotion}
              </p>
            </section>
          )}
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            {priceLabel && (
              <p className="font-heading text-2xl font-semibold text-gold-dark">{priceLabel}</p>
            )}
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/booking"
                className="bg-gold px-5 py-3 text-center text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
              >
                นัดชมโครงการนี้
              </Link>
              {project.mapUrl && (
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-gold-dark px-5 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
                >
                  <MapPin className="h-4 w-4" strokeWidth={1.75} />
                  เปิดใน Google Maps
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
