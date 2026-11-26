# SSG Exercise: Eleventy (11ty) Shared Section

Two pages (Home and About) built with Eleventy that share one layout,
including a common footer.

## Requirements
- Node.js and npm

## Commands

Run these from inside the `ssg-exercise/` folder:

```bash
npm install        # install dependencies
npm run build      # build the site into _site/
npm run preview    # serve locally with live reload
```

## Pages to preview

After running `npm run preview`, open:
- Home (`index.html`): http://localhost:8080/
- About (`about.html`): http://localhost:8080/about/

Each page shows its own content plus the shared footer.

## Shared section

The footer lives in `_includes/layout.html`. Edit it there, run
`npm run build`, and both pages show the change.
