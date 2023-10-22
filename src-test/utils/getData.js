"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFetcher = void 0;
class DataFetcher {
    async getData(url) {
        try {
            const response = await fetch(url);
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
    }
}
exports.DataFetcher = DataFetcher;
