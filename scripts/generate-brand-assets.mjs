import sharp from "sharp";
import toIco from "to-ico";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#050508"/>
  <text x="16" y="22" text-anchor="middle" fill="#F0F0F0" font-family="Arial Black, Arial, sans-serif" font-size="14" font-weight="700">BL</text>
</svg>`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050508"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#g)" opacity="0.35"/>
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#0066FF"/>
      <stop offset="100%" stop-color="#050508"/>
    </radialGradient>
  </defs>
  <text x="600" y="300" text-anchor="middle" fill="#F0F0F0" font-family="Arial Black, Arial, sans-serif" font-size="160" font-weight="700" letter-spacing="24">BLEU</text>
  <text x="600" y="380" text-anchor="middle" fill="#00AAFF" font-family="monospace" font-size="28" letter-spacing="8">NIGHTCLUB</text>
  <text x="600" y="440" text-anchor="middle" fill="#F0F0F0" opacity="0.5" font-family="monospace" font-size="22" letter-spacing="4">Córdoba, Argentina</text>
</svg>`;

async function main() {
  const publicDir = join(root, "public");
  mkdirSync(publicDir, { recursive: true });

  const faviconPng32 = await sharp(Buffer.from(faviconSvg)).png().toBuffer();
  const faviconPng16 = await sharp(Buffer.from(faviconSvg))
    .resize(16, 16)
    .png()
    .toBuffer();

  const faviconIco = await toIco([faviconPng16, faviconPng32]);
  writeFileSync(join(publicDir, "favicon.ico"), faviconIco);

  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(join(publicDir, "og-image.png"));

  console.log("Generated public/favicon.ico and public/og-image.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
