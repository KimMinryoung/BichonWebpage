#!/usr/bin/env node
// The war games' photograph portraits (war/art.js): each person's face cut square from a photograph and turned into a head of
// ink, the side's colour and paper, with the photograph's own background pressed flat into the side's colour.
//
//   node scripts/war-portraits.js <scenario> <job dir> [--sheet=review.png] [id…]
//
// <job dir> (scripts/content/war-portraits/<set>/) holds meta.json (person id → { file: the photograph, … }, as fetch-set.js
// there writes it) and crops.json (person id → [left, top, side]: the face's square, left and top as shares of the photograph's
// width and height, the side as a share of its width). Writes public/images/<scenario>/portraits/<id>-v<v>.webp (160px; v is the
// person's photo.v in the scenario, 1 when it has none yet). The side is the person's in the scenario's portraits.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const Art = require('../public/js/war/art.js');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const opt = name => { const a = process.argv.find(x => x.startsWith(`--${name}=`)); return a ? a.slice(name.length + 3) : null; };
const [scenarioId, job, ...only] = args;
const D = require(path.join(__dirname, '..', 'public', 'js', 'war', 'scenarios', `${scenarioId}.js`));
const meta = JSON.parse(fs.readFileSync(path.join(job, 'meta.json'), 'utf8'));
const crops = JSON.parse(fs.readFileSync(path.join(job, 'crops.json'), 'utf8'));
const outDir = path.join(__dirname, '..', 'public', 'images', scenarioId, 'portraits');

const M = 160;
// The middle tone of a side whose own colour is as dark as the ink (the anarchists' black): a grey the face can be read in.
const PHOTO_GROUND = { black: '#56554f' };
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const INK = rgb('#1d1d1b'), PAPER = rgb('#f1e6cf');
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
// A grey (0–1) as a colour: ink below, the side's colour in the middle, paper above.
const tone = (t, ground) => (t < 0.5 ? mix(INK, ground, t * 2) : mix(ground, PAPER, (t - 0.5) * 2));
// How much of the photograph shows at a pixel: all of it inside an oval about the head, none toward the corners.
const oval = (x, y) => { const dx = (x / M - 0.5) / 0.47, dy = (y / M - 0.5) / 0.56, d = Math.sqrt(dx * dx + dy * dy); return d < 0.8 ? 1 : d > 1.12 ? 0 : 1 - (d - 0.8) / 0.32; };

async function head(id) {
    const [l, t, s] = crops[id];
    const file = path.join(job, meta[id].file);
    const { width, height } = await sharp(file).metadata();
    const left = Math.round(width * l), top = Math.round(height * t);
    const size = Math.min(Math.round(width * s), width - left, height - top);
    const g = await sharp(file).extract({ left, top, width: size, height: size }).resize(M, M).greyscale()
        .normalise({ lower: 2, upper: 98 }).clahe({ width: 40, height: 40, maxSlope: 3 }).median(3).raw().toBuffer();
    const ground = rgb(PHOTO_GROUND[D.portraits[id].side] || Art.GROUND[D.portraits[id].side]);
    const out = Buffer.alloc(M * M * 3);
    for (let i = 0; i < M * M; i++) {
        const v = 0.5 + (g[i] / 255 - 0.5) * oval(i % M, Math.floor(i / M));
        const c = tone(v, ground);
        out[i * 3] = c[0]; out[i * 3 + 1] = c[1]; out[i * 3 + 2] = c[2];
    }
    return sharp(out, { raw: { width: M, height: M, channels: 3 } });
}

(async () => {
    fs.mkdirSync(outDir, { recursive: true });
    const ids = Object.keys(crops).filter(id => !only.length || only.includes(id)).sort();
    const tiles = [];
    let bytes = 0;
    for (const id of ids) {
        if (!D.portraits[id]) { console.log('not in the scenario:', id); continue; }
        if (!meta[id]) { console.log('no photograph:', id); continue; }
        const v = (D.portraits[id].photo && D.portraits[id].photo.v) || 1;
        const file = path.join(outDir, `${id}-v${v}.webp`);
        const img = await head(id);
        await img.clone().webp({ quality: 82 }).toFile(file);
        bytes += fs.statSync(file).size;
        tiles.push({ id, png: await img.png().toBuffer() });
    }
    console.log(`${tiles.length} portraits, ${Math.round(bytes / 1024)} KB in ${path.relative(process.cwd(), outDir)}`);
    const sheet = opt('sheet');
    if (sheet) {
        const cols = 9, cell = 132, parts = [], text = [];
        for (const [i, t] of tiles.entries()) {
            const x = (i % cols) * cell + 6, y = Math.floor(i / cols) * (cell + 18) + 6;
            parts.push({ input: await sharp(t.png).resize(120, 120).toBuffer(), left: x, top: y });
            parts.push({ input: await sharp(t.png).resize(30, 30).toBuffer(), left: x + 90, top: y + 90 });
            text.push(`<text x="${x}" y="${y + 132}" font-size="10" fill="#ddd" font-family="sans-serif">${t.id.slice(0, 22)}</text>`);
        }
        const W = cols * cell + 6, H = Math.ceil(tiles.length / cols) * (cell + 18) + 6;
        parts.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${text.join('')}</svg>`), left: 0, top: 0 });
        await sharp({ create: { width: W, height: H, channels: 3, background: '#26241f' } }).composite(parts).png().toFile(sheet);
        console.log(sheet);
    }
})().catch(e => { console.error(e); process.exit(1); });
