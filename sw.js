const CACHE_NAME = "lalan-portfolio-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",

  "/css/style.css",
  "/css/responsive.css",
  "/css/animation.css",

  "/js/app.js",
  "/js/navbar.js",
  "/js/theme.js",
  "/js/scroll.js",

  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

/* ================================
   INSTALL
================================ */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );

  self.skipWaiting();
});


/* ================================
   ACTIVATE
================================ */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );

  self.clients.claim();
});


/* ================================
   FETCH
================================ */

self.addEventListener("fetch", event => {

  // केवल GET requests handle करें
  if (event.request.method !== "GET") {
    return;
  }

  // HTML/navigation requests
  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          // Successful page को cache करें
          if (response.ok) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }

          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedPage => {
              return cachedPage || caches.match("/offline.html");
            });
        })
    );

    return;
  }


  // CSS, JS, images आदि
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {

            if (response.ok) {
              const responseClone = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }

            return response;
          });
      })
      .catch(() => {
        return caches.match("/offline.html");
      })
  );

});
