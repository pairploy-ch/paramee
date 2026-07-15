import type { Metadata } from "next";
import BlogAdmin from "./BlogAdmin";
import { fetchAllPostsAdmin } from "@/lib/data/posts";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: จัดการบทความ | Paramee",
};

export default async function AdminBlogPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const posts = await fetchAllPostsAdmin(supabase);

  return <BlogAdmin initialPosts={posts} />;
}
