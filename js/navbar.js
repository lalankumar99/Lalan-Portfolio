/* ====================================================================
   js/navbar.js - Premium Navigation, Scroll & Interaction Controller
==================================================================== */

window.addEventListener("portfolioComponentsLoaded", () => {
    // ==========================================
    // DOM ELEMENTS SELECTION
    // ==========================================
    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mainNavigation = document.getElementById("main-navigation");
    const progressBar = document.getElementById("header-progress-bar");
    
    const sidebar = document.getElementById("site-sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebarClose = document.getElementById("sidebar-close");

    const navigationLinks = document.querySelectorAll(".nav-link, .sidebar-link");
    const sections = document.querySelectorAll("section[id]");
    const magneticElements = document.querySelectorAll(".magnetic-element");

    // ==========================================
    // STATE VARIABLES
    // ==========================================
    let lastScrollTop = 0;
    let isScrolling = false;
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;

    // ==========================================
    // 1. MOBILE MENU & SIDEBAR LOGIC
    // ==========================================
    
    const openMobileMenu = () => {
        if (!menuToggle || !mainNavigation) return;
        
        // CSS में हमने .active क्लास बनाई थी, इसलिए उसे भी टॉगल कर रहे हैं
        mainNavigation.classList.add("is-open", "active");
        menuToggle.classList.add("is-active", "active");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeMobileMenu = () => {
        if (!menuToggle || !mainNavigation) return;

        mainNavigation.classList.remove("is-open", "active");
        menuToggle.classList.remove("is-active", "active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        document.body.style.overflow = ""; // Restore scrolling
    };

    const toggleMobileMenu = () => {
        if (!mainNavigation) return;
        const isOpen = mainNavigation.classList.contains("active");
        isOpen ? closeMobileMenu() : openMobileMenu();
    };

    const openSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.add("is-open", "active");
        
        if (sidebarOverlay) {
            sidebarOverlay.classList.add("is-visible");
            sidebarOverlay.setAttribute("aria-hidden", "false");
        }
        document.body.classList.add("sidebar-open");
    };

    const closeSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.remove("is-open", "active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("is-visible");
            sidebarOverlay.setAttribute("aria-hidden", "true");
        }
        document.body.classList.remove("sidebar-open");
    };

    // ==========================================
    // 2. SMOOTH SCROLL & NAVIGATION CLICK
    // ==========================================
    
    const handleNavigationClick = (event) => {
        const link = event.currentTarget;
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#" || !targetId.startsWith("#")) return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        event.preventDefault(); // Stop default jump

        // Close menus before scrolling
        closeMobileMenu();
        closeSidebar();

        // Calculate position accounting for fixed header height
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    };

    // ==========================================
    // 3. ADVANCED SCROLL LOGIC (Progress, Hide/Show)
    // ==========================================
    
    const onScroll = () => {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // A. Scroll Progress Bar Calculation
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = scrollHeight > 0 ? (currentScrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = `${scrollPercentage}%`;
        }

        if (!header) return;

        // B. Glassmorphism Active State (Scrolled)
        if (currentScrollTop > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // C. Smart Hide/Show Header on Scroll Direction
        if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight * 2) {
            // Scrolling Down - Hide Header
            header.classList.add("hidden-scroll");
        } else {
            // Scrolling Up - Show Header
            header.classList.remove("hidden-scroll");
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    const handleScrollEvent = () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                onScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    };

    // ==========================================
    // 4. SCROLL SPY (Highlight Active Nav Link)
    // ==========================================
    
    const initScrollSpy = () => {
        if (!sections.length || !navigationLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight + 20}px 0px -40% 0px`,
            threshold: 0.2
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute("id");
                    
                    // Remove active class from all links
                    navigationLinks.forEach(link => {
                        link.classList.remove("active");
                        if (link.getAttribute("href") === `#${currentId}`) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    };

    // ==========================================
    // 5. MAGNETIC BUTTON EFFECT (Premium Touch)
    // ==========================================
    
    const initMagneticEffect = () => {
        magneticElements.forEach(elem => {
            elem.addEventListener("mousemove", (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Move the element slightly towards the cursor
                elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            elem.addEventListener("mouseleave", () => {
                // Reset position smoothly
                elem.style.transform = `translate(0px, 0px)`;
            });
        });
    };

    // ==========================================
    // 6. UTILITY EVENT HANDLERS (Click Outside, Keys, Resize)
    // ==========================================
    
    const handleOutsideClick = (event) => {
        if (!mainNavigation || !menuToggle || !mainNavigation.classList.contains("active")) return;

        const clickedNavigation = mainNavigation.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedNavigation && !clickedToggle) {
            closeMobileMenu();
        }
    };

    const handleKeyboard = (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
            closeSidebar();
        }
    };

    const handleResize = () => {
        if (window.innerWidth > 1024) closeMobileMenu(); // Updated breakpoint to match CSS
        if (window.innerWidth > 1200) closeSidebar();
    };

    // ==========================================
    // 7. INITIALIZE ALL LISTENERS
    // ==========================================
    
    if (menuToggle) menuToggle.addEventListener("click", toggleMobileMenu);
    if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

    navigationLinks.forEach(link => {
        link.addEventListener("click", handleNavigationClick);
    });

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeyboard);
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScrollEvent, { passive: true });

    // Initialize Advanced Features
    initScrollSpy();
    
    // Only init magnetic effect on desktop to save battery/performance on mobile
    if (window.matchMedia("(pointer: fine)").matches) {
        initMagneticEffect();
    }
    
    // Run scroll logic once on load to set initial states
    onScroll();

    // ==========================================
    // EXPORT API TO GLOBAL WINDOW
    // ==========================================
    window.PortfolioNavigation = {
        openMobileMenu,
        closeMobileMenu,
        openSidebar,
        closeSidebar,
        toggleMobileMenu
    };
    
    console.log("🚀 Premium Navbar & Scroll Engine Initialized");
});
