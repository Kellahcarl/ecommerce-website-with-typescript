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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFetcher = void 0;
class DataFetcher {
    getData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url);
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
}
exports.DataFetcher = DataFetcher;
