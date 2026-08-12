"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import SupabaseSetupNotice from "@/components/SupabaseSetupNotice";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice title="เข้าสู่ระบบ" />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";
    const adminOnlyPath = next?.startsWith("/admin") || next?.startsWith("/mortgage-calculator");

    // Hard navigation (not router.replace/refresh) so the request hits the
    // server fresh — RootLayout's admin menu and logout button read the
    // session from cookies server-side, and a client-side transition can
    // reuse the already-mounted (logged-out) layout instead of refetching it.
    if (next && !(adminOnlyPath && !isAdmin)) {
      window.location.href = next;
    } else {
      window.location.href = isAdmin ? "/admin/leads" : "/owner-portal";
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
      <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
        <h1 className="font-heading text-2xl font-semibold text-maroon-dark">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-ink/60">
          สำหรับทีมงาน Paramee และเจ้าของทรัพย์ที่ลงทะเบียนไว้
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink/50">
          ยังไม่มีบัญชีเจ้าของทรัพย์?{" "}
          <Link href="/register" className="font-semibold text-gold-dark hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
