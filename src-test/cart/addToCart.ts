import {
  formatPrice,
  getElement,
  getLocalStorage,
  setLocalStorage,
} from "../utils/utils.ts";

class CartItem {
  constructor(
    public id: number,
    public title: string,
    public amount: number,
    public image: string,
    public price: number
  ) {}
}

class CartManager {
  private cart: CartItem[];

  constructor() {
    this.cart = getLocalStorage("cart") || [];
  }

  private findProduct(id: number): CartItem | undefined {
    const store = getLocalStorage("store") || [];
    return store.find((item: { id: number }) => item.id === id) as CartItem;
  }

  private addToCartDOM(product: CartItem) {
    const emptyMsg = getElement(".cart-emty-msg");
    emptyMsg.classList.add("hide");

    const { title, id, amount, image, price } = product;
    const article = document.createElement("article");
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

    article.innerHTML = `     
      <div class="col-4">
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
    this.removeCartItem();
  }

  private removeCartItem() {
    const removeBtns = document.querySelectorAll(".remove");
    if (removeBtns.length > 0) {
      removeBtns.forEach((remove) => {
        remove.addEventListener("click", (e) => {
          const id = parseInt(e.currentTarget.dataset.id);
          e.currentTarget.parentElement.parentElement.parentElement.remove();
          this.cart = this.cart.filter((item) => item.id !== id);
          setLocalStorage("cart", this.cart);
          if (this.cart.length < 1) {
            const emptyMsg = getElement(".cart-emty-msg");
            emptyMsg.classList.remove("hide");
          }
          this.updateCartInfo();
        });
      });
    }
  }

  private increaseCartItem() {
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
                  amount.textContent = (
                    parseInt(amount.textContent) + 1
                  ).toString();
                }
              });
            }
            setLocalStorage("cart", this.cart);
            this.updateCartInfo();
          }
        });
      });
    }
  }

  private decreaseCartItem() {
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
                    amount.textContent = (
                      parseInt(amount.textContent) - 1
                    ).toString();
                  }
                });
              }
            }
            setLocalStorage("cart", this.cart);
            this.updateCartInfo();
          }
        });
      });
    }
  }

  private updateCartInfo() {
    this.cartCount();
    this.cartTotal();
  }

  public cartCount() {
    const countIcon = getElement(".count-icon");
    if (this.cart.length > 0) {
      const amount = this.cart.reduce((accu, curr) => accu + curr.amount, 0);
      countIcon.textContent = amount.toString();
    } else {
      countIcon.textContent = "0";
    }
  }

  public cartTotal() {
    const total = getElement(".cart-footer");
    const checkout = getElement(".checkout");
    if (this.cart.length > 0) {
      total.classList.remove("hide");
      checkout.classList.remove("hide");
      const theTotal = this.cart.reduce((accu, curr) => {
        accu += parseFloat(curr.price) * parseFloat(curr.amount);
        return accu;
      }, 0);
      total.innerHTML = `Total: ${formatPrice(theTotal)}`;
    } else {
      total.classList.add("hide");
      checkout.classList.add("hide");
    }
  }

  public addToCart(id: number, amt: number) {
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
        setLocalStorage("cart", this.cart);
      }
    } else {
      existingItem.amount += amt;
      const cartAmount = document.querySelectorAll(".cart-amount");
      if (cartAmount.length > 0) {
        cartAmount.forEach((amount) => {
          if (parseInt(amount.dataset.id) === id) {
            amount.textContent = (
              parseInt(amount.textContent) + amt
            ).toString();
          }
        });
      }
      setLocalStorage("cart", this.cart);
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

export { CartUnit };
