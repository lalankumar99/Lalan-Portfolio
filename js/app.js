document.addEventListener("DOMContentLoaded", async () => {
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

    const loadComponent = async (id, file) => {
        const container = document.getElementById(id);

        if (!container) return;

        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(
                    `${file} returned ${response.status}`
                );
            }

            container.innerHTML = await response.text();
        } catch (error) {
            console.error(`Component load failed: ${file}`, error);

            container.innerHTML = "";
        }
    };

    try {
        await Promise.all(
            Object.entries(components).map(
                ([id, file]) => loadComponent(id, file)
            )
        );
    } finally {
        document.body.classList.add("page-ready");

        if (loader) {
            loader.classList.add("is-hidden");

            setTimeout(() => {
                loader.remove();
            }, 700);
        }

        window.dispatchEvent(
            new CustomEvent("portfolioComponentsLoaded")
        );
    }

    const footerYear = document.getElementById("footer-year");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
});
