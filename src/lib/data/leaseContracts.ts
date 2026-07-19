import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeaseChecklistItem, LeaseContract } from "@/lib/types";

interface LeaseContractRow {
  id: string;
  created_at: string;
  project_name: string;
  project_address: string;
  room_number: string;
  building: string;
  floor: string;
  lessor_name: string;
  lessor_id_card: string;
  lessor_address: string;
  lessee_name: string;
  lessee_id_card: string;
  lessee_address: string;
  contract_date: string | null;
  start_date: string | null;
  end_date: string | null;
  contract_years: number;
  rent_per_month: number;
  payment_due_day: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  deposit_amount: number;
  cleaning_fee: number;
  receipt_date: string | null;
  reservation_deposit_amount: number;
  damage_deposit_amount: number;
  checklist_items: LeaseChecklistItem[] | null;
}

function rowToContract(row: LeaseContractRow): LeaseContract {
  return {
    id: row.id,
    createdAt: row.created_at,
    projectName: row.project_name,
    projectAddress: row.project_address,
    roomNumber: row.room_number,
    building: row.building,
    floor: row.floor,
    lessorName: row.lessor_name,
    lessorIdCard: row.lessor_id_card,
    lessorAddress: row.lessor_address,
    lesseeName: row.lessee_name,
    lesseeIdCard: row.lessee_id_card,
    lesseeAddress: row.lessee_address,
    contractDate: row.contract_date,
    startDate: row.start_date,
    endDate: row.end_date,
    contractYears: row.contract_years,
    rentPerMonth: row.rent_per_month,
    paymentDueDay: row.payment_due_day,
    bankName: row.bank_name,
    bankAccountNumber: row.bank_account_number,
    bankAccountName: row.bank_account_name,
    depositAmount: row.deposit_amount,
    cleaningFee: row.cleaning_fee,
    receiptDate: row.receipt_date,
    reservationDepositAmount: row.reservation_deposit_amount,
    damageDepositAmount: row.damage_deposit_amount,
    checklistItems: row.checklist_items ?? [],
  };
}

export type LeaseContractInput = Omit<LeaseContract, "id" | "createdAt">;

function contractToRow(input: LeaseContractInput): Omit<LeaseContractRow, "id" | "created_at"> {
  return {
    project_name: input.projectName,
    project_address: input.projectAddress,
    room_number: input.roomNumber,
    building: input.building,
    floor: input.floor,
    lessor_name: input.lessorName,
    lessor_id_card: input.lessorIdCard,
    lessor_address: input.lessorAddress,
    lessee_name: input.lesseeName,
    lessee_id_card: input.lesseeIdCard,
    lessee_address: input.lesseeAddress,
    contract_date: input.contractDate,
    start_date: input.startDate,
    end_date: input.endDate,
    contract_years: input.contractYears,
    rent_per_month: input.rentPerMonth,
    payment_due_day: input.paymentDueDay,
    bank_name: input.bankName,
    bank_account_number: input.bankAccountNumber,
    bank_account_name: input.bankAccountName,
    deposit_amount: input.depositAmount,
    cleaning_fee: input.cleaningFee,
    receipt_date: input.receiptDate,
    reservation_deposit_amount: input.reservationDepositAmount,
    damage_deposit_amount: input.damageDepositAmount,
    checklist_items: input.checklistItems,
  };
}

export async function fetchAllLeaseContracts(supabase?: SupabaseClient): Promise<LeaseContract[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lease_contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as LeaseContractRow[]).map(rowToContract);
}

export async function fetchLeaseContractById(
  id: string,
  supabase?: SupabaseClient
): Promise<LeaseContract | undefined> {
  if (!supabase) return undefined;

  const { data, error } = await supabase.from("lease_contracts").select("*").eq("id", id).maybeSingle();

  if (error || !data) return undefined;
  return rowToContract(data as LeaseContractRow);
}

export async function insertLeaseContract(supabase: SupabaseClient, input: LeaseContractInput) {
  return supabase.from("lease_contracts").insert(contractToRow(input)).select("*").single();
}

export async function updateLeaseContractById(
  supabase: SupabaseClient,
  id: string,
  input: LeaseContractInput
) {
  return supabase.from("lease_contracts").update(contractToRow(input)).eq("id", id).select("*").single();
}

export async function deleteLeaseContractById(supabase: SupabaseClient, id: string) {
  return supabase.from("lease_contracts").delete().eq("id", id);
}
