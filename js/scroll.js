/* ====================================================================
   js/scroll.js - Ultra-Premium Scroll Engine & Momentum Effects
==================================================================== */

window.addEventListener("portfolioComponentsLoaded", () => {
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById("header-progress-bar");
    const backToTop = document.getElementById("backToTop");
    
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const navigationLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"], .sidebar-link[href^="#"]'));
    const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .card, .project-card");
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    
    // ==========================================
    // STATE VARIABLES
    // ==========================================
    let lastScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let ticking = false;
    let scrollVelocity = 0;

    // ==========================================
    // 1. ENHANCED BACK-TO-TOP WITH SVG PROGRESS
    // ==========================================
    const initBackToTop = () => {
        if (!backToTop) return;

        // Create SVG Ring for Circular Progress
        backToTop.innerHTML = `
            <svg class="progress-ring" width="100%" height="100%" viewBox="0 0 100 100" style="position:absolute; top:0; left:0; transform: rotate(-90deg); pointer-events:none;">
                <circle class="progress-ring-track" cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
                <circle class="progress-ring-circle" cx="50" cy="50" r="46" fill="transparent" stroke="var(--cyan-light)" stroke-width="4" stroke-dasharray="289" stroke-dashoffset="289" stroke-linecap="round" style="transition: stroke-dashoffset 0.1s ease-out;"/>
            </svg>
            <i class="fas fa-arrow-up" style="position:relative; z-index:2;"></i>
        `;

        backToTop.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; 
            border-radius: 50%; background: rgba(12, 19, 36, 0.7); backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: center; color: #fff;
            opacity: 0; visibility: hidden; transform: translateY(20px) scale(0.9);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 999; cursor: pointer;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05);
        `;

        backToTop.addEventListener("mouseenter", () => {
            backToTop.style.transform = "translateY(0) scale(1.1)";
            backToTop.style.background = "rgba(59, 130, 246, 0.2)";
            backToTop.style.borderColor = "var(--primary-light)";
            backToTop.style.boxShadow = "0 15px 35px rgba(59, 130, 246, 0.3), 0 0 15px rgba(6, 182, 212, 0.5) inset";
        });

        backToTop.addEventListener("mouseleave", () => {
            backToTop.style.transform = "translateY(0) scale(1)";
            backToTop.style.background = "rgba(12, 19, 36, 0.7)";
            backToTop.style.borderColor = "rgba(255, 255, 255, 0.05)";
            backToTop.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
        });

        backToTop.addEventListener("click", (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    // ==========================================
    // 2. MAIN SCROLL RENDER LOOP (60fps Optimized)
    // ==========================================
    const renderScrollEffects = () => {
        currentScrollY = window.scrollY;
        
        // Calculate Velocity (Speed of scrolling)
        scrollVelocity = currentScrollY - lastScrollY;
        
        // Get Total Scrollable Height
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = documentHeight > 0 ? currentScrollY / documentHeight : 0;

        // A. Linear Progress Bar Update
        if (progressBar) {
            progressBar.style.width = `${Math.min(Math.max(scrollProgress * 100, 0), 100)}%`;
        }

        // B. Circular Progress Bar Update (Back to Top)
        if (backToTop) {
            const circle = backToTop.querySelector(".progress-ring-circle");
            if (circle) {
                const circumference = 2 * Math.PI * 46; // r=46
                const offset = circumference - (scrollProgress * circumference);
                circle.style.strokeDashoffset = offset;
            }

            // Show/Hide Logic
            if (currentScrollY > 400) {
                backToTop.style.opacity = "1";
                backToTop.style.visibility = "visible";
                if(!backToTop.matches(':hover')) {
                    backToTop.style.transform = "translateY(0) scale(1)";
                }
            } else {
                backToTop.style.opacity = "0";
                backToTop.style.visibility = "hidden";
                backToTop.style.transform = "translateY(20px) scale(0.9)";
            }
        }

        // C. Parallax Elements Update
        if (parallaxElements.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
                // Only animate if element is somewhat in viewport
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = (window.innerHeight - rect.top) * speed;
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        }

        // D. Header Glassmorphism State
        if (header) {
            header.classList.toggle("is-scrolled", currentScrollY > 50);
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    // ==========================================
    // 3. SCROLL SPY (Active Nav Link)
    // ==========================================
    const updateActiveNavigation = () => {
        if (!sections.length) return;

        // Use the middle of the screen for accurate section detection
        const triggerPoint = window.scrollY + (window.innerHeight * 0.4);
        let currentSectionId = sections[0].id;

        sections.forEach((section) => {
            if (triggerPoint >= section.offsetTop) {
                currentSectionId = section.id;
            }
        });

        navigationLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    // ==========================================
    // 4. SMART REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const setupRevealObserver = () => {
        if (!revealElements.length) return;

        // Fallback for reduced motion or old browsers
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
            revealElements.forEach(el => {
                el.style.opacity = "1";
                el.style.transform = "none";
                el.classList.add("is-visible");
            });
            return;
        }

        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -10% 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Add visibility class
                    el.classList.add("is-visible");
                    
                    // Optional: Custom inline style animation if classes aren't defined in CSS
                    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-up')) {
                        el.style.animation = `hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
                    }
                    
                    observer.unobserve(el);
                }
            });
        }, revealOptions);

        revealElements.forEach((el, index) => {
            // Apply initial hidden state dynamically if not in CSS
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-up')) {
                el.style.opacity = "0";
            }
            revealObserver.observe(el);
        });
    };

    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(renderScrollEffects);
            ticking = true;
        }
    };

    // Debounce navigation update to save performance
    let navTimeout;
    const handleScrollForNav = () => {
        if (navTimeout) clearTimeout(navTimeout);
        navTimeout = setTimeout(updateActiveNavigation, 50);
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    initBackToTop();
    setupRevealObserver();
    
    // Initial calls
    renderScrollEffects();
    updateActiveNavigation();

    // Attach events
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScrollForNav, { passive: true });
    window.addEventListener("resize", () => {
        renderScrollEffects();
        updateActiveNavigation();
    }, { passive: true });

    console.log("🌀 Ultra-Premium Scroll Engine Initialized");
});
