import type { SupabaseClient } from "@supabase/supabase-js";
import { properties as seedProperties } from "@/lib/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  LandTransferFeeParty,
  LeaseTerm,
  Property,
  PropertyStatus,
  PropertyTier,
  PropertyType,
  TransitInfo,
} from "@/lib/types";

export interface PropertyRow {
  id: string;
  slug: string;
  owner_id: string | null;
  tier: PropertyTier;
  name: string;
  type: PropertyType;
  address: string;
  district: string;
  map_url: string | null;
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
  transit: TransitInfo[] | null;
  investor_roi_percent: number;
  investor_rental_yield_percent: number;
  investor_occupancy_percent: number;
  investor_cashflow_per_month: number;
  description: string;
  remarks: string | null;
  lease_terms: LeaseTerm[] | null;
  land_deed_type: string | null;
  land_transfer_fee_party: LandTransferFeeParty | null;
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
    mapUrl: row.map_url,
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
    transit: row.transit ?? [],
    investor: {
      roiPercent: row.investor_roi_percent,
      rentalYieldPercent: row.investor_rental_yield_percent,
      occupancyPercent: row.investor_occupancy_percent,
      cashflowPerMonth: row.investor_cashflow_per_month,
    },
    description: row.description,
    remarks: row.remarks ?? "",
    leaseTerms: row.lease_terms ?? [],
    landDeedType: row.land_deed_type,
    landTransferFeeParty: row.land_transfer_fee_party,
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
    map_url: input.mapUrl,
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
    transit: input.transit,
    investor_roi_percent: input.investor.roiPercent,
    investor_rental_yield_percent: input.investor.rentalYieldPercent,
    investor_occupancy_percent: input.investor.occupancyPercent,
    investor_cashflow_per_month: input.investor.cashflowPerMonth,
    description: input.description,
    remarks: input.remarks,
    lease_terms: input.leaseTerms,
    land_deed_type: input.landDeedType,
    land_transfer_fee_party: input.landTransferFeeParty,
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
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.district !== undefined) row.district = patch.district;
  if (patch.mapUrl !== undefined) row.map_url = patch.mapUrl;
  if (patch.tier !== undefined) row.tier = patch.tier;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.salePrice !== undefined) row.sale_price = patch.salePrice;
  if (patch.rentPrice !== undefined) row.rent_price = patch.rentPrice;
  if (patch.areaSqm !== undefined) row.area_sqm = patch.areaSqm;
  if (patch.bedrooms !== undefined) row.bedrooms = patch.bedrooms;
  if (patch.bathrooms !== undefined) row.bathrooms = patch.bathrooms;
  if (patch.floor !== undefined) row.floor = patch.floor;
  if (patch.facing !== undefined) row.facing = patch.facing;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.ownerId !== undefined) row.owner_id = patch.ownerId || null;
  if (patch.images !== undefined) row.images = patch.images;
  if (patch.commonFeePerSqm !== undefined) row.common_fee_per_sqm = patch.commonFeePerSqm;
  if (patch.avgRentInArea !== undefined) row.avg_rent_in_area = patch.avgRentInArea;
  if (patch.transferFeeEstimate !== undefined) row.transfer_fee_estimate = patch.transferFeeEstimate;
  if (patch.transit !== undefined) row.transit = patch.transit;
  if (patch.remarks !== undefined) row.remarks = patch.remarks;
  if (patch.leaseTerms !== undefined) row.lease_terms = patch.leaseTerms;
  if (patch.landDeedType !== undefined) row.land_deed_type = patch.landDeedType;
  if (patch.landTransferFeeParty !== undefined) row.land_transfer_fee_party = patch.landTransferFeeParty;
  if (patch.investor !== undefined) {
    row.investor_roi_percent = patch.investor.roiPercent;
    row.investor_rental_yield_percent = patch.investor.rentalYieldPercent;
    row.investor_occupancy_percent = patch.investor.occupancyPercent;
    row.investor_cashflow_per_month = patch.investor.cashflowPerMonth;
  }

  return supabase.from("properties").update(row).eq("slug", slug).select("*").single();
}

export async function deletePropertyBySlug(supabase: SupabaseClient, slug: string) {
  return supabase.from("properties").delete().eq("slug", slug);
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
