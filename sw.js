
/* sw.js */

const CACHE_NAME = "lalan-portfolio-v4";

/* ----------------------------------------
   Static Assets
---------------------------------------- */

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./offline.html",

    /* CSS */
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

    /* JavaScript */
    "./js/app.js",
    "./js/navbar.js",
    "./js/theme.js",
    "./js/scroll.js",

    /* HTML Components */
    "./components/header.html",
    "./components/sidebar.html",
    "./components/hero.html",
    "./components/about.html",
    "./components/education.html",
    "./components/skills.html",
    "./components/experience.html",
    "./components/projects.html",
    "./components/gallery.html",
    "./components/certificates.html",
    "./components/resume.html",
    "./components/blog.html",
    "./components/dashboard.html",
    "./components/contact.html",
    "./components/footer.html",

    /* Icons */
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/favicon.ico",
    "./assets/icons/favicon.svg"
];


/* ----------------------------------------
   Install Service Worker
---------------------------------------- */

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        await Promise.all(
            STATIC_ASSETS.map(async asset => {
                try {
                    const response = await fetch(asset, {
                        cache: "reload"
                    });

                    if (response.ok) {
                        await cache.put(asset, response);
                    } else {
                        console.warn(
                            "Cache failed:",
                            asset,
                            response.status
                        );
                    }
                } catch (error) {
                    console.warn(
                        "Could not cache:",
                        asset,
                        error
                    );
                }
            })
        );

        await self.skipWaiting();
    })());
});


/* ----------------------------------------
   Activate Service Worker
---------------------------------------- */

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();

        await Promise.all(
            keys
                .filter(key =>
                    key.startsWith("lalan-portfolio-") &&
                    key !== CACHE_NAME
                )
                .map(key => caches.delete(key))
        );

        await self.clients.claim();
    })());
});


/* ----------------------------------------
   Fetch & Offline Support
---------------------------------------- */

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;


    /* Page Navigation */

    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);

                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(
                        request,
                        response.clone()
                    );
                }

                return response;

            } catch {
                return (
                    await caches.match(request) ||
                    await caches.match("./index.html") ||
                    await caches.match("./offline.html") ||
                    new Response(
                        "You are offline. Please reconnect.",
                        {
                            status: 503,
                            headers: {
                                "Content-Type":
                                    "text/plain; charset=utf-8"
                            }
                        }
                    )
                );
            }
        })());

        return;
    }


    /* Static Assets & HTML Components */

    event.respondWith((async () => {
        const cached = await caches.match(request);

        if (cached) return cached;

        try {
            const response = await fetch(request);

            if (response.ok) {
                const cache = await caches.open(CACHE_NAME);

                await cache.put(
                    request,
                    response.clone()
                );
            }

            return response;

        } catch {
            return new Response("", {
                status: 503
            });
        }
    })());
});
