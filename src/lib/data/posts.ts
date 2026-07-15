import type { SupabaseClient } from "@supabase/supabase-js";
import { posts as seedPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/types";

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_image: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string;
}

export function rowToPost(row: PostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tag: row.tag,
    coverImage: row.cover_image,
    authorName: row.author_name,
    isPublished: row.is_published,
    publishedAt: row.published_at,
  };
}

export type NewPostInput = Omit<BlogPost, "slug"> & { slug?: string };

function postToRow(input: NewPostInput): Omit<PostRow, "id"> {
  const slug =
    input.slug ??
    `${input.title}-${Date.now()}`
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    tag: input.tag,
    cover_image: input.coverImage,
    author_name: input.authorName,
    is_published: input.isPublished,
    published_at: input.publishedAt,
  };
}

/** Public read — only published posts, seed fallback when Supabase isn't configured. */
export async function fetchPublishedPosts(supabase?: SupabaseClient): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return seedPosts.filter((p) => p.isPublished);
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return seedPosts.filter((p) => p.isPublished);
  return (data as PostRow[]).map(rowToPost);
}

/** Admin read — includes unpublished posts. Requires an authenticated admin client. */
export async function fetchAllPostsAdmin(supabase?: SupabaseClient): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) return seedPosts;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data) return seedPosts;
  return (data as PostRow[]).map(rowToPost);
}

export async function fetchPostBySlug(
  slug: string,
  supabase?: SupabaseClient
): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return seedPosts.find((p) => p.slug === slug && p.isPublished);
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return seedPosts.find((p) => p.slug === slug && p.isPublished);
  return rowToPost(data as PostRow);
}

export async function insertPost(supabase: SupabaseClient, input: NewPostInput) {
  return supabase.from("posts").insert(postToRow(input)).select("*").single();
}

export async function updatePostBySlug(
  supabase: SupabaseClient,
  slug: string,
  patch: Partial<NewPostInput>
) {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.excerpt !== undefined) row.excerpt = patch.excerpt;
  if (patch.content !== undefined) row.content = patch.content;
  if (patch.tag !== undefined) row.tag = patch.tag;
  if (patch.coverImage !== undefined) row.cover_image = patch.coverImage;
  if (patch.isPublished !== undefined) row.is_published = patch.isPublished;
  row.updated_at = new Date().toISOString();

  return supabase.from("posts").update(row).eq("slug", slug).select("*").single();
}

export async function deletePostBySlug(supabase: SupabaseClient, slug: string) {
  return supabase.from("posts").delete().eq("slug", slug);
}
