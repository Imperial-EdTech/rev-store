"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category, Tool, Resource, Post, Comment } from "@/lib/revlearn-types";
import { getActiveProfile, type StoredProfile } from "@/lib/revlearn-profiles";

export function useRevLearnContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/revlearn/content");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed to load.");
      setCategories(body.categories ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { categories, loading, error, reload: load };
}

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/revlearn/tools");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed.");
      setTools(body.tools ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { tools, loading, error, reload: load };
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/revlearn/resources");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed.");
      setResources(body.resources ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { resources, loading, error, reload: load };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/revlearn/posts");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Failed.");
      setPosts(body.posts ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { posts, loading, error, reload: load };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/revlearn/comments?postId=${postId}`);
      const body = await res.json();
      setComments(body.comments ?? []);
    } catch {}
    finally { setLoading(false); }
  }, [postId]);

  useEffect(() => { load(); }, [load]);
  return { comments, loading, reload: load };
}

export function useProfile() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getActiveProfile());
    setMounted(true);
  }, []);

  const update = useCallback((p: StoredProfile) => {
    setProfile(p);
  }, []);

  return { profile, update, mounted };
}

const PROGRESS_KEY = "rl_progress_v1";
type ProgressMap = Record<string, boolean>;

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try { setProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}")); } catch {}
  }, []);

  const markComplete = useCallback((id: string) => {
    setProgress(prev => {
      const next = { ...prev, [id]: true };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markIncomplete = useCallback((id: string) => {
    setProgress(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isComplete = useCallback((id: string) => !!progress[id], [progress]);
  const completedCount = Object.values(progress).filter(Boolean).length;
  return { isComplete, markComplete, markIncomplete, completedCount };
}

const LIKES_KEY = "rl_liked_posts_v1";

export function useLikedPosts() {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
      setLiked(new Set(arr));
    } catch {}
  }, []);

  const toggle = useCallback((postId: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      localStorage.setItem(LIKES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { liked, toggle };
}

export type SearchResult =
  | { kind: "course"; categoryId: string; categoryTitle: string; id: string; title: string; description: string; sourceName: string }
  | { kind: "tool"; id: string; title: string; description: string; partnerName: string }
  | { kind: "resource"; id: string; title: string; description: string; type: string; audience: string };

export function globalSearch(
  categories: Category[],
  tools: Tool[],
  resources: Resource[],
  query: string
): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: SearchResult[] = [];

  for (const cat of categories) {
    for (const course of cat.courses) {
      if ([course.title, course.description, course.sourceName, ...(course.tags ?? [])]
        .join(" ").toLowerCase().includes(q))
        results.push({ kind: "course", categoryId: cat.id, categoryTitle: cat.title, id: course.id, title: course.title, description: course.description, sourceName: course.sourceName });
    }
  }
  for (const tool of tools) {
    if ([tool.name, tool.description, tool.partnerName, tool.category]
      .join(" ").toLowerCase().includes(q))
      results.push({ kind: "tool", id: tool.id, title: tool.name, description: tool.description, partnerName: tool.partnerName });
  }
  for (const r of resources) {
    if ([r.title, r.description, r.sourceName, ...(r.tags ?? [])]
      .join(" ").toLowerCase().includes(q))
      results.push({ kind: "resource", id: r.id, title: r.title, description: r.description, type: r.type, audience: r.audience });
  }
  return results;
}