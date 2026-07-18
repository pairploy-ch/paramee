"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import SupabaseSetupNotice from "@/components/SupabaseSetupNotice";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  function closeWelcome() {
    setShowWelcome(false);
    router.replace("/owner-portal");
    router.refresh();
  }

  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice title="สมัครสมาชิกเจ้าของทรัพย์" />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\d{9,10}$/.test(phone)) {
      setError("กรุณากรอกเบอร์โทร 9-10 หลัก");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "owner", name, phone } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowWelcome(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-sm overflow-hidden bg-white shadow-2xl">
            <button
              type="button"
              aria-label="ปิด"
              onClick={closeWelcome}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink/60 backdrop-blur hover:text-maroon-dark"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <Image
              src="/welcome-popup.jpg"
              alt="ยินดีต้อนรับสู่ Paramee Asset"
              width={900}
              height={1273}
              className="w-full"
            />
          </div>
        </div>
      )}
      <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
        <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
          สมัครสมาชิกเจ้าของทรัพย์
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          สมัครเพื่อดูพอร์ตทรัพย์และเพิ่มทรัพย์ของคุณเองได้ผ่าน Owner Portal
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">ชื่อ-นามสกุล</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">เบอร์โทร</label>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">อีเมล</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">รหัสผ่าน</label>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink/50">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-semibold text-gold-dark hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
