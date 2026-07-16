"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Trash2, Loader2 } from "lucide-react";
import { formatThaiDate } from "@/lib/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertPost, updatePostBySlug, deletePostBySlug, type NewPostInput } from "@/lib/data/posts";
import { usePosts } from "@/lib/postStore";
import type { BlogPost } from "@/lib/types";

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

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  tag: "",
  coverImage: "",
  authorName: "ทีมงาน Paramee",
  isPublished: true,
};

export default function BlogAdmin({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const localStore = usePosts();
  const posts = isSupabaseConfigured ? initialPosts : localStore.posts;

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const input: Omit<BlogPost, "slug"> = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tag: form.tag,
      coverImage: form.coverImage || null,
      authorName: form.authorName,
      isPublished: form.isPublished,
      publishedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { error: insertError } = await insertPost(supabase, input);
      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }
      router.refresh();
    } else {
      localStore.addPost(input);
    }

    setForm(emptyForm);
    setSubmitting(false);
  }

  async function handleTogglePublish(post: BlogPost) {
    setPendingSlug(post.slug);
    const patch: Partial<NewPostInput> = { isPublished: !post.isPublished };
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await updatePostBySlug(supabase, post.slug, patch);
      router.refresh();
    } else {
      localStore.updatePost(post.slug, patch);
    }
    setPendingSlug(null);
  }

  async function handleDelete(post: BlogPost) {
    setPendingSlug(post.slug);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await deletePostBySlug(supabase, post.slug);
      router.refresh();
    } else {
      localStore.deletePost(post.slug);
    }
    setPendingSlug(null);
  }

  async function handleSaveEdit(post: BlogPost, patch: Partial<NewPostInput>) {
    setPendingSlug(post.slug);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await updatePostBySlug(supabase, post.slug, patch);
      router.refresh();
    } else {
      localStore.updatePost(post.slug, patch);
    }
    setPendingSlug(null);
    setEditingSlug(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">จัดการบทความ</h1>
        <p className="mt-2 text-sm text-ink/60">
          เพิ่ม แก้ไข และเผยแพร่บทความที่จะแสดงในหน้าแรกและหน้า &quot;บทความน่ารู้&quot;
          {!isSupabaseConfigured && " (โหมดสาธิต — บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น)"}
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mb-10 space-y-4 rounded-2xl border border-gold-light/40 bg-white p-6"
      >
        <h2 className="font-heading text-lg font-semibold text-maroon-dark">เพิ่มบทความใหม่</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="หัวข้อบทความ">
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="แท็ก">
            <input
              value={form.tag}
              onChange={(e) => update("tag", e.target.value)}
              placeholder="เช่น ซื้อบ้าน, การลงทุน, สินเชื่อ"
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="สรุปย่อ">
              <input
                required
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="เนื้อหาบทความ (เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่)">
              <textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="รูปปก (ลิงก์รูป, ไม่บังคับ)">
            <input
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
          <Field label="ผู้เขียน">
            <input
              value={form.authorName}
              onChange={(e) => update("authorName", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          เผยแพร่ทันที
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !form.title}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : "บันทึกบทความ"}
        </button>
      </form>

      <h2 className="mb-4 font-heading text-lg font-semibold text-maroon-dark">
        บทความทั้งหมด ({posts.length})
      </h2>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostRow
            key={post.slug}
            post={post}
            isEditing={editingSlug === post.slug}
            pending={pendingSlug === post.slug}
            onToggleEdit={() => setEditingSlug(editingSlug === post.slug ? null : post.slug)}
            onTogglePublish={() => handleTogglePublish(post)}
            onDelete={() => handleDelete(post)}
            onSave={(patch) => handleSaveEdit(post, patch)}
          />
        ))}
        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            ยังไม่มีบทความ
          </p>
        )}
      </div>
    </div>
  );
}

function PostRow({
  post,
  isEditing,
  pending,
  onToggleEdit,
  onTogglePublish,
  onDelete,
  onSave,
}: {
  post: BlogPost;
  isEditing: boolean;
  pending: boolean;
  onToggleEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  onSave: (patch: Partial<NewPostInput>) => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const [tag, setTag] = useState(post.tag);

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <p className="font-medium text-maroon-dark">{post.title}</p>
          <p className="text-xs text-ink/50">
            {post.tag} · {post.authorName} · {formatThaiDate(post.publishedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onTogglePublish}
          disabled={pending}
          className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
            post.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {post.isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
        </button>
        <button
          onClick={onToggleEdit}
          disabled={pending}
          aria-label="แก้ไข"
          className="flex h-9 w-9 items-center justify-center border border-gold-dark text-gold-dark hover:bg-cream-dark disabled:opacity-50"
        >
          {isEditing ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Pencil className="h-4 w-4" strokeWidth={1.75} />}
        </button>
        <button
          onClick={onDelete}
          disabled={pending}
          aria-label="ลบบทความ"
          className="flex h-9 w-9 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ title, excerpt, content, tag });
          }}
          className="mt-4 space-y-4 border-t border-cream-dark pt-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="หัวข้อบทความ">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
            </Field>
            <Field label="แท็ก">
              <input value={tag} onChange={(e) => setTag(e.target.value)} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="สรุปย่อ">
                <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="เนื้อหาบทความ">
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:opacity-50"
          >
            {pending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </form>
      )}
    </div>
  );
}
