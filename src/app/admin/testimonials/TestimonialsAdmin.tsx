"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/data/testimonials";
import { useTestimonials } from "@/lib/testimonialStore";
import type { Testimonial } from "@/lib/types";

const inputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold";

const emptyForm = { name: "", role: "", quote: "", isPublished: true };

export default function TestimonialsAdmin({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const localStore = useTestimonials();
  const testimonials = isSupabaseConfigured ? initialTestimonials : localStore.testimonials;

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { error: insertError } = await insertTestimonial(supabase, form);
      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }
      router.refresh();
    } else {
      localStore.addTestimonial(form);
    }

    setForm(emptyForm);
    setSubmitting(false);
  }

  async function handleTogglePublish(t: Testimonial) {
    setPendingId(t.id);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await updateTestimonial(supabase, t.id, { isPublished: !t.isPublished });
      router.refresh();
    } else {
      localStore.updateTestimonial(t.id, { isPublished: !t.isPublished });
    }
    setPendingId(null);
  }

  async function handleDelete(t: Testimonial) {
    setPendingId(t.id);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await deleteTestimonial(supabase, t.id);
      router.refresh();
    } else {
      localStore.deleteTestimonial(t.id);
    }
    setPendingId(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">จัดการรีวิวลูกค้า</h1>
        <p className="mt-2 text-sm text-ink/60">
          ข้อความในส่วน &quot;ลูกค้าพูดถึงเราอย่างไร&quot; บนหน้าแรก
          {!isSupabaseConfigured && " (โหมดสาธิต — บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)"}
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mb-10 space-y-4 rounded-2xl border border-gold-light/40 bg-white p-6"
      >
        <h2 className="font-heading text-lg font-semibold text-maroon-dark">เพิ่มรีวิวใหม่</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">ชื่อลูกค้า</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="เช่น คุณนภัส"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">สถานะ / บทบาท</label>
            <input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="เช่น ลูกค้าซื้อคอนโด ทองหล่อ"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ข้อความรีวิว</label>
          <textarea
            required
            rows={3}
            value={form.quote}
            onChange={(e) => update("quote", e.target.value)}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          เผยแพร่ทันที
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !form.name || !form.quote}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : "บันทึกรีวิว"}
        </button>
      </form>

      <h2 className="mb-4 font-heading text-lg font-semibold text-maroon-dark">
        รีวิวทั้งหมด ({testimonials.length})
      </h2>
      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-gold-light/40 bg-white p-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-[220px] flex-1">
                <p className="font-medium text-maroon-dark">{t.name}</p>
                <p className="text-xs text-ink/50">{t.role}</p>
                <p className="mt-2 text-sm text-ink/70">{t.quote}</p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePublish(t)}
                disabled={pendingId === t.id}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
                  t.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {t.isPublished ? "เผยแพร่แล้ว" : "ซ่อนอยู่"}
              </button>
              <button
                onClick={() => handleDelete(t)}
                disabled={pendingId === t.id}
                aria-label="ลบรีวิว"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500 disabled:opacity-50"
              >
                {pendingId === t.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                ) : (
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            ยังไม่มีรีวิว
          </p>
        )}
      </div>
    </div>
  );
}
