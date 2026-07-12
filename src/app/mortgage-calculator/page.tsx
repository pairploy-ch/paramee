import { Suspense } from "react";
import type { Metadata } from "next";
import MortgageCalculator from "./MortgageCalculator";

export const metadata: Metadata = {
  title: "คำนวณสินเชื่อ | Paramee",
};

export default function MortgageCalculatorPage() {
  return (
    <Suspense fallback={null}>
      <MortgageCalculator />
    </Suspense>
  );
}
