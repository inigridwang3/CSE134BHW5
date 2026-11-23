document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector("#toggle-compact-btn");
  const projectPanel = document.querySelector("project-panel");

  if (toggleBtn && projectPanel) {
    toggleBtn.addEventListener("click", () => {
      // Toggles the 'compact' attribute on the custom element
      projectPanel.toggleAttribute("compact");
    });
  }
});
