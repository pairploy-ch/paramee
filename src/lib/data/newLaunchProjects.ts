import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewLaunchProject } from "@/lib/types";

export interface NewLaunchProjectRow {
  id: string;
  slug: string;
  name: string;
  unit_types_count: string;
  price_min: number | null;
  price_max: number | null;
  location_highlight: string;
  rent_yield_price: string;
  developer: string;
  unit_count: string;
  building_count: string;
  completion_year: string;
  latest_promotion: string;
  map_url: string | null;
  common_area_facilities: string;
  reservation_deposit: string;
}

export function rowToProject(row: NewLaunchProjectRow): NewLaunchProject {
  return {
    slug: row.slug,
    name: row.name,
    unitTypesCount: row.unit_types_count,
    priceMin: row.price_min,
    priceMax: row.price_max,
    locationHighlight: row.location_highlight,
    rentYieldPrice: row.rent_yield_price,
    developer: row.developer,
    unitCount: row.unit_count,
    buildingCount: row.building_count,
    completionYear: row.completion_year,
    latestPromotion: row.latest_promotion,
    mapUrl: row.map_url,
    commonAreaFacilities: row.common_area_facilities,
    reservationDeposit: row.reservation_deposit,
  };
}

export type NewProjectInput = Omit<NewLaunchProject, "slug"> & { slug?: string };

export function projectToRow(input: NewProjectInput): Omit<NewLaunchProjectRow, "id"> {
  const slug =
    input.slug ??
    `${input.name}-${Date.now()}`
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return {
    slug,
    name: input.name,
    unit_types_count: input.unitTypesCount,
    price_min: input.priceMin,
    price_max: input.priceMax,
    location_highlight: input.locationHighlight,
    rent_yield_price: input.rentYieldPrice,
    developer: input.developer,
    unit_count: input.unitCount,
    building_count: input.buildingCount,
    completion_year: input.completionYear,
    latest_promotion: input.latestPromotion,
    map_url: input.mapUrl,
    common_area_facilities: input.commonAreaFacilities,
    reservation_deposit: input.reservationDeposit,
  };
}

export async function fetchAllNewLaunchProjects(supabase?: SupabaseClient): Promise<NewLaunchProject[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("new_launch_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as NewLaunchProjectRow[]).map(rowToProject);
}

export async function insertNewLaunchProject(supabase: SupabaseClient, input: NewProjectInput) {
  return supabase.from("new_launch_projects").insert(projectToRow(input)).select("*").single();
}

export async function updateNewLaunchProjectBySlug(
  supabase: SupabaseClient,
  slug: string,
  patch: Partial<NewProjectInput>
) {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.unitTypesCount !== undefined) row.unit_types_count = patch.unitTypesCount;
  if (patch.priceMin !== undefined) row.price_min = patch.priceMin;
  if (patch.priceMax !== undefined) row.price_max = patch.priceMax;
  if (patch.locationHighlight !== undefined) row.location_highlight = patch.locationHighlight;
  if (patch.rentYieldPrice !== undefined) row.rent_yield_price = patch.rentYieldPrice;
  if (patch.developer !== undefined) row.developer = patch.developer;
  if (patch.unitCount !== undefined) row.unit_count = patch.unitCount;
  if (patch.buildingCount !== undefined) row.building_count = patch.buildingCount;
  if (patch.completionYear !== undefined) row.completion_year = patch.completionYear;
  if (patch.latestPromotion !== undefined) row.latest_promotion = patch.latestPromotion;
  if (patch.mapUrl !== undefined) row.map_url = patch.mapUrl;
  if (patch.commonAreaFacilities !== undefined) row.common_area_facilities = patch.commonAreaFacilities;
  if (patch.reservationDeposit !== undefined) row.reservation_deposit = patch.reservationDeposit;

  return supabase.from("new_launch_projects").update(row).eq("slug", slug).select("*").single();
}

export async function deleteNewLaunchProjectBySlug(supabase: SupabaseClient, slug: string) {
  return supabase.from("new_launch_projects").delete().eq("slug", slug);
}
