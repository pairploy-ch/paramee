"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import type { Property } from "@/lib/types";

export default function PropertySearchSelect({
  properties,
  value,
  onChange,
  placeholder,
  emptyLabel,
}: {
  properties: Property[];
  value: string;
  onChange: (slug: string) => void;
  placeholder: string;
  emptyLabel: string;
}) {
  const selected = properties.find((p) => p.slug === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(selected?.name ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filtered = query.trim()
    ? properties.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : properties;

  function selectProperty(p: Property) {
    onChange(p.slug);
    setQuery(p.name);
    setOpen(false);
  }

  function clearSelection() {
    onChange("");
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
          strokeWidth={1.75}
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (e.target.value.trim() === "") onChange("");
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-lg border border-cream-dark bg-cream py-2.5 pl-9 pr-9 text-sm outline-none focus:border-gold"
        />
        {query && (
          <button
            type="button"
            aria-label="ล้างค่า"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="ปิดรายการ"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-cream-dark bg-white shadow-lg">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-ink/40">{emptyLabel}</p>
            ) : (
              filtered.map((p) => (
                <button
                  type="button"
                  key={p.slug}
                  onClick={() => selectProperty(p)}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-cream-dark ${
                    p.slug === value ? "bg-cream-dark font-semibold text-maroon-dark" : "text-ink/80"
                  }`}
                >
                  {p.name}
                  <span className="ml-2 text-xs text-ink/40">{p.district}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
