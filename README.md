# benjamin — portfolio

personal one-page portfolio for benjamin, designer & developer based in lagos (currently working with tourground).

Vanilla HTML, CSS and JavaScript in a single `index.html`, no build step and no dependencies apart from two Google fonts (Inter Tight and Belleza).

## Design

A mix of two references, with original code and content:

- [bleibtgleich.dev](https://bleibtgleich.dev/): the long Swiss-grid scroll, one grotesk at two sizes, staggered headlines, a thin vertical rule, ghost corner wordmarks, the clock and contact sections.
- [huyml.co](https://huyml.co/): the light grey canvas, the vertical rotated logo with tiny meta, the top bar (menu, working globally, for inquiries), the glyphic face for names, and the pinned selected-work index.

Everything is set in lowercase.

## Pages

- `/` home: name + reel hero, the pinned selected-work index, a short about, the lagos clock and contact
- `/work/` all selected projects (hover shows a preview), and `/work/<project>/` one page per project with desktop, full-scroll and phone screenshots
- `/gallery/` every screen, filterable by project, with a lightbox
- `/about/` and `/contact/`

## Editing

Pages are generated. Edit `scripts/works.json` (projects) or `scripts/build.mjs` (page copy), then run:

```bash
node scripts/build.mjs
```

Shared styles and behaviour live in `assets/site.css` and `assets/site.js`. Screenshots are in `assets/work/`.

`vercel.json` serves `/assets/*` from this repo through jsDelivr, pinned to a commit, so the HTML can be deployed on its own. Update the commit hash there when assets change.
