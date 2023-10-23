"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = __importDefault(require("bootstrap"));
const toolTips = document.querySelectorAll(".tt");
const url = "https://fakestoreapi.com/products";
//utilities
//#region
// get element
const getElement = (selection) => {
    const element = document.querySelector(selection);
    if (element)
        return element;
    throw new Error(`There is no such element: ${selection}, please check`);
};
// set item  to localstorage
const setLocalStorage = (key, value) => {
    const theValue = JSON.stringify(value);
    window.localStorage.setItem(key, theValue);
};
// get item form local storage
const getLocalStorage = (key) => {
    const element = window.localStorage.getItem(key);
    if (element) {
        return JSON.parse(element);
    }
    else
        return [];
};
const formatPrice = (price) => {
    const thePrice = Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(price.toFixed(2)));
    return thePrice;
};
toolTips.forEach((t) => {
    new bootstrap_1.default.Tooltip(t);
});
//function to get data from API
const getData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    if (response) {
        return response.json();
    }
    throw new Error("An error occurred while fetching the data.");
});
//#endregion
//get element inits
const products = getElement(".product-content");
const searchForm = getElement(".search-form");
const theValue = getElement('[type="search"]');
//add to cart section
//#region
// select item
const addToCart = (id, amt) => {
    // get the cart from local storage
    let cart = getLocalStorage("cart");
    // look for the product in the cart with his id
    const item = cart.find((cartItem) => cartItem.id == id);
    // case:product is't in the cart
    //   console.log(item);
    if (!item) {
        // getting product from the store
        const prod = findProduct(id);
        const product = Object.assign({ amount: amt }, prod);
        // adding prodcut to cart
        cart.push(product);
        // adding product to the DOM
        addToCartDOM(product);
        increaseCart();
        decreaseCart();
        // update cart in the localstorage
        setLocalStorage("cart", cart);
        // update the count and total
        cartCount();
        cartTotal();
    }
    // case that the item is in the cart
    else if (item) {
        // update ythe amount in the cart
        item.amount += amt;
        const cartAmount = document.querySelectorAll(".cart-amount");
        // update amount in theDOM
        if (cartAmount.length > 0) {
            cartAmount.forEach((amount) => {
                const element = amount;
                if (element.dataset.id) {
                    // Convert the dataset.id to a number and add 'amt'
                    const currentAmount = parseFloat(element.textContent || "0");
                    const newAmount = currentAmount + amt;
                    element.textContent = newAmount.toString();
                }
            });
        }
        // update cart localstorage
        setLocalStorage("cart", cart);
        cartCount();
        cartTotal();
    }
};
// find product in the store
const findProduct = (id) => {
    let store = getLocalStorage("store");
    const product = store.find((item) => item.id == id);
    return product;
};
// cart count
const cartCount = () => {
    const cart = getLocalStorage("cart");
    const countIcon = getElement(".count-icon");
    if (cart.length > 0) {
        const amount = cart.reduce((accu, curr) => {
            accu += curr.amount;
            return accu;
        }, 0);
        countIcon.textContent = amount.toString();
    }
    else {
        countIcon.textContent = "0";
    }
};
// cart total
const cartTotal = () => {
    const cart = getLocalStorage("cart");
    const total = getElement(".cart-footer");
    const checkout = getElement(".checkout");
    if (cart.length > 0) {
        total.classList.remove("hide");
        checkout.classList.remove("hide");
        const theTotal = cart.reduce((accu, curr) => {
            accu += parseFloat(curr.price) * parseFloat(curr.amount);
            return accu;
        }, 0);
        total.innerHTML = `Total: ${formatPrice(theTotal)}`;
    }
    else {
        total.classList.add("hide");
        checkout.classList.add("hide");
    }
};
// add prodcut to cartDOM
const addToCartDOM = (product) => {
    // remove empty msg
    const emptyMsg = getElement(".cart-emty-msg");
    emptyMsg.classList.add("hide");
    const { title, id, amount, image, price } = product;
    const article = document.createElement("article");
    article.setAttribute("data-id", id.toString());
    article.classList.add("row", "justify-content-start", "align-items-center", "border", "border-3", "border-top-0", "border-start-0", "border-end-0");
    article.innerHTML = `     <div class="col-4">
  <img src=${image} alt="Product ${title}" class="img-fluid" />
</div>
<div
  class="col-8 ps-2 align-items-end d-flex justify-content-between align-items-center"
>
  <div class="text d-inline-block">
    <h1 class="fs-5 product-name-cart mb-0">${title}</h1>
    <p class="text-muted mb-1 cart-price">${formatPrice(price)}</p>
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
    const cartContent = getElement(".cart-content");
    cartContent.appendChild(article);
    // select btns
    removeItem();
};
// remove item from the cart
const removeItem = () => {
    const removeBtns = document.querySelectorAll(".remove");
    if (removeBtns.length > 0) {
        removeBtns.forEach((remove) => {
            remove.addEventListener("click", (e) => {
                var _a, _b, _c;
                const id = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset.id) || "";
                // remove item from the DOM
                const parentElement = (_c = (_b = e.currentTarget) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
                if (parentElement) {
                    parentElement.remove();
                }
                // remove item from the local storage
                let cart = getLocalStorage("cart");
                const cartRemove = cart.filter((item) => {
                    return item.id != id;
                });
                setLocalStorage("cart", cartRemove);
                if (cartRemove.length < 1) {
                    const emtyMsg = getElement(".cart-emty-msg");
                    emtyMsg.classList.remove("hide");
                    cartCount();
                }
                // update count and total values
                cartCount();
                cartTotal();
            });
        });
    }
};
// icrease cart
const increaseCart = () => {
    const increaseBtns = document.querySelectorAll(".cart-increase");
    if (increaseBtns) {
        increaseBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                var _a;
                let cart = getLocalStorage("cart");
                const id = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset.id) || "";
                const item = cart.find((item) => item.id == id);
                item.amount++;
                const cartAmount = document.querySelectorAll(".cart-amount");
                if (cartAmount.length > 0) {
                    cartAmount.forEach((amount) => {
                        const element = amount;
                        if (element.dataset.id == id) {
                            const currentAmount = parseFloat(element.textContent || "0");
                            const newAmount = currentAmount + 1;
                            element.textContent = newAmount.toString();
                        }
                    });
                }
                setLocalStorage("cart", cart);
                cartCount();
                cartTotal();
            });
        });
    }
};
const decreaseCart = () => {
    const increaseBtns = document.querySelectorAll(".cart-decrease");
    if (increaseBtns) {
        increaseBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                var _a;
                let cart = getLocalStorage("cart");
                const id = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset.id) || "";
                const item = cart.find((item) => item.id == id);
                item.amount--;
                if (item.amount < 1) {
                    item.amount = 1;
                }
                const cartAmount = document.querySelectorAll(".cart-amount");
                if (cartAmount.length > 0) {
                    cartAmount.forEach((amount) => {
                        const element = amount;
                        const datasetId = element.dataset.id;
                        if (datasetId == id) {
                            // Convert the text content to a number
                            let currentAmount = parseFloat(element.textContent || "0");
                            // Perform decrement, but ensure it's never less than 1
                            currentAmount = Math.max(currentAmount - 1, 1);
                            // Convert back to a string before updating textContent
                            element.textContent = currentAmount.toString();
                        }
                    });
                }
                setLocalStorage("cart", cart);
                removeItem();
                cartCount();
                cartTotal();
            });
        });
    }
};
//cart
const CartUnit = () => {
    const cart = getLocalStorage("cart");
    cartCount();
    cartTotal();
    cart.forEach((item) => addToCartDOM(item));
    removeItem();
    increaseCart();
    decreaseCart();
};
//#endregion
//display products
//#region
const displayProducts = (data, section) => {
    const html = data
        .map((item) => {
        const { title, id, price, image } = item;
        return `    <div class="col-12 col-md-6 col-lg-4 ">
      <div class="card shadow features-card" data-id=${id}>
        <div class="card-body ">
          <div class="card-img-top ">
            <img
              class="card-img-top img-fluid "
              src=${image}
              alt=${title}
            />
          </div>
          <div
            class="card-title text-center h5 fw-normal text-muted mt-"
          >
            ${title}
          </div>
          <div class="card-text text-center">
            <span class="h4 text-center">${formatPrice(price)}</span>
          </div>
        </div>
        <div class="features-icons">
          <div
            class="f-icons d-flex flex-start align-items-center"
          >
            <span
              class="tt addBtn"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Add to cart"
              data-id=${id}
              ><i class="bi bi-cart-plus rounded-circle me-4 "   
              data-bs-toggle="offcanvas"
              data-bs-target="#cart"
              aria-controls="offcanvasRight"></i>
            </span>
            
          </div>
        </div>
      </div>
    </div>`;
    })
        .join("");
    section.innerHTML = html;
    const addBtns = document.querySelectorAll(".addBtn");
    addBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            var _a;
            const id = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset.id) || "";
            e.preventDefault();
            //   console.log(e.currentTarget);
            if (id) {
                addToCart(parseInt(id), 1);
            }
        });
    });
};
//#endregion
//price filter
//#region
const priceFilter = (data) => {
    displayPriceFilter(data);
    const priceInput = getElement('[type="range"]');
    window.addEventListener("input", (e) => {
        const price = parseFloat(priceInput.value);
        const filtredData = data.filter((item) => {
            return parseFloat(item.price) <= price;
        });
        const currentValue = getElement(".value");
        currentValue.textContent = `${formatPrice(price)}`;
        displayProducts(filtredData, products);
    });
};
const displayPriceFilter = (data) => {
    const prices = data.map((item) => {
        return item.price;
    });
    const maxPrice = Math.ceil(Math.max(...prices));
    const minPrice = Math.floor(Math.min(...prices));
    const priceRange = getElement(".price-r");
    priceRange.innerHTML = ` <input
  type="range"
  name="price"
  id="price"
  max="${maxPrice}"
  min="${minPrice}"
  value="${maxPrice}"
  class="w-100"
/>
<span
  class="d-flex justify-content-between align-items-center"
>
  <span class="min text-muted">${formatPrice(minPrice)}</span>
  <span class="max text-muted">${formatPrice(maxPrice)}</span>
</span>
<span class="value text-muted">value: ${formatPrice(maxPrice)}</span>`;
};
//#endregion
//search filter
//#region
const searchFilter = (data) => {
    theValue.addEventListener("input", () => {
        const value = theValue.value;
        console.log(value);
        if (!value) {
            displayProducts(data, products);
        }
    });
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = theValue.value;
        if (value) {
            const filtredData = data.filter((item) => {
                return item.title.toLowerCase().startsWith(value.toLowerCase());
            });
            if (filtredData.length > 0) {
                displayProducts(filtredData, products);
            }
            else {
                const products = getElement(".product-content");
                products.innerHTML = `<p class='text-center h1 lead text-muted text-capitalize' >Sorry there is no product with that name: ${value}</p>`;
            }
        }
    });
};
//#endregion
//categories filter
//#region
const categoriesFilter = (data) => {
    displayCategories(data);
    const categoriesBtn = displayCategories(data);
    categoriesBtn.forEach((it) => {
        it.addEventListener("click", (e) => {
            var _a;
            const category = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset.category) || "";
            categoriesBtn.forEach((cat) => {
                cat.classList.add("active");
                if (cat !== e.currentTarget) {
                    cat.classList.remove("active");
                }
            });
            const filtredData = data.filter((item) => {
                return item.category.startsWith(category);
            });
            displayProducts(filtredData, products);
            searchFilter(filtredData);
            priceFilter(filtredData);
            if (category === "All") {
                displayProducts(data, products);
                searchFilter(filtredData);
                priceFilter(data);
            }
        });
    });
};
const displayCategories = (data) => {
    let category = data.map((item) => {
        return item.category;
    });
    category = Array.from(new Set(category));
    category = category.sort();
    category.unshift("All");
    const cat = getElement(".categories");
    cat.innerHTML = category
        .map((item, index) => {
        let active = "";
        if (index === 0) {
            active = "active";
        }
        return `<li class="list-group-item border-0 text-muted ${active} cate" data-category=${item}>
    ${capitalize(item)}
  </li>`;
    })
        .join("");
    return document.querySelectorAll(".cate");
};
const capitalize = (myString) => {
    let myArr = [...myString];
    myArr[0] = myArr[0].toUpperCase();
    return `${myArr[0]}${myString.slice(1)}`;
};
//#endregion
//eventlistener
//#region
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getData(url)
        .then((result) => {
        const loader = getElement(".products-loader");
        loader.classList.add("hide");
        return result;
    })
        .catch((error) => {
        // Handle any errors from the `getData` function here.
    });
    setLocalStorage("store", data);
    displayProducts(data, products);
    searchFilter(data);
    categoriesFilter(data);
    priceFilter(data);
    CartUnit();
}));
//#endregion
