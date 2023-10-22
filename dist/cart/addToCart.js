"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartUnit = void 0;
const utils_ts_1 = require("../utils/utils.ts");
class CartItem {
    constructor(id, title, amount, image, price) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.image = image;
        this.price = price;
    }
}
class CartManager {
    constructor() {
        this.cart = (0, utils_ts_1.getLocalStorage)("cart") || [];
    }
    findProduct(id) {
        const store = (0, utils_ts_1.getLocalStorage)("store") || [];
        return store.find((item) => item.id === id);
    }
    addToCartDOM(product) {
        const emptyMsg = (0, utils_ts_1.getElement)(".cart-emty-msg");
        emptyMsg.classList.add("hide");
        const { title, id, amount, image, price } = product;
        const article = document.createElement("article");
        article.setAttribute("data-id", id.toString());
        article.classList.add("row", "justify-content-start", "align-items-center", "border", "border-3", "border-top-0", "border-start-0", "border-end-0");
        article.innerHTML = `     
      <div class="col-4">
        <img src=${image} alt="Product ${title}" class="img-fluid" />
      </div>
      <div
        class="col-8 ps-2 align-items-end d-flex justify-content-between align-items-center"
      >
        <div class="text d-inline-block">
          <h1 class="fs-5 product-name-cart mb-0">${title}</h1>
          <p class="text-muted mb-1 cart-price">${(0, utils_ts_1.formatPrice)(price)}</p>
          <span class="fs-6 fw-bold text-decoration-underline remove" data-id=${id}
            >Remove</span
          >
        </div>
        <div
          class="flex-column d-inline-flex justify-content-center align-items-end"
        >
          <button
            type="button"
            class="d-flex justify-content-center align-items-center text-primary btn cart-increase"
            data-id=${id}>
            <i class="bi bi-chevron-compact-up"></i>
          </button>
          <button
            type="button"
            class="d-flex justify-content-center align-items-center btn cart-amount"
            data-id=${id}>
            ${amount}
          </button>
          <button
            type="button"
            class="d-flex justify-content-center align-items-center btn text-primary cart-decrease"
            data-id=${id}>
            <i class="bi bi-chevron-compact-down"></i>
          </button>
        </div>
      </div>`;
        const cartContent = (0, utils_ts_1.getElement)(".cart-content");
        cartContent.appendChild(article);
        this.removeCartItem();
    }
    removeCartItem() {
        const removeBtns = document.querySelectorAll(".remove");
        if (removeBtns.length > 0) {
            removeBtns.forEach((remove) => {
                remove.addEventListener("click", (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    e.currentTarget.parentElement.parentElement.parentElement.remove();
                    this.cart = this.cart.filter((item) => item.id !== id);
                    (0, utils_ts_1.setLocalStorage)("cart", this.cart);
                    if (this.cart.length < 1) {
                        const emptyMsg = (0, utils_ts_1.getElement)(".cart-emty-msg");
                        emptyMsg.classList.remove("hide");
                    }
                    this.updateCartInfo();
                });
            });
        }
    }
    increaseCartItem() {
        const increaseBtns = document.querySelectorAll(".cart-increase");
        if (increaseBtns) {
            increaseBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    const item = this.cart.find((item) => item.id === id);
                    if (item) {
                        item.amount++;
                        const cartAmount = document.querySelectorAll(".cart-amount");
                        if (cartAmount.length > 0) {
                            cartAmount.forEach((amount) => {
                                if (parseInt(amount.dataset.id) === id) {
                                    amount.textContent = (parseInt(amount.textContent) + 1).toString();
                                }
                            });
                        }
                        (0, utils_ts_1.setLocalStorage)("cart", this.cart);
                        this.updateCartInfo();
                    }
                });
            });
        }
    }
    decreaseCartItem() {
        const decreaseBtns = document.querySelectorAll(".cart-decrease");
        if (decreaseBtns) {
            decreaseBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    const item = this.cart.find((item) => item.id === id);
                    if (item) {
                        if (item.amount > 1) {
                            item.amount--;
                            const cartAmount = document.querySelectorAll(".cart-amount");
                            if (cartAmount.length > 0) {
                                cartAmount.forEach((amount) => {
                                    if (parseInt(amount.dataset.id) === id) {
                                        amount.textContent = (parseInt(amount.textContent) - 1).toString();
                                    }
                                });
                            }
                        }
                        (0, utils_ts_1.setLocalStorage)("cart", this.cart);
                        this.updateCartInfo();
                    }
                });
            });
        }
    }
    updateCartInfo() {
        this.cartCount();
        this.cartTotal();
    }
    cartCount() {
        const countIcon = (0, utils_ts_1.getElement)(".count-icon");
        if (this.cart.length > 0) {
            const amount = this.cart.reduce((accu, curr) => accu + curr.amount, 0);
            countIcon.textContent = amount.toString();
        }
        else {
            countIcon.textContent = "0";
        }
    }
    cartTotal() {
        const total = (0, utils_ts_1.getElement)(".cart-footer");
        const checkout = (0, utils_ts_1.getElement)(".checkout");
        if (this.cart.length > 0) {
            total.classList.remove("hide");
            checkout.classList.remove("hide");
            const theTotal = this.cart.reduce((accu, curr) => {
                accu += parseFloat(curr.price) * parseFloat(curr.amount);
                return accu;
            }, 0);
            total.innerHTML = `Total: ${(0, utils_ts_1.formatPrice)(theTotal)}`;
        }
        else {
            total.classList.add("hide");
            checkout.classList.add("hide");
        }
    }
    addToCart(id, amt) {
        const existingItem = this.cart.find((item) => item.id === id);
        if (!existingItem) {
            const product = this.findProduct(id);
            if (product) {
                product.amount = amt;
                this.cart.push(product);
                this.addToCartDOM(product);
                this.cartCount();
                this.increaseCartItem();
                this.decreaseCartItem();
                (0, utils_ts_1.setLocalStorage)("cart", this.cart);
            }
        }
        else {
            existingItem.amount += amt;
            const cartAmount = document.querySelectorAll(".cart-amount");
            if (cartAmount.length > 0) {
                cartAmount.forEach((amount) => {
                    if (parseInt(amount.dataset.id) === id) {
                        amount.textContent = (parseInt(amount.textContent) + amt).toString();
                    }
                });
            }
            (0, utils_ts_1.setLocalStorage)("cart", this.cart);
            this.cartCount();
            this.cartTotal();
        }
    }
}
class CartUnit {
    constructor() {
        const cartManager = new CartManager();
        cartManager.cartCount();
        cartManager.cartTotal();
        cartManager.removeCartItem();
        cartManager.increaseCartItem();
        cartManager.decreaseCartItem();
    }
}
exports.CartUnit = CartUnit;
