import type { Metadata } from "next";
import BlogListView from "./BlogListView";
import { fetchPublishedPosts } from "@/lib/data/posts";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "บทความน่ารู้ | Paramee",
};

export default async function BlogPage() {
  const posts = await fetchPublishedPosts(isSupabaseConfigured ? createPublicClient() : undefined);

  return <BlogListView posts={posts} />;
}
