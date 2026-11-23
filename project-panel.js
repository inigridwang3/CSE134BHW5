class ProjectPanel extends HTMLElement {
  // Watch for the 'compact' attribute from an external page button
  static get observedAttributes() {
    return ["compact"];
  }

  constructor() {
    super();
    // Local sample data for Part 1
    this.projects = [
      { name: "Educational Water Game", tech: "C++, WebAssembly, WebGL", desc: "Teaches children water-saving techniques through interactive puzzles." },
      { name: "Real-time Shader Sandbox", tech: "GLSL, WebGPU, JavaScript", desc: "A browser-based tool for testing custom procedural shaders live." },
      { name: "Design Enterprise Tool", tech: "TypeScript, Custom Elements", desc: "High-performance configuration tool for creative layouts." }
    ];
    this.currentIndex = 0;

    // PART 2 ADDITION: Status, loading, error, and localStorage persistence states
    this.statusMessage = `Project ${this.currentIndex + 1} of ${this.projects.length}`;
    this.loading = false;
    this.error = null;
    this.isCompactPref = this.loadPreference();
  }

  connectedCallback() {
    // PART 2 ADDITION: Apply stored compact preference on load
    if (this.isCompactPref) {
      this.setAttribute("compact", "");
    }
    this.render();
    this.setupListeners();
  }

  // Responds when the external page button toggles the 'compact' attribute
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "compact" && oldValue !== newValue) {
      const isCompact = this.hasAttribute("compact");
      this.classList.toggle("is-compact", isCompact);
      
      // PART 2 ADDITION: Save preference change to localStorage
      this.savePreference(isCompact);
    }
  }

  // PART 2 ADDITION: localStorage helper methods with try/catch fallback
  loadPreference() {
    try {
      const saved = localStorage.getItem("hw5-project-panel-mode");
      
      // Strict validation: check if the retrieved value matches expected strings
      if (saved === "true" || saved === "false") {
        return saved === "true";
      }
      
      return false; // Default fallback if no value exists or if it's unrecognized
    } catch (e) {
      console.warn("localStorage unavailable:", e);
      return false; // Fallback on read failure
    }
  }

  savePreference(isCompact) {
    try {
      localStorage.setItem("hw5-project-panel-mode", isCompact);
    } catch (e) {
      console.warn("Could not save preference:", e);
      // Requirement check: Even if writing fails, the preference still applies for the current page session
    } 
  }

  // PART 2 ADDITION: Asynchronous remote fetch method option
  async fetchRemoteData() {
    this.loading = true;
    this.error = null;
    this.statusMessage = "Loading live data from server...";
    this.render();

    try {
      const response = await fetch("https://catfact.ninja/fact");
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (typeof data?.fact !== "string") {
        throw new Error("Expected a 'fact' string in response.");
      }

      // Temporarily swap current item with fetched remote data to satisfy Part 2
      this.projects[this.currentIndex].name = "Live API Fact: " + data.fact;
      this.statusMessage = "Loaded remote data successfully!";
      this.loading = false;
    } catch (err) {
      console.error("Fetch error:", err);
      this.error = err.message || "Network request failed.";
      this.statusMessage = "Failed to load remote data.";
      this.loading = false;
    } finally {
      this.render();
      this.setupListeners();
    }
  }

  render() {
    this.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Featured Project Showcase";

    // PART 2 ADDITION: Accessible status element with role="status" and aria-live
    const statusMsg = document.createElement("div");
    statusMsg.className = "status-message";
    statusMsg.setAttribute("role", "status");
    statusMsg.setAttribute("aria-live", "polite");
    statusMsg.textContent = this.statusMessage;

    const titleEl = document.createElement("p");
    titleEl.className = "project-title";
    titleEl.innerHTML = `<strong>${this.projects[this.currentIndex].name}</strong> (${this.projects[this.currentIndex].tech})`;

    const descEl = document.createElement("p");
    descEl.className = "project-desc";
    descEl.textContent = this.projects[this.currentIndex].desc;

    // Button container holding both Part 1 cycle button and Part 2 fetch/retry buttons
    const btnContainer = document.createElement("div");
    btnContainer.className = "component-controls";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "10px";
    btnContainer.style.marginTop = "1rem";

    if (this.error) {
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "retry-btn";
      retryBtn.textContent = "Try Again";
      retryBtn.disabled = this.loading;
      btnContainer.appendChild(retryBtn);
    } else {
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "next-project-btn";
      nextBtn.textContent = "Next Project";
      btnContainer.appendChild(nextBtn);

      const fetchBtn = document.createElement("button");
      fetchBtn.type = "button";
      fetchBtn.className = "fetch-api-btn";
      fetchBtn.textContent = this.loading ? "Loading..." : "Fetch Live API Data";
      fetchBtn.disabled = this.loading;
      btnContainer.appendChild(fetchBtn);
    }

    // Append to the component root
    this.appendChild(heading);
    this.appendChild(statusMsg);
    this.appendChild(titleEl);
    this.appendChild(descEl);
    this.appendChild(btnContainer);
  }
 
  setupListeners() {
    const nextBtn = this.querySelector(".next-project-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        this.statusMessage = `Project ${this.currentIndex + 1} of ${this.projects.length}`;
        this.render();
        this.setupListeners();
      });
    }

    // PART 2 ADDITION: Trigger remote fetch or retry
    const fetchBtn = this.querySelector(".fetch-api-btn");
    if (fetchBtn) {
      fetchBtn.addEventListener("click", () => this.fetchRemoteData());
    }

    const retryBtn = this.querySelector(".retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => this.fetchRemoteData());
    }  
  }
}

// Register custom element tag (must include a hyphen)
customElements.define("project-panel", ProjectPanel);
