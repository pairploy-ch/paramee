"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileText, Trash2, UploadCloud } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertCoAgentApplication } from "@/lib/data/coAgentApplications";
import {
  coAgentExpertiseAreas,
  coAgentMarketingChannels,
  coAgentWorkTypes,
} from "@/lib/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const inputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold";

function isAcceptedFile(file: File) {
  return file.type.startsWith("image/") || ACCEPTED_TYPES.includes(file.type);
}

function sanitizeFilename(name: string) {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9.]+/g, "-");
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink/70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2 border border-cream-dark bg-cream px-3 py-2 text-sm hover:border-gold"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="h-4 w-4 accent-maroon"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

async function uploadDocument(file: File): Promise<string> {
  const supabase = createClient();
  const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFilename(file.name)}`;
  const { error } = await supabase.storage.from("co-agent-documents").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export default function CoAgentRegisterForm() {
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [email, setEmail] = useState("");
  const [workType, setWorkType] = useState<string>("");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [marketingChannels, setMarketingChannels] = useState<string[]>([]);
  const [marketingName, setMarketingName] = useState("");

  const [idCardFiles, setIdCardFiles] = useState<{ name: string; path: string }[]>([]);
  const [bankBookFile, setBankBookFile] = useState<{ name: string; path: string } | null>(null);
  const [companyCertFile, setCompanyCertFile] = useState<{ name: string; path: string } | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleIdCardFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError("");
    const remaining = 5 - idCardFiles.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploadingField("idCard");
    for (const file of toUpload) {
      if (!isAcceptedFile(file)) {
        setUploadError("รองรับเฉพาะไฟล์ PDF, Word หรือรูปภาพเท่านั้น");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError("ไฟล์ต้องมีขนาดไม่เกิน 10MB");
        continue;
      }
      try {
        const path = await uploadDocument(file);
        setIdCardFiles((prev) => [...prev, { name: file.name, path }]);
      } catch {
        setUploadError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
      }
    }
    setUploadingField(null);
  }

  async function handleSingleFile(
    file: File | undefined,
    setFile: (v: { name: string; path: string } | null) => void,
    field: string
  ) {
    if (!file) return;
    setUploadError("");
    if (!isAcceptedFile(file)) {
      setUploadError("รองรับเฉพาะไฟล์ PDF, Word หรือรูปภาพเท่านั้น");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("ไฟล์ต้องมีขนาดไม่เกิน 10MB");
      return;
    }
    setUploadingField(field);
    try {
      const path = await uploadDocument(file);
      setFile({ name: file.name, path });
    } catch {
      setUploadError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
    }
    setUploadingField(null);
  }

  function removeIdCardFile(index: number) {
    setIdCardFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("ระบบยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ");
      return;
    }
    if (!workType) {
      setError("กรุณาเลือกประเภทการทำงาน");
      return;
    }
    if (expertiseAreas.length === 0) {
      setError("กรุณาเลือกพื้นที่ที่เชี่ยวชาญอย่างน้อย 1 ข้อ");
      return;
    }
    if (marketingChannels.length === 0) {
      setError("กรุณาเลือกช่องทางทำการตลาดอย่างน้อย 1 ข้อ");
      return;
    }
    if (idCardFiles.length === 0) {
      setError("กรุณาอัปโหลดรูปถ่ายสำเนาบัตรประชาชน");
      return;
    }
    if (!bankBookFile) {
      setError("กรุณาอัปโหลดรูปถ่ายสำเนาสมุดบัญชี");
      return;
    }

    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error: saveError } = await insertCoAgentApplication(supabase, {
      fullName,
      nickname,
      phone,
      lineId,
      email,
      workType,
      expertiseAreas,
      marketingChannels,
      marketingName,
      idCardFiles: idCardFiles.map((f) => f.path),
      bankBookFile: bankBookFile.path,
      companyCertFile: companyCertFile?.path ?? null,
    });

    setSubmitting(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 text-center">
        <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.5} />
          <h1 className="mt-4 font-heading text-xl font-semibold text-maroon-dark">ส่งใบสมัครเรียบร้อยแล้ว</h1>
          <p className="mt-2 text-sm text-ink/60">
            ขอบคุณที่สนใจสมัครเป็น Co-Agent กับ Paramee Asset ทีมงานจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="mb-8 text-center">
        <Image
          src="/logo-paramee-maroon.png"
          alt="Paramee"
          width={140}
          height={135}
          className="mx-auto h-16 w-auto"
        />
        <h1 className="mt-4 font-heading text-2xl font-semibold text-maroon-dark">สมัคร Co-Agent</h1>
        <p className="mt-2 text-sm text-ink/60">กรอกข้อมูลด้านล่างเพื่อสมัครเป็น Co-Agent กับ Paramee Asset</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            ข้อมูลส่วนตัว <span className="text-sm font-normal text-ink/40">Personal Information</span>
          </h2>
          <div className="mt-4 space-y-4">
            <Field label="Name - ชื่อจริง นามสกุล" required>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Nickname - ชื่อเล่น" required>
              <input required value={nickname} onChange={(e) => setNickname(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Phone - เบอร์โทรศัพท์" required>
              <input
                required
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
            </Field>
            <Field label="ID Line" required>
              <input required value={lineId} onChange={(e) => setLineId(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email" required>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            ข้อมูลการทำงาน <span className="text-sm font-normal text-ink/40">Work Information</span>
          </h2>
          <div className="mt-4 space-y-5">
            <Field label="Freelance or Company - ฟรีแลนซ์ หรือ บริษัท" required>
              <div className="flex flex-col gap-2 sm:flex-row">
                {coAgentWorkTypes.map((opt) => (
                  <label
                    key={opt}
                    className="flex flex-1 cursor-pointer items-center gap-2 border border-cream-dark bg-cream px-3 py-2.5 text-sm hover:border-gold"
                  >
                    <input
                      type="radio"
                      name="workType"
                      checked={workType === opt}
                      onChange={() => setWorkType(opt)}
                      className="h-4 w-4 accent-maroon"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Area of expertise - พื้นที่ที่เชี่ยวชาญ" required>
              <CheckboxGroup
                options={coAgentExpertiseAreas}
                selected={expertiseAreas}
                onToggle={(v) => toggle(expertiseAreas, setExpertiseAreas, v)}
              />
            </Field>

            <Field label="Marketing Channels - ช่องทางทำการตลาด" required>
              <CheckboxGroup
                options={coAgentMarketingChannels}
                selected={marketingChannels}
                onToggle={(v) => toggle(marketingChannels, setMarketingChannels, v)}
              />
            </Field>

            <Field label="ชื่อ Facebook ส่วนตัว หรือ Facebook Page ในการทำการตลาด" required>
              <input
                required
                value={marketingName}
                onChange={(e) => setMarketingName(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            เอกสารยืนยันตัวตน <span className="text-sm font-normal text-ink/40">Identity Documents</span>
          </h2>
          <div className="mt-4 space-y-5">
            <Field label="Photo Copy of ID Card - รูปถ่ายสำเนาบัตรประชาชน" required>
              <p className="mb-2 text-xs text-ink/50">อัปโหลดไฟล์ที่รองรับสูงสุด 5 ไฟล์: PDF, document หรือ image ขนาดสูงสุด 10 MB ต่อไฟล์</p>
              <label className="flex cursor-pointer items-center gap-2 border border-dashed border-gold-light/60 bg-cream-dark/30 px-4 py-3 text-sm text-ink/60 hover:border-gold">
                <UploadCloud className="h-4 w-4" strokeWidth={1.75} />
                เลือกไฟล์
                <input
                  type="file"
                  multiple
                  accept="application/pdf,.doc,.docx,image/*"
                  disabled={idCardFiles.length >= 5 || uploadingField === "idCard"}
                  onChange={(e) => {
                    handleIdCardFiles(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
              {uploadingField === "idCard" && <p className="mt-2 text-xs text-ink/50">กำลังอัปโหลด...</p>}
              {idCardFiles.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {idCardFiles.map((f, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 border border-cream-dark bg-cream px-3 py-1.5 text-xs">
                      <span className="flex items-center gap-1.5 truncate text-ink/70">
                        <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} /> {f.name}
                      </span>
                      <button type="button" onClick={() => removeIdCardFile(i)} className="text-ink/40 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <Field label="Photo Copy of Book Bank - รูปถ่ายสำเนาสมุดบัญชีส่วนตัว หรือบัญชีบริษัท" required>
              <p className="mb-2 text-xs text-ink/50">อัปโหลดไฟล์ที่รองรับ 1 รายการ: PDF, document หรือ image ขนาดสูงสุด 10 MB</p>
              <label className="flex cursor-pointer items-center gap-2 border border-dashed border-gold-light/60 bg-cream-dark/30 px-4 py-3 text-sm text-ink/60 hover:border-gold">
                <UploadCloud className="h-4 w-4" strokeWidth={1.75} />
                เลือกไฟล์
                <input
                  type="file"
                  accept="application/pdf,.doc,.docx,image/*"
                  disabled={uploadingField === "bankBook"}
                  onChange={(e) => {
                    handleSingleFile(e.target.files?.[0], setBankBookFile, "bankBook");
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
              {uploadingField === "bankBook" && <p className="mt-2 text-xs text-ink/50">กำลังอัปโหลด...</p>}
              {bankBookFile && (
                <p className="mt-2 flex items-center gap-1.5 border border-cream-dark bg-cream px-3 py-1.5 text-xs text-ink/70">
                  <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} /> {bankBookFile.name}
                </p>
              )}
            </Field>

            <Field label="Photo Copy of Company Certificate - รูปถ่ายสำเนาหนังสือรับรองบริษัท (กรณีจดทะเบียนนิติบุคคล)">
              <label className="flex cursor-pointer items-center gap-2 border border-dashed border-gold-light/60 bg-cream-dark/30 px-4 py-3 text-sm text-ink/60 hover:border-gold">
                <UploadCloud className="h-4 w-4" strokeWidth={1.75} />
                เลือกไฟล์
                <input
                  type="file"
                  accept="application/pdf,.doc,.docx,image/*"
                  disabled={uploadingField === "companyCert"}
                  onChange={(e) => {
                    handleSingleFile(e.target.files?.[0], setCompanyCertFile, "companyCert");
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
              {uploadingField === "companyCert" && <p className="mt-2 text-xs text-ink/50">กำลังอัปโหลด...</p>}
              {companyCertFile && (
                <p className="mt-2 flex items-center gap-1.5 border border-cream-dark bg-cream px-3 py-1.5 text-xs text-ink/70">
                  <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} /> {companyCertFile.name}
                </p>
              )}
            </Field>

            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploadingField !== null}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "กำลังส่งใบสมัคร..." : "ส่งใบสมัคร"}
        </button>
      </form>
    </div>
  );
}
