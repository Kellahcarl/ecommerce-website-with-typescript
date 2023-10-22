"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap"); // Import the Bootstrap JavaScript
const bootstrap_1 = require("bootstrap"); // Import the Tooltip component
class ToolTipManager {
    constructor() {
        this.toolTips = document.querySelectorAll(".tt");
        this.initToolTips();
    }
    initToolTips() {
        this.toolTips.forEach((t) => {
            new bootstrap_1.Tooltip(t); // Use the imported Tooltip component
        });
    }
}
// Instantiate the class
const toolTipManager = new ToolTipManager();
