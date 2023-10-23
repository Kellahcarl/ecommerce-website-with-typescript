import bootstrap from "bootstrap";

const toolTips: NodeListOf<Element> = document.querySelectorAll(".tt");

const url: string = "https://fakestoreapi.com/products";



//utilities
//#region
// get element
const getElement = (selection: string): Element => {
  const element: Element | null = document.querySelector(selection);
  if (element) return element;
  throw new Error(`There is no such element: ${selection}, please check`);
};

// set item  to localstorage
const setLocalStorage = (key: string, value: any): void => {
  const theValue: string = JSON.stringify(value);
  window.localStorage.setItem(key, theValue);
};

// get item form local storage

const getLocalStorage = (key: string): any => {
  const element: string | null = window.localStorage.getItem(key);
  if (element) {
    return JSON.parse(element);
  } else return [];
};

const formatPrice = (price: number): string => {
  const thePrice: string = Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(price.toFixed(2)));
  return thePrice;
};

toolTips.forEach((t: Element) => {
  new bootstrap.Tooltip(t);
});

//function to get data from API
const getData = async (url: string): Promise<any> => {
  const response: Response = await fetch(url);
  if (response) {
    return response.json();
  }
  throw new Error("An error occurred while fetching the data.");

};
//#endregion

//get element inits
const products: Element = getElement(".product-content");
const searchForm: Element = getElement(".search-form");
const theValue: Element = getElement('[type="search"]');

//add to cart section
//#region
// select item

const addToCart = (id: number, amt: number): void => {
  // get the cart from local storage
  let cart: any[] = getLocalStorage("cart");
  // look for the product in the cart with his id
  const item: any = cart.find((cartItem: any) => cartItem.id == id);
  // case:product is't in the cart
  //   console.log(item);
  if (!item) {
    // getting product from the store
    const prod: any = findProduct(id);
    const product: any = { amount: amt, ...prod };
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
    const cartAmount: NodeListOf<Element> =
      document.querySelectorAll(".cart-amount");
    // update amount in theDOM
    if (cartAmount.length > 0) {
      cartAmount.forEach((amount: Element) => {
        const element = amount as HTMLElement;
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
const findProduct = (id: number): any => {
  let store: any[] = getLocalStorage("store");

  const product: any = store.find((item: any) => item.id == id);
  return product;
};

// cart count
const cartCount = (): void => {
  const cart: any[] = getLocalStorage("cart");
  const countIcon: Element = getElement(".count-icon");
  if (cart.length > 0) {
    const amount: number = cart.reduce((accu: number, curr: any) => {
      accu += curr.amount;

      return accu;
    }, 0);

    countIcon.textContent = amount.toString();
  } else {
    countIcon.textContent = "0";
  }
};

// cart total
const cartTotal = (): void => {
  const cart: any[] = getLocalStorage("cart");
  const total: Element = getElement(".cart-footer");
  const checkout: Element = getElement(".checkout");
  if (cart.length > 0) {
    total.classList.remove("hide");
    checkout.classList.remove("hide");
    const theTotal: number = cart.reduce((accu: number, curr: any) => {
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
const addToCartDOM = (product: any): void => {
  // remove empty msg
  const emptyMsg: Element = getElement(".cart-emty-msg");
  emptyMsg.classList.add("hide");
  const { title, id, amount, image, price } = product;
  const article: Element = document.createElement("article");
  article.setAttribute("data-id", id.toString());
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
  const cartContent: Element = getElement(".cart-content");
  cartContent.appendChild(article);
  // select btns
  removeItem();
};

// remove item from the cart
const removeItem = (): void => {
  const removeBtns: NodeListOf<Element> = document.querySelectorAll(".remove");
  if (removeBtns.length > 0) {
    removeBtns.forEach((remove: Element) => {
      remove.addEventListener("click", (e: Event) => {
        const id: string = (e.currentTarget as HTMLElement)?.dataset.id || "";

        // remove item from the DOM
        const parentElement = (e.currentTarget as HTMLElement)?.parentElement
          ?.parentElement;
        if (parentElement) {
          parentElement.remove();
        }

        // remove item from the local storage
        let cart: any[] = getLocalStorage("cart");
        const cartRemove: any[] = cart.filter((item: any) => {
          return item.id != id;
        });
        setLocalStorage("cart", cartRemove);
        if (cartRemove.length < 1) {
          const emtyMsg: Element = getElement(".cart-emty-msg");
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
const increaseCart = (): void => {
  const increaseBtns: NodeListOf<Element> =
    document.querySelectorAll(".cart-increase");
  if (increaseBtns) {
    increaseBtns.forEach((btn: Element) => {
      btn.addEventListener("click", (e: Event) => {
        let cart: any[] = getLocalStorage("cart");
        const id: string = (e.currentTarget as HTMLElement)?.dataset.id || "";

        const item: any = cart.find((item: any) => item.id == id);
        item.amount++;
        const cartAmount: NodeListOf<Element> =
          document.querySelectorAll(".cart-amount");

        if (cartAmount.length > 0) {
          cartAmount.forEach((amount: Element) => {
            const element = amount as HTMLElement;
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
const decreaseCart = (): void => {
  const increaseBtns: NodeListOf<Element> =
    document.querySelectorAll(".cart-decrease");
  if (increaseBtns) {
    increaseBtns.forEach((btn: Element) => {
      btn.addEventListener("click", (e: Event) => {
        let cart: any[] = getLocalStorage("cart");
        const id: string = (e.currentTarget as HTMLElement)?.dataset.id || "";

        const item: any = cart.find((item: any) => item.id == id);
        item.amount--;
        if (item.amount < 1) {
          item.amount = 1;
        }
        const cartAmount: NodeListOf<Element> =
          document.querySelectorAll(".cart-amount");

        if (cartAmount.length > 0) {
          cartAmount.forEach((amount: Element) => {
            const element = amount as HTMLElement;
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
const CartUnit = (): void => {
  const cart: any[] = getLocalStorage("cart");
  cartCount();
  cartTotal();
  cart.forEach((item: any) => addToCartDOM(item));
  removeItem();
  increaseCart();
  decreaseCart();
};
//#endregion

//display products
//#region
const displayProducts = (data: any[], section: Element): void => {
  const html: string = data
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
  const addBtns: NodeListOf<Element> = document.querySelectorAll(".addBtn");
  addBtns.forEach((btn: Element) => {
    btn.addEventListener("click", function (e: Event) {
      const id: string = (e.currentTarget as HTMLElement)?.dataset.id || "";

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
const priceFilter = (data: any[]): void => {
  displayPriceFilter(data);
  const priceInput: HTMLInputElement = getElement(
    '[type="range"]'
  ) as HTMLInputElement;
  window.addEventListener("input", (e: Event) => {
    const price: number = parseFloat(priceInput.value);
    const filtredData: any[] = data.filter((item) => {
      return parseFloat(item.price) <= price;
    });
    const currentValue: Element = getElement(".value");
    currentValue.textContent = `${formatPrice(price)}`;
    displayProducts(filtredData, products);
  });
};

const displayPriceFilter = (data: any[]): void => {
  const prices: number[] = data.map((item) => {
    return item.price;
  });
  const maxPrice: number = Math.ceil(Math.max(...prices));
  const minPrice: number = Math.floor(Math.min(...prices));
  const priceRange: Element = getElement(".price-r");
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
const searchFilter = (data: any[]): void => {
  theValue.addEventListener("input", () => {
    const value: string = (theValue as HTMLInputElement).value;
    console.log(value);
    if (!value) {
      displayProducts(data, products);
    }
  });

  searchForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const value: string = (theValue as HTMLInputElement).value;
    if (value) {
      const filtredData: any[] = data.filter((item) => {
        return item.title.toLowerCase().startsWith(value.toLowerCase());
      });
      if (filtredData.length > 0) {
        displayProducts(filtredData, products);
      } else {
        const products: Element = getElement(".product-content");
        products.innerHTML = `<p class='text-center h1 lead text-muted text-capitalize' >Sorry there is no product with that name: ${value}</p>`;
      }
    }
  });
};
//#endregion

//categories filter
//#region
const categoriesFilter = (data: any[]): void => {
  displayCategories(data);

  const categoriesBtn: NodeListOf<Element> = displayCategories(data);

  categoriesBtn.forEach((it: Element) => {
    it.addEventListener("click", (e: Event) => {
     const category: string =
       (e.currentTarget as HTMLElement)?.dataset.category || "";


      categoriesBtn.forEach((cat: Element) => {
        cat.classList.add("active");
        if (cat !== e.currentTarget) {
          cat.classList.remove("active");
        }
      });

      const filtredData: any[] = data.filter((item) => {
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

const displayCategories = (data: any[]): NodeListOf<Element> => {
  let category: string[] = data.map((item) => {
    return item.category;
  });
  category = Array.from(new Set(category));
  category = category.sort();
  category.unshift("All");

  const cat: Element = getElement(".categories");
  cat.innerHTML = category
    .map((item, index) => {
      let active: string = "";
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

const capitalize = (myString: string): string => {
  let myArr: string[] = [...myString];
  myArr[0] = myArr[0].toUpperCase();
  return `${myArr[0]}${myString.slice(1)}`;
};
//#endregion

//eventlistener
//#region
window.addEventListener("DOMContentLoaded", async () => {
  const data: any[] = await getData(url)
    .then((result) => {
      const loader: Element = getElement(".products-loader");
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
});

//#endregion
