import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import LineFloatingButton from "@/components/LineFloatingButton";
import { getSessionProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { fetchAllOwnerContacts } from "@/lib/data/owners";
import { OwnerContactsProvider } from "@/components/OwnerContactsProvider";
import { CompareProvider } from "@/components/CompareProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Paramee | อสังหาริมทรัพย์คัดสรรทั่วกรุงเทพฯ",
  description:
    "Paramee แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร ค้นหา คอนโด บ้าน ทาวน์โฮม และที่ดิน พร้อมระบบนัดชม จองมัดจำ และคำนวณสินเชื่อ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await getSessionProfile();
  const isAdmin = profile?.role === "admin";
  const role = profile?.role ?? null;
  const ownerContacts = await fetchAllOwnerContacts(
    isSupabaseConfigured ? createPublicClient() : undefined
  );

  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <LanguageProvider>
          <OwnerContactsProvider contacts={ownerContacts}>
            <CompareProvider>
              <Navbar role={role} />
              <main className="flex-1">{children}</main>
              <Footer isAdmin={isAdmin} />
              <BackToTop />
              <LineFloatingButton />
            </CompareProvider>
          </OwnerContactsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
