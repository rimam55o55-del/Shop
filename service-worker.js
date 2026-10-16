const CACHE = "shop-v5";

const FILES = [
  "/",
  "/index.html",
  "/style.css",
  "/products.js",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(
        FILES.map(url =>
          cache.add(url).catch(() => console.log("cache skip:", url))
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;

  if (req.method !== "GET") return;
  if (!req.url.startsWith(self.location.origin)) return;

  // درخواست‌های API همیشه از شبکه خوانده شوند تا قیمت‌ها تازه بمانند
  if (new URL(req.url).pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(req)
      .then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(req).then(cached => {
          if (cached) return cached;
          if (req.mode === "navigate") return caches.match("/");
        })
      )
  );
});