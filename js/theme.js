/* ====================================================================
   js/theme.js - Premium Theme Controller with View Transitions
==================================================================== */

window.addEventListener("portfolioComponentsLoaded", () => {
    // ==========================================
    // DOM ELEMENTS & CONSTANTS
    // ==========================================
    const themeToggle = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const STORAGE_KEY = "lalan-portfolio-theme";
    
    // Theme Colors for Mobile Status Bar (Matches your CSS variables)
    const THEME_COLORS = {
        dark: "#03050a",
        light: "#f8fafc"
    };

    // ==========================================
    // 1. GET INITIAL THEME
    // ==========================================
    const getSavedTheme = () => {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY);
            if (savedTheme === "dark" || savedTheme === "light") {
                return savedTheme;
            }
        } catch (error) {
            console.warn("localStorage is not accessible:", error);
        }

        // Fallback to OS/System preference
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    };

    // ==========================================
    // 2. UPDATE MOBILE STATUS BAR
    // ==========================================
    const updateMetaThemeColor = (theme) => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement("meta");
            metaThemeColor.name = "theme-color";
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.setAttribute("content", THEME_COLORS[theme]);
    };

    // ==========================================
    // 3. CORE THEME APPLICATION
    // ==========================================
    const applyTheme = (theme, skipTransition = false) => {
        // Set Data Attribute for CSS
        root.setAttribute("data-theme", theme);

        const isLight = theme === "light";

        // Update ARIA Attributes for Accessibility
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(isLight));
            themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
            
            // Add a quick animation class to the toggle button itself
            themeToggle.classList.add("theme-switched");
            setTimeout(() => themeToggle.classList.remove("theme-switched"), 500);
        }

        // Save to LocalStorage
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            console.warn("Could not save theme to localStorage:", error);
        }

        // Update Mobile Browser Status Bar
        updateMetaThemeColor(theme);

        // Broadcast Event for other components (like charts or 3D canvases)
        window.dispatchEvent(
            new CustomEvent("portfolioThemeChanged", {
                detail: { theme, isLight }
            })
        );
    };

    // ==========================================
    // 4. ADVANCED TOGGLE WITH VIEW TRANSITION API
    // ==========================================
    const toggleTheme = (event) => {
        const currentTheme = root.getAttribute("data-theme") || "dark";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        // Check if browser supports the modern View Transitions API
        if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            applyTheme(nextTheme);
            return;
        }

        // Optional: Calculate click position for a radial ripple effect (if supported by CSS)
        if (event && event.clientX) {
            const x = event.clientX;
            const y = event.clientY;
            root.style.setProperty('--click-x', `${x}px`);
            root.style.setProperty('--click-y', `${y}px`);
        }

        // Smoothly transition between themes like a Native App
        document.startViewTransition(() => {
            applyTheme(nextTheme);
        });
    };

    // ==========================================
    // 5. CROSS-TAB SYNCHRONIZATION
    // ==========================================
    // If the user changes theme in another tab, update this tab seamlessly
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY && (event.newValue === "dark" || event.newValue === "light")) {
            applyTheme(event.newValue);
        }
    });

    // ==========================================
    // 6. SYSTEM THEME LISTENER
    // ==========================================
    const systemThemeMedia = window.matchMedia("(prefers-color-scheme: light)");
    
    systemThemeMedia.addEventListener("change", (event) => {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY);
            // Only auto-switch if user hasn't manually forced a theme
            if (savedTheme) return;
        } catch (e) {}

        const newSystemTheme = event.matches ? "light" : "dark";
        
        if (document.startViewTransition) {
            document.startViewTransition(() => applyTheme(newSystemTheme));
        } else {
            applyTheme(newSystemTheme);
        }
    });

    // ==========================================
    // 7. INITIALIZATION
    // ==========================================
    
    // Apply theme immediately on load without transition delay
    applyTheme(getSavedTheme(), true);

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    // ==========================================
    // 8. PUBLIC API EXPORT
    // ==========================================
    window.PortfolioTheme = {
        getTheme: () => root.getAttribute("data-theme") || "dark",
        
        setTheme: (theme) => {
            if (theme !== "dark" && theme !== "light") return;
            
            if (document.startViewTransition) {
                document.startViewTransition(() => applyTheme(theme));
            } else {
                applyTheme(theme);
            }
        },
        
        toggle: toggleTheme,
        isLight: () => root.getAttribute("data-theme") === "light"
    };

    console.log("🌓 Premium Theme Engine Initialized");
});
