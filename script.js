const toolTips = document.querySelectorAll(".tt");

const url = "https://fakestoreapi.com/products";

//utilities
//#region
// get element
const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(`There is no such element: ${selection}, please check`);
};

// set item  to localstorage
const setLocalStorage = (key, value) => {
  const theValue = JSON.stringify(value);
  window.localStorage.setItem(key, theValue);
};

// get item form local storage

const getLocalStorage = (key) => {
  const element = JSON.parse(window.localStorage.getItem(key));
  if (element) {
    return element;
  } else return [];
};

const formatPrice = (price) => {
  const thePrice = Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(price.toFixed(2));
  return thePrice;
};

toolTips.forEach((t) => {
  new bootstrap.Tooltip(t);
});

//function to get data from API
const getData = async (url) => {
  const response = await fetch(url);
  if (response) {
    return response.json();
  }
  throw new Error((err) => console.log(err));
};
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
    const product = { amount: amt, ...prod };
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
        if (amount.dataset.id == item.id) {
          amount.textContent = parseFloat(amount.textContent) + amt;
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

    countIcon.textContent = amount;
  } else {
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
  } else {
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
  article.setAttribute("data-id", id);
  article.classList.add(
    "row",
    "justify-content-start",
    "align-items-center",
    "border",
    "border-3",
    "border-top-0",
    "border-start-0",
    "border-end-0"
  );
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
        const id = e.currentTarget.dataset.id;
        // remove item from the DOM
        e.currentTarget.parentElement.parentElement.parentElement.remove();
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
        let cart = getLocalStorage("cart");
        const id = e.currentTarget.dataset.id;
        const item = cart.find((item) => item.id == id);
        item.amount++;
        const cartAmount = document.querySelectorAll(".cart-amount");

        if (cartAmount.length > 0) {
          cartAmount.forEach((amount) => {
            if (amount.dataset.id == id) {
              amount.textContent++;
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
        let cart = getLocalStorage("cart");
        const id = e.currentTarget.dataset.id;
        const item = cart.find((item) => item.id == id);
        item.amount--;
        if (item.amount < 1) {
          item.amount = 1;
        }
        const cartAmount = document.querySelectorAll(".cart-amount");

        if (cartAmount.length > 0) {
          cartAmount.forEach((amount) => {
            if (amount.dataset.id == id) {
              amount.textContent--;
              if (amount.textContent < 1) {
                amount.textContent = 1;
              }
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
      const id = e.currentTarget.dataset.id;
      e.preventDefault();
      //   console.log(e.currentTarget);
      if (id) {
        addToCart(id, 1);
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
      } else {
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
      const category = e.currentTarget.dataset.category;

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
window.addEventListener("DOMContentLoaded", async () => {
  const data = await getData(url).finally(() => {
    const loader = getElement(".products-loader");
    loader.classList.add("hide");
  });
  setLocalStorage("store", data);
  displayProducts(data, products);

  searchFilter(data);
  categoriesFilter(data);
  priceFilter(data);
  CartUnit();
});

//#endregion
