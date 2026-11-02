#!/usr/bin/env node
// CommuLingo's install icons (manifest, routes/commulingo-pwa.js) from the
// site mascot (https://assets.cyber-lenin.com/og-image.jpg, 1200x1200). A
// maskable icon keeps the face inside the 80% safe circle on the art's cream.
// Usage: scripts/build-pwa-icons.js <og-image.jpg>   (dev dependency: sharp)
const path = require('path');
const sharp = require('sharp');

async function main() {
    const source = process.argv[2];
    if (!source) throw new Error('usage: build-pwa-icons.js <og-image.jpg>');
    const out = path.join(__dirname, '..', 'public', 'icons');
    for (const size of [192, 512]) {
        await sharp(source).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(out, `commulingo-${size}.png`));
    }
    const inner = Math.round(512 * 0.8);
    const art = await sharp(source).resize(inner, inner).png().toBuffer();
    await sharp({ create: { width: 512, height: 512, channels: 3, background: '#f3e6c4' } })
        .composite([{ input: art, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toFile(path.join(out, 'commulingo-maskable-512.png'));
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });
