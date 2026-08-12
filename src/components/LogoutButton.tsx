"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Hard navigation so RootLayout re-reads the (now cleared) session from
    // cookies server-side instead of reusing the already-mounted layout.
    window.location.href = "/login";
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
