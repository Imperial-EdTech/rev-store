import type { LocalProfile } from "@/lib/revlearn-types";

const PROFILE_KEY = "rl_profile_v1";

const AVATAR_COLORS = [
  "#e85d04", "#d62828", "#023e8a", "#1b4332",
  "#7b2d8b", "#0077b6", "#b5451b", "#344e41",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export function loadProfile(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null"); }
  catch { return null; }
}

export function saveProfile(profile: LocalProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function normaliseEmbedUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      let id = url.searchParams.get("v");
      if (!id && url.hostname === "youtu.be") id = url.pathname.slice(1);
      if (!id && url.pathname.startsWith("/embed/")) return raw;
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
    if (url.hostname === "drive.google.com") {
      const m = url.pathname.match(/\/file\/d\/([^/]+)/);
      if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    }
    if (url.hostname === "docs.google.com")
      return raw.replace(/\/edit(\?.*)?$/, "/embed").replace(/\/view(\?.*)?$/, "/embed");
    if (url.hostname.includes("loom.com")) {
      const id = url.pathname.split("/").pop();
      if (id) return `https://www.loom.com/embed/${id}`;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.slice(1);
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return raw;
  } catch { return raw; }
}

export function deriveSourceName(raw: string): string {
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) return "YouTube";
    if (url.hostname.includes("drive.google.com")) return "Google Drive";
    if (url.hostname.includes("docs.google.com")) return "Google Docs";
    if (url.hostname.includes("loom.com")) return "Loom";
    if (url.hostname.includes("vimeo.com")) return "Vimeo";
    if (url.hostname.includes("coursera.org")) return "Coursera";
    if (url.hostname.includes("udemy.com")) return "Udemy";
    if (url.hostname.includes("khanacademy.org")) return "Khan Academy";
    if (url.hostname.includes("canva.com")) return "Canva";
    return url.hostname.replace(/^www\./, "");
  } catch { return "External"; }
}

export function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getYoutubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
      if (!id && u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2]?.split("?")[0] ?? null;
    }
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  } catch {}
  return null;
}

export function timeAgo(date: string): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}