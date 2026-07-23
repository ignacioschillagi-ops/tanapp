/* Simple offline-first service worker for the static app shell.
   Live chat (Groq) and library live-lookup (verbe.cc) requests are always
   fetched fresh from the network since they need to be up to date. */
const CACHE_NAME = "tanapp-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./icons.js",
  "./conjugator.js",
  "./stats.js",
  "./exercise.js",
  "./library.js",
  "./chat.js",
  "./cards.js",
  "./data/sentences.js",
  "./data/vocab.js",
  "./data/verb_es.js",
  "./data/verbs120.json",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // never cache calls to Groq or the live verb-conjugation API
  if (url.hostname.includes("groq.com") || url.hostname.includes("verbe.cc")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        if (event.request.method === "GET" && resp.ok && url.origin === self.location.origin) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
