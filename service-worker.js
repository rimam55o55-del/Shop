const CACHE = "shop-v2";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// نصب: ذخیره فایل‌های اصلی برای کار آفلاین
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// فعال‌سازی: پاک‌کردن کش‌های قدیمی
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

// درخواست‌ها: اول اینترنت، اگر نبود از کش
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // درخواست‌های سایت‌های دیگر (مثل واتساپ) را دست نمی‌زنیم
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});