import type { Lang } from "@/i18n/dictionaries";

export function formatBaht(value: number, opts?: { withSymbol?: boolean }) {
  const formatted = new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(value);
  return opts?.withSymbol === false ? formatted : `฿${formatted}`;
}

export function formatCompactBaht(value: number, lang: Lang = "th") {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded = millions.toFixed(millions >= 10 ? 0 : 1);
    return lang === "en" ? `฿${rounded}M` : `฿${rounded} ล้าน`;
  }
  return formatBaht(value);
}

export function formatThaiDate(isoDate: string, lang: Lang = "th") {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function statusLabel(status: string, lang: Lang = "th") {
  if (lang === "th") return status;
  const map: Record<string, string> = {
    ว่าง: "Available",
    ติดจอง: "Reserved",
    "PRM ปล่อยเช่า": "For Rent (PRM)",
    เจ้าของปล่อยเอง: "Owner-managed Rental",
  };
  return map[status] ?? status;
}

export function propertyTypeLabel(type: string, lang: Lang = "th") {
  if (lang === "th") return type;
  const map: Record<string, string> = {
    คอนโด: "Condo",
    บ้าน: "House",
    ที่ดิน: "Land",
    เรือยอชน์: "Yacht",
  };
  return map[type] ?? type;
}
