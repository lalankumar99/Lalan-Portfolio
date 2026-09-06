/* ==========================================
   LALAN KUMAR - PREMIUM PORTFOLIO
   NAVBAR CONTROLLER
========================================== */

"use strict";


// ==========================================
// INITIALIZE NAVBAR
// ==========================================

function initializeNavbar() {

    const header = document.getElementById("header");
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    const links = document.querySelectorAll(
        ".desktop-nav a"
    );


    // ==========================================
    // HEADER CHECK
    // ==========================================

    if (!header) {

        console.warn(
            "[Navbar] Header not found."
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


    // Run once

    updateStickyHeader();


    // Run while scrolling

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

                const isOpen =
                    sidebar.classList.toggle("active");


                // Accessibility

                menuBtn.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                menuBtn.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close Navigation Menu"
                        : "Open Navigation Menu"
                );

                sidebar.setAttribute(
                    "aria-hidden",
                    String(!isOpen)
                );

            }
        );

    } else {

        console.warn(
            "[Navbar] Mobile menu elements not found."
        );

    }


    // ==========================================
    // DESKTOP NAVIGATION
    // ==========================================

    if (links.length > 0) {

        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    // Remove active class
                    // from every navigation link

                    links.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Add active class
                    // to clicked link

                    link.classList.add(
                        "active"
                    );


                    // Close mobile sidebar
                    // after navigation

                    if (sidebar) {

                        sidebar.classList.remove(
                            "active"
                        );

                    }


                    // Reset menu button

                    if (menuBtn) {

                        menuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        menuBtn.setAttribute(
                            "aria-label",
                            "Open Navigation Menu"
                        );

                    }


                    // Reset sidebar accessibility

                    if (sidebar) {

                        sidebar.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    }

                }
            );

        });

    } else {

        console.warn(
            "[Navbar] Desktop navigation links not found."
        );

    }


    // ==========================================
    // CLOSE SIDEBAR WHEN CLICKING OUTSIDE
    // ==========================================

    document.addEventListener(
        "click",
        function (event) {

            if (!sidebar || !menuBtn) {

                return;

            }


            const clickedInsideSidebar =
                sidebar.contains(event.target);

            const clickedMenuButton =
                menuBtn.contains(event.target);


            if (
                !clickedInsideSidebar &&
                !clickedMenuButton
            ) {

                sidebar.classList.remove(
                    "active"
                );


                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuBtn.setAttribute(
                    "aria-label",
                    "Open Navigation Menu"
                );

                sidebar.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


    // ==========================================
    // ESCAPE KEY
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {

                return;

            }


            if (!sidebar || !menuBtn) {

                return;

            }


            sidebar.classList.remove(
                "active"
            );


            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.setAttribute(
                "aria-label",
                "Open Navigation Menu"
            );

            sidebar.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );


    // ==========================================
    // INITIAL ACCESSIBILITY STATE
    // ==========================================

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


    // ==========================================
    // SUCCESS MESSAGE
    // ==========================================

    console.log(
        "[Navbar] Initialized successfully."
    );

}


// ==========================================
// WAIT FOR DYNAMIC COMPONENTS
// ==========================================
//
// app.js loads header.html and sidebar.html
// dynamically. Therefore navbar.js must wait
// until componentsLoaded is fired.
// ==========================================

document.addEventListener(
    "componentsLoaded",
    initializeNavbar,
    { once: true }
);
