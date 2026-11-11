/* ====================================================================
   js/app.js - Ultra-Premium Core Engine, Loader & Animation System
==================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    
    // ==========================================
    // 1. COMPONENT CONFIGURATION
    // ==========================================
    const components = {
        header: "components/header.html",
        sidebar: "components/sidebar.html",
        hero: "components/hero.html",
        about: "components/about.html",
        education: "components/education.html",
        skills: "components/skills.html",
        experience: "components/experience.html",
        projects: "components/projects.html",
        gallery: "components/gallery.html",
        certificates: "components/certificates.html",
        resume: "components/resume.html",
        blog: "components/blog.html",
        dashboard: "components/dashboard.html",
        contact: "components/contact.html",
        footer: "components/footer.html"
    };

    const loader = document.getElementById("loader");
    let loadedCount = 0;
    const totalComponents = Object.keys(components).length;

    // ==========================================
    // 2. ADVANCED COMPONENT LOADER WITH RETRY LOGIC
    // ==========================================
    const loadComponent = async (id, file, retries = 2) => {
        const container = document.getElementById(id);
        if (!container) {
            loadedCount++;
            return; // Container not found in index.html, skip safely
        }

        try {
            const response = await fetch(file, { cache: "force-cache" }); // Use cache for speed
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            container.innerHTML = await response.text();
            
        } catch (error) {
            console.warn(`Attempt failed for ${file}:`, error.message);
            if (retries > 0) {
                console.log(`Retrying ${file}... (${retries} attempts left)`);
                await loadComponent(id, file, retries - 1);
            } else {
                console.error(`Component load totally failed: ${file}`);
                container.innerHTML = `<!-- Failed to load ${id} component -->`;
            }
        } finally {
            loadedCount++;
            updateLoaderProgress();
        }
    };

    // Update loader text/bar (If you want to add a % counter in index.html later)
    const updateLoaderProgress = () => {
        const progress = Math.round((loadedCount / totalComponents) * 100);
        // Example: if you have <div id="loader-text"></div> in index.html
        const loaderText = document.getElementById("loader-text");
        if (loaderText) loaderText.innerText = `${progress}%`;
    };

    // ==========================================
    // 3. CUSTOM MAGNETIC CURSOR LOGIC
    // ==========================================
    const initCustomCursor = () => {
        // Create Cursor Elements if they don't exist
        let cursorDot = document.getElementById("cursor-dot");
        let cursorRing = document.getElementById("cursor-ring");

        if (!cursorDot || !cursorRing) {
            cursorDot = document.createElement("div");
            cursorRing = document.createElement("div");
            cursorDot.id = "cursor-dot";
            cursorRing.id = "cursor-ring";
            
            // Basic inline styles for the cursor (can also be moved to style.css)
            const baseStyles = "position:fixed; top:0; left:0; pointer-events:none; z-index:9999; border-radius:50%; transform:translate(-50%, -50%); transition: opacity 0.3s ease;";
            cursorDot.style.cssText = baseStyles + "width:8px; height:8px; background:var(--primary-light); box-shadow:0 0 10px var(--primary-light); transition: transform 0.1s ease;";
            cursorRing.style.cssText = baseStyles + "width:36px; height:36px; border:1px solid rgba(96, 165, 250, 0.5); transition: transform 0.3s ease-out, width 0.3s ease, height 0.3s ease;";
            
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorRing);
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            // Smoothly move the ring
            cursorRing.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Add hover effects to links and buttons
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .magnetic-element');
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorRing.style.width = "50px";
                cursorRing.style.height = "50px";
                cursorRing.style.background = "rgba(96, 165, 250, 0.1)";
                cursorRing.style.borderColor = "var(--primary)";
            });
            el.addEventListener("mouseleave", () => {
                cursorRing.style.width = "36px";
                cursorRing.style.height = "36px";
                cursorRing.style.background = "transparent";
                cursorRing.style.borderColor = "rgba(96, 165, 250, 0.5)";
            });
        });

        // Hide cursor when it leaves the window
        document.addEventListener("mouseleave", () => {
            cursorDot.style.opacity = "0";
            cursorRing.style.opacity = "0";
        });
        document.addEventListener("mouseenter", () => {
            cursorDot.style.opacity = "1";
            cursorRing.style.opacity = "1";
        });
    };

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const initScrollReveals = () => {
        const revealElements = document.querySelectorAll(
            '.section-header, .card, .project-card, .skill-card, .about-text, .experience-card'
        );

        if (!revealElements.length) return;

        // Apply initial hidden state securely
        revealElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
            el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Slight delay based on element's position for a staggered effect
                    setTimeout(() => {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }, 100);
                    
                    // Stop observing once revealed to save performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: "0px 0px -10% 0px", // Trigger slightly before it hits the bottom
            threshold: 0.1
        });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // ==========================================
    // 5. EXECUTE APP INITIALIZATION
    // ==========================================
    try {
        // Load all components concurrently for maximum speed
        await Promise.all(
            Object.entries(components).map(([id, file]) => loadComponent(id, file))
        );
        
    } finally {
        // 1. Remove Preloader Smoothly
        if (loader) {
            loader.style.opacity = "0";
            loader.style.transition = "opacity 0.6s ease";
            
            setTimeout(() => {
                loader.remove();
                document.body.classList.add("page-ready");
            }, 600);
        } else {
            document.body.classList.add("page-ready");
        }

        // 2. Dispatch Event so navbar.js & theme.js know HTML is ready!
        window.dispatchEvent(new CustomEvent("portfolioComponentsLoaded"));

        // 3. Initialize Advanced Visual Features (after a tiny delay so DOM is parsed)
        setTimeout(() => {
            // Only init custom cursor on desktop devices (saves battery on mobile)
            if (window.matchMedia("(pointer: fine)").matches) {
                initCustomCursor();
            }
            initScrollReveals();
        }, 300);

        // 4. Dynamic Footer Year (if element exists)
        const footerYear = document.getElementById("footer-year");
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }

        console.log("⚡ Ultra-Premium App Engine Successfully Booted!");
    }
});
