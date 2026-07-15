"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={
        className ?? "border border-cream-dark px-4 py-2 text-xs font-medium text-ink/60 hover:border-gold"
      }
    >
      ออกจากระบบ
    </button>
  );
}
