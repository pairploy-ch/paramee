export function formatBaht(value: number, opts?: { withSymbol?: boolean }) {
  const formatted = new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 0,
  }).format(value);
  return opts?.withSymbol === false ? formatted : `฿${formatted}`;
}

export function formatCompactBaht(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `฿${millions.toFixed(millions >= 10 ? 0 : 1)} ล้าน`;
  }
  return formatBaht(value);
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    Available: "ว่าง",
    Reserved: "จองแล้ว",
    Sold: "ขายแล้ว",
    "For Rent": "ให้เช่า",
  };
  return map[status] ?? status;
}
