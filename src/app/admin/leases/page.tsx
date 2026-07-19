import type { Metadata } from "next";
import LeasesAdmin from "./LeasesAdmin";
import { fetchAllLeaseContracts } from "@/lib/data/leaseContracts";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: ระบบสัญญาเช่า | Paramee",
};

export default async function AdminLeasesPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const contracts = await fetchAllLeaseContracts(supabase);

  return <LeasesAdmin initialContracts={contracts} />;
}
