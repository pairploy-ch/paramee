import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import { getPropertyBySlug, properties } from "@/lib/properties";
import { amenitiesByType } from "@/lib/amenities";
import { formatBaht } from "@/lib/format";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import { FacebookIcon, InstagramIcon } from "@/components/icons";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  return { title: property ? `${property.name} | Paramee` : "ไม่พบทรัพย์ | Paramee" };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream-dark/70 py-3 text-sm last:border-none">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium text-maroon-dark">{value}</span>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const investorRows = [
    { label: "ROI", value: `${property.investor.roiPercent}%` },
    { label: "Rental Yield", value: `${property.investor.rentalYieldPercent}%` },
    { label: "Occupancy Rate", value: `${property.investor.occupancyPercent}%` },
    {
      label: "Cashflow ต่อเดือน",
      value: formatBaht(property.investor.cashflowPerMonth),
    },
  ];

  const mapQuery = encodeURIComponent(`${property.address}, ${property.district}, กรุงเทพฯ`);
  const amenities = amenitiesByType[property.type];
  const relatedProperties = properties
    .filter((p) => p.slug !== property.slug && (p.district === property.district || p.type === property.type))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/properties" className="hover:text-gold-dark">
          ทรัพย์ทั้งหมด
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
              {property.type} · {property.district}
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
              ข้อมูลทั่วไป
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="ขนาดพื้นที่" value={`${property.areaSqm} ตร.ม.`} />
              <InfoRow
                label="ห้องนอน / ห้องน้ำ"
                value={`${property.bedrooms} / ${property.bathrooms}`}
              />
              <InfoRow label="ชั้น" value={property.floor} />
              <InfoRow label="ทิศ" value={property.facing} />
              {property.salePrice && (
                <InfoRow
                  label="ราคาขาย"
                  value={`${formatBaht(property.salePrice)} (${formatBaht(
                    Math.round(property.salePrice / property.areaSqm)
                  )}/ตร.ม.)`}
                />
              )}
              {property.rentPrice && (
                <InfoRow label="ราคาเช่า" value={`${formatBaht(property.rentPrice)}/เดือน`} />
              )}
            </div>
          </section>

          {/* Amenities */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              สิ่งอำนวยความสะดวก
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
              ค่าใช้จ่าย
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow
                label="ค่าส่วนกลาง"
                value={
                  property.commonFeePerSqm
                    ? `${property.commonFeePerSqm} บาท/ตร.ม./เดือน`
                    : "ไม่มี"
                }
              />
              <InfoRow
                label="ค่าเช่าเฉลี่ยในพื้นที่"
                value={
                  property.avgRentInArea
                    ? `${formatBaht(property.avgRentInArea)}/เดือน`
                    : "ไม่มีข้อมูล"
                }
              />
              <InfoRow
                label="ค่าโอนกรรมสิทธิ์ (ประมาณการ)"
                value={
                  property.transferFeeEstimate
                    ? formatBaht(property.transferFeeEstimate)
                    : "ไม่มีข้อมูล"
                }
              />
            </div>
          </section>

          {/* Transit + location */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              ระบบขนส่งและทำเล
            </h2>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow
                label="สถานีใกล้ที่สุด"
                value={`${property.transit.line} ${property.transit.station}`}
              />
              <InfoRow
                label="ระยะทาง"
                value={`${property.transit.distanceMeters.toLocaleString()} ม.`}
              />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`แผนที่ ${property.name}`}
              />
            </div>
          </section>

          {/* Investor data */}
          <section className="mt-6 rounded-2xl border border-gold-light/40 bg-maroon p-6 text-cream">
            <h2 className="font-heading text-lg font-semibold text-gold-light">
              ข้อมูลสำหรับนักลงทุน
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
                หรือเช่า {formatBaht(property.rentPrice)}/เดือน
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={`/booking?property=${property.slug}`}
                className="bg-gold px-5 py-3 text-center text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
              >
                นัดชมทรัพย์นี้
              </Link>
              <Link
                href={`/booking?property=${property.slug}&mode=reserve`}
                className="bg-maroon px-5 py-3 text-center text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
              >
                จองและวางมัดจำ
              </Link>
              {property.salePrice && (
                <Link
                  href={`/mortgage-calculator?price=${property.salePrice}`}
                  className="border border-gold-dark px-5 py-3 text-center text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
                >
                  คำนวณสินเชื่อสำหรับทรัพย์นี้
                </Link>
              )}
            </div>
          </div>

          {/* Agent card */}
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon font-heading text-xl font-semibold text-gold-light">
              P
            </span>
            <p className="mt-3 font-heading text-base font-semibold text-maroon-dark">
              ทีมขาย Paramee
            </p>
            <p className="text-xs text-ink/50">Estate Agent</p>
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
            ทรัพย์ใกล้เคียง
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
