import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoAgentApplication } from "@/lib/types";

interface CoAgentApplicationRow {
  id: string;
  created_at: string;
  full_name: string;
  nickname: string;
  phone: string;
  line_id: string;
  email: string;
  work_type: string;
  expertise_areas: string[] | null;
  marketing_channels: string[] | null;
  marketing_name: string;
  id_card_files: string[] | null;
  bank_book_file: string;
  company_cert_file: string | null;
}

function rowToApplication(row: CoAgentApplicationRow): CoAgentApplication {
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    nickname: row.nickname,
    phone: row.phone,
    lineId: row.line_id,
    email: row.email,
    workType: row.work_type,
    expertiseAreas: row.expertise_areas ?? [],
    marketingChannels: row.marketing_channels ?? [],
    marketingName: row.marketing_name,
    idCardFiles: row.id_card_files ?? [],
    bankBookFile: row.bank_book_file,
    companyCertFile: row.company_cert_file,
  };
}

export type CoAgentApplicationInput = Omit<CoAgentApplication, "id" | "createdAt">;

function applicationToRow(input: CoAgentApplicationInput): Omit<CoAgentApplicationRow, "id" | "created_at"> {
  return {
    full_name: input.fullName,
    nickname: input.nickname,
    phone: input.phone,
    line_id: input.lineId,
    email: input.email,
    work_type: input.workType,
    expertise_areas: input.expertiseAreas,
    marketing_channels: input.marketingChannels,
    marketing_name: input.marketingName,
    id_card_files: input.idCardFiles,
    bank_book_file: input.bankBookFile,
    company_cert_file: input.companyCertFile,
  };
}

export async function fetchAllCoAgentApplications(supabase?: SupabaseClient): Promise<CoAgentApplication[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("co_agent_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as CoAgentApplicationRow[]).map(rowToApplication);
}

export async function insertCoAgentApplication(supabase: SupabaseClient, input: CoAgentApplicationInput) {
  return supabase.from("co_agent_applications").insert(applicationToRow(input)).select("*").single();
}

export async function deleteCoAgentApplicationById(supabase: SupabaseClient, id: string) {
  return supabase.from("co_agent_applications").delete().eq("id", id);
}
