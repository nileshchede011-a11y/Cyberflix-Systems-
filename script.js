console.log("Cyberflix Systems LLP Website Loaded");

document.addEventListener("DOMContentLoaded", () => {
    const builderButton = document.querySelector(".builder-btn");
    if (builderButton) {
        builderButton.addEventListener("click", () => {
            window.location.href = "builder.html";
        });
    }
});
/* =========================================================
   CYBERFLIX AUTH
========================================================= */

async function checkCyberflixLogin() {

    try {

        const response = await fetch(
            "/api/auth?action=me",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.user) {

            localStorage.setItem(
                "cyberflixUser",
                JSON.stringify(data.user)
            );

            return data.user;
        }

        localStorage.removeItem("cyberflixUser");

        return null;

    } catch (error) {

        console.error(
            "Login check error:",
            error
        );

        return null;
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function cyberflixLogout() {

    try {

        await fetch(
            "/api/auth?action=logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    } finally {

        localStorage.removeItem(
            "cyberflixUser"
        );

        window.location.href =
            "index.html";
    }

}


/* =========================================================
   UPDATE LOGIN UI
========================================================= */

async function updateAuthUI() {

    const user =
        await checkCyberflixLogin();


    const loginLinks =
        document.querySelectorAll(
            '[data-auth="login"]'
        );


    const userLinks =
        document.querySelectorAll(
            '[data-auth="user"]'
        );


    const logoutLinks =
        document.querySelectorAll(
            '[data-auth="logout"]'
        );


    if (user) {

        loginLinks.forEach(
            element => {
                element.style.display =
                    "none";
            }
        );


        userLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

                element.textContent =
                    `Hi, ${user.name || "User"}`;

            }
        );


        logoutLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

            }
        );

    } else {

        loginLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

            }
        );


        userLinks.forEach(
            element => {

                element.style.display =
                    "none";

            }
        );


        logoutLinks.forEach(
            element => {

                element.style.display =
                    "none";

            }
        );

    }

}


/* =========================================================
   AUTH START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAuthUI();

    }
);/* =========================================================
   CYBERFLIX AUTH
========================================================= */

async function checkCyberflixLogin() {

    try {

        const response = await fetch(
            "/api/auth?action=me",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.user) {

            localStorage.setItem(
                "cyberflixUser",
                JSON.stringify(data.user)
            );

            return data.user;
        }

        localStorage.removeItem("cyberflixUser");

        return null;

    } catch (error) {

        console.error(
            "Login check error:",
            error
        );

        return null;
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function cyberflixLogout() {

    try {

        await fetch(
            "/api/auth?action=logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    } finally {

        localStorage.removeItem(
            "cyberflixUser"
        );

        window.location.href =
            "index.html";
    }

}


/* =========================================================
   UPDATE LOGIN UI
========================================================= */

async function updateAuthUI() {

    const user =
        await checkCyberflixLogin();


    const loginLinks =
        document.querySelectorAll(
            '[data-auth="login"]'
        );


    const userLinks =
        document.querySelectorAll(
            '[data-auth="user"]'
        );


    const logoutLinks =
        document.querySelectorAll(
            '[data-auth="logout"]'
        );


    if (user) {

        loginLinks.forEach(
            element => {
                element.style.display =
                    "none";
            }
        );


        userLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

                element.textContent =
                    `Hi, ${user.name || "User"}`;

            }
        );


        logoutLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

            }
        );

    } else {

        loginLinks.forEach(
            element => {

                element.style.display =
                    "inline-flex";

            }
        );


        userLinks.forEach(
            element => {

                element.style.display =
                    "none";

            }
        );


        logoutLinks.forEach(
            element => {

                element.style.display =
                    "none";

            }
        );

    }

}


/* =========================================================
   AUTH START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAuthUI();

    }
);