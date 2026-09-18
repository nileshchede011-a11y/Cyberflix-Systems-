/* =========================================================
   CYBERFLIX PC BUILDER
========================================================= */

const componentIds = [
    "cpu",
    "gpu",
    "motherboard",
    "ram",
    "storage",
    "psu",
    "case",
    "cooler"
];


const summaryMap = {

    cpu: {
        name: "summaryCpuName",
        price: "summaryCpuPrice"
    },

    gpu: {
        name: "summaryGpuName",
        price: "summaryGpuPrice"
    },

    motherboard: {
        name: "summaryMotherboardName",
        price: "summaryMotherboardPrice"
    },

    ram: {
        name: "summaryRamName",
        price: "summaryRamPrice"
    },

    storage: {
        name: "summaryStorageName",
        price: "summaryStoragePrice"
    },

    psu: {
        name: "summaryPsuName",
        price: "summaryPsuPrice"
    },

    case: {
        name: "summaryCaseName",
        price: "summaryCasePrice"
    },

    cooler: {
        name: "summaryCoolerName",
        price: "summaryCoolerPrice"
    }

};


function formatPrice(value) {

    return "₹" +
        Number(value).toLocaleString("en-IN");

}


function getSelected(id) {

    const select =
        document.getElementById(id);

    if (!select || !select.value) {
        return null;
    }


    const option =
        select.options[
            select.selectedIndex
        ];


    return {

        id: id,

        name:
            option.dataset.name ||
            option.textContent.trim(),

        price:
            Number(option.value),

        power:
            Number(option.dataset.power || 0),

        platform:
            option.dataset.platform || "",

        watt:
            Number(option.dataset.watt || 0)

    };

}


function getBuild() {

    const build = {};

    componentIds.forEach(id => {

        build[id] =
            getSelected(id);

    });

    return build;

}


function calculateTotal(build) {

    let total = 0;


    componentIds.forEach(id => {

        if (build[id]) {

            total +=
                build[id].price;

        }

    });


    return total;

}


function calculatePower(build) {

    let power = 80;


    if (build.cpu) {

        power +=
            build.cpu.power;

    }


    if (build.gpu) {

        power +=
            build.gpu.power;

    }


    if (build.ram) {

        power += 20;

    }


    if (build.storage) {

        power += 10;

    }


    if (build.cooler) {

        power += 10;

    }


    return Math.ceil(
        power / 10
    ) * 10;

}


function checkCompatibility(build) {

    const count =
        componentIds.filter(
            id => build[id]
        ).length;


    if (count === 0) {

        return {

            status: "incomplete",

            title: "INCOMPLETE",

            message:
                "Select your components to start building."

        };

    }


    if (
        build.cpu &&
        build.motherboard
    ) {

        if (
            build.cpu.platform &&
            build.motherboard.platform &&
            build.cpu.platform !==
            build.motherboard.platform
        ) {

            return {

                status: "error",

                title: "INCOMPATIBLE",

                message:
                    "CPU and motherboard platform do not match."

            };

        }

    }


    const power =
        calculatePower(build);


    if (build.psu) {

        const recommended =
            power + 100;


        if (
            build.psu.watt <
            recommended
        ) {

            return {

                status: "error",

                title: "LOW PSU",

                message:
                    `Recommended PSU is ${recommended}W or higher.`

            };

        }

    }


    if (
        count <
        componentIds.length
    ) {

        return {

            status: "incomplete",

            title: "INCOMPLETE",

            message:
                `${count}/8 components selected.`

        };

    }


    return {

        status: "success",

        title: "COMPATIBLE",

        message:
            "All selected components are compatible."

    };

}


function updateSummary(build) {

    componentIds.forEach(id => {

        const map =
            summaryMap[id];


        const name =
            document.getElementById(
                map.name
            );


        const price =
            document.getElementById(
                map.price
            );


        if (!name || !price) {
            return;
        }


        const defaultNames = {

            cpu: "CPU",

            gpu: "GPU",

            motherboard:
                "Motherboard",

            ram: "RAM",

            storage:
                "Storage",

            psu: "PSU",

            case: "PC Case",

            cooler: "Cooler"

        };


        if (build[id]) {

            name.innerHTML = `
                <i></i>
                ${build[id].name}
            `;

            name.classList.add(
                "selected"
            );


            price.textContent =
                formatPrice(
                    build[id].price
                );

        } else {

            name.innerHTML = `
                <i></i>
                ${defaultNames[id]}
            `;

            name.classList.remove(
                "selected"
            );


            price.textContent =
                "—";

        }

    });

}


function updateBuilder() {

    const build =
        getBuild();


    const total =
        calculateTotal(build);


    const power =
        calculatePower(build);


    const compatibility =
        checkCompatibility(build);


    document.getElementById(
        "totalPrice"
    ).textContent =
        formatPrice(total);


    document.getElementById(
        "powerValue"
    ).textContent =
        power + "W";


    document.getElementById(
        "selectedCount"
    ).textContent =
        componentIds.filter(
            id => build[id]
        ).length;


    updateSummary(build);


    updateCompatibility(
        compatibility
    );

}


function updateCompatibility(data) {

    const box =
        document.getElementById(
            "compatibilityBox"
        );


    const status =
        document.getElementById(
            "summaryStatus"
        );


    const value =
        document.getElementById(
            "compatibilityValue"
        );


    box.className =
        "compatibility-box";


    status.classList.remove(
        "success-status",
        "error-status"
    );


    value.classList.remove(
        "compatible",
        "incompatible"
    );


    if (
        data.status ===
        "success"
    ) {

        box.classList.add(
            "success"
        );

        status.classList.add(
            "success-status"
        );

        value.classList.add(
            "compatible"
        );

    }


    if (
        data.status ===
        "error"
    ) {

        box.classList.add(
            "error"
        );

        status.classList.add(
            "error-status"
        );

        value.classList.add(
            "incompatible"
        );

    }


    status.textContent =
        data.title;


    value.textContent =
        data.status === "success"
            ? "Compatible"
            : data.status === "error"
                ? "Check Build"
                : "Incomplete";


    box.innerHTML = `

        <strong>
            ● ${data.title}
        </strong>

        <p>
            ${data.message}
        </p>

    `;

}


function addBuildToCart() {

    const build =
        getBuild();


    const selectedCount =
        componentIds.filter(
            id => build[id]
        ).length;


    if (
        selectedCount !== 8
    ) {

        showBuilderMessage(
            "Please select all 8 components."
        );

        return;

    }


    const compatibility =
        checkCompatibility(build);


    if (
        compatibility.status ===
        "error"
    ) {

        showBuilderMessage(
            compatibility.message
        );

        return;

    }


    const total =
        calculateTotal(build);


    let cart =
        JSON.parse(
            localStorage.getItem(
                "cyberflixCart"
            )
        ) || [];


    cart.push({

        id:
            "custom-" +
            Date.now(),

        name:
            "Cyberflix Custom PC",

        brand:
            "CYBERFLIX",

        category:
            "CUSTOM PC",

        price:
            total,

        quantity:
            1,

        build:
            build

    });


    localStorage.setItem(
        "cyberflixCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showBuilderMessage(
        "Custom PC added to cart."
    );

}


function saveBuild() {

    const build =
        getBuild();


    localStorage.setItem(

        "cyberflixSavedBuild",

        JSON.stringify({

            build:
                build,

            total:
                calculateTotal(build),

            power:
                calculatePower(build)

        })

    );


    showBuilderMessage(
        "Build saved successfully."
    );

}


function resetBuild() {

    componentIds.forEach(id => {

        const select =
            document.getElementById(id);


        if (select) {

            select.selectedIndex =
                0;

        }

    });


    updateBuilder();


    showBuilderMessage(
        "Build reset successfully."
    );

}


function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "cyberflixCart"
            )
        ) || [];


    const count =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity || 1),
            0
        );


    const element =
        document.getElementById(
            "cartCount"
        );


    if (element) {

        element.textContent =
            count;

        element.classList.toggle(
            "has-items",
            count > 0
        );

    }

}


function showBuilderMessage(text) {

    const old =
        document.querySelector(
            ".builder-message"
        );


    if (old) old.remove();


    const message =
        document.createElement(
            "div"
        );


    message.className =
        "builder-message";


    message.innerHTML = `
        <span>✓</span>
        ${text}
    `;


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.classList.add(
            "hide"
        );


        setTimeout(() => {

            message.remove();

        }, 300);

    }, 2300);

}


function goToComponents() {

    window.location.href =
        "components.html";

}


function goToCart() {

    window.location.href =
        "cart.html";

}


function toggleMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (menu) {

        menu.classList.toggle(
            "show"
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        componentIds.forEach(id => {

            const select =
                document.getElementById(id);


            if (select) {

                select.addEventListener(
                    "change",
                    updateBuilder
                );

            }

        });


        updateBuilder();

        updateCartCount();

    }
);