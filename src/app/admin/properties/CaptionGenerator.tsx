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

  const firstTransit = values.transit.find((row) => row.station.trim());
  const nearbyHighlight = firstTransit
    ? ` ใกล้ ${firstTransit.station} ${firstTransit.distanceMeters || "-"} ม.`
    : "";
  const bedHighlight = !isLand && values.bedrooms.trim() ? ` ${values.bedrooms} Bed` : "";

  const headline = `${isRent ? "ให้เช่า" : "ประกาศขาย"}${values.type} ${values.district} ${
    values.name || "..."
  }${bedHighlight}${nearbyHighlight}`
    .replace(/\s+/g, " ")
    .trim();
  blocks.push(headline);

  const unitCodeSuffix = values.unitCode.trim() ? ` (${values.unitCode.trim()})` : "";
  blocks.push(`Condo : ${values.name || "..."}${unitCodeSuffix}`);

  const roomDetailParts = isLand
    ? [`${values.areaSqm || "-"} ไร่`, `${values.bedrooms || "-"} งาน`, `${values.bathrooms || "-"} ตร.ว.`]
    : [
        `${values.areaSqm || "-"} ตร.ม.`,
        `${values.bedrooms || "-"} ห้องนอน`,
        `${values.bathrooms || "-"} ห้องน้ำ`,
        `ชั้น ${values.floor || "-"}`,
        values.facing.trim() ? `วิว ${values.facing.trim()}` : "",
      ].filter(Boolean);
  blocks.push(`รายละเอียดห้อง:\n${roomDetailParts.join(" • ")}`);

  if (price.trim()) {
    const conditionLines = [`${price} บาท${isRent ? "/เดือน" : ""}`];
    if (isRent) {
      const termParts = [
        values.rentalMinTermMonths.trim() && `สัญญาเช่าขั้นต่ำ ${values.rentalMinTermMonths} เดือน`,
        values.rentalDepositMonths.trim() && `เงินประกันความเสียหาย ${values.rentalDepositMonths} เดือน`,
        values.rentalAdvanceMonths.trim() && `ค่าเช่าล่วงหน้า ${values.rentalAdvanceMonths} เดือน`,
      ].filter(Boolean);
      if (termParts.length > 0) conditionLines.push(termParts.join(" + "));
    }
    blocks.push(`${isRent ? "เงื่อนไขการเช่า" : "ราคาขาย"}:\n${conditionLines.join("\n")}`);
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
      .map((row) => `📍 ${row.station} (~${row.distanceMeters || "-"} ม.)`)
      .join("\n");
    blocks.push(`Nearby:\n${nearbyLines}`);
  }

  blocks.push(
    `สนใจติดต่อสอบถามรายละเอียดเพิ่มเติม / นัดชมห้องจริง\nโทร ${CONTACT_PHONE} | LINE: ${socialLinks.line.handle} | WhatsApp: ${CONTACT_PHONE}`
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
