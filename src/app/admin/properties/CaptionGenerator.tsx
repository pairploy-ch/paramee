"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { PropertyFormValues } from "@/components/PropertyForm";
import { CONTACT_PHONE, socialLinks } from "@/lib/social";
import { propertyTypeLabel } from "@/lib/format";

function toIntlPhone(phone: string) {
  return phone.startsWith("0") ? `+66 ${phone.slice(1)}` : phone;
}

function buildCaption(values: PropertyFormValues): string {
  const includesRent = values.listingType === "เช่า" || values.listingType === "เช่า + ขาย";
  const includesSale = values.listingType === "ขาย" || values.listingType === "เช่า + ขาย";
  const isLand = values.type === "ที่ดิน";

  const blocks: string[] = [];

  const firstTransit = values.transit.find((row) => row.station.trim());
  const nearbyHighlight = firstTransit
    ? ` ใกล้ ${firstTransit.station} ${firstTransit.distanceMeters || "-"} ม.`
    : "";
  const bedHighlight = !isLand && values.bedrooms.trim() ? ` ${values.bedrooms} Bed` : "";

  const headlineWord = includesRent && includesSale ? "ให้เช่า/ขาย" : includesRent ? "ให้เช่า" : "ประกาศขาย";
  const headline = `NEW❗️ ${headlineWord}${values.type} ${values.district} ${
    values.name || "..."
  }${bedHighlight}${nearbyHighlight}`
    .replace(/\s+/g, " ")
    .trim();
  blocks.push(headline);

  const unitCodeSuffix = values.unitCode.trim() ? ` (${values.unitCode.trim()})` : "";
  blocks.push(`Condo : ${values.name || "..."}${unitCodeSuffix}`);

  blocks.push(
    `สนใจติดต่อสอบถามรายละเอียดเพิ่มเติม / นัดชมห้องจริง\nโทร ${CONTACT_PHONE} | LINE: ${socialLinks.line.handle} | WhatsApp: ${CONTACT_PHONE}`
  );

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

  if (includesRent && values.rentPrice.trim()) {
    const conditionLines = [`${values.rentPrice} บาท/เดือน`];
    const termParts = [
      values.rentalMinTermMonths.trim() && `สัญญาเช่าขั้นต่ำ ${values.rentalMinTermMonths} เดือน`,
      values.rentalDepositMonths.trim() && `เงินประกันความเสียหาย ${values.rentalDepositMonths} เดือน`,
      values.rentalAdvanceMonths.trim() && `ค่าเช่าล่วงหน้า ${values.rentalAdvanceMonths} เดือน`,
    ].filter(Boolean);
    if (termParts.length > 0) conditionLines.push(termParts.join(" + "));
    blocks.push(`เงื่อนไขการเช่า:\n${conditionLines.join("\n")}`);
  }

  if (includesSale && values.salePrice.trim()) {
    blocks.push(`ราคาขาย:\n${values.salePrice} บาท`);
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

  return blocks.join("\n\n");
}

function buildCaptionEn(values: PropertyFormValues): string {
  const includesRent = values.listingType === "เช่า" || values.listingType === "เช่า + ขาย";
  const includesSale = values.listingType === "ขาย" || values.listingType === "เช่า + ขาย";
  const isLand = values.type === "ที่ดิน";
  const typeLabel = propertyTypeLabel(values.type, "en");
  const unitCodeSuffix = values.unitCode.trim() ? ` (${values.unitCode.trim()})` : "";

  const blocks: string[] = [];

  const districtPart = values.district.trim() ? ` in ${values.district.trim()}` : "";
  const bedSegment = !isLand && values.bedrooms.trim() ? `${values.bedrooms}-Bedroom ${typeLabel}` : typeLabel;

  const listingWord = includesRent && includesSale ? "Rent/Sale" : includesRent ? "Rent" : "Sale";
  const headline = [
    `NEW❗️ ${typeLabel} for ${listingWord}${districtPart}`,
    values.name || "...",
    bedSegment,
  ].join(" | ");
  blocks.push(headline);

  blocks.push(`Property: ${values.name || "..."}${unitCodeSuffix}`);

  const intlPhoneEarly = toIntlPhone(CONTACT_PHONE);
  blocks.push(
    `───────────────────────\nFor more information or to schedule a viewing:\nK.Prem: ${intlPhoneEarly}\nLINE: ${socialLinks.line.handle} | WhatsApp: ${intlPhoneEarly}`
  );

  const roomDetailParts = isLand
    ? [`${values.areaSqm || "-"} Rai`, `${values.bedrooms || "-"} Ngan`, `${values.bathrooms || "-"} Sq.Wah`]
    : [
        `${values.areaSqm || "-"} sq.m.`,
        values.bedrooms.trim() ? `${values.bedrooms} Bedrooms` : "",
        values.bathrooms.trim() ? `${values.bathrooms} Bathrooms` : "",
        values.floor.trim() && values.floor.trim() !== "-" ? `Floor ${values.floor.trim()}` : "",
        values.facing.trim() ? `${values.facing.trim()} view` : "",
      ].filter(Boolean);
  blocks.push(`Property Details\n${roomDetailParts.join(" • ")}`);

  if (includesRent && values.rentPrice.trim()) {
    const rentNum = Number(values.rentPrice);
    const formattedRent = Number.isFinite(rentNum) ? rentNum.toLocaleString("en-US") : values.rentPrice;
    const conditionLines = [`THB ${formattedRent} / month`];
    if (values.rentalMinTermMonths.trim()) {
      conditionLines.push(`• Minimum ${values.rentalMinTermMonths}-month lease`);
    }
    const depositAdvanceParts = [
      values.rentalDepositMonths.trim() && `${values.rentalDepositMonths}-month security deposit`,
      values.rentalAdvanceMonths.trim() && `${values.rentalAdvanceMonths}-month advance rent`,
    ].filter(Boolean);
    if (depositAdvanceParts.length > 0) conditionLines.push(`• ${depositAdvanceParts.join(" + ")}`);
    blocks.push(`Rental Terms\n${conditionLines.join("\n")}`);
  }

  if (includesSale && values.salePrice.trim()) {
    const saleNum = Number(values.salePrice);
    const formattedSale = Number.isFinite(saleNum) ? saleNum.toLocaleString("en-US") : values.salePrice;
    blocks.push(`Sale Price\nTHB ${formattedSale}`);
  }

  const validLeaseTerms = values.leaseTerms.filter((row) => row.duration.trim());
  if (validLeaseTerms.length > 0) {
    const leaseLines = validLeaseTerms
      .map((row) => `• ${row.duration}-year lease, price ${row.price || "-"} THB`)
      .join("\n");
    blocks.push(`Initial Lease Terms\n${leaseLines}`);
  }

  const validTransit = values.transit.filter((row) => row.station.trim());
  if (validTransit.length > 0) {
    const nearbyLines = validTransit
      .map((row) => `📍 ${row.station} (~${row.distanceMeters || "-"} m.)`)
      .join("\n");
    blocks.push(`Nearby\n${nearbyLines}`);
  }

  return blocks.join("\n\n");
}

export default function CaptionGenerator({ values }: { values: PropertyFormValues }) {
  const [copied, setCopied] = useState(false);
  const caption = `${buildCaption(values)}\n\n${buildCaptionEn(values)}`;

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
