/* ==========================================
   NAVBAR
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("header");
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const links = document.querySelectorAll(".nav-menu a");

    /* Sticky Header */

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            header.classList.add("sticky");

        } else {

            header.classList.remove("sticky");

        }

    });

    /* Mobile Menu */

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("active");

        });

    }

    /* Active Navigation */

    links.forEach(link => {

        link.addEventListener("click", () => {

            links.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");

        });

    });

});