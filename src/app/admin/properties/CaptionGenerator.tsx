"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { PropertyFormValues } from "@/components/PropertyForm";
import { CONTACT_PHONE, socialLinks } from "@/lib/social";

function buildCaption(values: PropertyFormValues): string {
  const isRent = !values.salePrice.trim() && !!values.rentPrice.trim();
  const isLand = values.type === "ที่ดิน";
  const price = isRent ? values.rentPrice : values.salePrice;

  const blocks: string[] = [];

  blocks.push(`${isRent ? "ให้เช่า" : "ประกาศขาย"}${values.type}\nCondo: ${values.name || "..."}`);

  const locationLine = [values.address, values.district].filter((s) => s.trim()).join(" ");
  if (locationLine) blocks.push(locationLine);

  if (values.description.trim()) blocks.push(values.description.trim());

  const roomDetail = isLand
    ? `พื้นที่ ${values.areaSqm || "-"} ไร่ ${values.bedrooms || "-"} งาน ${values.bathrooms || "-"} ตร.ว.`
    : `${values.areaSqm || "-"} ตร.ม. • ${values.bedrooms || "-"} ห้องนอน • ${values.bathrooms || "-"} ห้องน้ำ • ชั้น ${values.floor || "-"} • วิว ${values.facing || "-"}`;
  blocks.push(`รายละเอียดห้อง:\n${roomDetail}`);

  if (price.trim()) {
    blocks.push(`${isRent ? "ราคาเช่า" : "ราคาขาย"} ${price} บาท${isRent ? "/เดือน" : ""}`);
  }

  const validLeaseTerms = values.leaseTerms.filter((row) => row.duration.trim());
  if (validLeaseTerms.length > 0) {
    const leaseLines = validLeaseTerms
      .map((row) => `สัญญา ${row.duration} ปี ราคา ${row.price || "-"} บาท`)
      .join("\n");
    blocks.push(`สัญญาเช่าเริ่มต้น:\n${leaseLines}`);
  }

  const validTransit = values.transit.filter((row) => row.station.trim());
  if (validTransit.length > 0) {
    const nearbyLines = validTransit
      .map((row) => `${row.line} ${row.station} (${row.distanceMeters || "-"} ม.)`)
      .join("\n");
    blocks.push(`Nearby:\n${nearbyLines}`);
  }

  blocks.push(
    `สนใจติดต่อสอบถามรายละเอียดเพิ่มเติม / นัดชมห้องจริง\nโทร ${CONTACT_PHONE} | LINE: ${socialLinks.line.handle}`
  );

  return blocks.join("\n\n");
}

export default function CaptionGenerator({ values }: { values: PropertyFormValues }) {
  const [copied, setCopied] = useState(false);
  const caption = buildCaption(values);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
      <h2 className="font-heading text-lg font-semibold text-maroon-dark">พรีวิวแคปชัน Facebook</h2>
      <textarea
        readOnly
        value={caption}
        rows={16}
        className="mt-4 w-full whitespace-pre-wrap border border-cream-dark bg-cream px-3 py-3 font-mono text-xs leading-relaxed text-ink outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 flex w-full items-center justify-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
      >
        {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
        {copied ? "คัดลอกแล้ว" : "คัดลอกแคปชั่น"}
      </button>
    </div>
  );
}
