/* Service worker for the static app shell, network-first: whenever there is
   internet, every same-origin file (index.html, css, js, data) is always
   fetched fresh so a new deploy shows up immediately on next reload -- the
   cache is just a fallback for when the phone/computer is offline. Live
   chat (Groq) and library live-lookup (verbe.cc) requests are never cached
   at all, they always need to be fresh/interactive. */
const CACHE_NAME = "tanapp-v5";
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
  "./dictionary.js",
  "./cards.js",
  "./data/sentences.js",
  "./data/vocab.js",
  "./data/verb_es.js",
  "./data/verbs120.json",
  "./manifest.json",
  "./assets/logo-header.svg",
  "./assets/logo-icon.svg",
  "./icons/favicon-32.png",
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
  // only handle our own same-origin GET requests here; let everything else
  // (e.g. the Google Fonts CSS/font files) go straight to the network
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
