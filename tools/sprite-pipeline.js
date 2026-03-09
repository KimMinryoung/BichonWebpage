#!/usr/bin/env node
//
// Sprite Asset Pipeline
// =====================
// Generates pixel art sprites via Gemini AI, then post-processes them
// into game-ready assets for manual cleanup (hand-pixeling).
//
// Steps automated:
//   1. AI generation       — Gemini 2.5 Flash generates raw sprite image
//   2. Background removal  — removes solid-color BG (magenta)
//   3. Scale down          — nearest-neighbor resize to target pixel size
//   4. Canvas placement    — centers sprite on final canvas (bottom-center anchor)
//   5. Palette reduction   — limits colors to N (indexed color feel)
//
// Usage:
//   node tools/sprite-pipeline.js generate [key...]   — generate + process sprites via Gemini
//   node tools/sprite-pipeline.js generate --all       — generate all sprites
//   node tools/sprite-pipeline.js process <file>       — post-process an existing image
//   node tools/sprite-pipeline.js batch <dir>          — post-process all PNGs in a directory
//   node tools/sprite-pipeline.js list                 — list sprite definitions
//
// Requires GEMINI_API_KEY in .env or environment.

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Sprite definitions: key -> { width, height, description, promptHint }
// Pipeline outputs 128x128 for quality; use spritfy.xyz for final size reduction.
// ---------------------------------------------------------------------------
const SPRITES = {
    'building-modern': {
        width: 128, height: 128,
        description: 'Modern office building, flat roof, glass windows in grid pattern',
        promptHint: 'modern office skyscraper, flat roof, rectangular windows in grid, concrete and glass facade',
    },
    'building-glass': {
        width: 128, height: 128,
        description: 'Tall glass tower, reflective blue-tinted windows',
        promptHint: 'tall glass curtain-wall tower, reflective blue windows, sleek modern design',
    },
    'building-apartment': {
        width: 128, height: 128,
        description: 'Korean apartment block, warm beige tones, balconies',
        promptHint: 'Korean apartment building, warm beige and brown, small balconies, residential block',
    },
    'namsan-tower': {
        width: 128, height: 128,
        description: 'N Seoul Tower (Namsan Tower) on mountain base with red beacon',
        promptHint: 'N Seoul Tower Namsan Tower, observation deck, antenna with red beacon light, green mountain base',
    },
    'tree': {
        width: 128, height: 128,
        description: 'Small deciduous tree, round green canopy, brown trunk',
        promptHint: 'small deciduous tree, round green canopy, thin brown trunk, urban park tree',
    },
    'streetlight': {
        width: 128, height: 128,
        description: 'Street lamp post with warm yellow light',
        promptHint: 'modern street lamp post, single arm, warm yellow glowing light, metal pole',
    },
    'cloud': {
        width: 128, height: 128,
        description: 'Fluffy white cloud, flat bottom',
        promptHint: 'simple fluffy white cloud, flat bottom edge, soft cumulus shape',
    },
    'sun': {
        width: 128, height: 128,
        description: 'Warm pixel art sun with rays',
        promptHint: 'warm golden sun with subtle rays, glowing circle, retro pixel art style',
    },
    'ground': {
        width: 128, height: 128,
        description: 'Seamless asphalt road texture tile',
        promptHint: 'seamless asphalt road texture, dark gray cracked pavement, top-down view, tileable seamless pattern, urban road surface',
        noTrim: true,
    },
};

// ---------------------------------------------------------------------------
// Pipeline configuration
// ---------------------------------------------------------------------------
const CONFIG = {
    bgColor: { r: 255, g: 0, b: 255 },   // magenta background to remove
    bgTolerance: 30,                        // color distance threshold for BG removal
    defaultPalette: 16,                     // default number of colors
    outputDir: path.resolve(__dirname, '..', 'public', 'img', 'game'),
    rawDir: path.resolve(__dirname, '..', 'public', 'img', 'game', 'raw'),
    retryDelay: 5000,                       // ms between API calls
    maxRetries: 3,
};

// ---------------------------------------------------------------------------
// 1. AI Image Generation via Gemini 2.5 Flash
// ---------------------------------------------------------------------------
function getGeminiClient() {
    // Load .env from project root
    require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY not found.');
        console.error('Set it in .env or as an environment variable.');
        process.exit(1);
    }

    const { GoogleGenAI } = require('@google/genai');
    return new GoogleGenAI({ apiKey });
}

function buildPrompt(def) {
    if (def.noTrim) {
        // Texture tile: no background, fill entire image
        return [
            'Pixel art style game texture,',
            def.promptHint + ',',
            'fill entire image edge to edge, no border, no margin,',
            'clean sharp edges, low resolution retro game asset',
        ].join(' ');
    }
    return [
        'Pixel art style game sprite,',
        def.promptHint + ',',
        'side view, single isolated object,',
        'solid magenta #FF00FF background,',
        'no shadows on background, clean sharp edges,',
        'low resolution retro game asset, minimal detail',
    ].join(' ');
}

async function generateSpriteImage(client, spriteKey, def) {
    const prompt = buildPrompt(def);

    for (let attempt = 0; attempt < CONFIG.maxRetries; attempt++) {
        try {
            const response = await client.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: prompt,
                config: {
                    responseModalities: ['Text', 'Image'],
                },
            });

            // Extract image from response parts
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const imageData = Buffer.from(part.inlineData.data, 'base64');
                    return imageData;
                }
            }

            console.warn('  No image in response, retrying...');
        } catch (err) {
            const errStr = String(err);
            if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
                const wait = 60000 * (attempt + 1);
                console.warn(`  Rate limited, waiting ${wait / 1000}s... (attempt ${attempt + 1}/${CONFIG.maxRetries})`);
                await sleep(wait);
            } else {
                console.error(`  Gemini error: ${err.message || err}`);
                if (attempt < CONFIG.maxRetries - 1) {
                    console.log('  Retrying...');
                    await sleep(CONFIG.retryDelay);
                }
            }
        }
    }

    return null;
}

async function generateSprites(keys) {
    const client = getGeminiClient();
    fs.mkdirSync(CONFIG.rawDir, { recursive: true });

    console.log(`Generating ${keys.length} sprite(s) via Gemini...\n`);

    let successCount = 0;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const def = SPRITES[key];
        if (!def) {
            console.error(`Unknown sprite key: "${key}" — skipping`);
            continue;
        }

        console.log(`[${i + 1}/${keys.length}] Generating ${key} (${def.width}x${def.height})...`);
        console.log(`  Prompt: ${buildPrompt(def)}`);

        const imageData = await generateSpriteImage(client, key, def);

        if (imageData) {
            // Save raw image
            const rawPath = path.join(CONFIG.rawDir, `${key}.png`);
            fs.writeFileSync(rawPath, imageData);
            const meta = await sharp(imageData).metadata();
            console.log(`  Raw saved: ${rawPath} (${meta.width}x${meta.height})`);

            // Run post-processing pipeline
            console.log('  Post-processing...');
            await processImage(rawPath, key);
            successCount++;
        } else {
            console.error(`  Failed to generate ${key} after ${CONFIG.maxRetries} attempts.\n`);
        }

        // Delay between API calls to avoid rate limiting
        if (i < keys.length - 1) {
            await sleep(CONFIG.retryDelay);
        }
    }

    console.log('='.repeat(50));
    console.log(`Generation complete: ${successCount}/${keys.length} sprites created.`);
    if (successCount > 0) {
        console.log(`Output: ${CONFIG.outputDir}/`);
        console.log('Ready for manual pixel cleanup!');
    }
}

// ---------------------------------------------------------------------------
// 2. Background removal — auto-detect BG color from corners, then remove it
// ---------------------------------------------------------------------------
async function removeBackground(inputBuffer, tolerance = CONFIG.bgTolerance) {
    const image = sharp(inputBuffer).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Auto-detect background color by sampling corner pixels
    const pixel = (x, y) => {
        const off = (y * width + x) * channels;
        return { r: data[off], g: data[off + 1], b: data[off + 2] };
    };
    const corners = [
        pixel(0, 0), pixel(width - 1, 0),
        pixel(0, height - 1), pixel(width - 1, height - 1),
    ];
    const bg = {
        r: Math.round(corners.reduce((s, c) => s + c.r, 0) / 4),
        g: Math.round(corners.reduce((s, c) => s + c.g, 0) / 4),
        b: Math.round(corners.reduce((s, c) => s + c.b, 0) / 4),
    };
    console.log(`  Detected BG color: rgb(${bg.r}, ${bg.g}, ${bg.b})`);

    const out = Buffer.from(data);

    for (let i = 0; i < width * height; i++) {
        const off = i * channels;
        const dr = out[off] - bg.r;
        const dg = out[off + 1] - bg.g;
        const db = out[off + 2] - bg.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        if (dist < tolerance) {
            out[off + 3] = 0; // make transparent
        }
    }

    return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

// ---------------------------------------------------------------------------
// 3. Trim transparent edges to find the content bounding box
// ---------------------------------------------------------------------------
async function trimTransparent(inputBuffer) {
    const trimmed = await sharp(inputBuffer)
        .trim({ threshold: 0 })
        .toBuffer();
    return trimmed;
}

// ---------------------------------------------------------------------------
// 4. Scale down with nearest-neighbor interpolation
// ---------------------------------------------------------------------------
async function scaleDown(inputBuffer, targetW, targetH) {
    const meta = await sharp(inputBuffer).metadata();
    const srcW = meta.width;
    const srcH = meta.height;

    // Fit within target while preserving aspect ratio
    const scale = Math.min(targetW / srcW, targetH / srcH);
    const newW = Math.max(1, Math.round(srcW * scale));
    const newH = Math.max(1, Math.round(srcH * scale));

    const resized = await sharp(inputBuffer)
        .resize(newW, newH, {
            kernel: sharp.kernel.nearest,
            fit: 'fill',
        })
        .toBuffer();

    return resized;
}

// ---------------------------------------------------------------------------
// 5. Place on final canvas (bottom-center anchor)
// ---------------------------------------------------------------------------
async function placeOnCanvas(inputBuffer, canvasW, canvasH) {
    const meta = await sharp(inputBuffer).metadata();
    const spriteW = meta.width;
    const spriteH = meta.height;

    const left = Math.max(0, Math.floor((canvasW - spriteW) / 2));
    const top = Math.max(0, canvasH - spriteH);

    const canvas = await sharp({
        create: {
            width: canvasW,
            height: canvasH,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        }
    })
        .composite([{ input: inputBuffer, left, top }])
        .png()
        .toBuffer();

    return canvas;
}

// ---------------------------------------------------------------------------
// 6. Palette reduction — quantize to N colors using sharp's png palette mode
// ---------------------------------------------------------------------------
async function reducePalette(inputBuffer, numColors = CONFIG.defaultPalette) {
    const quantized = await sharp(inputBuffer)
        .png({
            palette: true,
            colours: numColors,
            dither: 0,
        })
        .toBuffer();

    return quantized;
}

// ---------------------------------------------------------------------------
// Full post-processing pipeline: bg remove -> trim -> scale -> canvas -> palette
// ---------------------------------------------------------------------------
async function processImage(inputPath, spriteKey, options = {}) {
    const def = SPRITES[spriteKey];
    if (!def) {
        console.error(`Unknown sprite key: "${spriteKey}"`);
        console.error(`Available keys: ${Object.keys(SPRITES).join(', ')}`);
        process.exit(1);
    }

    const numColors = options.colors || CONFIG.defaultPalette;
    const tolerance = options.tolerance || CONFIG.bgTolerance;

    console.log(`Processing: ${path.basename(inputPath)} -> ${spriteKey} (${def.width}x${def.height})`);

    let buf = fs.readFileSync(inputPath);
    const srcMeta = await sharp(buf).metadata();
    console.log(`  Source: ${srcMeta.width}x${srcMeta.height}`);

    if (def.noTrim) {
        // Texture tile: just resize directly, no BG removal or trim
        console.log(`  Resizing to ${def.width}x${def.height} (nearest neighbor, texture mode)...`);
        buf = await sharp(buf)
            .resize(def.width, def.height, { kernel: sharp.kernel.nearest, fit: 'cover' })
            .toBuffer();
    } else {
        console.log(`  Removing background (tolerance: ${tolerance})...`);
        buf = await removeBackground(buf, tolerance);

        console.log('  Trimming transparent edges...');
        buf = await trimTransparent(buf);
        const trimMeta = await sharp(buf).metadata();
        console.log(`  After trim: ${trimMeta.width}x${trimMeta.height}`);

        console.log(`  Scaling to fit ${def.width}x${def.height} (nearest neighbor)...`);
        buf = await scaleDown(buf, def.width, def.height);
        const scaleMeta = await sharp(buf).metadata();
        console.log(`  After scale: ${scaleMeta.width}x${scaleMeta.height}`);

        console.log(`  Placing on ${def.width}x${def.height} canvas (bottom-center)...`);
        buf = await placeOnCanvas(buf, def.width, def.height);
    }

    console.log(`  Reducing palette to ${numColors} colors...`);
    buf = await reducePalette(buf, numColors);

    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    const outPath = path.join(CONFIG.outputDir, `${spriteKey}.png`);
    fs.writeFileSync(outPath, buf);

    const finalMeta = await sharp(outPath).metadata();
    console.log(`  Output: ${outPath}`);
    console.log(`  Final: ${finalMeta.width}x${finalMeta.height}`);
    console.log('  Ready for manual pixel cleanup!\n');

    return outPath;
}

// ---------------------------------------------------------------------------
// Batch: process all PNGs in a directory
// ---------------------------------------------------------------------------
async function batchProcess(dirPath) {
    const absDir = path.resolve(dirPath);
    if (!fs.existsSync(absDir)) {
        console.error(`Directory not found: ${absDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(absDir).filter(f => f.toLowerCase().endsWith('.png'));
    if (files.length === 0) {
        console.error(`No PNG files found in: ${absDir}`);
        process.exit(1);
    }

    console.log(`Found ${files.length} PNG(s) in ${absDir}\n`);

    for (const file of files) {
        const base = path.basename(file, '.png');
        const spriteKey = base.replace(/_.*$/, '');

        if (!SPRITES[spriteKey]) {
            console.warn(`  Skipping ${file} — no sprite definition for "${spriteKey}"`);
            console.warn(`  Expected one of: ${Object.keys(SPRITES).join(', ')}\n`);
            continue;
        }

        await processImage(path.join(absDir, file), spriteKey);
    }

    console.log('Batch complete! Open outputs in a pixel editor for manual cleanup.');
}

// ---------------------------------------------------------------------------
// 7. Glow extraction — extract emissive pixels from base sprites
// ---------------------------------------------------------------------------

// Per-type glow rules.
// `isWindow(r,g,b,a)` — deterministic detection of "window" pixels to patch/extract.
// `recolor` — glow layer output color (if omitted, keeps original pixel color).
// `litChance` — probability a detected window appears lit in glow (default 1.0).
// `patchable` — if true, patch-base will replace these pixels with wall color.
const GLOW_RULES = {
    'building-modern': {
        isWindow: (r, g, b, a) => {
            if (a < 128) return false;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum < 70;
        },
        recolor: { r: 255, g: 238, b: 170 },  // #FFEEAA warm window
        erode: 1,       // shrink detected regions by 1px → only window interiors
        litChance: 1.0,
        dimAlpha: 0.3,
        dimRatio: 0.4,
    },
    'building-glass': {
        isWindow: (r, g, b, a) => {
            if (a < 128) return false;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum > 200;
        },
        recolor: { r: 200, g: 240, b: 255 },  // cool white-cyan glow
        erode: 0,
        litChance: 1.0,
        dimAlpha: 0.25,
        dimRatio: 0.5,
    },
    'building-apartment': {
        isWindow: (r, g, b, a) => {
            if (a < 128) return false;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum < 45;
        },
        recolor: { r: 255, g: 220, b: 150 },  // warmer amber window
        erode: 0,       // apartment windows are small (~2px), erosion would delete them
        litChance: 1.0,
        dimAlpha: 0.3,
        dimRatio: 0.3,
    },
    'streetlight': {
        isWindow: (r, g, b, a) => {
            if (a < 128) return false;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum > 120 && r > 160 && g > 120 && (r + g) > (b * 3);
        },
        litChance: 1.0,
        patchable: false,
    },
    'namsan-tower': {
        isWindow: (r, g, b, a) => {
            if (a < 128) return false;
            return r > 180 && g < 120 && b < 120;
        },
        litChance: 1.0,
        patchable: false,
    },
};

// Sprites that have a glow layer
const GLOW_SPRITES = Object.keys(GLOW_RULES);

async function extractGlow(inputPath, spriteKey) {
    const rule = GLOW_RULES[spriteKey];
    if (!rule) {
        console.error(`  No glow rule for "${spriteKey}" — skipping`);
        return null;
    }

    const basePath = path.join(CONFIG.outputDir, `${spriteKey}.png`);
    const srcPath = inputPath || basePath;

    if (!fs.existsSync(srcPath)) {
        console.error(`  Base sprite not found: ${srcPath} — skipping`);
        return null;
    }

    console.log(`Extracting glow: ${spriteKey}`);

    const image = sharp(srcPath).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Build binary mask of detected window pixels
    const mask = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
        const off = i * channels;
        mask[i] = rule.isWindow(data[off], data[off + 1], data[off + 2], data[off + 3]) ? 1 : 0;
    }

    // Erode mask: shrink by N pixels (only keep pixels whose NxN neighborhood is all window)
    const erodeN = rule.erode || 0;
    if (erodeN > 0) {
        const eroded = new Uint8Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let allWindow = true;
                for (let dy = -erodeN; dy <= erodeN && allWindow; dy++) {
                    for (let dx = -erodeN; dx <= erodeN && allWindow; dx++) {
                        const nx = x + dx, ny = y + dy;
                        if (nx < 0 || nx >= width || ny < 0 || ny >= height || !mask[ny * width + nx]) {
                            allWindow = false;
                        }
                    }
                }
                eroded[y * width + x] = allWindow ? 1 : 0;
            }
        }
        mask.set(eroded);
    }

    const out = Buffer.alloc(width * height * 4);
    let kept = 0;
    const rc = rule.recolor;
    const dimAlpha = rule.dimAlpha != null ? rule.dimAlpha : 0;
    const dimRatio = rule.dimRatio != null ? rule.dimRatio : 0;

    for (let i = 0; i < width * height; i++) {
        if (!mask[i]) continue;

        const off = i * channels;
        const a = data[off + 3];
        const oOff = i * 4;
        const isDim = dimRatio > 0 && Math.random() < dimRatio;
        const outAlpha = isDim ? Math.round(a * dimAlpha) : a;

        if (rc) {
            out[oOff] = rc.r;
            out[oOff + 1] = rc.g;
            out[oOff + 2] = rc.b;
        } else {
            out[oOff] = data[off];
            out[oOff + 1] = data[off + 1];
            out[oOff + 2] = data[off + 2];
        }
        out[oOff + 3] = outAlpha;
        kept++;
    }

    const total = width * height;
    const pct = ((kept / total) * 100).toFixed(1);
    console.log(`  ${kept}/${total} pixels kept (${pct}%)`);

    if (kept === 0) {
        console.warn(`  Warning: no glowing pixels found! Check the glow rule for ${spriteKey}.`);
        return null;
    }

    const glowBuf = await sharp(out, { raw: { width, height, channels: 4 } })
        .png()
        .toBuffer();

    const outKey = `${spriteKey}-glow`;
    const outPath = path.join(CONFIG.outputDir, `${outKey}.png`);
    fs.writeFileSync(outPath, glowBuf);
    console.log(`  Output: ${outPath} (${width}x${height})\n`);

    return outPath;
}

async function generateGlows(keys) {
    console.log(`Extracting glow layers for ${keys.length} sprite(s)...\n`);

    let success = 0;
    for (const key of keys) {
        const result = await extractGlow(null, key);
        if (result) success++;
    }

    console.log('='.repeat(50));
    console.log(`Glow extraction complete: ${success}/${keys.length} glow layers created.`);
    if (success > 0) {
        console.log(`Output: ${CONFIG.outputDir}/`);
    }
}

// ---------------------------------------------------------------------------
// 8. Patch base sprites — replace window pixels with dominant wall color
// ---------------------------------------------------------------------------

// Find the dominant opaque color (most frequent non-window, non-transparent pixel)
function findWallColor(data, width, height, channels, isWindowFn) {
    const counts = {};
    for (let i = 0; i < width * height; i++) {
        const off = i * channels;
        const r = data[off], g = data[off + 1], b = data[off + 2], a = data[off + 3];
        if (a < 128) continue;
        if (isWindowFn(r, g, b, a)) continue;
        // Quantize to reduce noise (group similar colors)
        const qr = Math.round(r / 8) * 8;
        const qg = Math.round(g / 8) * 8;
        const qb = Math.round(b / 8) * 8;
        const key = `${qr},${qg},${qb}`;
        counts[key] = (counts[key] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { r: 128, g: 128, b: 128 };
    const [rr, gg, bb] = sorted[0][0].split(',').map(Number);
    return { r: rr, g: gg, b: bb };
}

// patch-base does TWO things in one pass (before window data is lost):
//   1. Extracts glow layer from detected window pixels → saves <key>-glow.png
//   2. Fills those window pixels with wall color in base → overwrites <key>.png
async function patchBase(spriteKey) {
    const rule = GLOW_RULES[spriteKey];
    if (!rule || !rule.patchable) {
        console.log(`  ${spriteKey}: not patchable — skipping`);
        return null;
    }

    const basePath = path.join(CONFIG.outputDir, `${spriteKey}.png`);
    if (!fs.existsSync(basePath)) {
        console.error(`  Base sprite not found: ${basePath} — skipping`);
        return null;
    }

    console.log(`Patching base: ${spriteKey}`);

    const image = sharp(basePath).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    const wallColor = findWallColor(data, width, height, channels, rule.isWindow);
    console.log(`  Wall color: rgb(${wallColor.r}, ${wallColor.g}, ${wallColor.b})`);

    const baseOut = Buffer.from(data);
    const glowOut = Buffer.alloc(width * height * 4);  // transparent
    let patched = 0;
    let glowKept = 0;
    const rc = rule.recolor;
    const dimAlpha = rule.dimAlpha != null ? rule.dimAlpha : 0;
    const dimRatio = rule.dimRatio != null ? rule.dimRatio : 0;

    for (let i = 0; i < width * height; i++) {
        const off = i * channels;
        const r = baseOut[off], g = baseOut[off + 1], b = baseOut[off + 2], a = baseOut[off + 3];

        if (rule.isWindow(r, g, b, a)) {
            // Fill base with wall color
            baseOut[off] = wallColor.r;
            baseOut[off + 1] = wallColor.g;
            baseOut[off + 2] = wallColor.b;
            patched++;

            // Glow layer: all windows covered, dim ones get lower alpha
            const isDim = dimRatio > 0 && Math.random() < dimRatio;
            const outAlpha = isDim ? Math.round(a * dimAlpha) : a;
            const oOff = i * 4;
            glowOut[oOff] = rc ? rc.r : r;
            glowOut[oOff + 1] = rc ? rc.g : g;
            glowOut[oOff + 2] = rc ? rc.b : b;
            glowOut[oOff + 3] = outAlpha;
            glowKept++;
        }
    }

    const total = width * height;
    console.log(`  ${patched} window pixels filled with wall (${((patched / total) * 100).toFixed(1)}%)`);
    console.log(`  ${glowKept} glow pixels kept (${((glowKept / total) * 100).toFixed(1)}%)`);

    // Save patched base
    const patchedBuf = await sharp(baseOut, { raw: { width, height, channels } })
        .png().toBuffer();
    fs.writeFileSync(basePath, patchedBuf);
    console.log(`  Base overwritten: ${basePath}`);

    // Save glow layer
    const glowBuf = await sharp(glowOut, { raw: { width, height, channels: 4 } })
        .png().toBuffer();
    const glowPath = path.join(CONFIG.outputDir, `${spriteKey}-glow.png`);
    fs.writeFileSync(glowPath, glowBuf);
    console.log(`  Glow saved: ${glowPath}\n`);

    return basePath;
}

async function patchBases(keys) {
    const patchableKeys = keys.filter(k => GLOW_RULES[k] && GLOW_RULES[k].patchable);
    if (patchableKeys.length === 0) {
        console.log('No patchable sprites in the selection.');
        return;
    }

    console.log(`Patching ${patchableKeys.length} base sprite(s) + generating glow layers...\n`);

    let success = 0;
    for (const key of patchableKeys) {
        const result = await patchBase(key);
        if (result) success++;
    }

    console.log('='.repeat(50));
    console.log(`Patch complete: ${success}/${patchableKeys.length} sprites processed.`);
    console.log('Both base sprites and glow layers updated.\n');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function printUsage() {
    console.log(`
Sprite Asset Pipeline
=====================

Usage:
  node tools/sprite-pipeline.js generate [key...]
      Generate sprites via Gemini AI and post-process them.
      Requires GEMINI_API_KEY in .env or environment.

  node tools/sprite-pipeline.js generate --all
      Generate all defined sprites.

  node tools/sprite-pipeline.js process <image> --sprite <key> [--colors N] [--tolerance N]
      Post-process an existing image (bg removal, scale, palette).

  node tools/sprite-pipeline.js batch <directory>
      Post-process all PNGs in a directory. Files named <sprite-key>.png.

  node tools/sprite-pipeline.js patch-base [key...]
      Remove dark window pixels from base sprites (fill with wall color).
      Only applies to patchable sprites (buildings). Run glow after this.

  node tools/sprite-pipeline.js patch-base --all
      Patch all patchable base sprites.

  node tools/sprite-pipeline.js glow [key...]
      Extract glow layers from existing base sprites (bright/warm pixels only).

  node tools/sprite-pipeline.js glow --all
      Extract glow layers for all supported sprites.

  node tools/sprite-pipeline.js list
      List all sprite definitions and their target sizes.

Sprite keys: ${Object.keys(SPRITES).join(', ')}
Glow keys:   ${GLOW_SPRITES.join(', ')}

Options:
  --colors N      Number of palette colors (default: ${CONFIG.defaultPalette})
  --tolerance N   Background removal tolerance (default: ${CONFIG.bgTolerance})
`);
}

function parseArgs(argv) {
    const args = { _: [], all: false };
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--sprite' && argv[i + 1]) {
            args.sprite = argv[++i];
        } else if (argv[i] === '--colors' && argv[i + 1]) {
            args.colors = parseInt(argv[++i], 10);
        } else if (argv[i] === '--tolerance' && argv[i + 1]) {
            args.tolerance = parseInt(argv[++i], 10);
        } else if (argv[i] === '--all') {
            args.all = true;
        } else if (!argv[i].startsWith('--')) {
            args._.push(argv[i]);
        }
    }
    return args;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const command = args._[0];

    switch (command) {
        case 'generate': {
            let keys;
            if (args.all) {
                keys = Object.keys(SPRITES);
            } else {
                keys = args._.slice(1); // keys after "generate"
                if (keys.length === 0) {
                    console.error('Error: Specify sprite keys or use --all.');
                    console.error(`Available: ${Object.keys(SPRITES).join(', ')}`);
                    process.exit(1);
                }
            }
            await generateSprites(keys);
            break;
        }

        case 'list':
            console.log('Sprite definitions:\n');
            for (const [key, def] of Object.entries(SPRITES)) {
                console.log(`  ${key.padEnd(22)} ${String(def.width).padStart(3)}x${String(def.height).padEnd(3)}  ${def.description}`);
            }
            break;

        case 'process': {
            const file = args._[1];
            if (!file) {
                console.error('Error: No input file specified.');
                printUsage();
                process.exit(1);
            }
            if (!args.sprite) {
                const base = path.basename(file, '.png').replace(/_.*$/, '');
                if (SPRITES[base]) {
                    args.sprite = base;
                    console.log(`Auto-detected sprite key: ${base}\n`);
                } else {
                    console.error('Error: --sprite <key> required (could not guess from filename).');
                    console.error(`Available: ${Object.keys(SPRITES).join(', ')}`);
                    process.exit(1);
                }
            }
            await processImage(path.resolve(file), args.sprite, {
                colors: args.colors,
                tolerance: args.tolerance,
            });
            break;
        }

        case 'batch': {
            const dir = args._[1];
            if (!dir) {
                console.error('Error: No directory specified.');
                printUsage();
                process.exit(1);
            }
            await batchProcess(dir);
            break;
        }

        case 'patch-base': {
            let keys;
            if (args.all) {
                keys = GLOW_SPRITES;
            } else {
                keys = args._.slice(1);
                if (keys.length === 0) {
                    console.error('Error: Specify sprite keys or use --all.');
                    console.error(`Patchable: ${GLOW_SPRITES.filter(k => GLOW_RULES[k].patchable).join(', ')}`);
                    process.exit(1);
                }
            }
            await patchBases(keys);
            break;
        }

        case 'glow': {
            let keys;
            if (args.all) {
                keys = GLOW_SPRITES;
            } else {
                keys = args._.slice(1);
                if (keys.length === 0) {
                    console.error('Error: Specify sprite keys or use --all.');
                    console.error(`Available glow keys: ${GLOW_SPRITES.join(', ')}`);
                    process.exit(1);
                }
            }
            await generateGlows(keys);
            break;
        }

        default:
            printUsage();
            break;
    }
}

main().catch(err => {
    console.error('Pipeline error:', err.message);
    process.exit(1);
});
