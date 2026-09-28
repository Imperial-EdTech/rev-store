import type { LocalProfile } from "@/lib/revlearn/types";

const PROFILES_KEY = "rl_profiles_v1";
const ACTIVE_KEY   = "rl_active_profile_v1";

export type StoredProfile = LocalProfile & { id: string };

export function getProfiles(): StoredProfile[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) ?? "[]");
  } catch { return []; }
}

export function saveProfiles(profiles: StoredProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveProfile(): StoredProfile | null {
  const profiles = getProfiles();
  if (!profiles.length) return null;
  const id = getActiveProfileId();
  return profiles.find(p => p.id === id) ?? profiles[0];
}

export function upsertProfile(profile: StoredProfile): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) profiles[idx] = profile;
  else profiles.push(profile);
  saveProfiles(profiles);
}

export function deleteProfile(id: string): void {
  const profiles = getProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  if (getActiveProfileId() === id && profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}