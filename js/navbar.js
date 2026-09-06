/* ==========================================
   LALAN KUMAR - PREMIUM PORTFOLIO
   NAVBAR CONTROLLER
========================================== */

(function () {

    "use strict";


    // ==========================================
    // NAVBAR INITIALIZATION
    // ==========================================

    function initializeNavbar() {

        const header =
            document.getElementById("header");

        const menuBtn =
            document.getElementById("menuBtn");

        const sidebar =
            document.getElementById("sidebar");


        // ------------------------------------------
        // Check Header
        // ------------------------------------------

        if (!header) {

            console.warn(
                "[Navbar] Header element not found."
            );

            return;

        }


        // ==========================================
        // STICKY HEADER
        // ==========================================

        function updateStickyHeader() {

            if (window.scrollY > 80) {

                header.classList.add("sticky");

            } else {

                header.classList.remove("sticky");

            }

        }


        // Run once on initialization

        updateStickyHeader();


        // Listen for scrolling

        window.addEventListener(
            "scroll",
            updateStickyHeader,
            { passive: true }
        );


        // ==========================================
        // MOBILE MENU
        // ==========================================

        if (menuBtn && sidebar) {

            menuBtn.addEventListener(
                "click",
                function () {

                    const isActive =
                        sidebar.classList.toggle("active");


                    // Accessibility

                    menuBtn.setAttribute(
                        "aria-expanded",
                        String(isActive)
                    );


                    sidebar.setAttribute(
                        "aria-hidden",
                        String(!isActive)
                    );

                }
            );

        } else {

            console.warn(
                "[Navbar] Menu button or sidebar not found."
            );

        }


        // ==========================================
        // NAVIGATION LINKS
        // ==========================================

        const links =
            document.querySelectorAll(
                ".nav-menu a"
            );


        if (!links.length) {

            console.warn(
                "[Navbar] Navigation links not found."
            );

        }


        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    // Remove active class

                    links.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Add active class

                    link.classList.add(
                        "active"
                    );


                    // Close mobile sidebar

                    if (sidebar) {

                        sidebar.classList.remove(
                            "active"
                        );

                    }


                    // Update accessibility state

                    if (menuBtn) {

                        menuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                    if (sidebar) {

                        sidebar.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    }

                }
            );

        });


        console.log(
            "[Navbar] Initialized successfully."
        );

    }


    // ==========================================
    // WAIT FOR COMPONENTS
    // ==========================================

    document.addEventListener(
        "componentsLoaded",
        function () {

            initializeNavbar();

        },
        { once: true }
    );


})();
