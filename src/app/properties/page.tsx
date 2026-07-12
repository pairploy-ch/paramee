import { Suspense } from "react";
import type { Metadata } from "next";
import PropertiesBrowser from "./PropertiesBrowser";

export const metadata: Metadata = {
  title: "ทรัพย์ทั้งหมด | Paramee",
};

export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesBrowser />
    </Suspense>
  );
}
