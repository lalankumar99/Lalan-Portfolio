const CACHE_NAME = "lalan-portfolio-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./css/style.css",
  "./css/header.css",
  "./css/hero.css",
  "./css/about.css",
  "./css/education.css",
  "./css/skills.css",
  "./css/experience.css",
  "./css/projects.css",
  "./css/gallery.css",
  "./css/certificates.css",
  "./css/resume.css",
  "./css/blog.css",
  "./css/dashboard.css",
  "./css/contact.css",
  "./css/footer.css",
  "./css/sidebar.css",
  "./js/app.js",
  "./js/navbar.js",
  "./js/theme.js",
  "./js/scroll.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/favicon.ico",
  "./assets/icons/favicon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(STATIC_ASSETS.map(async asset => {
      try {
        const response = await fetch(asset, { cache: "reload" });
        if (response.ok) await cache.put(asset, response);
      } catch (error) {
        console.warn("Could not cache:", asset, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("lalan-portfolio-") &&
                     key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return await caches.match(request) ||
          await caches.match("./index.html") ||
          await caches.match("./offline.html") ||
          new Response("You are offline. Please reconnect.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response("", { status: 503 });
    }
  })());
});