import type { Metadata } from "next";
import KpiDashboard from "./KpiDashboard";
import { fetchRentalDashboard, fetchSaleDashboard } from "@/lib/dashboardSheets";
import { fetchCurrentMonthCommissionTarget } from "@/lib/data/commissionTargets";
import { fetchAllProperties } from "@/lib/data/properties";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: KPI Dashboard | Paramee",
};

export default async function AdminDashboardPage() {
  let rental;
  let sale;
  let error = "";

  try {
    [rental, sale] = await Promise.all([fetchRentalDashboard(), fetchSaleDashboard()]);
  } catch (e) {
    error = e instanceof Error ? e.message : "ดึงข้อมูลจาก Google Sheet ไม่สำเร็จ";
  }

  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const [commissionTarget, properties] = await Promise.all([
    fetchCurrentMonthCommissionTarget(supabase),
    fetchAllProperties(supabase),
  ]);
  const totalRentSum = properties.reduce((sum, p) => sum + (p.rentPrice ?? 0), 0);

  return (
    <KpiDashboard
      rental={rental}
      sale={sale}
      error={error}
      commissionTarget={commissionTarget}
      totalRentSum={totalRentSum}
      canEditTarget={isSupabaseConfigured}
    />
  );
}
