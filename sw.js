/* ==========================================
   SERVICE WORKER
   Lalan Kumar - Premium Portfolio
========================================== */

const CACHE_NAME = "portfolio-v1.0.0";

const ASSETS = [

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

/* Install */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(ASSETS);

        })

    );

    self.skipWaiting();

});

/* Activate */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* Fetch */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response ||

                fetch(event.request)

                .catch(() => {

                    return caches.match("/offline.html");

                });

        })

    );

});