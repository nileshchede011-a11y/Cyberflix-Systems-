/* =========================================================
   CYBERFLIX COMPONENT STORE
========================================================= */

const products = [

    {
        id: 1,
        category: "cpu",
        categoryName: "CPU",
        brand: "INTEL",
        name: "Intel Core i5-14600K",
        price: 18000,
        oldPrice: 20500,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Intel_Core_i5-14600K_(INVADERPC)_01.png"
    },

    {
        id: 2,
        category: "cpu",
        categoryName: "CPU",
        brand: "AMD",
        name: "AMD Ryzen 7 7800X3D",
        price: 32000,
        oldPrice: 35500,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/AMD@5nmCCD(6nmIOD)@Zen4@Raphael@Ryzen_7_7800X3D@100-000000910_BS_2312PGY_9LW3390030138_DSCx01.jpg"
    },

    {
        id: 3,
        category: "gpu",
        categoryName: "GPU",
        brand: "GIGABYTE",
        name: "GeForce RTX 4070 SUPER 12GB",
        price: 50000,
        oldPrice: 55500,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_RTX_4070_Super_und_Vergleichskarten_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_03.png"
    },

    {
        id: 4,
        category: "gpu",
        categoryName: "GPU",
        brand: "GIGABYTE",
        name: "GeForce RTX 4060 8GB",
        price: 30000,
        oldPrice: 34000,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_GeForce_RTX_4060_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_05.png"
    },

    {
        id: 5,
        category: "motherboard",
        categoryName: "MOTHERBOARD",
        brand: "MSI",
        name: "B760 Gaming Plus WiFi",
        price: 15000,
        oldPrice: 17000,
        stock: "IN STOCK",
        image: "https://m.media-amazon.com/images/I/51lLktu5Z3L._AC_.jpg"
    },

    {
        id: 6,
        category: "ram",
        categoryName: "RAM",
        brand: "CORSAIR",
        name: "Vengeance RGB 32GB DDR5",
        price: 11000,
        oldPrice: 13000,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/2023_Pami%C4%99ci_Corsair_Vengeance_RGB.jpg"
    },

    {
        id: 7,
        category: "storage",
        categoryName: "STORAGE",
        brand: "SAMSUNG",
        name: "990 EVO Plus 2TB NVMe",
        price: 9000,
        oldPrice: 11000,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/SSD_Samsung_990_EVO_Plus_2TB,_Model_MZ-V9S2T0-2801.jpg"
    },

    {
        id: 8,
        category: "psu",
        categoryName: "POWER SUPPLY",
        brand: "CORSAIR",
        name: "RM750e 750W Gold",
        price: 10000,
        oldPrice: 12000,
        stock: "IN STOCK",
        image: "https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020262-NA-RM750e-PSU-01.png"
    },

    {
        id: 9,
        category: "case",
        categoryName: "PC CASE",
        brand: "ROSEWILL",
        name: "Airflow Gaming Case",
        price: 6000,
        oldPrice: 7500,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosewill_Gaming_Case.png"
    },

    {
        id: 10,
        category: "cooler",
        categoryName: "COOLING",
        brand: "NZXT",
        name: "Kraken 240 AIO Cooler",
        price: 8000,
        oldPrice: 9500,
        stock: "IN STOCK",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NZXT_Kraken_X52_cooler_in_H500i.jpg"
    }

];


let currentCategory = "all";


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");

}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(list = products) {

    const grid =
        document.getElementById("productGrid");

    if (!grid) return;


    if (list.length === 0) {

        grid.innerHTML = `
            <div class="no-products">
                <div>⌕</div>
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML = list.map(product => `

        <article class="product-card">

            <div class="product-image">

                <span class="product-category">
                    ${product.categoryName}
                </span>

                <span class="stock-badge">
                    ● ${product.stock}
                </span>

                <button
                    class="wishlist-btn"
                    onclick="toggleWishlist(${product.id})"
                    title="Add to Wishlist"
                    type="button"
                >
                    ♡
                </button>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.parentElement.classList.add('image-error');"
                >

            </div>


            <div class="product-info">

                <div class="product-brand">
                    ${product.brand}
                </div>

                <h3>
                    ${product.name}
                </h3>


                <div class="product-price">

                    <strong>
                        ${formatPrice(product.price)}
                    </strong>

                    <del>
                        ${formatPrice(product.oldPrice)}
                    </del>

                </div>


                <div class="product-actions">

                    <button
                        class="add-cart-btn"
                        onclick="addProductToCart(${product.id})"
                        type="button"
                    >
                        ADD TO CART
                    </button>

                    <button
                        class="buy-btn"
                        onclick="buyProduct(${product.id})"
                        type="button"
                    >
                        BUY
                    </button>

                </div>

            </div>

        </article>

    `).join("");

}


/* =========================================================
   FILTER
========================================================= */

function filterProducts(category) {

    currentCategory = String(category || "all").toLowerCase();


    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                String(btn.dataset.category || "").toLowerCase() === currentCategory
            );

        });


    const searchInput =
        document.getElementById("searchInput");

    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    applyFilters(search);

}


/* =========================================================
   SEARCH
========================================================= */

function applyFilters(search = "") {

    let result = [...products];


    if (currentCategory !== "all") {

        result =
            result.filter(
                product =>
                    product.category.toLowerCase() ===
                    currentCategory
            );

    }


    if (search) {

        result =
            result.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.brand
                    .toLowerCase()
                    .includes(search)

                ||

                product.categoryName
                    .toLowerCase()
                    .includes(search)

            );

    }


    displayProducts(result);

}


/* =========================================================
   ADD TO CART
========================================================= */

function addProductToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    let cart =
        JSON.parse(
            localStorage.getItem(
                "cyberflixCart"
            )
        ) || [];


    const existing =
        cart.find(
            item => item.id === product.id
        );


    if (existing) {

        existing.quantity =
            Number(existing.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            brand: product.brand,

            category: product.categoryName,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cyberflixCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showStoreMessage(
        `${product.name} added to cart`
    );

}


/* =========================================================
   BUY
========================================================= */

function buyProduct(id) {

    addProductToCart(id);

    setTimeout(() => {

        window.location.href =
            "cart.html";

    }, 500);

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "cyberflixCart"
            )
        ) || [];


    const count =
        cart.reduce(
            (total, item) =>
                total +
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


/* =========================================================
   SEARCH FOCUS
========================================================= */

function focusSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (input) {

        input.focus();

        input.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

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


/* =========================================================
   CART
========================================================= */

function goToCart() {

    window.location.href =
        "cart.html";

}


/* =========================================================
   MESSAGE
========================================================= */

function showStoreMessage(text) {

    const old =
        document.querySelector(
            ".store-message"
        );


    if (old) old.remove();


    const message =
        document.createElement("div");


    message.className =
        "store-message";


    message.innerHTML = `
        <span>✓</span>
        ${text}
    `;


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.classList.add("hide");

        setTimeout(() => {

            message.remove();

        }, 300);

    }, 2200);

}


/* =========================================================
   WISHLIST
========================================================= */

async function toggleWishlist(productId) {

    const user =
        JSON.parse(
            localStorage.getItem(
                "cyberflixUser"
            )
        );


    if (!user) {

        showStoreMessage(
            "Please login to use Wishlist"
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 700);

        return;
    }


    try {

        const response =
            await fetch(
                "/api/wishlist",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        productId:
                            String(productId)
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Wishlist failed"
            );

        }


        if (data.action === "added") {

            showStoreMessage(
                "Added to Wishlist ❤️"
            );

        } else {

            showStoreMessage(
                "Removed from Wishlist"
            );

        }

    } catch (error) {

        console.error(
            "Wishlist error:",
            error
        );

        showStoreMessage(
            "Unable to update Wishlist"
        );

    }

}


/* =========================================================
   EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayProducts();

        updateCartCount();


        /* FILTER BUTTONS */

        document
            .querySelectorAll(".filter-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        filterProducts(
                            button.dataset.category
                        );

                    }
                );

            });


        /* SEARCH */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    applyFilters(
                        searchInput.value
                    );

                }
            );

        }

    }
);