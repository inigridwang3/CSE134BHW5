# SSG Exercise: Eleventy (11ty) Shared Section

Two pages (Home and About) built with Eleventy that share one layout,
including a common footer.

## Commands

```bash
npm install        # install dependencies
npm run build      # build the site into _site/
npm run preview    # serve locally with live reload
```

## Pages to preview

After running `npm run preview`, open:
- Home: http://localhost:8080/ (also reachable at http://localhost:8080/index)
- About: http://localhost:8080/about/

## Shared section

The footer lives in `_includes/layout.html` (change this if your file is named
differently). Edit it there, run `npm run build`, and both pages show the
change.
