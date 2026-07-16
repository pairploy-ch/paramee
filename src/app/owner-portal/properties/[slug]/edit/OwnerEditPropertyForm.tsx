"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { updatePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";

export default function OwnerEditPropertyForm({
  property,
  ownerName,
}: {
  property: Property;
  ownerName: string;
}) {
  const router = useRouter();
  const { updateProperty } = useProperties();

  async function handleSave(patch: Omit<Property, "slug">) {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { error } = await updatePropertyBySlug(supabase, property.slug, patch);
      if (error) return { error: error.message };
      router.refresh();
      return { slug: property.slug };
    }
    updateProperty(property.slug, patch);
    return { slug: property.slug };
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            แก้ไขทรัพย์: {property.name}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            แก้ไขข้อมูลทรัพย์ของคุณ
            {!isSupabaseConfigured && " (โหมดสาธิต — บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)"}
          </p>
        </div>
        <Link
          href="/owner-portal"
          className="border border-cream-dark px-4 py-2 text-sm font-medium text-ink/60 hover:border-gold-dark hover:text-gold-dark"
        >
          กลับไปหน้าทรัพย์ของฉัน
        </Link>
      </div>

      <PropertyForm
        ownerLocked={{ id: property.ownerId, name: ownerName }}
        initialProperty={property}
        resetOnSuccess={false}
        onSubmit={handleSave}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
