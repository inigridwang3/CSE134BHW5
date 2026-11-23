class FactPanel extends HTMLElement {
  // 1. Tell the browser to watch the 'compact' attribute
  static get observedAttributes() {
    return ["compact"];
  }

  constructor() {
    super();
    // Local sample data for Part 1
    this.facts = [
      "Semantic HTML improves screen reader navigation and SEO.",
      "CSS custom properties let you inherit site themes dynamically.",
      "The DOM represents the page as a live, interactive tree of nodes."
    ];
    this.currentIndex = 0;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  // 2. Respond when the external button toggles the 'compact' attribute
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "compact" && oldValue !== newValue) {
      this.classList.toggle("is-compact", this.hasAttribute("compact"));
    }
  }

  render() {
    // Clear any existing content
    this.innerHTML = "";

    // Create interface containers/elements
    const heading = document.createElement("h3");
    heading.textContent = "Portfolio Quick Fact";

    const contentArea = document.createElement("p");
    contentArea.className = "fact-text";
    contentArea.textContent = this.facts[this.currentIndex];

    const statusMsg = document.createElement("span");
    statusMsg.className = "status-message";
    statusMsg.textContent = `Fact ${this.currentIndex + 1} of ${this.facts.length}`;

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "next-fact-btn";
    nextBtn.textContent = "Next Fact";

    // Append elements to the custom element root
    this.appendChild(heading);
    this.appendChild(contentArea);
    this.appendChild(statusMsg);
    this.appendChild(nextBtn);
  }

  setupListeners() {
    const nextBtn = this.querySelector(".next-fact-btn");
    nextBtn.addEventListener("click", () => {
      // Cycle through items
      this.currentIndex = (this.currentIndex + 1) % this.facts.length;
      
      // Update text and status without a page reload
      this.querySelector(".fact-text").textContent = this.facts[this.currentIndex];
      this.querySelector(".status-message").textContent = `Fact ${this.currentIndex + 1} of ${this.facts.length}`;
    });
  }
}

// Register the custom element tag (must contain a hyphen)
customElements.define("fact-panel", FactPanel);
