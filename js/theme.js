/* ==========================================
   THEME SWITCHER
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const themeBtn = document.getElementById("themeToggle");
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        body.classList.add("light-theme");
    }

    // Toggle theme
    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            body.classList.toggle("light-theme");

            if (body.classList.contains("light-theme")) {

                localStorage.setItem("theme", "light");

                themeBtn.innerHTML =
                    '<i class="fas fa-sun"></i>';

            } else {

                localStorage.setItem("theme", "dark");

                themeBtn.innerHTML =
                    '<i class="fas fa-moon"></i>';

            }

        });

    }

});