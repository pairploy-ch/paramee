import type { Metadata } from "next";
import KpiDashboard from "./KpiDashboard";
import { fetchRentalDashboard, fetchSaleDashboard } from "@/lib/dashboardSheets";

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

  return <KpiDashboard rental={rental} sale={sale} error={error} />;
}
