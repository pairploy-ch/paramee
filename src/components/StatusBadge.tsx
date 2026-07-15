"use client";

import { statusLabel } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { PropertyStatus } from "@/lib/types";

const styles: Record<PropertyStatus, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  Reserved: "bg-gold-light text-maroon-dark",
  Sold: "bg-neutral-200 text-neutral-600",
  "For Rent": "bg-sky-100 text-sky-800",
};

export default function StatusBadge({ status }: { status: PropertyStatus }) {
  const { lang } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {statusLabel(status, lang)}
    </span>
  );
}
