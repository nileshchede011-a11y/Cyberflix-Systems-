// ==========================================
// CYBERFLIX CHECKOUT
// ==========================================

let build = JSON.parse(localStorage.getItem("cyberflixBuild"));


// ------------------------------------------
// GET BUILD
// ------------------------------------------

if (!build) {

    // fallback demo build
    build = {
        cpu: {
            name: "Intel Core i5-14600K",
            price: 18000
        },
        gpu: {
            name: "RTX 4060 8GB",
            price: 30000
        },
        motherboard: {
            name: "B760 Gaming",
            price: 15000
        },
        ram: {
            name: "16GB DDR5",
            price: 6000
        },
        storage: {
            name: "1TB NVMe SSD",
            price: 5000
        },
        psu: {
            name: "650W Gold",
            price: 7000
        },
        case: {
            name: "Airflow Gaming Case",
            price: 6000
        },
        cooler: {
            name: "Air Cooler",
            price: 4000
        }
    };
}


// ------------------------------------------
// COMPONENT LIST
// ------------------------------------------

const components = [
    ["CPU", build.cpu],
    ["GPU", build.gpu],
    ["Motherboard", build.motherboard],
    ["RAM", build.ram],
    ["Storage", build.storage],
    ["PSU", build.psu],
    ["Case", build.case],
    ["Cooler", build.cooler]
];


// ------------------------------------------
// CALCULATE TOTAL
// ------------------------------------------

let total = 0;

components.forEach(([name, component]) => {

    if (component && component.price) {
        total += Number(component.price);
    }

});


// ------------------------------------------
// DISPLAY SUMMARY
// ------------------------------------------

const summaryItems = document.getElementById("summaryItems");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");

summaryItems.innerHTML = "";

components.forEach(([name, component]) => {

    if (!component || !component.name) return;

    const item = document.createElement("div");

    item.className = "summary-item";

    item.innerHTML = `
        <span>${name}</span>
        <strong>₹${Number(component.price).toLocaleString("en-IN")}</strong>
    `;

    summaryItems.appendChild(item);

});

subtotalElement.textContent =
    `₹${total.toLocaleString("en-IN")}`;

totalElement.textContent =
    `₹${total.toLocaleString("en-IN")}`;


// ------------------------------------------
// PAYMENT OPTION UI
// ------------------------------------------

const paymentOptions =
    document.querySelectorAll(".payment-option");

paymentOptions.forEach(option => {

    option.addEventListener("click", () => {

        paymentOptions.forEach(item => {
            item.classList.remove("active");
        });

        option.classList.add("active");

    });

});


// ------------------------------------------
// CHECKOUT FORM
// ------------------------------------------

const checkoutForm =
    document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const state =
        document.getElementById("state").value.trim();

    const pincode =
        document.getElementById("pincode").value.trim();

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!/^[0-9]{10}$/.test(mobile)) {

        alert("Please enter a valid 10 digit mobile number.");

        return;
    }


    if (!/^[0-9]{6}$/.test(pincode)) {

        alert("Please enter a valid 6 digit PIN code.");

        return;
    }


    // --------------------------------------
    // CREATE ORDER ID
    // --------------------------------------

    const now = new Date();

    const orderId =
        "CFX-" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        Math.floor(1000 + Math.random() * 9000);


    // --------------------------------------
    // DELIVERY DATE
    // --------------------------------------

    const deliveryStart = new Date();

    deliveryStart.setDate(
        deliveryStart.getDate() + 6
    );

    const deliveryEnd = new Date();

    deliveryEnd.setDate(
        deliveryEnd.getDate() + 10
    );


    const deliveryText =
        formatDate(deliveryStart) +
        " – " +
        formatDate(deliveryEnd);


    // --------------------------------------
    // ORDER OBJECT
    // --------------------------------------

    const order = {

        orderId: orderId,

        customer: {
            name: name,
            mobile: mobile,
            email: email
        },

        address: {
            address: address,
            city: city,
            state: state,
            pincode: pincode
        },

        payment: payment,

        items: components,

        total: total,

        delivery: deliveryText,

        createdAt: new Date().toISOString()

    };


    // --------------------------------------
    // SAVE ORDER
    // --------------------------------------

    localStorage.setItem(
        "cyberflixOrder",
        JSON.stringify(order)
    );


    // --------------------------------------
    // GO TO CONFIRMATION
    // --------------------------------------

    window.location.href =
        "order-confirmation.html";

});


// ------------------------------------------
// DATE FORMAT
// ------------------------------------------

function formatDate(date) {

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}