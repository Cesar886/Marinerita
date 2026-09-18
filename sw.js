const IMAGE_CACHE = 'marinerita-images-v2';
const MOBILE_IMAGES = [
  './assets/img/optimized/IMG-20260917-WA0023-480.webp',
  './assets/img/optimized/1789755074100-480.webp',
  './assets/img/optimized/IMG-20260917-WA0022-480.webp',
  './assets/img/optimized/1789755073861-480.webp',
  './assets/img/optimized/1789755074062-480.webp',
  './assets/img/optimized/1789755074016-480.webp',
  './assets/img/optimized/IMG-20260905-WA0020-480.webp',
  './assets/img/optimized/IMG-20260905-WA0021-480.webp',
  './assets/img/optimized/1789755073804-480.webp',
  './assets/img/optimized/IMG-20260905-WA0023-480.webp',
  './assets/img/optimized/IMG-20260905-WA0022-480.webp'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(IMAGE_CACHE).then((cache) => cache.addAll(MOBILE_IMAGES))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('marinerita-images-') && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    !url.pathname.includes('/assets/img/optimized/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || !response.ok) return response;

        const copy = response.clone();
        caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
