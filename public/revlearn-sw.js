const SHELL_CACHE = "rl-shell-v3";
const PAGES_CACHE = "rl-pages-v3";
const ALL_CACHES  = [SHELL_CACHE, PAGES_CACHE];

const SHELL_ASSETS = [
  "/revlearn",
  "/revlearn/courses",
  "/revlearn/tools",
  "/revlearn/resources",
  "/revlearn/community",
  "/revlearn-manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      Promise.allSettled(
        SHELL_ASSETS.map((url) => cache.add(url).catch(() => {}))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "offline" }), {
          headers: { "Content-Type": "application/json" }, status: 503,
        })
      )
    );
    return;
  }

  if (url.pathname.startsWith("/revlearn") || url.pathname.startsWith("/fonts")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
        return cached ?? networkFetch.catch(() => {
          if (request.mode === "navigate") return caches.match("/revlearn");
          return new Response("Offline", { status: 503 });
        });
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});