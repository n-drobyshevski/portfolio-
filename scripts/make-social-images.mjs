// Regenerates public/og.png (1200x630) and public/apple-touch-icon.png (180x180) from inline SVG.
// Run: node scripts/make-social-images.mjs   (uses sharp, which Astro already installs)
import sharp from 'sharp';
const blue = '#2A52C4', paper = '#FAFAF7';
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${blue}"/>
<rect x="60" y="60" width="1080" height="510" rx="6" fill="${paper}"/>
<text x="110" y="150" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="${blue}">Nick Drobyshevski</text>
<text x="110" y="370" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="500" fill="#1B2440" letter-spacing="-4">Made properly.</text>
<path d="M112 410C400 396 720 424 1000 404" stroke="${blue}" stroke-width="5" fill="none" stroke-linecap="round"/>
<text x="110" y="500" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#4A5570">Branding, websites, apps and bots for small businesses.</text>
</svg>`;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="${blue}"/><path d="M18 48V16h6.4l19.2 24.6V16H50v32h-6.2L24.4 23.2V48z" fill="${paper}"/></svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og.png');
await sharp(Buffer.from(icon)).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png');
