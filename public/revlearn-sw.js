const CACHE = "revlearn-v2";
const SHELL = ["/revlearn"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(SHELL.map(u => c.add(u).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && res.type === "basic" && url.pathname.startsWith("/revlearn")) {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (request.mode === "navigate") return caches.match("/revlearn");
        return new Response("Offline", { status: 503 });
      });
    })
  );
});