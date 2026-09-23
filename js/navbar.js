/* js/navbar.js */

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mainNavigation = document.getElementById("main-navigation");

    const sidebar = document.getElementById("site-sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebarClose = document.getElementById("sidebar-close");

    const navigationLinks = document.querySelectorAll(
        ".nav-link, .sidebar-link"
    );


    const openMobileMenu = () => {
        if (!menuToggle || !mainNavigation) return;

        mainNavigation.classList.add("is-open");
        menuToggle.classList.add("is-active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add("nav-open");
    };


    const closeMobileMenu = () => {
        if (!menuToggle || !mainNavigation) return;

        mainNavigation.classList.remove("is-open");
        menuToggle.classList.remove("is-active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("nav-open");
    };


    const toggleMobileMenu = () => {
        if (!mainNavigation) return;

        const isOpen =
            mainNavigation.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };


    const openSidebar = () => {
        if (!sidebar) return;

        sidebar.classList.add("is-open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("is-visible");
            sidebarOverlay.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        document.body.classList.add("sidebar-open");
    };


    const closeSidebar = () => {
        if (!sidebar) return;

        sidebar.classList.remove("is-open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("is-visible");
            sidebarOverlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        document.body.classList.remove("sidebar-open");
    };


    const handleNavigationClick = (event) => {
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

        closeMobileMenu();
        closeSidebar();
    };


    const handleOutsideClick = (event) => {
        if (
            !mainNavigation ||
            !menuToggle ||
            !mainNavigation.classList.contains("is-open")
        ) {
            return;
        }

        const clickedNavigation =
            mainNavigation.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        if (!clickedNavigation && !clickedToggle) {
            closeMobileMenu();
        }
    };


    const handleKeyboard = (event) => {
        if (event.key !== "Escape") return;

        closeMobileMenu();
        closeSidebar();
    };


    const handleResize = () => {
        if (window.innerWidth > 1000) {
            closeMobileMenu();
        }

        if (window.innerWidth > 1200) {
            closeSidebar();
        }
    };


    if (menuToggle) {
        menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );
    }


    if (sidebarClose) {
        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );
    }


    if (sidebarOverlay) {
        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    navigationLinks.forEach((link) => {
        link.addEventListener(
            "click",
            handleNavigationClick
        );
    });


    document.addEventListener(
        "click",
        handleOutsideClick
    );

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

    window.addEventListener(
        "resize",
        handleResize,
        { passive: true }
    );


    window.PortfolioNavigation = {
        openMobileMenu,
        closeMobileMenu,
        openSidebar,
        closeSidebar,
        toggleMobileMenu
    };
});