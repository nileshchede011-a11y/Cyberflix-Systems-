// ==========================================
// CYBERFLIX ORDER CONFIRMATION
// ==========================================

const order =
    JSON.parse(localStorage.getItem("cyberflixOrder"));


// ------------------------------------------
// CHECK ORDER
// ------------------------------------------

if (!order) {

    document.querySelector(".confirmation-wrapper").innerHTML = `

        <div class="success-card">

            <h1>
                NO ORDER FOUND<span>.</span>
            </h1>

            <p>
                We couldn't find a recent Cyberflix order.
            </p>

            <div class="confirmation-actions">

                <a
                    href="builder.html"
                    class="confirm-btn primary-btn"
                >
                    BUILD YOUR PC
                </a>

            </div>

        </div>

    `;

} else {

    loadOrder();

}


// ------------------------------------------
// LOAD ORDER
// ------------------------------------------

function loadOrder() {

    // Order ID
    document.getElementById("orderId").textContent =
        order.orderId;


    // Customer
    document.getElementById("customerName").textContent =
        order.customer.name;


    document.getElementById("customerMobile").textContent =
        order.customer.mobile;


    // Delivery
    document.getElementById("deliveryDate").textContent =
        order.delivery;


    // Payment
    document.getElementById("paymentMethod").textContent =
        order.payment;


    // Total
    const formattedTotal =
        `₹${Number(order.total).toLocaleString("en-IN")}`;


    document.getElementById("paymentTotal").textContent =
        formattedTotal;


    document.getElementById("finalTotal").textContent =
        formattedTotal;


    // Address
    document.getElementById("addressText").innerHTML = `

        ${escapeHTML(order.address.address)}<br>
        ${escapeHTML(order.address.city)},
        ${escapeHTML(order.address.state)}
        - ${escapeHTML(order.address.pincode)}

    `;


    // Items
    const itemsContainer =
        document.getElementById("orderItems");

    itemsContainer.innerHTML = "";


    order.items.forEach(([category, component]) => {

        if (!component || !component.name) {
            return;
        }

        const row =
            document.createElement("div");

        row.className = "item-row";

        row.innerHTML = `

            <span>
                ${escapeHTML(category)}
                — ${escapeHTML(component.name)}
            </span>

            <strong>
                ₹${Number(component.price)
                    .toLocaleString("en-IN")}
            </strong>

        `;

        itemsContainer.appendChild(row);

    });

}


// ------------------------------------------
// SECURITY HELPER
// ------------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}