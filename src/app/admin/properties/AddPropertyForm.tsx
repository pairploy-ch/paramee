"use client";

import PropertyForm from "@/components/PropertyForm";
import CaptionGenerator from "./CaptionGenerator";
import type { Property } from "@/lib/types";
import type { Owner } from "@/lib/owners";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertProperty } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";

export default function AddPropertyForm({ owners }: { owners: Owner[] }) {
  const { addProperty } = useProperties();

  async function handleSaveProperty(property: Omit<Property, "slug">) {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { data, error } = await insertProperty(supabase, property);
      if (error) return { error: error.message };
      return { slug: data?.slug };
    }
    const saved = addProperty(property);
    return { slug: saved.slug };
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">เพิ่มทรัพย์</h1>
        <p className="mt-2 text-sm text-ink/60">
          กรอกข้อมูลทรัพย์แบบเต็ม (เหมือนหน้ารายละเอียดทรัพย์) ระบบจะบันทึกเข้าระบบทันที
          {!isSupabaseConfigured && " (โหมดสาธิต — บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)"}
        </p>
      </div>

      <PropertyForm owners={owners} onSubmit={handleSaveProperty}>
        {(values) => <CaptionGenerator values={values} />}
      </PropertyForm>
    </div>
  );
}
