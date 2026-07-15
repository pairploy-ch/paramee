export default function SupabaseSetupNotice({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-5">
      <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
        <h1 className="font-heading text-xl font-semibold text-maroon-dark">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          ระบบนี้ต้องเชื่อมต่อ Supabase ก่อนใช้งาน — ยังไม่พบค่า{" "}
          <code className="rounded bg-cream-dark px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          และ{" "}
          <code className="rounded bg-cream-dark px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
        </p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-ink/60">
          <li>สร้างโปรเจกต์ใหม่ที่ supabase.com</li>
          <li>
            รันไฟล์ <code className="rounded bg-cream-dark px-1.5 py-0.5 text-xs">supabase/schema.sql</code>{" "}
            ใน SQL Editor ของโปรเจกต์
          </li>
          <li>
            คัดลอกค่า Project URL และ anon key จาก Project Settings → API ไปใส่ใน{" "}
            <code className="rounded bg-cream-dark px-1.5 py-0.5 text-xs">.env.local</code> (ดูตัวอย่างใน{" "}
            <code className="rounded bg-cream-dark px-1.5 py-0.5 text-xs">.env.example</code>)
          </li>
          <li>รีสตาร์ทเซิร์ฟเวอร์แล้วกลับมาหน้านี้อีกครั้ง</li>
        </ol>
      </div>
    </div>
  );
}
