import type { Metadata } from "next";
import Link from "next/link";
import OwnerPortal from "./OwnerPortal";
import { getSessionProfile, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fetchOwnerProperties } from "@/lib/data/properties";

export const metadata: Metadata = {
  title: "Owner Portal | Paramee",
};

export default async function OwnerPortalPage() {
  const { user, profile } = await getSessionProfile();

  if (profile?.role === "admin") {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
          บัญชีนี้เป็นบัญชีทีมงาน
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Owner Portal สำหรับเจ้าของทรัพย์เท่านั้น ไปที่หน้าจัดการทรัพย์สำหรับแอดมินแทน
        </p>
        <Link
          href="/admin/manage-properties"
          className="mt-6 inline-block bg-maroon px-6 py-3 text-sm font-medium text-cream hover:bg-maroon-light"
        >
          ไปหน้าจัดการทรัพย์
        </Link>
      </div>
    );
  }

  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const ownedProperties = user && supabase ? await fetchOwnerProperties(supabase, user.id) : [];

  return (
    <OwnerPortal
      ownerName={profile?.name ?? user?.email ?? "เจ้าของทรัพย์"}
      ownerId={user?.id ?? ""}
      initialProperties={ownedProperties}
    />
  );
}
