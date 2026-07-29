import Papa from "papaparse";

const SPREADSHEET_ID = "1FOu8XWO5HhIu-S_5aXFcyMNKWSW73IkN84QamTiFJoA";

export const DASH_BOARD_GID = "602187454"; // "Dash board" — rental KPI tracker
export const DASHBOARD_SALE_GID = "433175392"; // "Dashboard Sale" — sale opportunity dashboard

async function fetchTabRows(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`ดึงข้อมูลจาก Google Sheet ไม่สำเร็จ (HTTP ${res.status})`);
  }
  const csv = await res.text();
  return Papa.parse<string[]>(csv, { skipEmptyLines: false }).data;
}

export interface KpiMetric {
  label: string;
  target: string;
  achieved: string;
  percent: string;
}

export interface CategoryRow {
  label: string;
  target: string;
  achieved: string;
  percent: string;
}

export interface RentalDashboard {
  title: string;
  metrics: KpiMetric[];
  rentalCategories: CategoryRow[];
  highCommissionCategories: CategoryRow[];
}

export async function fetchRentalDashboard(): Promise<RentalDashboard> {
  const rows = await fetchTabRows(DASH_BOARD_GID);

  const metrics: KpiMetric[] = [
    { label: "💰 Commission (บาท)", target: rows[4]?.[1] ?? "-", achieved: rows[4]?.[2] ?? "-", percent: rows[4]?.[3] ?? "-" },
    { label: "🏠 ทรัพย์ที่หา (ชิ้น)", target: rows[4]?.[4] ?? "-", achieved: rows[4]?.[5] ?? "-", percent: rows[4]?.[6] ?? "-" },
    { label: "🏗️ Developer (โครงการ)", target: rows[4]?.[7] ?? "-", achieved: rows[4]?.[8] ?? "-", percent: rows[4]?.[9] ?? "-" },
    { label: "📅 วันที่เหลือ (วัน)", target: rows[4]?.[10] ?? "-", achieved: rows[4]?.[11] ?? "-", percent: rows[4]?.[12] ?? "-" },
  ];

  const readCategoryRows = (startIdx: number, endIdx: number): CategoryRow[] => {
    const out: CategoryRow[] = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const row = rows[i];
      if (!row || !row[1]?.trim()) continue;
      out.push({ label: row[1], target: row[2] ?? "-", achieved: row[3] ?? "-", percent: row[4] ?? "-" });
    }
    return out;
  };

  return {
    title: rows[0]?.[1] ?? "KPI Tracker",
    metrics,
    rentalCategories: readCategoryRows(9, 12),
    highCommissionCategories: readCategoryRows(16, 18),
  };
}

export interface OpportunityRow {
  rank: string;
  type: string;
  code: string;
  name: string;
  zone: string;
  pricePerMonth: string;
  commission: string;
  cumulative: string;
}

export interface SaleDashboard {
  updatedAt: string;
  monthEndNote: string;
  monthlyTarget: string;
  actual: string;
  gap: string;
  percentDone: string;
  daysLeft: string;
  vacantUnits: string;
  avgRentPerMonth: string;
  avgCommissionPerDeal: string;
  dealsNeeded: string;
  maxPortfolioPotential: string;
  portfolioStatus: string;
  opportunities: OpportunityRow[];
}

export async function fetchSaleDashboard(): Promise<SaleDashboard> {
  const rows = await fetchTabRows(DASHBOARD_SALE_GID);

  const opportunities: OpportunityRow[] = [];
  for (let i = 15; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[3]?.trim()) continue; // stop once CODE column is empty
    opportunities.push({
      rank: row[1] ?? "-",
      type: row[2] ?? "-",
      code: row[3] ?? "-",
      name: row[5] ?? "-",
      zone: row[9] ?? "-",
      pricePerMonth: row[11] ?? "-",
      commission: row[12] ?? "-",
      cumulative: row[13] ?? "-",
    });
  }

  return {
    updatedAt: (rows[2]?.[1] ?? "").replace("อัปเดตล่าสุด: ", ""),
    monthEndNote: rows[2]?.[6] ?? "",
    monthlyTarget: rows[5]?.[1] ?? "-",
    actual: rows[5]?.[4] ?? "-",
    gap: rows[5]?.[6] ?? "-",
    percentDone: rows[5]?.[8] ?? "-",
    daysLeft: rows[5]?.[11] ?? "-",
    vacantUnits: rows[11]?.[1] ?? "-",
    avgRentPerMonth: rows[11]?.[3] ?? "-",
    avgCommissionPerDeal: rows[11]?.[5] ?? "-",
    dealsNeeded: rows[11]?.[7] ?? "-",
    maxPortfolioPotential: rows[11]?.[9] ?? "-",
    portfolioStatus: rows[11]?.[11] ?? "-",
    opportunities,
  };
}
