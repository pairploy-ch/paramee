// Regenerates public/watermark-contact-line.png — the pre-rendered contact
// line composited onto uploaded photos by src/lib/watermark.ts. Re-run this
// (`node scripts/generate-watermark-text.mjs`) whenever CONTACT_PHONE or the
// LINE handle in src/lib/social.ts changes. Must be run on a machine with a
// Thai-capable font installed (e.g. this only reliably works on Windows/macOS
// dev machines, not bare Linux CI) since it rasterizes real glyphs once,
// which is the whole point: the app itself never renders text at request
// time, so it can't be broken by missing fonts on whatever host runs it.
import sharp from "sharp";
import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { CONTACT_PHONE, socialLinks } from "../src/lib/social.ts";

sharp.cache(false);
sharp.concurrency(1);

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_PATH = path.join(ROOT, "public", "watermark-contact-line.png");

const contactLine = `${CONTACT_PHONE}  |  LINE: ${socialLinks.line.handle}`;

// Render at a large reference size for crisp downscaling later, on a wide
// transparent canvas, then trim to the actual text bounding box.
const FONT_SIZE = 100;
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 160;

const svg = `
  <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="ds" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <text x="0" y="${FONT_SIZE}" text-anchor="start" filter="url(#ds)"
      font-family="Noto Sans Thai, Leelawadee UI, Tahoma, Arial, Helvetica, sans-serif" font-size="${FONT_SIZE}" font-weight="600" fill="#ffffff">${contactLine}</text>
  </svg>
`;

const rendered = await sharp(Buffer.from(svg)).png().toBuffer();
const trimmed = await sharp(rendered).trim({ threshold: 5 }).png().toBuffer();
await writeFile(OUT_PATH, trimmed);

const meta = await sharp(trimmed).metadata();
console.log("wrote", OUT_PATH, meta.width, "x", meta.height);
