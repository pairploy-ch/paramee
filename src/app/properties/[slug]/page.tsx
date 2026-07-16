import { notFound } from "next/navigation";
import { properties } from "@/lib/properties";
import { fetchAllProperties, fetchPropertyBySlug } from "@/lib/data/properties";
import { fetchOwnerContact } from "@/lib/data/owners";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { getSessionProfile } from "@/lib/supabase/server";
import PropertyDetailView from "@/components/PropertyDetailView";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(
    slug,
    isSupabaseConfigured ? createPublicClient() : undefined
  );
  return { title: property ? `${property.name} | Paramee` : "ไม่พบทรัพย์ | Paramee" };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const property = await fetchPropertyBySlug(slug, supabase);
  if (!property) notFound();

  const allProperties = await fetchAllProperties(supabase);
  const { profile } = await getSessionProfile();
  const isAdmin = profile?.role === "admin";
  const relatedProperties = allProperties
    .filter((p) => p.slug !== property.slug && (p.district === property.district || p.type === property.type))
    .slice(0, 3);
  const ownerContact = await fetchOwnerContact(property.ownerId, supabase);

  return (
    <PropertyDetailView
      property={property}
      relatedProperties={relatedProperties}
      isAdmin={isAdmin}
      ownerContact={ownerContact}
    />
  );
}
