"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceFormatter = exports.LocalStorageHelper = exports.DomHelper = void 0;
class DomHelper {
    static getElement(selection) {
        const element = document.querySelector(selection);
        if (element)
            return element;
        throw new Error(`There is no such element: ${selection}, please check`);
    }
}
exports.DomHelper = DomHelper;
class LocalStorageHelper {
    static setLocalStorage(key, value) {
        const theValue = JSON.stringify(value);
        window.localStorage.setItem(key, theValue);
    }
    static getLocalStorage(key) {
        const itemString = window.localStorage.getItem(key);
        if (itemString) {
            const element = JSON.parse(itemString);
            return element;
        }
        else {
            return [];
        }
    }
}
exports.LocalStorageHelper = LocalStorageHelper;
class PriceFormatter {
    static formatPrice(price) {
        const thePrice = new Intl.NumberFormat("en-us", {
            style: "currency",
            currency: "USD",
        }).format(parseFloat(price.toFixed(2)));
        return thePrice;
    }
}
exports.PriceFormatter = PriceFormatter;
