// =============================================
// LALAN KUMAR - PREMIUM PORTFOLIO
// Component Loader v2.0
// Part 1
// =============================================

// =============================================
// COMPONENT PATHS
// =============================================

const components = {

    header: "components/header.html",

    sidebar: "components/sidebar.html",

    hero: "components/hero.html",

    about: "components/about.html",

    skills: "components/skills.html",

    education: "components/education.html",

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

// =============================================
// LOAD SINGLE COMPONENT
// =============================================

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) {

        console.warn(`Missing Element : ${id}`);

        return;

    }

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(
                `Failed to load ${file}`
            );

        }

        element.innerHTML =
            await response.text();

    }

    catch (error) {

        console.error(error);

        element.innerHTML = `
            <div class="component-error">
                Failed to load :
                ${id}
            </div>
        `;

    }

}
// =============================================
// LOAD ALL COMPONENTS
// =============================================

async function loadAllComponents() {

    const tasks = Object.entries(components).map(

        ([id, file]) => loadComponent(id, file)

    );

    await Promise.all(tasks);

    console.log(
        "All Components Loaded Successfully"
    );

}

// =============================================
// INITIALIZE APP
// =============================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await loadAllComponents();

        document.body.classList.add("loaded");

    }

);

// =============================================
// WINDOW LOAD
// =============================================

window.addEventListener(

    "load",

    () => {

        const loader = document.getElementById("loader");

        if (loader) {

            loader.classList.add("hide");

            setTimeout(() => {

                loader.remove();

            }, 500);

        }

    }

);