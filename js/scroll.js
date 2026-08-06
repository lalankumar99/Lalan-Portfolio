/* ==========================================
   SCROLL FUNCTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const progress =
        document.getElementById("scroll-progress");

    const backToTop =
        document.getElementById("backToTop");

    /* Scroll Progress */

    window.addEventListener("scroll", () => {

        const scrollTop =
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const percentage =
            (scrollTop / scrollHeight) * 100;

        if (progress) {

            progress.style.width =
                percentage + "%";

        }

        /* Back To Top */

        if (backToTop) {

            if (scrollTop > 300) {

                backToTop.classList.add("show");

            } else {

                backToTop.classList.remove("show");

            }

        }

    });

    /* Scroll To Top */

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

    }

});