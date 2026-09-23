/* js/theme.js */

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");

    if (!themeToggle) return;

    const root = document.documentElement;

    const STORAGE_KEY = "lalan-portfolio-theme";


    /* ----------------------------------------
       Get Saved Theme
    ---------------------------------------- */

    const getSavedTheme = () => {
        const savedTheme =
            localStorage.getItem(STORAGE_KEY);

        if (
            savedTheme === "dark" ||
            savedTheme === "light"
        ) {
            return savedTheme;
        }

        return window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches
            ? "light"
            : "dark";
    };


    /* ----------------------------------------
       Apply Theme
    ---------------------------------------- */

    const applyTheme = (theme) => {
        root.setAttribute(
            "data-theme",
            theme
        );

        const isLight =
            theme === "light";

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Switch to dark theme"
                : "Switch to light theme"
        );

        localStorage.setItem(
            STORAGE_KEY,
            theme
        );

        window.dispatchEvent(
            new CustomEvent(
                "portfolioThemeChanged",
                {
                    detail: {
                        theme
                    }
                }
            )
        );
    };


    /* ----------------------------------------
       Toggle Theme
    ---------------------------------------- */

    const toggleTheme = () => {
        const currentTheme =
            root.getAttribute("data-theme") ||
            "dark";

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        applyTheme(nextTheme);
    };


    /* ----------------------------------------
       Initialize
    ---------------------------------------- */

    applyTheme(getSavedTheme());


    /* ----------------------------------------
       Events
    ---------------------------------------- */

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );


    /* ----------------------------------------
       System Theme Changes
       Only applies when user has not
       manually selected a theme.
    ---------------------------------------- */

    const systemTheme =
        window.matchMedia(
            "(prefers-color-scheme: light)"
        );

    systemTheme.addEventListener(
        "change",
        (event) => {
            const savedTheme =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (savedTheme) return;

            applyTheme(
                event.matches
                    ? "light"
                    : "dark"
            );
        }
    );


    /* ----------------------------------------
       Public Theme API
    ---------------------------------------- */

    window.PortfolioTheme = {
        getTheme: () =>
            root.getAttribute(
                "data-theme"
            ),

        setTheme: (theme) => {
            if (
                theme !== "dark" &&
                theme !== "light"
            ) {
                return;
            }

            applyTheme(theme);
        },

        toggle: toggleTheme
    };
});