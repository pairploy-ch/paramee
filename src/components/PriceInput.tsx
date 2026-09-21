"use client";

/**
 * Plain number inputs can't show thousands separators while typing (browsers
 * strip anything but digits/decimal point) — this renders as text but keeps
 * the same string-based value/onChange contract every price field in this
 * app already uses, so it's a drop-in swap for <input type="number">.
 */
export default function PriceInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
    onChange(digitsOnly);
  }

  const display = value.trim() === "" ? "" : Number(value).toLocaleString("en-US");

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
