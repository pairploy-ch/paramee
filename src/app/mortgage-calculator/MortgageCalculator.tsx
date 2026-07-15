"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatBaht } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function MortgageCalculator() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const priceFromQuery = Number(searchParams.get("price")) || 5_000_000;

  const bankPresets = [
    { name: lang === "en" ? "Bangkok Bank" : "ธนาคารกรุงเทพ", rate: 3.35 },
    { name: lang === "en" ? "Kasikornbank" : "ธนาคารกสิกรไทย", rate: 3.4 },
    { name: lang === "en" ? "Siam Commercial Bank" : "ธนาคารไทยพาณิชย์", rate: 3.5 },
    { name: lang === "en" ? "Krungthai Bank" : "ธนาคารกรุงไทย", rate: 3.45 },
    { name: t.mortgage.bankCustom, rate: 3.5 },
  ];

  const [price, setPrice] = useState(priceFromQuery);
  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [interestRate, setInterestRate] = useState(3.4);
  const [years, setYears] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

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

  const dtiPercent = monthlyIncome > 0 ? (result.monthlyPayment / monthlyIncome) * 100 : null;
  const dtiLevel =
    dtiPercent === null ? null : dtiPercent >= 70 ? "danger" : dtiPercent >= 40 ? "warning" : "ok";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{t.mortgage.heading}</h1>
      <p className="mt-2 text-sm text-ink/60">{t.mortgage.subtitle}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6 rounded-2xl border border-gold-light/40 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              {t.mortgage.priceLabel}
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
              {t.mortgage.downPaymentLabel}: {downPaymentPercent}% ({formatBaht(result.downPayment)})
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
              {t.mortgage.interestRateLabel}
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
                  {b.name} {b.name !== t.mortgage.bankCustom && `${b.rate}%`}
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
              {t.mortgage.loanTermLabel}: {years} {t.mortgage.yearsSuffix}
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

          <div className="border-t border-cream-dark pt-6">
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              {t.mortgage.incomeLabel}
            </label>
            <input
              type="number"
              min={0}
              value={monthlyIncome || ""}
              onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
              placeholder={t.mortgage.incomePlaceholder}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-maroon p-6 text-cream">
            <p className="text-sm text-cream/60">{t.mortgage.monthlyPaymentLabel}</p>
            <p className="mt-2 font-heading text-4xl font-semibold text-gold-light">
              {formatBaht(Math.round(result.monthlyPayment))}
            </p>
          </div>

          {dtiLevel && (
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                dtiLevel === "danger"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : dtiLevel === "warning"
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
              }`}
            >
              {dtiLevel === "danger" ? (
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.75} />
              ) : dtiLevel === "warning" ? (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.75} />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.75} />
              )}
              <div>
                <p className="font-semibold">
                  {t.mortgage.dtiTitle} {dtiPercent!.toFixed(0)}%
                </p>
                <p className="mt-0.5 text-xs leading-relaxed opacity-90">
                  {dtiLevel === "danger"
                    ? t.mortgage.dtiDanger
                    : dtiLevel === "warning"
                    ? t.mortgage.dtiWarning
                    : t.mortgage.dtiOk}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">{t.mortgage.loanAmountLabel}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.loanAmount))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">{t.mortgage.totalInterestLabel}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.totalInterest))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">{t.mortgage.downPaymentResultLabel}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.downPayment))}
              </p>
            </div>
            <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
              <p className="text-xs text-ink/60">{t.mortgage.totalPaidLabel}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-maroon-dark">
                {formatBaht(Math.round(result.totalPaid))}
              </p>
            </div>
          </div>

          <Link
            href="/booking?mode=financing"
            className="bg-gold px-5 py-3 text-center text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
          >
            {t.mortgage.ctaButton}
          </Link>
          <p className="text-center text-xs text-ink/40">{t.mortgage.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
