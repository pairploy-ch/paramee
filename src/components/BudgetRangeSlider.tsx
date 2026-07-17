"use client";

const MIN = 0;
const MAX = 50_000_000;
const STEP = 100_000;

function formatBaht(n: number) {
  return n.toLocaleString("th-TH");
}

export default function BudgetRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const minPercent = ((min - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((max - MIN) / (MAX - MIN)) * 100;

  function handleMinChange(value: number) {
    onChange(Math.min(value, max - STEP), max);
  }

  function handleMaxChange(value: number) {
    onChange(min, Math.max(value, min + STEP));
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-maroon-dark">
        <span>{formatBaht(min)} บาท</span>
        <span>
          {formatBaht(max)} บาท{max >= MAX ? "+" : ""}
        </span>
      </div>
      <div className="relative mt-3 h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cream-dark" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          aria-label="งบประมาณต่ำสุด"
          min={MIN}
          max={MAX}
          step={STEP}
          value={min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="budget-slider-thumb absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <input
          type="range"
          aria-label="งบประมาณสูงสุด"
          min={MIN}
          max={MAX}
          step={STEP}
          value={max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="budget-slider-thumb absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
      </div>
      <style jsx>{`
        .budget-slider-thumb {
          pointer-events: none;
        }
        .budget-slider-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: var(--color-gold-dark);
          border: 2px solid var(--color-cream);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        .budget-slider-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: var(--color-gold-dark);
          border: 2px solid var(--color-cream);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        .budget-slider-thumb::-webkit-slider-runnable-track,
        .budget-slider-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
