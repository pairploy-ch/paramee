import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";
import { CONTACT_PHONE, socialLinks } from "./social";

// libvips' native binary becomes unstable on Windows when many sharp()
// instances run back-to-back in a short burst (the same root cause behind
// the earlier ERR_DLOPEN_FAILED crash) — serializing calls and disabling the
// operation cache avoids it piling up file handles across a batch upload.
sharp.cache(false);
sharp.concurrency(1);

const LOGO_PATH = path.join(process.cwd(), "public", "logo-paramee-gold.png");

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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

  const overlayWidth = Math.max(220, Math.min(420, Math.round(width * 0.4)));
  const logoHeight = Math.round(overlayWidth * 0.16);
  const logoWidth = Math.round(logoHeight * logoAspect);
  const fontSize = Math.max(14, Math.round(overlayWidth * 0.055));
  const bottomMargin = Math.round(height * 0.03);
  const overlayHeight = logoHeight + fontSize * 2 + 24;

  const logoBase64 = (await sharp(logoBuffer).resize(logoWidth, logoHeight).png().toBuffer()).toString(
    "base64"
  );

  const contactLine = `${CONTACT_PHONE}  |  LINE: ${socialLinks.line.handle}`;

  const svg = `
    <svg width="${overlayWidth}" height="${overlayHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ds" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.65"/>
        </filter>
      </defs>
      <g filter="url(#ds)">
        <image x="${(overlayWidth - logoWidth) / 2}" y="0" width="${logoWidth}" height="${logoHeight}" href="data:image/png;base64,${logoBase64}" />
        <text x="50%" y="${logoHeight + fontSize + 8}" text-anchor="middle"
          font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="600" fill="#ffffff">${escapeXml(contactLine)}</text>
      </g>
    </svg>
  `;

  return image
    .composite([
      {
        input: Buffer.from(svg),
        top: Math.max(0, height - overlayHeight - bottomMargin),
        left: Math.round((width - overlayWidth) / 2),
      },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();
}
