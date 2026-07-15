"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, CalendarPlus } from "lucide-react";
import { properties } from "@/lib/properties";
import { useTranslation } from "@/i18n/LanguageProvider";

const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const totalMinutes = 9 * 60 + i * 30; // 09:00 to 17:00 in 30-minute steps
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

export default function BookingForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "financing" ? "financing" : "view";
  const propertySlug = searchParams.get("property") ?? "";

  const modeCopy = {
    view: { title: t.booking.viewTitle, subtitle: t.booking.viewSubtitle, cta: t.booking.viewCta },
    financing: {
      title: t.booking.financingTitle,
      subtitle: t.booking.financingSubtitle,
      cta: t.booking.financingCta,
    },
  };
  const copy = modeCopy[mode];

  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [calendarLink, setCalendarLink] = useState<string | undefined>();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    property: propertySlug,
    date: "",
    time: "",
    note: "",
    pdpaConsent: false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const selectedProperty = properties.find((p) => p.slug === form.property);

  function validate(): string | null {
    if (!/^\d{10}$/.test(form.phone)) return t.booking.errorPhone;
    if (mode === "view") {
      if (!form.date || !form.time) return t.booking.errorDateTime;
      if (form.time < "09:00" || form.time > "17:00") return t.booking.errorTimeRange;
    }
    if (!form.pdpaConsent) return t.booking.errorPdpa;
    return null;
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setShowConfirm(true);
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.booking.errorGeneric);
        setShowConfirm(false);
        return;
      }
      setCalendarLink(data.calendarLink);
      setSubmitted(true);
    } catch {
      setError(t.booking.errorGeneric);
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
          <Check className="h-8 w-8 text-maroon-dark" strokeWidth={2} />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-maroon-dark">
          {t.booking.successHeading}
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          {t.booking.successBody} {form.email}
        </p>
        {calendarLink && (
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-maroon px-5 py-3 text-sm font-medium text-cream hover:bg-maroon-light"
          >
            <CalendarPlus className="h-4 w-4" strokeWidth={1.75} />
            {t.booking.addToCalendar}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{copy.title}</h1>
      <p className="mt-2 text-sm text-ink/60">{copy.subtitle}</p>

      <form
        onSubmit={handleReview}
        className="mt-8 space-y-5 rounded-2xl border border-gold-light/40 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              {t.booking.nameLabel}
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              {t.booking.phoneLabel} <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              pattern="\d{10}"
              title={t.booking.phoneLabel}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            {t.booking.emailLabel}
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            {t.booking.propertyLabel}
          </label>
          <select
            value={form.property}
            onChange={(e) => update("property", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          >
            <option value="">{t.booking.propertyUnset}</option>
            {properties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {mode === "view" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
                {t.booking.dateLabel}
              </label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
                {t.booking.timeLabel}
              </label>
              <select
                required
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
              >
                <option value="">{t.booking.timePlaceholder}</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            {t.booking.noteLabel}
          </label>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-ink/60">
          <input
            type="checkbox"
            checked={form.pdpaConsent}
            onChange={(e) => update("pdpaConsent", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-gold"
          />
          {t.booking.pdpaText}
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
        >
          {copy.cta}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="font-heading text-xl font-semibold text-maroon-dark">
              {t.booking.confirmHeading}
            </h2>
            <p className="mt-1 text-xs text-ink/50">{t.booking.confirmSubtitle}</p>

            <dl className="mt-4 space-y-2 text-sm">
              <Row label={t.booking.confirmName} value={form.name} />
              <Row label={t.booking.confirmPhone} value={form.phone} />
              <Row label={t.booking.confirmEmail} value={form.email} />
              {selectedProperty && <Row label={t.booking.confirmProperty} value={selectedProperty.name} />}
              {mode === "view" && (
                <Row label={t.booking.confirmDateTime} value={`${form.date} ${form.time}`} />
              )}
              {form.note && <Row label={t.booking.confirmNote} value={form.note} />}
            </dl>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-cream-dark px-5 py-2.5 text-sm font-medium text-ink/60 hover:border-gold"
              >
                {t.booking.editButton}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirm}
                className="flex-1 bg-maroon px-5 py-2.5 text-sm font-medium text-cream hover:bg-maroon-light disabled:opacity-50"
              >
                {submitting ? t.booking.sending : t.booking.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-cream-dark pb-2 last:border-none">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-right font-medium text-maroon-dark">{value}</dd>
    </div>
  );
}
