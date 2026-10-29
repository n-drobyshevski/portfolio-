# Design mockups

Explorations for the landing page, kept for reference. Nothing here is part of the production site.

## Round 1 (`round1/`)

Static comps made on a claude.ai Design canvas. The `.dc.html` files need the canvas runtime (`support.js`) and do not open on their own.

- `Main.dc.html` (A, Print): the direction that was picked. Newspaper masthead, Schibsted Grotesk + Newsreader, menu-style prices.
- `Midnight.dc.html` (B, Darkroom) and `Friendly.dc.html` (C, Notebook): the alternatives.

## Round 2 (`round2/`)

Animated prototypes: A's print feel with calmer colours, no header bar, the structure built from a print metaphor. Each `r2-*.html` is a self-contained page (GSAP 3.15 and Lenis from CDNs, Google Fonts) that opens directly in a browser.

- `r2-press.html` (Print Run): every scene is printed on a riso press and delivered onto a tabbed pile that works as the menu.
- `r2-sentence.html` (The Sentence): the headline's words break out of the line to become the menu, and each word opens its own page.
- `r2-leaflet.html` (The Leaflet): a roll-fold leaflet that unfolds crease by crease in 3D, lies open as a poster, then turns over to show the reply slip.
- `r3-leaflet-riso-blue.html`, `r3-leaflet-sage-apricot.html`, `r3-leaflet-night-desk.html`: The Leaflet in three colour schemes (the user picked The Leaflet). Only the colour tokens differ; desk furniture has its own `--desk-*` inks so a dark desk stays readable.
- `leaflet-made-properly.html`: the current version. The Leaflet in Riso Blue with the slogan "Made properly." (FR « Fait comme il faut. »), services and prices covering websites, apps, bots and branding, and the poster overprint blended like real ink.
- `index.html` is the overview page published as a claude.ai Artifact. It has no `<!doctype>` because the Artifact host wraps it.

All copy in `[brackets]` is a placeholder for real content (photo, projects, prices, city).
