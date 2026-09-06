/* ==========================================
   LALAN KUMAR - PREMIUM PORTFOLIO
   SCROLL FUNCTIONS
========================================== */

"use strict";


// ==========================================
// SCROLL CONTROLLER
// ==========================================

(function () {


    // ==========================================
    // ELEMENTS
    // ==========================================

    const progress =
        document.getElementById("scroll-progress");

    const backToTop =
        document.getElementById("backToTop");


    // ==========================================
    // UPDATE SCROLL UI
    // ==========================================

    function updateScrollUI() {

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop ||
            0;


        const documentHeight =
            document.documentElement.scrollHeight;


        const viewportHeight =
            document.documentElement.clientHeight;


        const scrollableHeight =
            documentHeight - viewportHeight;


        // ==========================================
        // SCROLL PROGRESS
        // ==========================================

        if (progress) {

            let percentage = 0;


            if (scrollableHeight > 0) {

                percentage =
                    (scrollTop / scrollableHeight) * 100;

            }


            // Keep value between 0 and 100

            percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        percentage
                    )
                );


            progress.style.width =
                percentage + "%";

        }


        // ==========================================
        // BACK TO TOP
        // ==========================================

        if (backToTop) {

            if (scrollTop > 300) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );

            }

        }

    }


    // ==========================================
    // OPTIMIZED SCROLL EVENT
    // ==========================================

    let ticking = false;


    function handleScroll() {

        if (!ticking) {

            window.requestAnimationFrame(
                function () {

                    updateScrollUI();

                    ticking = false;

                }
            );


            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );


    // ==========================================
    // BACK TO TOP
    // ==========================================

    if (backToTop) {

        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    // ==========================================
    // INITIAL UPDATE
    // ==========================================

    updateScrollUI();


    // ==========================================
    // SUCCESS MESSAGE
    // ==========================================

    console.log(
        "[Scroll] Initialized successfully."
    );


})();
