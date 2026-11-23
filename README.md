# CSE 134B Homework 5 Portfolio & Web Components

## SSG Exercise Path & Preview Instructions
- **SSG Exercise Folder Path:** `ssg-exercise/`
- **Pages Generated / Previewed:** `index.html` (Home) and `about.html` (About)
- **SSG Commands:** See `ssg-exercise/README.md` for full installation, build, and local preview instructions.

---

## Design Note: Component Architecture & State Lifecycle

### User Goal & Action Traced
* **Visitor Goal:** The visitor wants to explore dynamic project insights or live data updates without reloading the entire portfolio page.
* **Action:** The visitor clicks the **"Fetch Live API Data"** button inside the `<project-panel>` custom element.

### Lifecycle Trace
1. **Trigger & Loading State:** 
   * The click event listener in `project-panel.js` fires `fetchRemoteData()`.
   * The component sets `this.loading = true`, updates the accessible status element (`role="status"`, `aria-live="polite"`), and re-renders to display a disabled loading state ("Loading...").
2. **API Request & Defensive Validation:**
   * An asynchronous `fetch()` call requests data from the remote endpoint (`https://catfact.ninja/fact`).
   * The component checks `response.ok` and validates defensively that the returned JSON contains a valid string property.
3. **Outcome States:**
   * **On Success:** The component updates its internal state with the fetched data, resets `this.loading = false`, updates the DOM title/description, and clears any previous error states.
   * **On Failure (Network/Server Error):** The `catch` block intercepts the exception, sets `this.error`, logs a warning, and switches the control panel view to display a **"Try Again"** retry button so the user can recover smoothly.
