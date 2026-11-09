
import { products } from "./products.js";

const STORAGE_KEY = "urbancart-cart";
const DELIVERY_FEE = 30;
const FREE_DELIVERY_LIMIT = 500;
const HANDLING_AND_GST = 20;

let cart = loadCart();

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "{}"
        );

        if (
            !savedCart ||
            typeof savedCart !== "object" ||
            Array.isArray(savedCart)
        ) {
            return {};
        }

        return Object.fromEntries(
            Object.entries(savedCart).filter(([id, quantity]) => {
                const productExists = products.some(
                    product => product.id === Number(id)
                );

                return (
                    productExists &&
                    Number.isInteger(quantity) &&
                    quantity > 0
                );
            })
        );
    } catch {
        return {};
    }
}

function saveCart() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Unable to save UrbanCart cart:", error);
    }
}

export function addToCart(productId) {
    const id = Number(productId);

    const productExists = products.some(
        product => product.id === id
    );

    if (!productExists) {
        return;
    }

    cart[id] = (cart[id] || 0) + 1;

    saveCart();
}

export function changeQuantity(productId, delta) {
    const id = Number(productId);

    if (
        !Number.isInteger(delta) ||
        delta === 0 ||
        !products.some(product => product.id === id)
    ) {
        return;
    }

    const nextQuantity = (cart[id] || 0) + delta;

    if (nextQuantity <= 0) {
        delete cart[id];
    } else {
        cart[id] = nextQuantity;
    }

    saveCart();
}

export function removeItem(productId) {
    const id = Number(productId);

    if (!Object.hasOwn(cart, id)) {
        return;
    }

    delete cart[id];

    saveCart();
}

export function getCartItems() {
    return Object.entries(cart).flatMap(([id, quantity]) => {
        const product = products.find(
            item => item.id === Number(id)
        );

        if (!product) {
            return [];
        }

        return [{
            ...product,
            quantity,
            lineTotal: product.price * quantity
        }];
    });
}

export function getCartCount() {
    return Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0
    );
}

export function calculateTotals() {
    const subtotal = getCartItems().reduce(
        (total, item) => total + item.lineTotal,
        0
    );

    const delivery =
        subtotal > 0 && subtotal < FREE_DELIVERY_LIMIT
            ? DELIVERY_FEE
            : 0;

    const handlingAndGst =
        subtotal > 0 ? HANDLING_AND_GST : 0;

    return {
        subtotal,
        delivery,
        handlingAndGst,
        total: subtotal + delivery + handlingAndGst
    };
}

export function clearCart() {
    cart = {};

    saveCart();
}
