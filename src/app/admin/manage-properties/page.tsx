import type { Metadata } from "next";
import ManagePropertiesAdmin from "./ManagePropertiesAdmin";
import { fetchAllProperties } from "@/lib/data/properties";
import { fetchAllOwners } from "@/lib/data/owners";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: จัดการทรัพย์ | Paramee",
};

export default async function ManagePropertiesPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const [properties, owners] = await Promise.all([
    fetchAllProperties(supabase),
    fetchAllOwners(supabase),
  ]);

  return <ManagePropertiesAdmin initialProperties={properties} owners={owners} />;
}
