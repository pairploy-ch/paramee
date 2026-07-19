import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeaseContractForm from "../../LeaseContractForm";
import { contractToFormValues } from "../../formValues";
import { fetchLeaseContractById } from "@/lib/data/leaseContracts";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: แก้ไขสัญญาเช่า | Paramee",
};

export default async function EditLeaseContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const contract = await fetchLeaseContractById(id, supabase);

  if (!contract) notFound();

  return <LeaseContractForm contractId={contract.id} initialValues={contractToFormValues(contract)} />;
}
