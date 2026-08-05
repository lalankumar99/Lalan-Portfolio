// =============================================
// Premium Portfolio
// Component Loader
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

    certificates: "components/certificates.html",

    gallery: "components/gallery.html",

    resume: "components/resume.html",

    blog: "components/blog.html",

    dashboard: "components/dashboard.html",

    contact: "components/contact.html",

    footer: "components/footer.html"

};


// Load One Component

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok)
            throw new Error(file);

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    }

    catch (error) {

        console.error(
            "Component Load Failed:",
            error
        );

    }

}


// Load All Components

async function loadAllComponents() {

    for (const id in components) {

        await loadComponent(
            id,
            components[id]
        );

    }

}


// Start

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadAllComponents();

    }

);