import type { RentalDashboard, SaleDashboard } from "@/lib/dashboardSheets";
import { formatBaht } from "@/lib/format";
import CommissionTargetCard from "./CommissionTargetCard";

function pct(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
      <div
        className={`h-full rounded-full ${percent >= 100 ? "bg-emerald-500" : "bg-gold"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function MetricCard({ label, target, achieved, percent }: { label: string; target: string; achieved: string; percent: string }) {
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
      <p className="text-xs font-semibold text-ink/60">{label}</p>
      <p className="mt-2 font-heading text-lg font-semibold text-maroon-dark">
        {achieved} / {target}
      </p>
      <div className="mt-3">
        <ProgressBar percent={pct(percent)} />
        <p className="mt-1 text-right text-xs text-ink/50">{percent}</p>
      </div>
    </div>
  );
}

function CategoryTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; target: string; achieved: string; percent: string }[];
}) {
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
      <h2 className="font-heading text-lg font-semibold text-maroon-dark">{title}</h2>
      <table className="mt-4 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="pb-2">ประเภท</th>
            <th className="pb-2 text-right">เป้า</th>
            <th className="pb-2 text-right">ได้แล้ว</th>
            <th className="pb-2 text-right">% คืบหน้า</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isTotal = row.label.includes("รวม");
            return (
              <tr
                key={i}
                className={`border-t border-cream-dark ${isTotal ? "font-semibold text-maroon-dark" : ""}`}
              >
                <td className="py-2">{row.label}</td>
                <td className="py-2 text-right">{row.target}</td>
                <td className="py-2 text-right">{row.achieved}</td>
                <td className="py-2 text-right">{row.percent}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="mt-1 font-heading text-base font-semibold text-maroon-dark">{value}</p>
    </div>
  );
}

export default function KpiDashboard({
  rental,
  sale,
  error,
  commissionTarget,
  totalRentSum,
  canEditTarget,
}: {
  rental?: RentalDashboard;
  sale?: SaleDashboard;
  error: string;
  commissionTarget: number | null;
  totalRentSum: number;
  canEditTarget: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
          Commission Performance Dashboard
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          ดึงข้อมูลสดจาก Google Sheet (CPT_MASTER) — แก้ไขตัวเลขได้ที่ชีตเท่านั้น ไม่มีการกรอกผ่านเว็บ
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          ดึงข้อมูลจาก Google Sheet ไม่สำเร็จ: {error}
        </div>
      )}

      {rental && (
        <div className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-semibold text-maroon-dark">{rental.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {rental.metrics.map((m, i) =>
              i === 0 ? (
                <CommissionTargetCard
                  key={m.label}
                  label={m.label}
                  achieved={m.achieved}
                  sheetTarget={m.target}
                  dbTarget={commissionTarget}
                  canEdit={canEditTarget}
                />
              ) : (
                <MetricCard key={m.label} label={m.label} target={m.target} achieved={m.achieved} percent={m.percent} />
              )
            )}
            {sale && (
              <MetricCard
                label="📈 ยอดขายปัจจุบัน"
                target={sale.monthlyTarget}
                achieved={sale.actual}
                percent={sale.percentDone}
              />
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <CategoryTable title="เป้าหมายค่าคอมมิชชั่นเช่า (Rental Commission Target)" rows={rental.rentalCategories} />
            <CategoryTable title="เป้าหมาย Commission % สูง (High-Commission Target)" rows={rental.highCommissionCategories} />
          </div>
        </div>
      )}

      {sale && (
        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-heading text-xl font-semibold text-maroon-dark">Dashboard Sale</h2>
            <p className="text-xs text-ink/50">
              อัปเดตล่าสุด: {sale.updatedAt} {sale.monthEndNote && `· ${sale.monthEndNote}`}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard label="เป้าหมายเดือนนี้ / ทำได้แล้ว" target={sale.monthlyTarget} achieved={sale.actual} percent={sale.percentDone} />
            <SmallStat label="ขาดอีก (Gap)" value={sale.gap} />
            <SmallStat label="วันที่เหลือในเดือน" value={sale.daysLeft} />
            <SmallStat label="ทรัพย์ว่างทั้งหมด" value={sale.vacantUnits} />
            <SmallStat label="สถานะพอร์ต" value={sale.portfolioStatus} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <SmallStat label="Commission ทั้งหมด (รวมค่าเช่าทุกทรัพย์)" value={formatBaht(totalRentSum)} />
            <SmallStat label="ราคาเช่าเฉลี่ย/เดือน" value={sale.avgRentPerMonth} />
            <SmallStat label="คอมมิชชั่นเฉลี่ย/ดีล" value={sale.avgCommissionPerDeal} />
            <SmallStat label="ดีลที่ต้องปิดเพิ่ม" value={sale.dealsNeeded} />
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">ประเภท</th>
                  <th className="px-4 py-3">CODE</th>
                  <th className="px-4 py-3">โครงการ</th>
                  <th className="px-4 py-3">โซน</th>
                  <th className="px-4 py-3 text-right">ราคา/เดือน</th>
                  <th className="px-4 py-3 text-right">คอมมิชชั่นประมาณการ</th>
                  <th className="px-4 py-3 text-right">สะสม</th>
                </tr>
              </thead>
              <tbody>
                {sale.opportunities.map((o, i) => (
                  <tr key={i} className="border-t border-cream-dark">
                    <td className="px-4 py-3">{o.rank}</td>
                    <td className="px-4 py-3">{o.type}</td>
                    <td className="px-4 py-3">{o.code}</td>
                    <td className="px-4 py-3">{o.name}</td>
                    <td className="px-4 py-3">{o.zone}</td>
                    <td className="px-4 py-3 text-right">{o.pricePerMonth}</td>
                    <td className="px-4 py-3 text-right">{o.commission}</td>
                    <td className="px-4 py-3 text-right">{o.cumulative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
