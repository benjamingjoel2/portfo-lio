# benjamin — portfolio

personal one-page portfolio for benjamin, designer & developer working from everywhere (working at tourground).

Vanilla HTML, CSS and JavaScript in a single `index.html`, no build step and no dependencies apart from one Google font (Bricolage Grotesque).

## Design

A mix of two references, with original code and content:

- [bleibtgleich.dev](https://bleibtgleich.dev/): the long Swiss-grid scroll, one grotesk at two sizes, staggered headlines, a thin vertical rule, ghost corner wordmarks, the clock and contact sections.
- [huyml.co](https://huyml.co/): the light grey canvas, the vertical rotated logo with tiny meta, the top bar (menu, working globally, for inquiries), the glyphic face for names, and the pinned selected-work index.

Everything is set in lowercase.

## Pages

- `/` home: name + reel hero, the pinned selected-work index, a short about, the local clock and contact
- `/work/` all selected projects (hover shows a preview), and `/work/<project>/` one page per project with desktop, full-scroll and phone screenshots
- `/about/` and `/contact/`

## Editing

Where you are: change `LOCATION` and `NEXT` at the top of `scripts/build.mjs` (city, country, country code, coordinates, time zone, and the "packing for…" line), then rebuild.


Pages are generated. Edit `scripts/works.json` (projects) or `scripts/build.mjs` (page copy), then run:

```bash
node scripts/build.mjs
```

Shared styles and behaviour live in `assets/site.css` and `assets/site.js`. Screenshots are in `assets/work/`.

The build adds a version tag to the stylesheet and script links (`?v=…`) that changes whenever those files change, so visitors never get a stale copy.
