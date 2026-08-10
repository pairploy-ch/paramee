import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AssignOwnerForm from "./AssignOwnerForm";
import { fetchPropertyBySlug } from "@/lib/data/properties";
import { fetchAllOwners } from "@/lib/data/owners";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: ข้อมูลเจ้าของทรัพย์ | Paramee",
};

export default async function AssignOwnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const [property, owners] = await Promise.all([
    fetchPropertyBySlug(slug, supabase),
    fetchAllOwners(supabase),
  ]);

  if (!property) notFound();

  return <AssignOwnerForm property={property} owners={owners} />;
}
