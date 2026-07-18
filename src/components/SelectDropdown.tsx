"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectDropdownOption {
  value: string;
  label: string;
}

/**
 * Fully custom-rendered dropdown (not a native <select>). Native <select>
 * popups on Windows can be painted by the OS itself using the system theme,
 * which ignores the page's own CSS/`color-scheme` entirely and can render
 * illegible white-on-white text when the OS is in dark mode. Rendering the
 * option list ourselves guarantees the colors always match this site's design.
 */
export default function SelectDropdown({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string;
  options: SelectDropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-left text-sm text-ink outline-none focus:border-gold"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-cream-dark bg-white shadow-lg">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-cream-dark ${
                o.value === value ? "bg-gold-light/40 font-semibold text-maroon-dark" : "text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
