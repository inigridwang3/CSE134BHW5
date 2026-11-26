# CSE 134B Homework 5: Portfolio & Web Components

## SSG exercise
- **Folder:** `ssg-exercise/`
- **Generator:** Eleventy (11ty)
- **Pages to preview:**
  - Home (`index.html`): http://localhost:8080/
  - About (`about.html`): http://localhost:8080/about/
- **Commands** (run inside `ssg-exercise/`; full details in `ssg-exercise/README.md`):

```bash
npm install
npm run build
npm run preview
```

## Design note

**What the visitor wants:** to explore project details and get live data
without reloading the page.

**Action traced:** the visitor clicks "Fetch Live API Data" in the
`<project-panel>` custom element.

1. The click handler calls `fetchRemoteData()`.
2. The component sets `loading = true`, disables the fetch button, and shows
   "Loading live data from server..." in the `role="status"` element.
3. `fetch("https://catfact.ninja/fact")` requests data. The component checks
   `response.ok` and confirms the JSON has a non-empty string `fact`.
4. The fact is written into the panel with `textContent`, so remote text is
   never inserted as HTML.

**What the visitor sees**
- **While waiting:** the status reads "Loading live data from server..." and
  the button is disabled.
- **On success:** the status reads "Loaded remote data successfully!" and the
  fact appears in the panel.
- **On failure:** the status reads "Failed to load remote data. Click Try Again
  to retry." and the button's label changes to "Try Again". Clicking it
  repeats the request without reloading the page, and the error clears when
  it succeeds.

**Other behavior**
- The external "Toggle Compact View" button toggles the observed `compact`
  attribute, and the component responds in `attributeChangedCallback()`.
- The compact/expanded choice is saved in `localStorage` under
  `hw5-project-panel-mode`, validated on load, and wrapped in `try/catch`, so
  the control still works if storage is unavailable.
- With JavaScript disabled, the rest of the portfolio stays usable and a
  `<noscript>` message explains that the widget needs JavaScript.
