/* js/app.js */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const siteHeader = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mainNavigation = document.getElementById("main-navigation");

    const sidebar = document.getElementById("site-sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebarClose = document.getElementById("sidebar-close");

    const contactForm = document.getElementById("contact-form");
    const footerYear = document.getElementById("footer-year");


    const setHeaderState = () => {
        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "is-scrolled",
            window.scrollY > 30
        );
    };


    const closeNavigation = () => {
        if (!menuToggle || !mainNavigation) return;

        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        mainNavigation.classList.remove("is-open");
        body.classList.remove("nav-open");
    };


    const openSidebar = () => {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.add("is-open");
        sidebarOverlay.classList.add("is-visible");
        body.classList.add("sidebar-open");

        sidebarOverlay.setAttribute("aria-hidden", "false");
    };


    const closeSidebar = () => {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.remove("is-open");
        sidebarOverlay.classList.remove("is-visible");
        body.classList.remove("sidebar-open");

        sidebarOverlay.setAttribute("aria-hidden", "true");
    };


    const updateNavigation = () => {
        const sections = document.querySelectorAll("section[id]");
        const navigationLinks = document.querySelectorAll(
            ".nav-link, .sidebar-link"
        );

        if (!sections.length || !navigationLinks.length) return;

        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop =
                section.getBoundingClientRect().top +
                window.scrollY -
                180;

            if (window.scrollY >= sectionTop) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${currentSection}`
            );
        });
    };


    const handleAnchorNavigation = (event) => {
        const link = event.currentTarget;
        const targetId = link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#" ||
            !targetId.startsWith("#")
        ) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerHeight =
            siteHeader?.offsetHeight || 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            15;

        window.scrollTo({
            top: Math.max(targetPosition, 0),
            behavior: "smooth"
        });

        closeNavigation();
        closeSidebar();
    };


    const setupNavigationLinks = () => {
        const links = document.querySelectorAll(
            'a[href^="#"]'
        );

        links.forEach((link) => {
            link.addEventListener(
                "click",
                handleAnchorNavigation
            );
        });
    };


    const setupMobileNavigation = () => {
        if (!menuToggle || !mainNavigation) return;

        menuToggle.addEventListener("click", () => {
            const isOpen =
                mainNavigation.classList.toggle("is-open");

            menuToggle.classList.toggle(
                "is-active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            body.classList.toggle(
                "nav-open",
                isOpen
            );
        });

        document.addEventListener("click", (event) => {
            if (!mainNavigation.classList.contains("is-open")) {
                return;
            }

            const clickedInside =
                mainNavigation.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInside) {
                closeNavigation();
            }
        });
    };


    const setupSidebar = () => {
        if (!sidebar) return;

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener(
                "click",
                closeSidebar
            );
        }

        if (sidebarClose) {
            sidebarClose.addEventListener(
                "click",
                closeSidebar
            );
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeNavigation();
                closeSidebar();
            }
        });
    };


    const setupContactForm = () => {
        if (!contactForm) return;

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const submitButton =
                contactForm.querySelector(
                    ".contact-submit"
                );

            if (!submitButton) return;

            const buttonText =
                submitButton.querySelector("span");

            const originalText =
                buttonText?.textContent ||
                "Send Message";

            if (buttonText) {
                buttonText.textContent = "Message Ready";
            }

            submitButton.classList.add("is-sent");

            window.setTimeout(() => {
                if (buttonText) {
                    buttonText.textContent = originalText;
                }

                submitButton.classList.remove(
                    "is-sent"
                );
            }, 2200);
        });
    };


    const setupFooterYear = () => {
        if (!footerYear) return;

        footerYear.textContent =
            new Date().getFullYear();
    };


    const handleResize = () => {
        if (window.innerWidth > 1000) {
            closeNavigation();
        }
    };


    setHeaderState();
    updateNavigation();

    setupMobileNavigation();
    setupSidebar();
    setupNavigationLinks();
    setupContactForm();
    setupFooterYear();

    window.addEventListener(
        "scroll",
        () => {
            setHeaderState();
            updateNavigation();
        },
        { passive: true }
    );

    window.addEventListener(
        "resize",
        handleResize,
        { passive: true }
    );
});