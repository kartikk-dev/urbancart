
import { products } from "./products.js";

import {
    addToCart,
    changeQuantity,
    removeItem,
    getCartItems,
    getCartCount,
    calculateTotals,
    clearCart
} from "./cart.js";

const productGrid = document.querySelector("#product-grid");
const productCount = document.querySelector("#product-count");

const searchInput = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#sort-products");

const cartItemsContainer = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartTableContainer = document.querySelector("#cart-table-container");

const headerCartCount = document.querySelector("#header-cart-count");
const cartItemCount = document.querySelector("#cart-item-count");

const cartSubtotal = document.querySelector("#cart-subtotal");
const cartDelivery = document.querySelector("#cart-delivery");
const cartHandlingGst = document.querySelector("#cart-handling-gst");
const cartTotal = document.querySelector("#cart-total");
const deliveryNote = document.querySelector("#delivery-note");

const cartDrawer = document.querySelector("#cart-drawer");
const headerCartButton = document.querySelector("#header-cart-button");
const closeCartButton = document.querySelector("#close-cart-button");
const continueShoppingButton = document.querySelector("#continue-shopping-button");

const checkoutButton = document.querySelector("#checkout-button");
const checkoutDialog = document.querySelector("#checkout-dialog");
const checkoutItemsContainer = document.querySelector("#checkout-items");

const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutDelivery = document.querySelector("#checkout-delivery");
const checkoutHandlingGst = document.querySelector("#checkout-handling-gst");
const checkoutTotal = document.querySelector("#checkout-total");

const checkoutForm = document.querySelector("#checkout-form");
const payWithCodButton = document.querySelector("#pay-with-cod-button");
const codConfirmationStep = document.querySelector("#cod-confirmation-step");
const codCustomerSummary = document.querySelector("#cod-customer-summary");
const placeOrderButton = document.querySelector("#place-order-button");
const backToDetailsButton = document.querySelector("#back-to-details-button");

const closeCheckoutButton = document.querySelector("#close-checkout-button");
const closePreviewButton = document.querySelector("#close-preview-button");

const orderSuccess = document.querySelector("#order-success");
const successHeading = document.querySelector("#success-heading");
const successTypingText = document.querySelector("#success-typing-text");
const successOrderId = document.querySelector("#success-order-id");

const continueShoppingSuccess = document.querySelector(
    "#continue-shopping-success"
);

const fireworksCanvas = document.querySelector("#fireworks-canvas");
const burstCrackerButton = document.querySelector("#burst-cracker-button");

const fireworksContext = fireworksCanvas?.getContext("2d");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});

const FIREWORK_COLORS = [
    "#ffd166",
    "#ff6b6b",
    "#f72585",
    "#4cc9f0",
    "#c77dff",
    "#ffffff"
];

let fireworksParticles = [];
let fireworksFrame = null;
let checkoutCustomer = null;
let orderSubmitting = false;


/* PRODUCT AND CURRENCY UTILITIES */

function formatPrice(price) {
    return currencyFormatter.format(price);
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}


/* PRODUCT CATEGORIES */

function populateCategories() {
    if (!categoryFilter) {
        return;
    }

    const categories = [
        ...new Set(products.map(product => product.category))
    ].sort();

    categories.forEach(category => {
        const option = createElement("option", "", category);

        option.value = category;
        categoryFilter.appendChild(option);
    });
}


/* PRODUCT IMAGES */

function createImageFallback(product) {
    const fallback = createElement(
        "div",
        "product-image-placeholder"
    );

    fallback.setAttribute("role", "img");

    fallback.setAttribute(
        "aria-label",
        `${product.name} image unavailable`
    );

    fallback.append(
        createElement("strong", "", product.name),
        createElement("span", "", "IMAGE UNAVAILABLE")
    );

    return fallback;
}

function createProductImage(product) {
    const container = createElement("div", "product-image");

    if (!product.image) {
        container.appendChild(createImageFallback(product));
        return container;
    }

    const image = createElement("img");

    image.src = product.image;
    image.alt = product.imageAlt || product.name;
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    image.addEventListener("error", () => {
        image.replaceWith(createImageFallback(product));
    }, { once: true });

    container.appendChild(image);

    return container;
}


/* PRODUCT CARDS */

function createProductCard(product) {
    const card = createElement("article", "product-card");

    const imageContainer = createProductImage(product);

    if (Number.isFinite(product.discount) && product.discount > 0) {
        imageContainer.appendChild(
            createElement(
                "span",
                "product-sale-badge",
                `${product.discount}% OFF`
            )
        );
    }

    const details = createElement("div", "product-details");

    const category = createElement(
        "span",
        "product-category",
        product.category
    );

    const name = createElement(
        "h3",
        "product-name",
        product.name
    );

    const description = createElement(
        "p",
        "product-description",
        product.description
    );

    const priceRow = createElement("div", "product-price-row");

    const salePrice = createElement(
        "p",
        "product-price",
        formatPrice(product.price)
    );

    priceRow.appendChild(salePrice);

    if (
        Number.isFinite(product.originalPrice) &&
        product.originalPrice > product.price
    ) {
        priceRow.appendChild(
            createElement(
                "del",
                "product-original-price",
                formatPrice(product.originalPrice)
            )
        );
    }

    const addButton = createElement(
        "button",
        "add-to-cart-button",
        "Add to cart"
    );

    addButton.type = "button";
    addButton.dataset.productId = String(product.id);

    details.append(
        category,
        name,
        description,
        priceRow,
        addButton
    );

    card.append(imageContainer, details);

    return card;
}


/* PRODUCT SEARCH, FILTER AND SORT */

function getFilteredProducts() {
    const searchTerm = searchInput?.value.trim().toLowerCase() || "";
    const selectedCategory = categoryFilter?.value || "all";
    const selectedSort = sortSelect?.value || "default";

    const filteredProducts = products.filter(product => {
        const matchesSearch = [
            product.name,
            product.description,
            product.category
        ].some(value =>
            value.toLowerCase().includes(searchTerm)
        );

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (selectedSort === "name") {
        filteredProducts.sort(
            (a, b) => a.name.localeCompare(b.name)
        );
    }

    return filteredProducts;
}

function renderProducts() {
    if (!productGrid || !productCount) {
        return;
    }

    const filteredProducts = getFilteredProducts();

    const fragment = document.createDocumentFragment();

    filteredProducts.forEach(product => {
        fragment.appendChild(createProductCard(product));
    });

    productGrid.replaceChildren(fragment);

    productCount.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1 ? "product" : "products"
        } found`;

    if (filteredProducts.length === 0) {
        productGrid.appendChild(
            createElement(
                "p",
                "no-products",
                "No products found. Try another search or category."
            )
        );
    }
}


/* CART PRODUCT ROWS */

function createCartRow(item) {
    const row = document.createElement("tr");

    const nameCell = createElement("td", "", item.name);

    const priceCell = createElement(
        "td",
        "",
        formatPrice(item.price)
    );

    const quantityCell = document.createElement("td");

    const quantityControl = createElement(
        "div",
        "quantity-control"
    );

    const decreaseButton = createElement(
        "button",
        "quantity-button",
        "−"
    );

    decreaseButton.type = "button";
    decreaseButton.dataset.cartAction = "decrease";
    decreaseButton.dataset.productId = String(item.id);

    decreaseButton.setAttribute(
        "aria-label",
        `Decrease ${item.name} quantity`
    );

    const quantity = createElement(
        "span",
        "",
        String(item.quantity)
    );

    const increaseButton = createElement(
        "button",
        "quantity-button",
        "+"
    );

    increaseButton.type = "button";
    increaseButton.dataset.cartAction = "increase";
    increaseButton.dataset.productId = String(item.id);

    increaseButton.setAttribute(
        "aria-label",
        `Increase ${item.name} quantity`
    );

    quantityControl.append(
        decreaseButton,
        quantity,
        increaseButton
    );

    quantityCell.appendChild(quantityControl);

    const totalCell = createElement(
        "td",
        "",
        formatPrice(item.lineTotal)
    );

    const actionCell = document.createElement("td");

    const removeButton = createElement(
        "button",
        "remove-item-button",
        "Remove"
    );

    removeButton.type = "button";
    removeButton.dataset.cartAction = "remove";
    removeButton.dataset.productId = String(item.id);

    removeButton.setAttribute(
        "aria-label",
        `Remove ${item.name} from cart`
    );

    actionCell.appendChild(removeButton);

    row.append(
        nameCell,
        priceCell,
        quantityCell,
        totalCell,
        actionCell
    );

    return row;
}


/* CART RENDERING AND TOTALS */

function renderCart() {
    const items = getCartItems();
    const itemCount = getCartCount();
    const totals = calculateTotals();

    if (headerCartCount) {
        headerCartCount.textContent = String(itemCount);
    }

    if (cartItemCount) {
        cartItemCount.textContent =
            `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
    }

    if (cartEmpty) {
        cartEmpty.hidden = items.length > 0;
    }

    if (cartTableContainer) {
        cartTableContainer.hidden = items.length === 0;
    }

    if (cartItemsContainer) {
        cartItemsContainer.replaceChildren(
            ...items.map(createCartRow)
        );
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(totals.subtotal);
    }

    if (cartDelivery) {
        cartDelivery.textContent = formatPrice(totals.delivery);
    }

    if (cartHandlingGst) {
        cartHandlingGst.textContent = formatPrice(totals.handlingAndGst);
    }

    if (cartTotal) {
        cartTotal.textContent = formatPrice(totals.total);
    }

    if (deliveryNote) {
        if (totals.subtotal === 0) {
            deliveryNote.textContent =
                "Free delivery on orders of ₹500 or above. A ₹30 delivery charge applies below ₹500.";
        } else if (totals.subtotal < 500) {
            deliveryNote.textContent =
                `Add ${formatPrice(500 - totals.subtotal)} more to unlock free delivery.`;
        } else {
            deliveryNote.textContent =
                "Free delivery unlocked on this order.";
        }
    }

    if (checkoutButton) {
        checkoutButton.disabled = items.length === 0;
    }
}


/* CHECKOUT ORDER PREVIEW */

function createCheckoutItem(item) {
    const row = createElement("div", "checkout-item");

    const details = createElement(
        "span",
        "",
        `${item.name} × ${item.quantity}`
    );

    const total = createElement(
        "strong",
        "",
        formatPrice(item.lineTotal)
    );

    row.append(details, total);

    return row;
}

function renderCheckoutPreview() {
    const items = getCartItems();

    if (items.length === 0 || !checkoutItemsContainer) {
        return false;
    }

    const totals = calculateTotals();

    checkoutItemsContainer.replaceChildren(
        ...items.map(createCheckoutItem)
    );

    if (checkoutSubtotal) {
        checkoutSubtotal.textContent = formatPrice(totals.subtotal);
    }

    if (checkoutDelivery) {
        checkoutDelivery.textContent = formatPrice(totals.delivery);
    }

    if (checkoutHandlingGst) {
        checkoutHandlingGst.textContent = formatPrice(totals.handlingAndGst);
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = formatPrice(totals.total);
    }

    return true;
}


/* CART AND CHECKOUT NAVIGATION */

function openCart() {
    renderCart();

    if (cartDrawer && !cartDrawer.open) {
        cartDrawer.showModal();
    }
}

function resetCheckoutSteps() {
    if (checkoutForm) {
        checkoutForm.hidden = false;
    }

    if (codConfirmationStep) {
        codConfirmationStep.hidden = true;
    }

    checkoutCustomer = null;
}

function openCheckout() {
    if (!checkoutDialog || !renderCheckoutPreview()) {
        return;
    }

    if (cartDrawer?.open) {
        cartDrawer.close();
    }

    resetCheckoutSteps();
    checkoutDialog.showModal();
}

function closeCheckout() {
    if (checkoutDialog?.open) {
        checkoutDialog.close();
    }

    resetCheckoutSteps();
}


/* CUSTOMER DETAILS AND COD VALIDATION */

function prepareCODConfirmation() {
    if (!checkoutForm || !codConfirmationStep || !codCustomerSummary) {
        return;
    }

    if (!checkoutForm.reportValidity()) {
        return;
    }

    if (getCartItems().length === 0) {
        closeCheckout();
        openCart();
        return;
    }

    const formData = new FormData(checkoutForm);

    if (formData.get("payment") !== "cod") {
        return;
    }

    checkoutCustomer = {
        name: String(formData.get("name")).trim(),
        address: String(formData.get("address")).trim(),
        phone: String(formData.get("phone")).trim()
    };

    const customerDetails = [
        `Name: ${checkoutCustomer.name}`,
        `Address: ${checkoutCustomer.address}`,
        `Phone: ${checkoutCustomer.phone}`,
        "Payment: Cash on Delivery"
    ];

    codCustomerSummary.replaceChildren(
        ...customerDetails.map(detail =>
            createElement("p", "", detail)
        )
    );

    checkoutForm.hidden = true;
    codConfirmationStep.hidden = false;
}


/* ORDER CONFIRMATION ANIMATION */

function startTypewriter(message) {
    if (!successTypingText) {
        return;
    }

    successTypingText.textContent = "";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        successTypingText.textContent = message;
        return;
    }

    let position = 0;

    function writeNextCharacter() {
        successTypingText.textContent = message.slice(0, position);

        position += 1;

        if (position <= message.length) {
            window.setTimeout(writeNextCharacter, 32);
        }
    }

    writeNextCharacter();
}

function generateOrderReference() {
    const timestamp = Date.now().toString().slice(-8);
    const randomPart = Math.floor(100 + Math.random() * 900);

    return `UC-${timestamp}-${randomPart}`;
}

function placeOrder() {
    if (orderSubmitting) {
        return;
    }

    const items = getCartItems();

    if (items.length === 0 || !checkoutCustomer) {
        return;
    }

    orderSubmitting = true;

    if (placeOrderButton) {
        placeOrderButton.disabled = true;
    }

    const orderReference = generateOrderReference();
    const customerName = checkoutCustomer.name;

    if (checkoutDialog?.open) {
        checkoutDialog.close();
    }

    if (successHeading) {
        successHeading.textContent = "Thank you for shopping!";
    }

    if (successOrderId) {
        successOrderId.textContent =
            `Order reference: ${orderReference}`;
    }

    if (orderSuccess) {
        orderSuccess.classList.add("is-active");
        orderSuccess.setAttribute("aria-hidden", "false");
    }

    startTypewriter(
        `Your Cash on Delivery order has been placed successfully, ${customerName}. Thank you for shopping with UrbanCart!`
    );

    document.body.style.overflow = "hidden";

    clearCart();
    renderCart();

    checkoutForm?.reset();
    resetCheckoutSteps();

    launchConfirmationFireworks();
}

function closeOrderSuccess() {
    if (orderSuccess) {
        orderSuccess.classList.remove("is-active");
        orderSuccess.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";

    orderSubmitting = false;

    if (placeOrderButton) {
        placeOrderButton.disabled = false;
    }

    document.querySelector("#shop")?.scrollIntoView({
        behavior: "smooth"
    });
}


/* FIREWORKS ANIMATION */

function resizeFireworksCanvas() {
    if (!fireworksCanvas || !fireworksContext) {
        return;
    }

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    fireworksCanvas.width = Math.floor(window.innerWidth * ratio);
    fireworksCanvas.height = Math.floor(window.innerHeight * ratio);

    fireworksContext.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}

function createFireworkBurst(x, y) {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const particleCount = reducedMotion ? 16 : 55;

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4;
        const lifetime = 45 + Math.random() * 35;

        fireworksParticles.push({
            x,
            y,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            life: lifetime,
            maxLife: lifetime,
            size: 1.5 + Math.random() * 2.5,
            color: FIREWORK_COLORS[
                Math.floor(Math.random() * FIREWORK_COLORS.length)
            ]
        });
    }
}

function animateFireworks() {
    if (!fireworksContext) {
        fireworksFrame = null;
        return;
    }

    fireworksContext.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    fireworksParticles = fireworksParticles.filter(
        particle => particle.life > 0
    );

    fireworksParticles.forEach(particle => {
        particle.velocityX *= 0.985;
        particle.velocityY += 0.035;

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life -= 1;

        fireworksContext.globalAlpha =
            particle.life / particle.maxLife;

        fireworksContext.fillStyle = particle.color;

        fireworksContext.beginPath();

        fireworksContext.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        fireworksContext.fill();
    });

    fireworksContext.globalAlpha = 1;

    if (fireworksParticles.length > 0) {
        fireworksFrame = requestAnimationFrame(animateFireworks);
    } else {
        fireworksFrame = null;

        fireworksContext.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
    }
}

function startFireworksAt(x, y, burstCount = 1) {
    if (!fireworksCanvas || !fireworksContext) {
        return;
    }

    resizeFireworksCanvas();

    createFireworkBurst(x, y);

    if (burstCount > 1) {
        createFireworkBurst(
            window.innerWidth * 0.25,
            window.innerHeight * 0.28
        );

        createFireworkBurst(
            window.innerWidth * 0.75,
            window.innerHeight * 0.22
        );

        if (burstCount > 2) {
            createFireworkBurst(
                window.innerWidth * 0.5,
                window.innerHeight * 0.16
            );
        }
    }

    if (fireworksFrame === null) {
        fireworksFrame = requestAnimationFrame(animateFireworks);
    }
}

function launchFireworks() {
    if (!burstCrackerButton) {
        return;
    }

    const buttonPosition = burstCrackerButton.getBoundingClientRect();

    startFireworksAt(
        buttonPosition.left + buttonPosition.width / 2,
        Math.max(80, buttonPosition.top - 40),
        4
    );
}

function launchConfirmationFireworks() {
    startFireworksAt(
        window.innerWidth / 2,
        window.innerHeight * 0.35,
        4
    );
}


/* EVENT LISTENERS */

function initializeEventListeners() {
    productGrid?.addEventListener("click", event => {
        const button = event.target.closest("button[data-product-id]");

        if (!button) {
            return;
        }

        addToCart(button.dataset.productId);
        renderCart();

        button.textContent = "Added";

        window.setTimeout(() => {
            button.textContent = "Add to cart";
        }, 900);
    });

    cartItemsContainer?.addEventListener("click", event => {
        const button = event.target.closest("button[data-cart-action]");

        if (!button) {
            return;
        }

        const productId = button.dataset.productId;
        const action = button.dataset.cartAction;

        if (action === "increase") {
            addToCart(productId);
        }

        if (action === "decrease") {
            changeQuantity(productId, -1);
        }

        if (action === "remove") {
            removeItem(productId);
        }

        renderCart();
    });

    searchInput?.addEventListener("input", renderProducts);
    categoryFilter?.addEventListener("change", renderProducts);
    sortSelect?.addEventListener("change", renderProducts);

    headerCartButton?.addEventListener("click", openCart);

    closeCartButton?.addEventListener("click", () => {
        cartDrawer?.close();
    });

    continueShoppingButton?.addEventListener("click", () => {
        cartDrawer?.close();

        document.querySelector("#shop")?.scrollIntoView({
            behavior: "smooth"
        });
    });

    checkoutButton?.addEventListener("click", openCheckout);

    closeCheckoutButton?.addEventListener("click", closeCheckout);
    closePreviewButton?.addEventListener("click", closeCheckout);

    payWithCodButton?.addEventListener(
        "click",
        prepareCODConfirmation
    );

    checkoutForm?.addEventListener("submit", event => {
        event.preventDefault();
        prepareCODConfirmation();
    });

    backToDetailsButton?.addEventListener("click", () => {
        checkoutForm.hidden = false;
        codConfirmationStep.hidden = true;
    });

    placeOrderButton?.addEventListener("click", placeOrder);

    continueShoppingSuccess?.addEventListener(
        "click",
        closeOrderSuccess
    );

    checkoutDialog?.addEventListener("close", resetCheckoutSteps);

    cartDrawer?.addEventListener("click", event => {
        if (event.target === cartDrawer) {
            cartDrawer.close();
        }
    });

    checkoutDialog?.addEventListener("click", event => {
        if (event.target === checkoutDialog) {
            closeCheckout();
        }
    });

    burstCrackerButton?.addEventListener(
        "click",
        launchFireworks
    );

    window.addEventListener("resize", resizeFireworksCanvas, {
        passive: true
    });
}


/* INITIALIZE URBANCART */

function initializeUrbanCart() {
    populateCategories();
    renderProducts();
    renderCart();
    resizeFireworksCanvas();
    initializeEventListeners();

    const heroSection = document.querySelector(".hero-section");

    if (heroSection) {
        heroSection.dataset.variant = String(
            Math.floor(Math.random() * 3) + 1
        );
    }
}

initializeUrbanCart();
