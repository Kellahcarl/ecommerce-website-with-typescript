class ShoppingCart {
  private cart: Array<{ id: number; amount: number }> = [];
  private store: Array<{ id: number; price: number }> = [];

  constructor(private url: string) {}

  // Utilities
  private getElement(selection: string) {
    const element = document.querySelector(selection);
    if (element) return element;
    throw new Error(`There is no such element: ${selection}, please check`);
  }

  private setLocalStorage(key: string, value: any) {
    const theValue = JSON.stringify(value);
    window.localStorage.setItem(key, theValue);
  }

  private getLocalStorage(key: string) {
    const element = JSON.parse(window.localStorage.getItem(key)!);
    if (element) {
      return element;
    } else return [];
  }

  private formatPrice(price: number) {
    const thePrice = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price.toFixed(2)));
    return thePrice;
  }

  private findProduct(id: number) {
    return this.store.find((item) => item.id === id);
  }

  private cartCount() {
    const countIcon = this.getElement(".count-icon");
    if (this.cart.length > 0) {
      const amount = this.cart.reduce((accu, curr) => accu + curr.amount, 0);
      countIcon.textContent = `${amount}`;
    } else {
      countIcon.textContent = "0";
    }
  }

  private cartTotal() {
    const total = this.getElement(".cart-footer");
    const checkout = this.getElement(".checkout");
    if (this.cart.length > 0) {
      total.classList.remove("hide");
      checkout.classList.remove("hide");
      const theTotal = this.cart.reduce((accu, curr) => {
        const product = this.findProduct(curr.id);
        if (product) {
          accu += product.price * curr.amount;
        }
        return accu;
      }, 0);
      total.innerHTML = `Total: ${this.formatPrice(theTotal)}`;
    } else {
      total.classList.add("hide");
      checkout.classList.add("hide");
    }
  }

  private addToCartDOM(product: any) {
    const emptyMsg = this.getElement(".cart-emty-msg");
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
    article.innerHTML = `
      <div class="col-4">
        <img src=${image} alt="Product ${title}" class="img-fluid" />
      </div>
      <div class="col-8 ps-2 align-items-end d-flex justify-content-between align-items-center">
        <div class="text d-inline-block">
          <h1 class="fs-5 product-name-cart mb-0">${title}</h1>
          <p class="text-muted mb-1 cart-price">${this.formatPrice(price)}</p>
          <span class="fs-6 fw-bold text-decoration-underline remove" data-id=${id}>Remove</span>
        </div>
        <div class="flex-column d-inline-flex justify-content-center align-items-end">
          <button type="button" class="d-flex justify-content-center align-items-center text-primary btn cart-increase" data-id=${id}>
            <i class="bi bi-chevron-compact-up"></i>
          </button>
          <button type="button" class="d-flex justify-content-center align-items-center btn cart-amount" data-id=${id}>
            ${amount}
          </button>
          <button type="button" class="d-flex justify-content-center align-items-center btn text-primary cart-decrease" data-id=${id}>
            <i class="bi bi-chevron-compact-down"></i>
          </button>
        </div>
      </div>`;
    const cartContent = this.getElement(".cart-content");
    cartContent.appendChild(article);
    this.removeItem();
  }

  private removeItem() {
    const removeBtns = document.querySelectorAll(".remove");
    if (removeBtns.length > 0) {
      removeBtns.forEach((remove) => {
        remove.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLElement | null;
          const id = target?.dataset.id;

          if (target) {
            const parent = target.parentElement?.parentElement?.parentElement;
            if (parent) {
              parent.remove();
            }
          }
          const cartRemove = this.cart.filter((item) => item.id !== Number(id));

          this.setLocalStorage("cart", cartRemove);
          if (cartRemove.length < 1) {
            const emtyMsg = this.getElement(".cart-emty-msg");
            emtyMsg.classList.remove("hide");
            this.cartCount();
          }
          this.cartCount();
          this.cartTotal();
        });
      });
    }
  }

  private increaseCart() {
    const increaseBtns = document.querySelectorAll(".cart-increase");
    if (increaseBtns) {
      increaseBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLElement | null;
          const id = target ? target.dataset.id : null;

          const numericId = Number(id); // Convert id to a number
          const item = this.cart.find((item) => item && item.id === numericId);

          if (item) {
            item.amount++;
          }

          const cartAmount = document.querySelectorAll(".cart-amount");

          if (cartAmount.length > 0) {
            cartAmount.forEach((amount) => {
              if (amount instanceof HTMLElement && amount.dataset?.id == id) {
                amount.textContent = (
                  parseInt(amount.textContent || "0") + 1
                ).toString();
              }
            });
          }
          this.setLocalStorage("cart", this.cart);
          this.cartCount();
          this.cartTotal();
        });
      });
    }
  }
  private addToCart(id: number, amt: number) {
    let cart = this.getLocalStorage("cart");

    const item = cart.find((cartItem: { id: number }) => cartItem.id === id);

    if (!item) {
      const product = this.findProduct(id);

      if (product) {
        const productToAdd = { amount: amt, ...product };

        cart.push(productToAdd);

        this.addToCartDOM(productToAdd);

        this.setLocalStorage("cart", cart);

        this.cartCount();
        this.cartTotal();
      }
    } else {
      item.amount += amt;

      const cartAmount = document.querySelectorAll(".cart-amount");

      if (cartAmount.length > 0) {
        cartAmount.forEach((amount) => {
          if (
            amount instanceof HTMLElement &&
            amount.dataset.id === id.toString()
          ) {
            amount.textContent = (
              parseInt(amount.textContent || "0") + amt
            ).toString();
          }
        });
      }

      this.setLocalStorage("cart", cart);

      this.cartCount();
      this.cartTotal();
    }
  }

  private decreaseCart() {
    const increaseBtns = document.querySelectorAll(".cart-decrease");
    if (increaseBtns) {
      increaseBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLElement | null;
          const id = target ? target.dataset.id : null;
          const numericId = Number(id); // Convert id to a number
          const item = this.cart.find((item) => item && item.id === numericId);
          if (item) {
            item.amount--;
          }

          if (item) {
            if (item.amount < 1) {
              item.amount = 1;
            }
          }

          const cartAmount = document.querySelectorAll(".cart-amount");

          if (cartAmount.length > 0) {
            cartAmount.forEach((amount) => {
              if (amount instanceof HTMLElement && amount.dataset?.id == id) {
                const currentAmount = parseInt(amount.textContent || "0");
                if (currentAmount > 1) {
                  amount.textContent = (currentAmount - 1).toString();
                } else {
                  amount.textContent = "1";
                }
              }
            });
          }

          this.setLocalStorage("cart", this.cart);
          this.removeItem();
          this.cartCount();
          this.cartTotal();
        });
      });
    }
  }

  public async initialize() {
    const loader = this.getElement(".products-loader");

    this.getData(this.url)
      .then((data) => {
        this.setLocalStorage("store", data);
        this.displayProducts(data);
        this.searchFilter(data);
        this.categoriesFilter(data);
        this.priceFilter(data);
        this.cartUnit();
      })
      .catch((error) => {
        // Handle the error if necessary
      })
      .then(() => {
        loader.classList.add("hide");
      });
  }

  private async getData(url: string) {
    const response = await fetch(url);
    if (response) {
      return response.json();
    }
    throw new Error("An error occurred. Please check fetchAPI.");
  }

  private cartUnit() {
    this.cartCount();
    this.cartTotal();
    this.cart.forEach((item) => this.addToCartDOM(item));
    this.removeItem();
    this.increaseCart();
    this.decreaseCart();
  }

  private displayProducts(data: any) {
    const products = this.getElement(".product-content");
    interface Product {
      title: string;
      id: number;
      price: number;
      image: string;
    }

    const html = data
      .map((item: Product) => {
        const { title, id, price, image } = item;
        return `
      <div class="col-12 col-md-6 col-lg-4 ">
        <div class="card shadow features-card" data-id=${id}>
          <div class="card-body ">
            <div class="card-img-top ">
              <img class="card-img-top img-fluid " src=${image} alt=${title} />
            </div>
            <div class="card-title text-center h5 fw-normal text-muted mt-">
              ${title}
            </div>
            <div class="card-text text-center">
              <span class="h4 text-center">${this.formatPrice(price)}</span>
            </div>
          </div>
          <div class="features-icons">
            <div class="f-icons d-flex flex-start align-items-center">
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

    products.innerHTML = html;
    const addBtns = document.querySelectorAll(".addBtn");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", (e: Event) => {
        const target = e.currentTarget as HTMLElement | null;
        const id = target ? target.dataset.id : null;

        e.preventDefault();
        if (id) {
          const numericId = parseInt(id, 10); // Assuming 'id' is a string representing an integer
          this.addToCart(numericId, 1);
        }
      });
    });
  }

  private searchFilter(data: any) {
    const theValue = this.getElement('[type="search"]') as HTMLInputElement;
    const searchForm = this.getElement(".search-form");
    theValue.addEventListener("input", () => {
      const value = theValue.value;
      console.log(value);
      if (!value) {
        this.displayProducts(data);
      }
    });

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      interface Product {
        title: string;
        id: number;
        price: number;
        image: string;
      }
      const value = theValue.value;
      if (value) {
        const filtredData = data.filter((item: Product) =>
          item.title.toLowerCase().startsWith(value.toLowerCase())
        );
        if (filtredData.length > 0) {
          this.displayProducts(filtredData);
        } else {
          const products = this.getElement(".product-content");
          products.innerHTML = `<p class='text-center h1 lead text-muted text-capitalize' >Sorry there is no product with that name: ${value}</p>`;
        }
      }
    });
  }

  private priceFilter(data: any) {
    const priceInput = this.getElement('[type="range"]') as HTMLInputElement;

    interface Product {
      title: string;
      id: number;
      price: number;
      image: string;
    }
    priceInput.addEventListener("input", (e) => {
      const price = parseFloat(priceInput.value);
      const filtredData = data.filter((item: Product) => {
        return item.price <= price;
      });
      const currentValue = this.getElement(".value");
      currentValue.textContent = `${this.formatPrice(price)}`;
      this.displayProducts(filtredData);
    });
    this.displayPriceFilter(data);
  }

  private displayPriceFilter(data: any) {
    interface Product {
      title: string;
      id: number;
      price: number;
      image: string;
    }
    const prices = data.map((item: Product) => {
      return item.price;
    });
    const maxPrice = Math.ceil(Math.max(...prices));
    const minPrice = Math.floor(Math.min(...prices));
    const priceRange = this.getElement(".price-r");
    priceRange.innerHTML = `
      <input
        type="range"
        name="price"
        id="price"
        max="${maxPrice}"
        min="${minPrice}"
        value="${maxPrice}"
        class="w-100"
      />
      <span class="d-flex justify-content-between align-items-center">
        <span class="min text-muted">${this.formatPrice(minPrice)}</span>
        <span class="max text-muted">${this.formatPrice(maxPrice)}</span>
      </span>
      <span class="value text-muted">value: ${this.formatPrice(
        maxPrice
      )}</span>`;
  }

  private categoriesFilter(data: any) {
    const categories = this.displayCategories(data);
    categories.forEach((it) => {
      it.addEventListener("click", (e) => {
        const category = (e.currentTarget as HTMLElement)?.dataset.category;
        categories.forEach((cat) => {
          cat.classList.add("active");
          if (cat !== e.currentTarget) {
            cat.classList.remove("active");
          }
        });
        interface Product {
          title: string;
          id: number;
          price: number;
          image: string;
          category: string;
        }
        const filtredData = data.filter((item: Product) => {
          return category ? item.category.startsWith(category) : false;
        });

        this.displayProducts(filtredData);
        this.searchFilter(filtredData);
        this.priceFilter(filtredData);

        if (category === "All") {
          this.displayProducts(data);
          this.searchFilter(data);
          this.priceFilter(data);
        }
      });
    });
  }

  private displayCategories(data: any) {
    interface Product {
      title: string;
      id: number;
      price: number;
      image: string;
      category: string;
    }
    let category = data.map((item: Product) => item.category);
    category = Array.from(new Set(category));
    category = category.sort();
    category.unshift("All");

    const cat = this.getElement(".categories");
    cat.innerHTML = category
      .map((item: string, index: Number) => {
        let active = "";
        if (index === 0) {
          active = "active";
        }
        return `
          <li class="list-group-item border-0 text-muted ${active} cate" data-category=${item}>
            ${this.capitalize(item)}
          </li>`;
      })
      .join("");
    return document.querySelectorAll(".cate");
  }

  private capitalize(myString: string) {
    let myArr = [...myString];
    myArr[0] = myArr[0].toUpperCase();
    return `${myArr[0]}${myString.slice(1)}`;
  }
}

const myShoppingCart = new ShoppingCart("https://fakestoreapi.com/products");
myShoppingCart.initialize();
