import type { Property } from "@/lib/types";
import { CONTACT_PHONE, socialLinks } from "@/lib/social";
import { propertyTypeLabel } from "@/lib/format";

function toIntlPhone(phone: string) {
  return phone.startsWith("0") ? `+66 ${phone.slice(1)}` : phone;
}

function n(value: number): string {
  return value ? String(value) : "-";
}

export function buildPropertyCaptionTh(property: Property): string {
  const includesRent = property.listingType === "เช่า" || property.listingType === "เช่า + ขาย";
  const includesSale = property.listingType === "ขาย" || property.listingType === "เช่า + ขาย";
  const isLand = property.type === "ที่ดิน";

  const blocks: string[] = [];

  const firstTransit = property.transit.find((row) => row.station.trim());
  const nearbyHighlight = firstTransit
    ? ` ใกล้ ${firstTransit.station} ${firstTransit.distanceMeters || "-"} ม.`
    : "";
  const bedHighlight = !isLand && property.bedrooms ? ` ${property.bedrooms} Bed` : "";

  const headlineWord = includesRent && includesSale ? "ให้เช่า/ขาย" : includesRent ? "ให้เช่า" : "ประกาศขาย";
  const headline = `NEW❗️ ${headlineWord}${property.type} ${property.district} ${
    property.name || "..."
  }${bedHighlight}${nearbyHighlight}`
    .replace(/\s+/g, " ")
    .trim();
  blocks.push(headline);

  const unitCodeSuffix = property.unitCode?.trim() ? ` (${property.unitCode.trim()})` : "";
  blocks.push(`${propertyTypeLabel(property.type, "en")} : ${property.name || "..."}${unitCodeSuffix}`);

  const roomDetailParts = isLand
    ? [`${n(property.areaSqm)} ไร่`, `${n(property.bedrooms)} งาน`, `${n(property.bathrooms)} ตร.ว.`]
    : [
        `${n(property.areaSqm)} ตร.ม.`,
        `${n(property.bedrooms)} ห้องนอน`,
        `${n(property.bathrooms)} ห้องน้ำ`,
        `ชั้น ${property.floor || "-"}`,
        property.facing?.trim() ? `วิว ${property.facing.trim()}` : "",
      ].filter(Boolean);
  blocks.push(`📍 รายละเอียดห้อง:\n${roomDetailParts.join(" • ")}`);

  if (includesRent && property.rentPrice) {
    const conditionLines = [`${property.rentPrice.toLocaleString("en-US")} บาท/เดือน`];
    const termParts = [
      property.rentalMinTermMonths && `สัญญาเช่าขั้นต่ำ ${property.rentalMinTermMonths} เดือน`,
      property.rentalDepositMonths && `เงินประกันความเสียหาย ${property.rentalDepositMonths} เดือน`,
      property.rentalAdvanceMonths && `ค่าเช่าล่วงหน้า ${property.rentalAdvanceMonths} เดือน`,
    ].filter(Boolean);
    if (termParts.length > 0) conditionLines.push(termParts.join(" + "));
    blocks.push(`✅ เงื่อนไขการเช่า:\n${conditionLines.join("\n")}`);
  }

  if (includesSale && property.salePrice) {
    blocks.push(`✅ ราคาขาย:\n${property.salePrice.toLocaleString("en-US")} บาท`);
  }

  const validLeaseTerms = property.leaseTerms.filter((row) => row.duration?.trim());
  if (validLeaseTerms.length > 0) {
    const leaseLines = validLeaseTerms
      .map((row) => `สัญญา ${row.duration} ปี ราคา ${row.price ? row.price.toLocaleString("en-US") : "-"} บาท`)
      .join("\n");
    blocks.push(`สัญญาเช่าเริ่มต้น:\n${leaseLines}`);
  }

  const validTransit = property.transit.filter((row) => row.station.trim());
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

export function buildPropertyCaptionEn(property: Property): string {
  const includesRent = property.listingType === "เช่า" || property.listingType === "เช่า + ขาย";
  const includesSale = property.listingType === "ขาย" || property.listingType === "เช่า + ขาย";
  const isLand = property.type === "ที่ดิน";
  const typeLabel = propertyTypeLabel(property.type, "en");
  const unitCodeSuffix = property.unitCode?.trim() ? ` (${property.unitCode.trim()})` : "";

  const blocks: string[] = [];

  const districtPart = property.district?.trim() ? ` in ${property.district.trim()}` : "";
  const bedSegment =
    !isLand && property.bedrooms ? `${property.bedrooms}-Bedroom ${typeLabel}` : typeLabel;

  const listingWord =
    includesRent && includesSale ? "Rent/Sale" : includesRent ? "Rent" : "Sale";
  const headline = [
    `NEW❗️ ${typeLabel} for ${listingWord}${districtPart}`,
    property.name || "...",
    bedSegment,
  ].join(" | ");
  blocks.push(headline);

  blocks.push(`Property: ${property.name || "..."}${unitCodeSuffix}`);

  const roomDetailParts = isLand
    ? [`${n(property.areaSqm)} Rai`, `${n(property.bedrooms)} Ngan`, `${n(property.bathrooms)} Sq.Wah`]
    : [
        `${n(property.areaSqm)} sq.m.`,
        property.bedrooms ? `${property.bedrooms} Bedrooms` : "",
        property.bathrooms ? `${property.bathrooms} Bathrooms` : "",
        property.floor?.trim() && property.floor.trim() !== "-" ? `Floor ${property.floor.trim()}` : "",
        property.facing?.trim() ? `${property.facing.trim()} view` : "",
      ].filter(Boolean);
  blocks.push(`📍 Property Details\n${roomDetailParts.join(" • ")}`);

  if (includesRent && property.rentPrice) {
    const formattedRent = property.rentPrice.toLocaleString("en-US");
    const conditionLines = [`THB ${formattedRent} / month`];
    if (property.rentalMinTermMonths) {
      conditionLines.push(`• Minimum ${property.rentalMinTermMonths}-month lease`);
    }
    const depositAdvanceParts = [
      property.rentalDepositMonths && `${property.rentalDepositMonths}-month security deposit`,
      property.rentalAdvanceMonths && `${property.rentalAdvanceMonths}-month advance rent`,
    ].filter(Boolean);
    if (depositAdvanceParts.length > 0) conditionLines.push(`• ${depositAdvanceParts.join(" + ")}`);
    blocks.push(`✅ Rental Terms\n${conditionLines.join("\n")}`);
  }

  if (includesSale && property.salePrice) {
    const formattedSale = property.salePrice.toLocaleString("en-US");
    blocks.push(`✅ Sale Price\nTHB ${formattedSale}`);
  }

  const validLeaseTerms = property.leaseTerms.filter((row) => row.duration?.trim());
  if (validLeaseTerms.length > 0) {
    const leaseLines = validLeaseTerms
      .map((row) => `• ${row.duration}-year lease, price ${row.price ? row.price.toLocaleString("en-US") : "-"} THB`)
      .join("\n");
    blocks.push(`Initial Lease Terms\n${leaseLines}`);
  }

  const validTransit = property.transit.filter((row) => row.station.trim());
  if (validTransit.length > 0) {
    const nearbyLines = validTransit
      .map((row) => `📍 ${row.station} (~${row.distanceMeters || "-"} m.)`)
      .join("\n");
    blocks.push(`Nearby\n${nearbyLines}`);
  }

  const intlPhone = toIntlPhone(CONTACT_PHONE);
  blocks.push(
    `───────────────────────\nFor more information or to schedule a viewing:\nK.Prem: ${intlPhone}\nLINE: ${socialLinks.line.handle} | WhatsApp: ${intlPhone}`
  );

  return blocks.join("\n\n");
}
