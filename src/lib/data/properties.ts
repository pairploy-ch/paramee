import type { SupabaseClient } from "@supabase/supabase-js";
import { properties as seedProperties } from "@/lib/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Property, PropertyStatus, PropertyTier, PropertyType, TransitLine } from "@/lib/types";

export interface PropertyRow {
  id: string;
  slug: string;
  owner_id: string | null;
  tier: PropertyTier;
  name: string;
  type: PropertyType;
  address: string;
  district: string;
  status: PropertyStatus;
  sale_price: number | null;
  rent_price: number | null;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  floor: string | null;
  facing: string | null;
  images: string[];
  common_fee_per_sqm: number;
  avg_rent_in_area: number;
  transfer_fee_estimate: number;
  transit_station: string | null;
  transit_line: TransitLine | null;
  transit_distance_meters: number;
  investor_roi_percent: number;
  investor_rental_yield_percent: number;
  investor_occupancy_percent: number;
  investor_cashflow_per_month: number;
  description: string;
}

export function rowToProperty(row: PropertyRow): Property {
  return {
    slug: row.slug,
    ownerId: row.owner_id ?? "",
    tier: row.tier,
    name: row.name,
    type: row.type,
    address: row.address,
    district: row.district,
    status: row.status,
    salePrice: row.sale_price,
    rentPrice: row.rent_price,
    areaSqm: row.area_sqm,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    floor: row.floor ?? "",
    facing: row.facing ?? "",
    images: row.images ?? [],
    commonFeePerSqm: row.common_fee_per_sqm,
    avgRentInArea: row.avg_rent_in_area,
    transferFeeEstimate: row.transfer_fee_estimate,
    transit: {
      station: row.transit_station ?? "",
      line: row.transit_line ?? "BTS",
      distanceMeters: row.transit_distance_meters,
    },
    investor: {
      roiPercent: row.investor_roi_percent,
      rentalYieldPercent: row.investor_rental_yield_percent,
      occupancyPercent: row.investor_occupancy_percent,
      cashflowPerMonth: row.investor_cashflow_per_month,
    },
    description: row.description,
  };
}

export type NewPropertyInput = Omit<Property, "slug"> & { slug?: string };

export function propertyToRow(input: NewPropertyInput): Omit<PropertyRow, "id"> {
  const slug =
    input.slug ??
    `${input.name}-${Date.now()}`
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return {
    slug,
    owner_id: input.ownerId || null,
    tier: input.tier,
    name: input.name,
    type: input.type,
    address: input.address,
    district: input.district,
    status: input.status,
    sale_price: input.salePrice,
    rent_price: input.rentPrice,
    area_sqm: input.areaSqm,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    floor: input.floor,
    facing: input.facing,
    images: input.images,
    common_fee_per_sqm: input.commonFeePerSqm,
    avg_rent_in_area: input.avgRentInArea,
    transfer_fee_estimate: input.transferFeeEstimate,
    transit_station: input.transit.station,
    transit_line: input.transit.line,
    transit_distance_meters: input.transit.distanceMeters,
    investor_roi_percent: input.investor.roiPercent,
    investor_rental_yield_percent: input.investor.rentalYieldPercent,
    investor_occupancy_percent: input.investor.occupancyPercent,
    investor_cashflow_per_month: input.investor.cashflowPerMonth,
    description: input.description,
  };
}

/**
 * Reads from Supabase when a client + configuration are available, otherwise
 * falls back to the bundled seed data so the site keeps working in local/demo mode.
 */
export async function fetchAllProperties(supabase?: SupabaseClient): Promise<Property[]> {
  if (!isSupabaseConfigured || !supabase) return seedProperties;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return seedProperties;
  return (data as PropertyRow[]).map(rowToProperty);
}

export async function fetchPropertyBySlug(
  slug: string,
  supabase?: SupabaseClient
): Promise<Property | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return seedProperties.find((p) => p.slug === slug);
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return seedProperties.find((p) => p.slug === slug);
  return rowToProperty(data as PropertyRow);
}

export async function insertProperty(supabase: SupabaseClient, input: NewPropertyInput) {
  return supabase.from("properties").insert(propertyToRow(input)).select("*").single();
}

export async function updatePropertyBySlug(
  supabase: SupabaseClient,
  slug: string,
  patch: Partial<NewPropertyInput>
) {
  const row: Record<string, unknown> = {};
  if (patch.tier !== undefined) row.tier = patch.tier;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.salePrice !== undefined) row.sale_price = patch.salePrice;
  if (patch.rentPrice !== undefined) row.rent_price = patch.rentPrice;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.ownerId !== undefined) row.owner_id = patch.ownerId || null;
  if (patch.images !== undefined) row.images = patch.images;

  return supabase.from("properties").update(row).eq("slug", slug).select("*").single();
}

export async function fetchOwnerProperties(supabase: SupabaseClient, ownerId: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as PropertyRow[]).map(rowToProperty);
}
