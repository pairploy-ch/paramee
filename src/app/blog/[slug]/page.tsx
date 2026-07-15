import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchPublishedPosts } from "@/lib/data/posts";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { posts as seedPosts } from "@/lib/posts";
import BlogPostView from "./BlogPostView";

export function generateStaticParams() {
  return seedPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug, isSupabaseConfigured ? createPublicClient() : undefined);
  return { title: post ? `${post.title} | Paramee` : "ไม่พบบทความ | Paramee" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const post = await fetchPostBySlug(slug, supabase);
  if (!post) notFound();

  const related = (await fetchPublishedPosts(supabase))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return <BlogPostView post={post} related={related} />;
}
