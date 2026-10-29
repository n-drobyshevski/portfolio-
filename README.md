# Nicolai Drobyshevski: freelance site

A bilingual (English at `/`, French at `/fr/`) static site for a freelance designer and developer who makes branding, websites, apps and bots for small businesses in France. It is "The Leaflet": one printed roll-fold leaflet on a desk that opens as you scroll (3D on wide screens, a flat strip on phones, a calm mode for reduced motion, and a readable no-JS fallback). Palette: Riso Blue. Slogan: "Made properly." / "Fait comme il faut."

Built with Astro 7 (static output), TypeScript, GSAP (ScrollTrigger, CustomEase, DrawSVGPlugin) and Fontsource fonts. No Tailwind, no CDN.

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (types)
```

In dev, `window.__leaf` exposes `state()`, `goTo(label)` and `seek(t)` for debugging. It is not in production builds.

## Where to edit

| What | Where |
| --- | --- |
| Name, city, email, booking URL, socials, languages, reply time, 4 prices, 3 projects, legal details | `src/data/site.ts` |
| All visible text, English | `src/i18n/en.ts` (defines the shape) |
| All visible text, French | `src/i18n/fr.ts` (same keys; lines starting with `[FR] ` are English waiting for translation) |
| Helpers (`fill`, `useI18n`, `localePath`) | `src/i18n/utils.ts` |
| Colours, fonts, spacing tokens | `src/styles/tokens.css`, `src/styles/palette.css` (Riso Blue) |
| Other styles | `src/styles/` (`furniture`, `panels`, `leaflet-3d`, `responsive`, `refinements`) |
| Page parts | `src/components/` (`Desk`, `Cover`, `About`, `Why`, `Work`, `How`, `Services`, `Prices`, `Contact`, `LooseDialog`, ...) |
| Head tags, JSON-LD, hreflang, Open Graph | `src/layouts/Base.astro` |
| Fold, intro, form and dialog behaviour | `src/scripts/leaflet.ts` |
| Pencil stroke shapes | `src/components/marks.ts` |
| Legal notice text | `legal` in the dictionaries, details in `site.legal` |
| Favicon | `public/favicon.svg` |

Tokens in `{braces}` inside dictionary strings (`{city}`, `{month}`, `{reply}`, `{email}`, `{year}`) are filled from `site.ts`. Keep the copy rules: no em or en dashes in visible text, placeholders in [brackets], plain first-person voice.

Adding a language means adding a dictionary, extending `Locale` and `locales` in `src/data/site.ts` and `i18n` in `astro.config.mjs`, and adding pages under `src/pages/<code>/`.

## Environment variables

Copy `.env.example` to `.env`.

- `PUBLIC_WEB3FORMS_KEY`: your [Web3Forms](https://web3forms.com) access key. When set, the contact form posts JSON to Web3Forms and shows a "Sent" stamp (or an error in the slip). When empty, the form opens the visitor's email app with a ready-made `mailto:` message and says so. The key is public by design.

On Vercel or GitHub Actions, set it in the project's environment variables before building: it is baked in at build time.

## Deploy

Before deploying, set `site` in `astro.config.mjs` to the real domain (`robots.txt` is generated from it). Then run `npm run build && node scripts/check-launch.mjs`: it fails while `yourdomain.com` or a `[placeholder]` inside an `href` is still in the built pages. Links whose URL still contains `[brackets]` (the booking link) are rendered without an `href` until you replace them in `src/data/site.ts`. `public/og.png` and `public/apple-touch-icon.png` come from `node scripts/make-social-images.mjs`; replace them with real artwork if you like. `vercel.json` sets long-lived caching for `/_astro/*`.

**Vercel:** import the repository. Framework preset Astro, build `npm run build`, output `dist`. Add `PUBLIC_WEB3FORMS_KEY` under Environment Variables. `404.html` is served automatically.

**GitHub Pages:** build with `npm run build` and publish `dist/` (for example with the `withastro/action` workflow, which also needs the key as a repository variable). For a project page at `user.github.io/repo` also set `base: '/repo'` in `astro.config.mjs`; a custom domain needs no `base`. Pages serves `dist/404.html` for unknown URLs.

## Placeholders to fill

Everything in [brackets]:

- Domain: `https://drobyshevski.com` is set in `astro.config.mjs` (robots.txt and the sitemap are generated from it).
- `src/data/site.ts`: `[month]` / `[mois]`, booking URL `cal.com/[your-handle]` (the link stays hidden until it is real), and the legal details (SIRET, postal address, phone). City (Lille), email, Telegram, languages, reply time, prices, VAT line and the three projects (Planner, SkillSoft, Arc) are filled in.
- `src/i18n/en.ts` / `fr.ts`: the screenshot slots of the three projects.
- `src/i18n/en.ts` and `src/i18n/fr.ts`: project screenshots and descriptions (`[Screenshot]`, `[Two sentences: ...]`, `[What changed for them.]`).
- `src/i18n/fr.ts`: translate every string that starts with `[FR] `.
- Optional: add an `og:image` (1200 by 630 PNG) in `src/layouts/Base.astro`, and real project screenshots in `src/components/Work.astro` and the dialog.
