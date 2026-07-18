"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { NewLaunchFormValues } from "./formValues";
import { CONTACT_PHONE, socialLinks } from "@/lib/social";

function buildCaption(v: NewLaunchFormValues): string {
  const blocks: string[] = [];

  const codeSuffix = v.projectCode.trim() ? ` (${v.projectCode.trim()})` : "";
  const regionSuffix = v.region ? ` ${v.region}` : "";
  blocks.push(`เปิดจองโครงการใหม่ ${v.projectType}${regionSuffix}\n${v.name || "..."}${codeSuffix}`);

  if (v.developer.trim()) blocks.push(`ผู้พัฒนาโครงการ: ${v.developer.trim()}`);

  if (v.locationHighlight.trim()) blocks.push(v.locationHighlight.trim());

  const priceLine =
    v.priceMin.trim() || v.priceMax.trim()
      ? `ราคาเริ่มต้น ${v.priceMin || "-"} - ${v.priceMax || "-"} บาท`
      : "";
  const yieldLine = v.rentYieldPrice.trim() ? `ปล่อยเช่าได้ในราคา ${v.rentYieldPrice.trim()}` : "";
  const priceBlock = [priceLine, yieldLine].filter(Boolean).join("\n");
  if (priceBlock) blocks.push(priceBlock);

  const overviewParts = [
    v.unitTypesCount.trim() && `${v.unitTypesCount.trim()} แบบ`,
    v.unitCount.trim() && `${v.unitCount.trim()} ยูนิต`,
    v.buildingCount.trim() && `${v.buildingCount.trim()} อาคาร`,
    v.completionYear.trim() && `สร้างเสร็จปี ${v.completionYear.trim()}`,
  ].filter(Boolean);
  if (overviewParts.length > 0) blocks.push(overviewParts.join(" • "));

  if (v.commonAreaFacilities.trim()) blocks.push(`ส่วนกลาง:\n${v.commonAreaFacilities.trim()}`);

  if (v.reservationDeposit.trim()) blocks.push(`เงินจอง / เงินดาวน์: ${v.reservationDeposit.trim()}`);

  if (v.latestPromotion.trim()) blocks.push(`โปรโมชั่นล่าสุด:\n${v.latestPromotion.trim()}`);

  blocks.push(
    `สนใจติดต่อสอบถามรายละเอียดเพิ่มเติม\nโทร ${CONTACT_PHONE} | LINE: ${socialLinks.line.handle} | WhatsApp: ${CONTACT_PHONE}`
  );

  return blocks.join("\n\n");
}

export default function NewLaunchCaptionGenerator({ values }: { values: NewLaunchFormValues }) {
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
