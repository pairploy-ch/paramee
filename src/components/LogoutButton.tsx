"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={
        (className ?? "border border-cream-dark px-4 py-2 text-xs font-medium text-ink/60 hover:border-gold") +
        " disabled:opacity-50"
      }
    >
      {loading ? "กำลังออก..." : "ออกจากระบบ"}
    </button>
  );
}
