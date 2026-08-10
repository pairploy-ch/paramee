import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";

// libvips' native binary becomes unstable on Windows when many sharp()
// instances run back-to-back in a short burst (the same root cause behind
// the earlier ERR_DLOPEN_FAILED crash) — serializing calls and disabling the
// operation cache avoids it piling up file handles across a batch upload.
sharp.cache(false);
sharp.concurrency(1);

const LOGO_PATH = path.join(process.cwd(), "public", "logo-paramee-gold.png");
// Pre-rendered "095-789-5692 | LINE: @paramee" text (see
// generate-watermark-text.mjs at the repo root, re-run it if the phone
// number or LINE handle ever changes). Compositing a static raster image
// instead of an SVG <text> element at request time means the watermark no
// longer depends on any font being installed on the host — the previous
// approach rendered as blank/garbled ("tofu") glyphs on hosts without Thai
// or the specific fallback fonts (e.g. serverless Linux deploys), even
// though the text itself was plain ASCII, because none of the listed
// fonts resolved there at all.
const TEXT_PATH = path.join(process.cwd(), "public", "watermark-contact-line.png");

/**
 * Composites the Paramee logo + contact number + LINE handle at the
 * bottom-center of an uploaded photo before it's stored.
 */
export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const logoBuffer = await readFile(LOGO_PATH);
  const logoMeta = await sharp(logoBuffer).metadata();
  const logoAspect = (logoMeta.width ?? 1) / (logoMeta.height ?? 1);

  const textBuffer = await readFile(TEXT_PATH);
  const textMeta = await sharp(textBuffer).metadata();
  const textAspect = (textMeta.width ?? 1) / (textMeta.height ?? 1);
  // The reference asset was rendered at font-size 100 (see the generator
  // script), so (textMeta.height / 100) converts a target font size into
  // the matching scale factor for this asset's actual pixel height.
  const textHeightPerFontSize = (textMeta.height ?? 115) / 100;

  const overlayWidth = Math.max(220, Math.min(420, Math.round(width * 0.4)));
  const logoHeight = Math.round(overlayWidth * 0.16);
  const logoWidth = Math.round(logoHeight * logoAspect);
  const fontSize = Math.max(14, Math.round(overlayWidth * 0.055));
  const textHeight = Math.round(fontSize * textHeightPerFontSize);
  const textWidth = Math.round(textHeight * textAspect);
  const gap = 8;
  const overlayHeight = logoHeight + gap + textHeight;
  const bottomMargin = Math.round(height * 0.03);
  const overlayTop = Math.max(0, height - overlayHeight - bottomMargin);

  const logoResized = await sharp(logoBuffer)
    .resize(logoWidth, logoHeight)
    .png()
    .toBuffer();
  const textResized = await sharp(textBuffer)
    .resize(textWidth, textHeight)
    .png()
    .toBuffer();

  // The logo has no shadow baked in (unlike the text asset), so it still
  // gets one dynamically via an SVG filter — that's font-independent and
  // safe on every host.
  const logoBase64 = logoResized.toString("base64");
  const logoSvg = `
    <svg width="${logoWidth}" height="${logoHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ds" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.65"/>
        </filter>
      </defs>
      <image x="0" y="0" width="${logoWidth}" height="${logoHeight}" href="data:image/png;base64,${logoBase64}" filter="url(#ds)" />
    </svg>
  `;

  return image
    .composite([
      {
        input: Buffer.from(logoSvg),
        top: overlayTop,
        left: Math.round((width - logoWidth) / 2),
      },
      {
        input: textResized,
        top: overlayTop + logoHeight + gap,
        left: Math.round((width - textWidth) / 2),
      },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();
}
