import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
