# benjamin — portfolio

one-page portfolio for benjamin, designer & developer at tourground.

Vanilla HTML, CSS and JavaScript in a single `index.html`, no build step and no dependencies apart from two Google fonts (Inter Tight and Belleza).

## Design

A mix of two references, with original code and content:

- [bleibtgleich.dev](https://bleibtgleich.dev/): the long Swiss-grid scroll, one grotesk at two sizes, staggered headlines, a thin vertical rule, ghost corner wordmarks, the clock and contact sections.
- [huyml.co](https://huyml.co/): the light grey canvas, the vertical rotated logo with tiny meta, the top bar (menu, working globally, for inquiries), the glyphic face for names, and the pinned selected-work index.

Everything is set in lowercase.

## Features

- Line-by-line headline reveals on scroll
- Selected-work index: scroll flips through 12 live sites (real screenshots in `assets/work/`), with a big counter, role / destination / live-at details, a centred project list and colour swatches taken from each screenshot
- Network table of every live Tourground site, grouped by region, from the Tourground directory
- Live Lagos (WAT) clock
- One-click email copy with a toast
- Respects `prefers-reduced-motion`
