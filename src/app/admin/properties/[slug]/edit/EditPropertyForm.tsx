"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";
import CaptionGenerator from "@/app/admin/properties/CaptionGenerator";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { updatePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";
import type { Owner } from "@/lib/owners";

export default function EditPropertyForm({
  property,
  owners,
}: {
  property: Property;
  owners: Owner[];
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
            แก้ไขข้อมูลทรัพย์แบบเต็ม
            {!isSupabaseConfigured && " (โหมดสาธิต — บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)"}
          </p>
        </div>
        <Link
          href="/admin/manage-properties"
          className="border border-cream-dark px-4 py-2 text-sm font-medium text-ink/60 hover:border-gold-dark hover:text-gold-dark"
        >
          กลับไปหน้าจัดการทรัพย์
        </Link>
      </div>

      <PropertyForm
        owners={owners}
        initialProperty={property}
        resetOnSuccess={false}
        onSubmit={handleSave}
        submitLabel="บันทึกการแก้ไข"
      >
        {(values) => <CaptionGenerator values={values} />}
      </PropertyForm>
    </div>
  );
}
