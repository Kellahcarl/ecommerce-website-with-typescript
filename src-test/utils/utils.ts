class DomHelper {
  static getElement(selection: string): Element | null {
    const element = document.querySelector(selection);
    if (element) return element;
    throw new Error(`There is no such element: ${selection}, please check`);
  }
}

class LocalStorageHelper {
  static setLocalStorage(key: string, value: any): void {
    const theValue = JSON.stringify(value);
    window.localStorage.setItem(key, theValue);
  }

  static getLocalStorage(key: string): any {
    const itemString = window.localStorage.getItem(key);
    if (itemString) {
      const element = JSON.parse(itemString);
      return element;
    } else {
      return [];
    }

  }
}

class PriceFormatter {
  static formatPrice(price: number): string {
    const thePrice = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price.toFixed(2)));
    return thePrice;
  }
}

export { DomHelper, LocalStorageHelper, PriceFormatter };
