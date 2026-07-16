import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OwnerEditPropertyForm from "./OwnerEditPropertyForm";
import { fetchPropertyBySlug } from "@/lib/data/properties";
import { getSessionProfile, isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "แก้ไขทรัพย์ของฉัน | Paramee",
};

export default async function OwnerEditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");

  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const property = await fetchPropertyBySlug(slug, supabase);
  if (!property) notFound();

  // Owners may only edit their own properties; admins may edit any.
  if (profile?.role !== "admin" && property.ownerId !== user.id) {
    redirect("/owner-portal");
  }

  return (
    <OwnerEditPropertyForm
      property={property}
      ownerName={profile?.name ?? user.email ?? "เจ้าของทรัพย์"}
    />
  );
}
