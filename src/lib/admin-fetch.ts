"use client";

/**
 * fetch() for admin screens. If the session has expired (401), sends the
 * user to the login page and returns to where they were after signing in.
 */
export async function adminFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401 && typeof window !== "undefined") {
    const next = window.location.pathname + window.location.search;
    window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`);
  }
  return response;
}

export async function signOutAdmin(): Promise<void> {
  await fetch("/api/auth/admin", { method: "DELETE" });
  window.location.assign("/admin/login");
}
