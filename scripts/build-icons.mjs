// Rasterize build/icon.svg -> build/icon.png (512/1024) and build/icon.ico (256)
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const svg = await readFile(new URL('../build/icon.svg', import.meta.url));

for (const size of [512, 1024]) {
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(new URL(`../build/icon-${size}.png`, import.meta.url).pathname);
}

const png256 = await sharp(svg, { density: 300 }).resize(256, 256).png().toBuffer();
await writeFile(new URL('../build/icon.png', import.meta.url), await sharp(svg, { density: 300 }).resize(512, 512).png().toBuffer());
await writeFile(new URL('../build/icon-256.png', import.meta.url), png256);
const ico = await pngToIco(png256);
await writeFile(new URL('../build/icon.ico', import.meta.url), ico);
console.log('icons written');
