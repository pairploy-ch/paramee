"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatBaht } from "@/lib/format";

const bankPresets = [
  { name: "ธนาคารกรุงเทพ", rate: 3.35 },
  { name: "ธนาคารกสิกรไทย", rate: 3.4 },
  { name: "ธนาคารไทยพาณิชย์", rate: 3.5 },
  { name: "ธนาคารกรุงไทย", rate: 3.45 },
  { name: "กำหนดเอง", rate: 3.5 },
];

export default function MortgageCalculator() {
  const searchParams = useSearchParams();
  const priceFromQuery = Number(searchParams.get("price")) || 5_000_000;

  const [price, setPrice] = useState(priceFromQuery);
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [interestRate, setInterestRate] = useState(3.4);
  const [years, setYears] = useState(30);

  const result = useMemo(() => {
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const months = years * 12;

    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - loanAmount;

    return { downPayment, loanAmount, monthlyPayment, totalInterest, totalPaid };
  }, [price, downPaymentPercent, interestRate, years]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
        คำนวณสินเชื่อ
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        ประเมินยอดผ่อนต่อเดือน ดอกเบี้ยรวม และยอดกู้สุทธิ ก่อนตัดสินใจซื้อ
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6 rounded-2xl border border-gold-light/40 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              ราคาทรัพย์ (บาท)
            </label>
            <input
              type="number"
              value={price}
              min={0}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              เงินดาวน์: {downPaymentPercent}% ({formatBaht(result.downPayment)})
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              อัตราดอกเบี้ย (%ต่อปี)
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {bankPresets.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setInterestRate(b.rate)}
                  className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                    interestRate === b.rate
                      ? "border-gold bg-gold text-maroon-dark"
                      : "border-cream-dark text-ink/60 hover:border-gold"
                  }`}
                >
                  {b.name} {b.name !== "กำหนดเอง" && `${b.rate}%`}
                </button>
              ))}
            </div>
            <input
              type="number"
              step={0.05}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              ระยะเวลาผ่อน: {years} ปี
            </label>
            <input
              type="range"
              min={5}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-maroon p-6 text-cream">
            <p className="text-sm text-cream/60">ยอดผ่อนต่อเดือน (โดยประมาณ)</p>
            <p className="mt-2 font-heading text-4xl font-semibold text-gold-light">
              {formatBaht(Math.round(result.monthlyPayment))}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">ยอดกู้สุทธิ</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.loanAmount))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">ดอกเบี้ยรวมตลอดสัญญา</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.totalInterest))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">เงินดาวน์</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.downPayment))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">ยอดชำระรวมทั้งหมด</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.totalPaid))}
              </p>
            </div>
          </div>

          <Link
            href="/booking?mode=financing"
            className="bg-gold px-5 py-3 text-center text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
          >
            ขอสินเชื่อ / นัดพบเจ้าหน้าที่
          </Link>
          <p className="text-center text-xs text-ink/40">
            ผลลัพธ์เป็นการประมาณการเบื้องต้นเท่านั้น อัตราจริงขึ้นอยู่กับการพิจารณาของธนาคาร
          </p>
        </div>
      </div>
    </div>
  );
}
