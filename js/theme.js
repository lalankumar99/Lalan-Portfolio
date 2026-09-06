/* ==========================================
   LALAN KUMAR - PREMIUM PORTFOLIO
   THEME SWITCHER
========================================== */

"use strict";


// ==========================================
// THEME SWITCHER
// ==========================================

(function () {


    // ==========================================
    // GET CURRENT THEME
    // ==========================================

    function getSavedTheme() {

        return localStorage.getItem("theme") || "dark";

    }


    // ==========================================
    // UPDATE THEME BUTTON
    // ==========================================

    function updateThemeButtons() {

        const themeBtn =
            document.getElementById("themeToggle");

        const sidebarThemeBtn =
            document.getElementById(
                "themeToggleSidebar"
            );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        // ------------------------------------------
        // Header Theme Button
        // ------------------------------------------

        if (themeBtn) {

            themeBtn.innerHTML = isLight
                ? '<i class="fas fa-sun" aria-hidden="true"></i>'
                : '<i class="fas fa-moon" aria-hidden="true"></i>';


            themeBtn.setAttribute(
                "aria-pressed",
                String(isLight)
            );


            themeBtn.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to Dark Theme"
                    : "Switch to Light Theme"
            );

        }


        // ------------------------------------------
        // Sidebar Theme Button
        // ------------------------------------------

        if (sidebarThemeBtn) {

            sidebarThemeBtn.innerHTML = isLight
                ? '<i class="fas fa-sun" aria-hidden="true"></i><span>Light Theme</span>'
                : '<i class="fas fa-moon" aria-hidden="true"></i><span>Dark Theme</span>';


            sidebarThemeBtn.setAttribute(
                "aria-pressed",
                String(isLight)
            );


            sidebarThemeBtn.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to Dark Theme"
                    : "Switch to Light Theme"
            );

        }

    }


    // ==========================================
    // APPLY SAVED THEME
    // ==========================================

    function applySavedTheme() {

        const savedTheme =
            getSavedTheme();


        if (savedTheme === "light") {

            document.body.classList.add(
                "light-theme"
            );

        } else {

            document.body.classList.remove(
                "light-theme"
            );

        }

    }


    // ==========================================
    // TOGGLE THEME
    // ==========================================

    function toggleTheme() {

        const isLight =
            document.body.classList.toggle(
                "light-theme"
            );


        const newTheme =
            isLight
                ? "light"
                : "dark";


        // Save theme

        localStorage.setItem(
            "theme",
            newTheme
        );


        // Update both buttons

        updateThemeButtons();


        console.log(
            `[Theme] Switched to ${newTheme} theme.`
        );

    }


    // ==========================================
    // INITIALIZE THEME
    // ==========================================

    function initializeTheme() {

        applySavedTheme();

        updateThemeButtons();


        // ------------------------------------------
        // Header Button
        // ------------------------------------------

        const themeBtn =
            document.getElementById(
                "themeToggle"
            );


        if (themeBtn) {

            themeBtn.addEventListener(
                "click",
                toggleTheme
            );

        }


        // ------------------------------------------
        // Sidebar Button
        // ------------------------------------------

        const sidebarThemeBtn =
            document.getElementById(
                "themeToggleSidebar"
            );


        if (sidebarThemeBtn) {

            sidebarThemeBtn.addEventListener(
                "click",
                toggleTheme
            );

        }


        console.log(
            "[Theme] Initialized successfully."
        );

    }


    // ==========================================
    // WAIT FOR COMPONENTS
    // ==========================================

    document.addEventListener(
        "componentsLoaded",
        initializeTheme,
        { once: true }
    );


})();
