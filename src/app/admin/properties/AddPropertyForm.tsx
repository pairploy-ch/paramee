"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import { propertyTypes } from "@/lib/properties";
import type { PropertyType } from "@/lib/types";
import AdminNav from "@/components/AdminNav";

const DEMO_EMAIL = "admin@paramee.co.th";
const DEMO_PASSWORD = "Admin@2026";

const propertyTypeEnMap: Record<PropertyType, string> = {
  คอนโด: "Condo",
  บ้าน: "House",
  ทาวน์โฮม: "Townhome",
  ที่ดิน: "Land",
};

const SEPARATOR = "────────────────────────";

interface NearbyRow {
  place: string;
  distance: string;
}

interface ListingForm {
  kind: "ให้เช่า" | "ขาย";
  propertyType: PropertyType;
  nameTh: string;
  nameEn: string;
  code: string;
  soi: string;
  highlight: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  building: string;
  floor: string;
  facing: string;
  furnishing: string;
  amenities: string;
  nearby: NearbyRow[];
  price: string;
  contractYears: string;
  depositMonths: string;
  advanceMonths: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  lineId: string;
  whatsapp: string;
}

const emptyForm: ListingForm = {
  kind: "ให้เช่า",
  propertyType: "คอนโด",
  nameTh: "",
  nameEn: "",
  code: "",
  soi: "",
  highlight: "",
  areaSqm: "",
  bedrooms: "1",
  bathrooms: "1",
  building: "",
  floor: "",
  facing: "",
  furnishing: "Fully Furnished",
  amenities: "Wi-Fi\nเครื่องใช้ไฟฟ้าครบ",
  nearby: [
    { place: "", distance: "" },
    { place: "", distance: "" },
    { place: "", distance: "" },
  ],
  price: "",
  contractYears: "1",
  depositMonths: "2",
  advanceMonths: "1",
  contact1Name: "K.Prem",
  contact1Phone: "095-789-5692",
  contact2Name: "K.Aom",
  contact2Phone: "086-393-9978",
  lineId: "@paramee",
  whatsapp: "095-789-5692",
};

interface SavedListing {
  id: string;
  nameTh: string;
  price: string;
  kind: ListingForm["kind"];
  caption: string;
  createdAt: string;
}

const STORAGE_KEY = "paramee-admin-listings";

function buildCaption(f: ListingForm): string {
  const isRent = f.kind === "ให้เช่า";
  const isLand = f.propertyType === "ที่ดิน";
  const enType = propertyTypeEnMap[f.propertyType] ?? f.propertyType;

  const headerLine = `${isRent ? "ให้เช่า" : "ประกาศขาย"}${f.propertyType} ${f.nameTh}${
    f.soi ? ` ซ.${f.soi}` : ""
  }${f.highlight ? ` ${f.highlight}` : ""}`;
  const subLine = `${enType} : ${f.nameEn}${f.code ? ` (${f.code})` : ""}`;

  const blocks: string[] = [`${headerLine}\n${subLine}`];

  if (!isLand) {
    const roomLine = `${f.areaSqm} ตร.ม. • ${f.bedrooms} ห้องนอน • ${f.bathrooms} ห้องน้ำ • ตึก ${f.building} • ชั้น ${f.floor} • วิว ${f.facing}`;
    blocks.push(`รายละเอียดห้อง\n${roomLine}`);

    const amenityLines = f.amenities
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean)
      .map((a) => `✓ ${a}`);
    blocks.push(`เฟอร์นิเจอร์และเครื่องใช้ไฟฟ้า\n✓ ${f.furnishing}${amenityLines.length ? `\n${amenityLines.join("\n")}` : ""}`);
  } else {
    blocks.push(`รายละเอียดที่ดิน\n${f.areaSqm} ตร.ม.`);
  }

  const nearbyLines = f.nearby
    .filter((n) => n.place.trim())
    .map((n) => `⚲ ${n.place}${n.distance ? ` (~${n.distance})` : ""}`);
  if (nearbyLines.length) {
    blocks.push(`Nearby\n${nearbyLines.join("\n")}`);
  }

  const priceHeading = isRent ? "เงื่อนไขการเช่า" : "ราคาขาย";
  const priceLine = isRent ? `${f.price} THB / month` : `${f.price} THB`;
  blocks.push(`${priceHeading}\n${priceLine}`);

  let caption = blocks.join("\n\n\n");

  if (isRent) {
    const contractLine = `สัญญา ${f.contractYears} ปี • เงินประกัน ${f.depositMonths} เดือน + ล่วงหน้า ${f.advanceMonths} เดือน`;
    caption += `\n\n\n\n${contractLine}`;
  }

  const contactLine = `${f.contact1Name} : ${f.contact1Phone} | ${f.contact2Name} : ${f.contact2Phone}`;
  const lineWhatsappLine = `LINE : ${f.lineId} | WhatsApp : ${f.whatsapp}`;
  caption += `\n${SEPARATOR}\nสนใจติดต่อสอบถามรายละเอียดเพิ่มเติม / นัดชมห้องจริง\n${contactLine}\n${lineWhatsappLine}`;

  return caption;
}

export default function AddPropertyForm() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [form, setForm] = useState<ListingForm>(emptyForm);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState<SavedListing[]>([]);
  const [copiedSavedId, setCopiedSavedId] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  function persist(next: SavedListing[]) {
    setSaved(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const caption = buildCaption(form);

  function update<K extends keyof ListingForm>(key: K, value: ListingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateNearby(index: number, field: keyof NearbyRow, value: string) {
    setForm((f) => ({
      ...f,
      nearby: f.nearby.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  }

  function addNearbyRow() {
    setForm((f) => ({ ...f, nearby: [...f.nearby, { place: "", distance: "" }] }));
  }

  function removeNearbyRow(index: number) {
    setForm((f) => ({ ...f, nearby: f.nearby.filter((_, i) => i !== index) }));
  }

  async function copyCaption(text: string, onDone: () => void) {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  function handleSaveListing(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameTh) return;
    const entry: SavedListing = {
      id: crypto.randomUUID(),
      nameTh: form.nameTh,
      price: form.price,
      kind: form.kind,
      caption,
      createdAt: new Date().toISOString(),
    };
    persist([entry, ...saved]);
    setForm(emptyForm);
  }

  function handleDelete(id: string) {
    persist(saved.filter((s) => s.id !== id));
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
        <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
          <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
            Admin: เพิ่มทรัพย์
          </h1>
          <p className="mt-2 text-sm text-ink/60">เข้าสู่ระบบสำหรับทีมงาน Paramee</p>
          <div className="mt-3 rounded-lg bg-cream-dark/60 px-4 py-3 text-xs text-ink/60">
            บัญชีสาธิต — อีเมล: <span className="font-semibold text-maroon-dark">{DEMO_EMAIL}</span>
            <br />
            รหัสผ่าน: <span className="font-semibold text-maroon-dark">{DEMO_PASSWORD}</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
                setLoginError("");
                setLoggedIn(true);
              } else {
                setLoginError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
              }
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">อีเมล</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="admin@paramee.co.th"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">รหัสผ่าน</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="••••••"
              />
            </div>
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <AdminNav />
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">เพิ่มทรัพย์</h1>
        <p className="mt-2 text-sm text-ink/60">
          กรอกข้อมูลทรัพย์ ระบบจะสร้างแคปชั่นให้พร้อมคัดลอกไปลงประกาศใน Facebook ได้ทันที
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <form onSubmit={handleSaveListing} className="space-y-6">
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลพื้นฐาน</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="ประเภทประกาศ">
                <select
                  value={form.kind}
                  onChange={(e) => update("kind", e.target.value as ListingForm["kind"])}
                  className={inputClass}
                >
                  <option value="ให้เช่า">ให้เช่า</option>
                  <option value="ขาย">ขาย</option>
                </select>
              </Field>
              <Field label="ประเภททรัพย์">
                <select
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType)}
                  className={inputClass}
                >
                  {propertyTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="ชื่อโครงการ (ไทย)">
                <input
                  required
                  value={form.nameTh}
                  onChange={(e) => update("nameTh", e.target.value)}
                  placeholder="เช่น เดอะ พาร์ควิว ทองหล่อ"
                  className={inputClass}
                />
              </Field>
              <Field label="ชื่อโครงการ (อังกฤษ)">
                <input
                  value={form.nameEn}
                  onChange={(e) => update("nameEn", e.target.value)}
                  placeholder="เช่น The Parkview Thonglor"
                  className={inputClass}
                />
              </Field>
              <Field label="รหัสทรัพย์">
                <input
                  value={form.code}
                  onChange={(e) => update("code", e.target.value)}
                  placeholder="เช่น PM-3502"
                  className={inputClass}
                />
              </Field>
              <Field label="ซอย">
                <input
                  value={form.soi}
                  onChange={(e) => update("soi", e.target.value)}
                  placeholder="เช่น สุขุมวิท 55"
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="รายละเอียดเด่น">
                  <input
                    value={form.highlight}
                    onChange={(e) => update("highlight", e.target.value)}
                    placeholder="เช่น 1 ห้องนอน วิวสระว่ายน้ำ"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>

          {form.propertyType !== "ที่ดิน" ? (
            <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">รายละเอียดห้อง</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="ตร.ม.">
                  <input value={form.areaSqm} onChange={(e) => update("areaSqm", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ห้องนอน">
                  <input value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ห้องน้ำ">
                  <input value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ตึก">
                  <input value={form.building} onChange={(e) => update("building", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ชั้น">
                  <input value={form.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass} />
                </Field>
                <Field label="วิว / ทิศ">
                  <input value={form.facing} onChange={(e) => update("facing", e.target.value)} className={inputClass} />
                </Field>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="เฟอร์นิเจอร์">
                  <select
                    value={form.furnishing}
                    onChange={(e) => update("furnishing", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Partly Furnished">Partly Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </Field>
                <Field label="เครื่องใช้ไฟฟ้า / สิ่งอำนวยความสะดวก (บรรทัดละ 1 รายการ)">
                  <textarea
                    value={form.amenities}
                    onChange={(e) => update("amenities", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">รายละเอียดที่ดิน</h2>
              <div className="mt-4 max-w-xs">
                <Field label="พื้นที่ (ตร.ม.)">
                  <input value={form.areaSqm} onChange={(e) => update("areaSqm", e.target.value)} className={inputClass} />
                </Field>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">สถานที่ใกล้เคียง</h2>
              <button
                type="button"
                onClick={addNearbyRow}
                className="flex items-center gap-1 border border-gold-dark px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-cream-dark"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.75} /> เพิ่มแถว
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {form.nearby.map((row, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    value={row.place}
                    onChange={(e) => updateNearby(i, "place", e.target.value)}
                    placeholder="สถานที่ใกล้เคียง"
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    value={row.distance}
                    onChange={(e) => updateNearby(i, "distance", e.target.value)}
                    placeholder="ระยะทาง เช่น 350 ม."
                    className={`${inputClass} w-40`}
                  />
                  <button
                    type="button"
                    aria-label="ลบแถว"
                    onClick={() => removeNearbyRow(i)}
                    className="border border-cream-dark px-3 text-ink/40 hover:border-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              {form.kind === "ให้เช่า" ? "เงื่อนไขการเช่า" : "ราคาขาย"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label={form.kind === "ให้เช่า" ? "ค่าเช่า / เดือน (บาท)" : "ราคาขาย (บาท)"}>
                <input value={form.price} onChange={(e) => update("price", e.target.value)} className={inputClass} />
              </Field>
              {form.kind === "ให้เช่า" && (
                <>
                  <Field label="สัญญา (ปี)">
                    <input
                      value={form.contractYears}
                      onChange={(e) => update("contractYears", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="เงินประกัน (เดือน)">
                    <input
                      value={form.depositMonths}
                      onChange={(e) => update("depositMonths", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="เงินล่วงหน้า (เดือน)">
                    <input
                      value={form.advanceMonths}
                      onChange={(e) => update("advanceMonths", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลติดต่อ</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="ผู้ติดต่อ 1 - ชื่อ">
                <input value={form.contact1Name} onChange={(e) => update("contact1Name", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ผู้ติดต่อ 1 - เบอร์โทร">
                <input value={form.contact1Phone} onChange={(e) => update("contact1Phone", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ผู้ติดต่อ 2 - ชื่อ">
                <input value={form.contact2Name} onChange={(e) => update("contact2Name", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ผู้ติดต่อ 2 - เบอร์โทร">
                <input value={form.contact2Phone} onChange={(e) => update("contact2Phone", e.target.value)} className={inputClass} />
              </Field>
              <Field label="LINE ID">
                <input value={form.lineId} onChange={(e) => update("lineId", e.target.value)} className={inputClass} />
              </Field>
              <Field label="WhatsApp">
                <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.nameTh}
            className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            บันทึกทรัพย์
          </button>
        </form>

        {/* Live caption preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">
                พรีวิวแคปชั่น Facebook
              </h2>
            </div>
            <textarea
              readOnly
              value={caption}
              rows={22}
              className="mt-4 w-full whitespace-pre-wrap border border-cream-dark bg-cream px-3 py-3 font-mono text-xs leading-relaxed text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => copyCaption(caption, () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })}
              className="mt-4 flex w-full items-center justify-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
              {copied ? "คัดลอกแล้ว" : "คัดลอกแคปชั่น"}
            </button>
          </div>

          {saved.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">
                ทรัพย์ที่บันทึกไว้ ({saved.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {saved.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 border-b border-cream-dark pb-3 last:border-none"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-maroon-dark">{s.nameTh}</p>
                      <p className="text-xs text-ink/50">
                        {s.kind} · {s.price ? `${s.price} บาท` : "-"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        aria-label="คัดลอกแคปชั่น"
                        onClick={() =>
                          copyCaption(s.caption, () => {
                            setCopiedSavedId(s.id);
                            setTimeout(() => setCopiedSavedId(null), 2000);
                          })
                        }
                        className="border border-gold-dark px-2.5 py-1.5 text-gold-dark hover:bg-cream-dark"
                      >
                        {copiedSavedId === s.id ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        ) : (
                          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label="ลบทรัพย์"
                        onClick={() => handleDelete(s.id)}
                        className="border border-cream-dark px-2.5 py-1.5 text-ink/40 hover:border-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/60">{label}</label>
      {children}
    </div>
  );
}
