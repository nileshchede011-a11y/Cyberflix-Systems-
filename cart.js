// ===============================
// CYBERFLIX CART SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const cartItemsContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");
    const cartCountElement = document.getElementById("cartCount");

    // --------------------------------
    // GET BUILDER CART
    // --------------------------------
    function getBuilderCart() {
        try {
            const data = JSON.parse(
                localStorage.getItem("cyberflixBuild")
            );

            if (!data) return [];

            // Builder may store object with components
            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data.components)) {
                return data.components;
            }

            return [];
        } catch (error) {
            console.error("Builder cart error:", error);
            return [];
        }
    }


    // --------------------------------
    // GET STORE CART
    // --------------------------------
    function getStoreCart() {
        try {
            const data = JSON.parse(
                localStorage.getItem("cyberflixCart")
            );

            if (!data) return [];

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Store cart error:", error);
            return [];
        }
    }


    // --------------------------------
    // FORMAT PRICE
    // --------------------------------
    function formatPrice(price) {
        return "₹" + Number(price || 0).toLocaleString("en-IN");
    }


    // --------------------------------
    // ESCAPE HTML
    // --------------------------------
    function escapeHTML(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // --------------------------------
    // DISPLAY CART
    // --------------------------------
    function renderCart() {

        const builderItems = getBuilderCart();
        const storeItems = getStoreCart();

        const allItems = [
            ...builderItems,
            ...storeItems
        ];

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        // EMPTY CART
        if (allItems.length === 0) {

            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>

                    <h2>Your Cart is Empty</h2>

                    <p>
                        Add components or build your custom PC
                        to see products here.
                    </p>

                    <div class="empty-cart-buttons">

                        <a href="components.html"
                           class="btn btn-primary">
                            Browse Components
                        </a>

                        <a href="builder.html"
                           class="btn btn-secondary">
                            Build Your PC
                        </a>

                    </div>
                </div>
            `;

            updateTotals([]);
            updateCartCount([]);

            return;
        }


        // --------------------------------
        // BUILDER ITEMS
        // --------------------------------
        builderItems.forEach((item, index) => {

            const name =
                item.name ||
                item.title ||
                item.productName ||
                "PC Component";

            const category =
                item.category ||
                item.type ||
                "Component";

            const price =
                Number(item.price) || 0;

            const image =
                item.image ||
                item.img ||
                "https://via.placeholder.com/120x100?text=PC";

            const quantity =
                Number(item.quantity) || 1;

            const itemTotal =
                price * quantity;


            const div = document.createElement("div");

            div.className = "cart-item builder-cart-item";

            div.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        onerror="this.src='https://via.placeholder.com/120x100?text=PC'"
                    >

                </div>


                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(category)}
                    </p>

                    <span class="cart-quantity">
                        Quantity: ${quantity}
                    </span>

                </div>


                <div class="cart-item-price">

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                    ${
                        quantity > 1
                        ? `<small>${formatPrice(price)} × ${quantity}</small>`
                        : ""
                    }

                </div>

            `;

            cartItemsContainer.appendChild(div);

        });


        // --------------------------------
        // STORE PRODUCTS
        // --------------------------------
        storeItems.forEach((item, index) => {

            const name =
                item.name ||
                item.title ||
                item.productName ||
                "Product";

            const category =
                item.category ||
                item.type ||
                "Component";

            const price =
                Number(item.price) || 0;

            const image =
                item.image ||
                item.img ||
                "https://via.placeholder.com/120x100?text=Product";

            const quantity =
                Number(item.quantity) || 1;

            const itemTotal =
                price * quantity;


            const div = document.createElement("div");

            div.className = "cart-item store-cart-item";

            div.innerHTML = `

                <div class="cart-item-image product-cart-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        onerror="this.src='https://via.placeholder.com/120x100?text=Product'"
                    >

                </div>


                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(category)}
                    </p>

                    <span class="cart-quantity">
                        Quantity: ${quantity}
                    </span>

                </div>


                <div class="cart-item-price">

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                    ${
                        quantity > 1
                        ? `<small>${formatPrice(price)} × ${quantity}</small>`
                        : ""
                    }

                </div>

            `;

            cartItemsContainer.appendChild(div);

        });


        updateTotals(allItems);
        updateCartCount(allItems);

    }


    // --------------------------------
    // TOTAL
    // --------------------------------
    function updateTotals(items) {

        let total = 0;

        items.forEach(item => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;

            total += price * quantity;

        });


        if (subtotalElement) {
            subtotalElement.textContent =
                formatPrice(total);
        }

        if (totalElement) {
            totalElement.textContent =
                formatPrice(total);
        }

    }


    // --------------------------------
    // CART COUNT
    // --------------------------------
    function updateCartCount(items) {

        let count = 0;

        items.forEach(item => {

            count +=
                Number(item.quantity) || 1;

        });


        if (cartCountElement) {
            cartCountElement.textContent = count;
        }

        // Also update all cart badges
        document
            .querySelectorAll("[data-cart-count]")
            .forEach(element => {
                element.textContent = count;
            });

    }


    // --------------------------------
    // CLEAR CART
    // --------------------------------
    const clearCartButton =
        document.getElementById("clearCart");

    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            () => {

                const confirmClear =
                    confirm(
                        "Are you sure you want to clear your cart?"
                    );

                if (!confirmClear) return;


                localStorage.removeItem(
                    "cyberflixCart"
                );

                localStorage.removeItem(
                    "cyberflixBuild"
                );


                renderCart();

            }
        );

    }


    // --------------------------------
    // CHECKOUT
    // --------------------------------
    const checkoutButton =
        document.getElementById("checkoutBtn");

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                const builderItems =
                    getBuilderCart();

                const storeItems =
                    getStoreCart();

                const allItems = [
                    ...builderItems,
                    ...storeItems
                ];


                if (allItems.length === 0) {

                    alert(
                        "Your cart is empty!"
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }


    // --------------------------------
    // INITIAL LOAD
    // --------------------------------
    renderCart();

});