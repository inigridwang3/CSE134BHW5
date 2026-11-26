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
    const savedCompact = this.loadPreference();
    this.toggleAttribute("compact", savedCompact);
    this.render();
    this.setupListeners();
    this.syncExternalToggle();
  }

  syncExternalToggle() {
    const toggleBtn = document.querySelector("#toggle-compact-btn");
    if (!toggleBtn) return;
    const isCompact = this.hasAttribute("compact");
    toggleBtn.setAttribute("aria-pressed", String(isCompact));
    toggleBtn.textContent = isCompact ? "Expand View" : "Toggle Compact View";
  }

  // Responds when the external page button toggles the 'compact' attribute
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "compact" && oldValue !== newValue) {
      const isCompact = this.hasAttribute("compact");
      this.classList.toggle("is-compact", isCompact);
      this.savePreference(isCompact);
      this.syncExternalToggle();
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
      localStorage.setItem("hw5-project-panel-mode", String(Boolean(isCompact)));
    } catch (e) {
      console.warn("Could not save preference:", e);
    }
  }

  // PART 2 ADDITION: Asynchronous remote fetch method option
  async fetchRemoteData() {
    if (this.loading) return;
    const idx = this.currentIndex;
    this.loading = true;
    this.error = null;
    this.statusMessage = "Loading live data from server...";
    this.render();
    this.setupListeners();

    try {
      const response = await fetch("https://catfact.ninja/fact");
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (typeof data?.fact !== "string" || !data.fact.trim()) {
        throw new Error("Expected a non-empty 'fact' string in response.");
      }

            this.projects[idx] = { ...this.projects[idx], liveFact: data.fact.trim() };
      
      this.error = null;
      this.statusMessage = "Loaded remote data successfully!";
    } catch (err) {
      console.error("Fetch error:", err);
      this.error = err instanceof Error ? err.message : "Network request failed.";
      this.statusMessage = "Failed to load remote data. Click Try Again to retry.";
    } finally {
      this.loading = false;
      this.render();
      this.setupListeners();
    }
  } 

    // Builds the DOM once; afterwards render() only updates text and state
  render() {
    if (!this.built) {
      this.heading = document.createElement("h3");
      this.heading.textContent = "Featured Project Showcase";

      this.statusEl = document.createElement("div");
      this.statusEl.className = "status-message";
      this.statusEl.setAttribute("role", "status");
      this.statusEl.setAttribute("aria-live", "polite");

      this.titleEl = document.createElement("p");
      this.titleEl.className = "project-title";
      this.nameEl = document.createElement("strong");
      this.techEl = document.createElement("span");
      this.titleEl.append(this.nameEl, this.techEl);

      this.descEl = document.createElement("p");
      this.descEl.className = "project-desc";

      this.factEl = document.createElement("p");
      this.factEl.className = "live-fact";
      this.factEl.hidden = true;

      const controls = document.createElement("div");
      controls.className = "component-controls";
      controls.style.cssText = "display:flex;gap:10px;margin-top:1rem";

      this.nextBtn = document.createElement("button");
      this.nextBtn.type = "button";
      this.nextBtn.className = "next-project-btn";
      this.nextBtn.textContent = "Next Project";
      this.nextBtn.addEventListener("click", () => {
        this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        this.error = null;
        this.statusMessage = `Project ${this.currentIndex + 1} of ${this.projects.length}`;
        this.render();
      });

      this.fetchBtn = document.createElement("button");
      this.fetchBtn.type = "button";
      this.fetchBtn.className = "fetch-api-btn";
      this.fetchBtn.addEventListener("click", () => this.fetchRemoteData());

      controls.append(this.nextBtn, this.fetchBtn);
      this.append(this.heading, this.statusEl, this.titleEl, this.descEl, this.factEl, controls);
      this.built = true;
    }

    const p = this.projects[this.currentIndex];
    this.statusEl.textContent = this.statusMessage;
    this.nameEl.textContent = p.name;
    this.techEl.textContent = ` (${p.tech})`;
    this.descEl.textContent = p.desc;
    this.factEl.hidden = !p.liveFact;
    this.factEl.textContent = p.liveFact ? `Live API fact: ${p.liveFact}` : "";

    this.nextBtn.disabled = this.loading;
    this.fetchBtn.disabled = this.loading;
    this.fetchBtn.classList.toggle("retry-btn", Boolean(this.error) && !this.loading);
    this.fetchBtn.textContent = this.loading
      ? "Loading..."
      : this.error
        ? "Try Again"
        : "Fetch Live API Data";
  }

  // Listeners are attached once inside render(); kept so existing calls are harmless
  setupListeners() {}
}

// Register custom element tag (must include a hyphen)
customElements.define("project-panel", ProjectPanel);

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector("#toggle-compact-btn");
  const panel = document.querySelector("project-panel");
  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => {
      panel.toggleAttribute("compact");
    });
  }
});
