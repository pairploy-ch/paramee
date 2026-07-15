import type { SupabaseClient } from "@supabase/supabase-js";
import { leads as seedLeads, type Lead } from "@/lib/leads";

export interface LeadRow {
  id: string;
  date: string;
  channel: string;
  interested_type: string;
  area: string;
  budget: string;
  size_needed: string;
  purpose: string;
  follow_up: string;
  note: string;
}

function rowToLead(row: LeadRow): Lead {
  return {
    date: row.date,
    channel: row.channel as Lead["channel"],
    interestedType: row.interested_type as Lead["interestedType"],
    area: row.area,
    budget: row.budget,
    sizeNeeded: row.size_needed,
    purpose: row.purpose as Lead["purpose"],
    followUp: row.follow_up as Lead["followUp"],
    note: row.note,
  };
}

export async function fetchAllLeads(supabase?: SupabaseClient): Promise<Lead[]> {
  if (!supabase) return seedLeads;

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("date", { ascending: false });

  if (error || !data) return seedLeads;
  return (data as LeadRow[]).map(rowToLead);
}

export async function insertLead(supabase: SupabaseClient, lead: Lead) {
  return supabase
    .from("leads")
    .insert({
      date: lead.date,
      channel: lead.channel,
      interested_type: lead.interestedType,
      area: lead.area,
      budget: lead.budget,
      size_needed: lead.sizeNeeded,
      purpose: lead.purpose,
      follow_up: lead.followUp,
      note: lead.note,
    })
    .select("*")
    .single();
}
