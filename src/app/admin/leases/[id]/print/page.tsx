import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeaseContractPrint from "./LeaseContractPrint";
import { fetchLeaseContractById } from "@/lib/data/leaseContracts";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "สัญญาเช่า | Paramee",
};

export default async function LeaseContractPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const contract = await fetchLeaseContractById(id, supabase);

  if (!contract) notFound();

  return <LeaseContractPrint contract={contract} />;
}
