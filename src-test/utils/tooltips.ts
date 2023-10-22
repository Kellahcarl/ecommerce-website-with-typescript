import "bootstrap"; // Import the Bootstrap JavaScript
import { Tooltip } from "bootstrap"; // Import the Tooltip component

class ToolTipManager {
  private toolTips: NodeListOf<HTMLElement>;

  constructor() {
    this.toolTips = document.querySelectorAll(".tt");
    this.initToolTips();
  }

  private initToolTips() {
    this.toolTips.forEach((t) => {
      new Tooltip(t); // Use the imported Tooltip component
    });
  }
}

// Instantiate the class
const toolTipManager = new ToolTipManager();
