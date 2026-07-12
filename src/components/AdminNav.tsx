"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/leads", label: "Track Lead" },
  { href: "/admin/properties", label: "เพิ่มทรัพย์" },
  { href: "/admin/manage-properties", label: "จัดการทรัพย์ / เจ้าของ" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-cream-dark pb-4">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-maroon text-cream"
                : "border border-cream-dark text-ink/60 hover:border-gold-dark hover:text-gold-dark"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
