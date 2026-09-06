// =============================================
// LALAN KUMAR - PREMIUM PORTFOLIO
// Component Loader v3.0
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

    // Element does not exist
    if (!element) {

        console.warn(
            `[Component] Missing element: #${id}`
        );

        return false;

    }


    try {

        const response = await fetch(file, {
            cache: "no-cache"
        });


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${file}`
            );

        }


        const html = await response.text();


        if (!html.trim()) {

            throw new Error(
                `Empty component: ${file}`
            );

        }


        element.innerHTML = html;


        console.log(
            `[Component] Loaded: ${file}`
        );


        return true;

    }


    catch (error) {

        console.error(
            `[Component] Failed: ${file}`,
            error
        );


        element.innerHTML = `
            <div class="component-error">
                <strong>Component failed to load</strong>
                <br>
                ${file}
            </div>
        `;


        return false;

    }

}


// =============================================
// LOAD ALL COMPONENTS
// =============================================

async function loadAllComponents() {

    const entries = Object.entries(components);


    const results = await Promise.all(

        entries.map(
            ([id, file]) =>
                loadComponent(id, file)
        )

    );


    const failed = results.filter(
        result => result === false
    ).length;


    if (failed === 0) {

        console.log(
            "[App] All components loaded successfully."
        );

    } else {

        console.warn(
            `[App] ${failed} component(s) failed to load.`
        );

    }


    // Tell other JavaScript files that
    // components are now available.

    document.dispatchEvent(
        new CustomEvent("componentsLoaded", {
            detail: {
                total: entries.length,
                failed: failed
            }
        })
    );


    return {
        total: entries.length,
        failed: failed
    };

}


// =============================================
// INITIALIZE APP
// =============================================

async function initializeApp() {

    console.log(
        "[App] Initializing portfolio..."
    );


    const result =
        await loadAllComponents();


    // Mark body as loaded

    document.body.classList.add(
        "loaded"
    );


    // Hide page loader ONLY after
    // components have finished loading.

    hideLoader();


    console.log(
        `[App] Initialization complete. ${result.total - result.failed}/${result.total} components loaded.`
    );

}


// =============================================
// HIDE LOADER
// =============================================

function hideLoader() {

    const loader =
        document.getElementById("loader");


    if (!loader) {

        return;

    }


    loader.classList.add("hide");


    setTimeout(() => {

        if (loader) {

            loader.remove();

        }

    }, 500);

}


// =============================================
// DOM READY
// =============================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        { once: true }
    );

} else {

    initializeApp();

}


// =============================================
// COMPONENTS LOADED EVENT
// =============================================
//
// Other JS files can use:
//
// document.addEventListener(
//     "componentsLoaded",
//     () => {
//         // code here
//     }
// );
//
// =============================================


// =============================================
// GLOBAL ERROR HANDLER
// =============================================

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "[Global Error]",
            event.error || event.message
        );

    }
);


// =============================================
// UNHANDLED PROMISE ERROR
// =============================================

window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.error(
            "[Unhandled Promise Rejection]",
            event.reason
        );

    }
);
