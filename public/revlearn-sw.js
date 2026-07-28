// RevLearn Service Worker v2
// This file must be at /public/revlearn-sw.js

const CACHE = "revlearn-v2";
const SHELL = [
  "/revlearn",
  "/revlearn/",
  "/revlearn/courses",
  "/revlearn/tools",
  "/revlearn/resources",
  "/revlearn/community",
  "/revlearn/profile",
  "/revlearn-manifest.json",
  "/icons/revlearn-icon-192.png",
  "/icons/revlearn-icon-512.png",
];

// Install — cache shell immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(SHELL).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

// Activate — remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for HTML/API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;
  if (request.method !== "GET") return;

  // Images — cache first
  if (/\.(png|jpg|jpeg|webp|gif|svg|ico)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => cached ?? new Response("", { status: 408 }));
        })
      )
    );
    return;
  }

  // Static assets (JS/CSS bundles) — stale while revalidate
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
          return cached ?? fetchPromise;
        })
      )
    );
    return;
  }

  // API — network first, cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).then((res) => {
        if (res.ok) {
          caches.open(CACHE).then((c) => c.put(request, res.clone()));
        }
        return res;
      }).catch(() =>
        caches.match(request).then((cached) =>
          cached ?? new Response(JSON.stringify({ error: "Offline" }), {
            status: 503, headers: { "Content-Type": "application/json" },
          })
        )
      )
    );
    return;
  }

  // HTML pages — network first, fallback to shell
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).then((res) => {
        caches.open(CACHE).then((c) => c.put(request, res.clone()));
        return res;
      }).catch(() =>
        caches.match(request).then((cached) =>
          cached ?? caches.match("/revlearn").then((shell) => shell ?? Response.error())
        )
      )
    );
    return;
  }
});
