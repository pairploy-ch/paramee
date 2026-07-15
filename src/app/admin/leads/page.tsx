import type { Metadata } from "next";
import LeadsAdmin from "./LeadsAdmin";
import { fetchAllLeads } from "@/lib/data/leads";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: Track Lead | Paramee",
};

export default async function AdminLeadsPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const leads = await fetchAllLeads(supabase);

  return <LeadsAdmin initialLeads={leads} />;
}
