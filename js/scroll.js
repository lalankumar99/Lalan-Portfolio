/* js/scroll.js */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById(
        "header-progress-bar"
    );

    const sections = Array.from(
        document.querySelectorAll("section[id]")
    );

    const navigationLinks = Array.from(
        document.querySelectorAll(
            '.nav-link[href^="#"], .sidebar-link[href^="#"]'
        )
    );

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-up, .reveal-left, .reveal-right"
    );


    /* ----------------------------------------
       Header Scroll State
    ---------------------------------------- */

    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 40
        );
    };


    /* ----------------------------------------
       Scroll Progress
    ---------------------------------------- */

    const updateProgress = () => {
        if (!progressBar) return;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {
            progressBar.style.width = "0%";
            return;
        }

        const progress =
            (window.scrollY / documentHeight) * 100;

        progressBar.style.width =
            `${Math.min(Math.max(progress, 0), 100)}%`;
    };


    /* ----------------------------------------
       Active Navigation
    ---------------------------------------- */

    const updateActiveNavigation = () => {
        if (!sections.length) return;

        const scrollPosition =
            window.scrollY +
            Math.min(window.innerHeight * 0.3, 220);

        let currentSection = sections[0].id;

        sections.forEach((section) => {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach((link) => {
            const href = link.getAttribute("href");

            const isActive =
                href === `#${currentSection}`;

            link.classList.toggle(
                "active",
                isActive
            );
        });
    };


    /* ----------------------------------------
       Reveal Animations
    ---------------------------------------- */

    const setupRevealObserver = () => {
        if (!revealElements.length) return;

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    };


    /* ----------------------------------------
       Back To Top
    ---------------------------------------- */

    const backToTop =
        document.querySelector(
            ".back-to-top"
        );

    const updateBackToTop = () => {
        if (!backToTop) return;

        backToTop.classList.toggle(
            "is-visible",
            window.scrollY > 500
        );
    };


    if (backToTop) {
        backToTop.addEventListener(
            "click",
            (event) => {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* ----------------------------------------
       Scroll Handler
    ---------------------------------------- */

    let ticking = false;

    const handleScroll = () => {
        if (ticking) return;

        window.requestAnimationFrame(() => {
            updateHeader();
            updateProgress();
            updateActiveNavigation();
            updateBackToTop();

            ticking = false;
        });

        ticking = true;
    };


    /* ----------------------------------------
       Initial State
    ---------------------------------------- */

    updateHeader();
    updateProgress();
    updateActiveNavigation();
    updateBackToTop();

    setupRevealObserver();


    /* ----------------------------------------
       Events
    ---------------------------------------- */

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        () => {
            updateProgress();
            updateActiveNavigation();
        },
        { passive: true }
    );
});