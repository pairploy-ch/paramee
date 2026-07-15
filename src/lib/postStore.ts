"use client";

import { useEffect, useState } from "react";
import { posts as basePosts } from "./posts";
import type { BlogPost } from "./types";

const STORAGE_KEY = "paramee-post-overrides";
const NEW_POSTS_KEY = "paramee-new-posts";

type Overrides = Record<string, Partial<BlogPost>>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Overrides) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function readNewPosts(): BlogPost[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(NEW_POSTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeNewPosts(list: BlogPost[]) {
  window.localStorage.setItem(NEW_POSTS_KEY, JSON.stringify(list));
}

function slugify(title: string) {
  return `${title}-${Date.now()}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Browser-local fallback store used when Supabase isn't configured. */
export function usePosts() {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [newPosts, setNewPosts] = useState<BlogPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(readOverrides());
    setNewPosts(readNewPosts());
    setReady(true);
  }, []);

  function addPost(input: Omit<BlogPost, "slug">) {
    const post: BlogPost = { ...input, slug: slugify(input.title) };
    setNewPosts((prev) => {
      const next = [post, ...prev];
      writeNewPosts(next);
      return next;
    });
    return post;
  }

  function updatePost(slug: string, patch: Partial<BlogPost>) {
    setOverrides((prev) => {
      const next: Overrides = { ...prev, [slug]: { ...prev[slug], ...patch } };
      writeOverrides(next);
      return next;
    });
  }

  function deletePost(slug: string) {
    setNewPosts((prev) => {
      const next = prev.filter((p) => p.slug !== slug);
      writeNewPosts(next);
      return next;
    });
    updatePost(slug, { isPublished: false });
  }

  const posts: BlogPost[] = [
    ...newPosts,
    ...basePosts.map((p) => ({ ...p, ...overrides[p.slug] })),
  ];

  return { posts, addPost, updatePost, deletePost, ready };
}
