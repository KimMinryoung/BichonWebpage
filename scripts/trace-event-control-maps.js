#!/usr/bin/env node
// Trace territorial-control areas off public-domain period maps.
//
// The event map's control layer (data/commulingo/event-control.js) needs
// "who held what, when" polygons. For 1945–1947 a contemporary US source
// exists: the State Department's six-panel "China: Communist Controlled
// Areas, 1945–1947" (Map Division no. 10745, August 1947, declassified,
// NARA via Wikimedia Commons). Japanese occupation at the surrender comes
// from the West Point atlas plate "Situation at the End of World War Two".
// Both are US government works in the public domain. This script turns their
// coloured areas into lng/lat rings; bake-event-control.js combines those
// with hand-drawn later phases and clips everything to the coastline.
//
// Usage:
//   node scripts/trace-event-control-maps.js chinese-civil-war <state-dept.jpg> <west-point-plate-5.png>
//   node scripts/trace-event-control-maps.js sino-japanese-war <west-point-plate-4.jpg>
//   node scripts/trace-event-control-maps.js spanish-civil-war <1936-07.png> <1936-09.png> <1937-03.png> <1937-10.png> <1938-07.png> <1939-02.png>
// Sources (Wikimedia Commons originals):
//   File:China_Communist_Controlled_Areas,_1945-1947_-_DPLA_-_fcf9e57e32bee59c1519defdd8d46e43.jpg (8268×6888)
//   File:Situation_at_the_End_of_World_War_Two.PNG (888×687)
//   File:Japanese_Occupation_-_Map.jpg (1119×857; West Point plate 4, Japanese occupation 1940)
//   File:Map_of_the_Spanish_Civil_War_in_<Month_Year>.png (900×725 each; NordNordWest,
//     modified by Sting and Grandiose, CC BY-SA 3.0 — the traced areas are a
//     derivative and carry the same licence and attribution)
// Output: scripts/content/event-control/<eventId>.traced.json
//
// Method. Each map is georeferenced with a least-squares quadratic from
// lng/lat to frame-normalised (u, v), fitted on city dots read off the scan
// (residuals ≤ 11 px of ~75 px per degree on the State map, ≤ 4.4 px of ~12
// on the plate). A 0.05° lng/lat grid is then sampled: each cell votes over
// the scan pixels around its projected centre, ignoring dark pixels (rails,
// rivers, lettering), so a railway through a red area does not punch a
// hole. Specks and pinholes are dropped, the cell mask is traced into rings
// and simplified. All six State panels are printed from one plate, so one
// georeference serves them all, offset by each panel's detected neat line.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// The lng/lat sampling grid; each event sets its own extent.
let STEP, LNG0, LAT1, NX, NY;
function setGrid(lng0, lng1, lat0, lat1, step) {
    STEP = step;
    LNG0 = lng0;
    LAT1 = lat1;
    NX = Math.round((lng1 - lng0) / step);
    NY = Math.round((lat1 - lat0) / step);
}
setGrid(97, 136, 17, 54, 0.05);

function solve(A, b) {
    const n = A[0].length;
    const M = Array.from({ length: n }, () => new Array(n + 1).fill(0));
    A.forEach((row, k) => {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) M[i][j] += row[i] * row[j];
            M[i][n] += row[i] * b[k];
        }
    });
    for (let i = 0; i < n; i++) {
        let p = i;
        for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
        [M[i], M[p]] = [M[p], M[i]];
        for (let r = 0; r < n; r++) {
            if (r === i) continue;
            const f = M[r][i] / M[i][i];
            for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c];
        }
    }
    return M.map((row, i) => row[n] / row[i]);
}

const terms = (lng, lat) => {
    const x = (lng - 118) / 10;
    const y = (lat - 38) / 10;
    return [1, x, y, x * x, x * y, y * y];
};

// frame: the pixel box the control points were read in; cps: [name, lat, lng, x, y].
function georeference(frame, cps) {
    const A = cps.map(c => terms(c[2], c[1]));
    const cu = solve(A, cps.map(c => (c[3] - frame.l) / (frame.r - frame.l)));
    const cv = solve(A, cps.map(c => (c[4] - frame.t) / (frame.b - frame.t)));
    const dot = (c, t) => c.reduce((s, k, i) => s + k * t[i], 0);
    return (lng, lat) => {
        const t = terms(lng, lat);
        return [dot(cu, t), dot(cv, t)];
    };
}

// Control points read on the 1 Aug 1946 panel (its neat line below).
const STATE_FORWARD = georeference({ l: 5762, t: 370, r: 8076, b: 3055 }, [
    ['Peiping', 39.90, 116.40, 6730, 1869], ['Tsinan', 36.67, 117.00, 6763, 2204],
    ['Harbin', 45.75, 126.65, 7454.5, 1255], ['Tsitsihar', 47.35, 123.92, 7266, 1100.5],
    ['Mukden', 41.80, 123.43, 7248.5, 1668.5], ['Hailar', 49.21, 119.74, 6972, 929.5],
    ['Kueisui', 40.84, 111.66, 6378.5, 1756], ['Sian', 34.27, 108.94, 6099.5, 2411],
    ['Nanking', 32.06, 118.78, 6912.5, 2672], ['Wuchang', 30.55, 114.30, 6529.5, 2823.5],
    ['Ningsia', 38.47, 106.27, 5949, 1951.5], ['Kaifeng', 34.80, 114.31, 6544.5, 2387],
    ['Suchow', 34.26, 117.19, 6765.5, 2448], ['Chiamussu', 46.80, 130.36, 7700, 1125],
]);

// Plate 4 is the same West Point series as plate 5, printed at another
// size; its control points were read separately.
const PLATE4_FORWARD = georeference({ l: 0, t: 0, r: 1119, b: 857 }, [
    ['Beijing', 39.90, 116.40, 761.3, 193.1], ['Jinan', 36.67, 117.00, 796.7, 299.4],
    ['Qingdao', 36.07, 120.38, 892, 297.7], ['Xian', 34.27, 108.94, 579.4, 411],
    ['Nanjing', 32.06, 118.78, 875.4, 445.7], ['Shanghai', 31.23, 121.47, 954.7, 456.7],
    ['Hankou', 30.58, 114.27, 749, 516.7], ['Changsha', 28.23, 112.94, 724.6, 610.6],
    ['Guangzhou', 23.13, 113.26, 752.1, 782], ['Chongqing', 29.56, 106.55, 517, 583.4],
    ['Lanzhou', 36.06, 103.83, 432.7, 358.1], ['Shenyang', 41.80, 123.43, 921.3, 95.7],
    ['Xiamen', 24.48, 118.09, 912.1, 698.6], ['Nanchang', 28.68, 115.86, 811.9, 580.7],
    ['Taiyuan', 37.87, 112.55, 673, 276.6], ['Baotou', 40.65, 109.84, 586.7, 192.6],
]);

// One base map for the whole Spanish series; city dots read at 900×725.
const SPAIN_FORWARD = georeference({ l: 0, t: 0, r: 900, b: 725 }, [
    ['Corunna', 43.37, -8.40, 80, 61], ['Gijon', 43.53, -5.66, 250, 55], ['Oviedo', 43.36, -5.85, 238, 72],
    ['Santander', 43.46, -3.80, 363, 66], ['Bilbao', 43.26, -2.93, 420, 80], ['Vitoria', 42.85, -2.67, 432, 108],
    ['Pamplona', 42.81, -1.64, 504, 122], ['Leon', 42.60, -5.57, 254, 131], ['Valladolid', 41.65, -4.72, 303, 208],
    ['Zaragoza', 41.65, -0.88, 546, 212], ['Lerida', 41.62, 0.62, 656, 220], ['Barcelona', 41.39, 2.17, 747, 234],
    ['Tarragona', 41.12, 1.25, 686, 253], ['Salamanca', 40.97, -5.66, 243, 265], ['Avila', 40.66, -4.70, 305, 294],
    ['Guadalajara', 40.63, -3.17, 403, 295], ['Madrid', 40.42, -3.70, 369, 316], ['Teruel', 40.34, -1.11, 536, 319],
    ['Toledo', 39.86, -4.02, 345, 357], ['Valencia', 39.47, -0.38, 583, 400], ['Caceres', 39.47, -6.37, 205, 387],
    ['Badajoz', 38.88, -6.97, 165, 432], ['Merida', 38.92, -6.34, 199, 432], ['Alicante', 38.35, -0.48, 574, 490],
    ['Murcia', 37.99, -1.13, 533, 518], ['Cordoba', 37.89, -4.78, 289, 523], ['Cartagena', 37.60, -0.99, 545, 548],
    ['Seville', 37.39, -5.98, 221, 565], ['Granada', 37.18, -3.60, 366, 584], ['Huelva', 37.26, -6.94, 162, 577],
    ['Almeria', 36.84, -2.46, 447, 610], ['Malaga', 36.72, -4.42, 327, 618], ['Cadiz', 36.53, -6.29, 207, 635],
]);

const PLATE_FORWARD = georeference({ l: 0, t: 0, r: 888, b: 687 }, [
    ['Beijing', 39.90, 116.40, 603.7, 158.7], ['Jinan', 36.67, 117.00, 631.6, 240.9],
    ['Qingdao', 36.07, 120.38, 705.1, 241.9], ['Xian', 34.27, 108.94, 461.4, 326.7],
    ['Nanjing', 32.06, 118.78, 690.9, 356.3], ['Shanghai', 31.23, 121.47, 752.4, 364.9],
    ['Hankou', 30.58, 114.27, 592.4, 409.6], ['Changsha', 28.23, 112.94, 572.9, 483.4],
    ['Guangzhou', 23.13, 113.26, 594.6, 618], ['Chongqing', 29.56, 106.55, 412.9, 462.7],
    ['Lanzhou', 36.06, 103.83, 346.1, 285.4], ['Shenyang', 41.80, 123.43, 728.7, 83.6],
    ['Baotou', 40.65, 109.84, 466.9, 156.6], ['Xiamen', 24.48, 118.09, 719.1, 552],
    ['Nanchang', 28.68, 115.86, 640.6, 460.7],
]);

// Neat lines of the six State panels, detected as the long dark frame runs.
// 11 Nov 1946 is traced for completeness; the bake does not use it.
const STATE_PANELS = {
    '1945.08': { l: 473, t: 374, r: 2783, b: 3057 },
    '1946.01': { l: 3114, t: 373, r: 5425, b: 3055 },
    '1946.08': { l: 5762, t: 370, r: 8076, b: 3055 },
    '1946.11': { l: 459, t: 3386, r: 2774, b: 6069 },
    '1947.01': { l: 3102, t: 3386, r: 5418, b: 6069 },
    '1947.07': { l: 5747, t: 3386, r: 8062, b: 6071 },
};

function stateClass(r, g, b) {
    if (r + g + b < 330) return null;                       // lines, lettering, foreign fill
    if (r > 125 && r - g > 45 && r - b > 60) return 'red';  // Communist-controlled
    if (r > 195 && r - g >= 12 && r - b >= 20) return 'pink'; // stipple: occupied by USSR
    if (Math.abs(r - g) < 25 && r > 170) return 'light';
    return null;
}

function plateClass(r, g, b) {
    if (b > 180 && b - r > 30) return null;                 // water
    if (r + g + b < 300) return null;
    if (r > 200 && g > 110 && g < 185 && b > 90 && b < 170 && r - g > 50) return 'salmon';
    if (r > 180 && g < 110 && b < 110) return 'stripe';
    if (r > 200 && g > 200 && b > 200) return 'white';
    return null;
}

function plate4Class(r, g, b) {
    if (b > r + 40) return null;                              // water
    if (r > 200 && r - g > 80 && b < 110) return null;        // foreign (orange)
    if (r + g + b < 360) return null;                         // lines, lettering
    if (r > 190 && r - g > 25 && b - g > 15) return 'pink';   // Japanese-occupied
    return 'white';
}

function spainClass(r, g, b) {
    if (r + g + b < 250) return null;                          // dots, lettering
    if (r > 200 && r - g > 55 && b > 150) return 'pink';        // Nationalist
    if (b - r > 40 && r < 175 && b < 230) return 'blue';        // Republican
    return 'other';                                             // sea, foreign land
}

async function loadRaw(file) {
    const { data, info } = await sharp(file, { limitInputPixels: false })
        .removeAlpha().raw().toBuffer({ resolveWithObject: true });
    return { data, W: info.width, H: info.height, C: info.channels };
}

// Fraction of each class among the voting pixels of every grid cell.
function rasterize(img, frame, forward, classify, { radius, stride, exclude }) {
    const grids = {};
    for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
            const [u, v] = forward(LNG0 + (i + 0.5) * STEP, LAT1 - (j + 0.5) * STEP);
            if (u < 0.01 || u > 0.99 || v < 0.01 || v > 0.99 || (exclude && exclude(u, v))) continue;
            const x = frame.l + u * (frame.r - frame.l);
            const y = frame.t + v * (frame.b - frame.t);
            const votes = {};
            let total = 0;
            for (let dy = -radius; dy <= radius; dy += stride) {
                for (let dx = -radius; dx <= radius; dx += stride) {
                    const px = Math.round(x + dx);
                    const py = Math.round(y + dy);
                    if (px < 0 || py < 0 || px >= img.W || py >= img.H) continue;
                    const k = (py * img.W + px) * img.C;
                    const c = classify(img.data[k], img.data[k + 1], img.data[k + 2]);
                    if (c === null) continue;
                    votes[c] = (votes[c] || 0) + 1;
                    total++;
                }
            }
            if (!total) continue;
            for (const [c, n] of Object.entries(votes)) {
                if (!grids[c]) grids[c] = new Float32Array(NX * NY);
                grids[c][j * NX + i] = n / total;
            }
        }
    }
    return grids;
}

function threshold(frac, t) {
    const m = new Uint8Array(NX * NY);
    if (frac) for (let k = 0; k < m.length; k++) m[k] = frac[k] >= t ? 1 : 0;
    return m;
}

// Flip 4-connected components of `val` smaller than `min` cells: specks
// (val 1) or pinholes (val 0; keepBorder spares the open outside).
function dropSmall(m, val, min, keepBorder) {
    const seen = new Uint8Array(m.length);
    for (let s = 0; s < m.length; s++) {
        if (m[s] !== val || seen[s]) continue;
        const stack = [s];
        const comp = [];
        let border = false;
        seen[s] = 1;
        while (stack.length) {
            const k = stack.pop();
            comp.push(k);
            const i = k % NX;
            const j = (k / NX) | 0;
            if (i === 0 || j === 0 || i === NX - 1 || j === NY - 1) border = true;
            for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const a = i + di;
                const b = j + dj;
                if (a < 0 || b < 0 || a >= NX || b >= NY) continue;
                const q = b * NX + a;
                if (m[q] === val && !seen[q]) { seen[q] = 1; stack.push(q); }
            }
        }
        if (comp.length < min && !(keepBorder && border)) for (const k of comp) m[k] = 1 - val;
    }
    return m;
}

function dilate(m, r) {
    const o = new Uint8Array(m.length);
    for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
            if (!m[j * NX + i]) continue;
            for (let b = Math.max(0, j - r); b <= Math.min(NY - 1, j + r); b++) {
                for (let a = Math.max(0, i - r); a <= Math.min(NX - 1, i + r); a++) {
                    if ((a - i) ** 2 + (b - j) ** 2 <= r * r) o[b * NX + a] = 1;
                }
            }
        }
    }
    return o;
}

const erode = (m, r) => dilate(m.map(x => 1 - x), r).map(x => 1 - x);
const close = (m, r) => erode(dilate(m, r), r);

// Cell-mask boundary edges linked into closed lng/lat rings. Outer rings
// run counter-clockwise geographically, holes clockwise; the bake reads the
// set with even-odd semantics, so orientation is informational only.
function traceRings(m) {
    const key = (x, y) => y * (NX + 1) + x;
    const next = new Map();
    const add = (x0, y0, x1, y1) => {
        const k = key(x0, y0);
        if (!next.has(k)) next.set(k, []);
        next.get(k).push([x1, y1]);
    };
    const at = (i, j) => (i >= 0 && j >= 0 && i < NX && j < NY) ? m[j * NX + i] : 0;
    for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
            if (!at(i, j)) continue;
            if (!at(i, j - 1)) add(i, j, i + 1, j);
            if (!at(i + 1, j)) add(i + 1, j, i + 1, j + 1);
            if (!at(i, j + 1)) add(i + 1, j + 1, i, j + 1);
            if (!at(i - 1, j)) add(i, j + 1, i, j);
        }
    }
    const out = [];
    for (const [k0, list] of next) {
        while (list.length) {
            let x = k0 % (NX + 1);
            let y = (k0 / (NX + 1)) | 0;
            const ring = [[x, y]];
            let [nx, ny] = list.pop();
            while (!(nx === ring[0][0] && ny === ring[0][1])) {
                ring.push([nx, ny]);
                const l = next.get(key(nx, ny));
                if (!l || !l.length) break;
                // At a pinch vertex take the right turn, so diagonal cells stay apart.
                let pick = 0;
                if (l.length > 1) {
                    const dx = nx - x;
                    const dy = ny - y;
                    pick = Math.max(0, l.findIndex(([a, b]) => dx * (b - ny) - dy * (a - nx) > 0));
                }
                x = nx; y = ny;
                [nx, ny] = l.splice(pick, 1)[0];
            }
            out.push(ring.map(([gx, gy]) => [
                Number((LNG0 + gx * STEP).toFixed(3)), Number((LAT1 - gy * STEP).toFixed(3)),
            ]));
        }
    }
    return out;
}

// Douglas–Peucker on a closed ring, split at its far point.
function simplify(ring, tol) {
    if (ring.length < 8) return ring;
    const keep = new Uint8Array(ring.length);
    const far = Math.floor(ring.length / 2);
    keep[0] = keep[far] = keep[ring.length - 1] = 1;
    const rec = (a, b) => {
        const [x1, y1] = ring[a];
        const [x2, y2] = ring[b];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const L = Math.hypot(dx, dy) || 1e-9;
        let best = -1, bi = -1;
        for (let i = a + 1; i < b; i++) {
            const d = Math.abs(dy * ring[i][0] - dx * ring[i][1] + x2 * y1 - y2 * x1) / L;
            if (d > best) { best = d; bi = i; }
        }
        if (best > tol) { keep[bi] = 1; rec(a, bi); rec(bi, b); }
    };
    rec(0, far);
    rec(far, ring.length - 1);
    return ring.filter((_, i) => keep[i]);
}

const polygons = (m, tol) => traceRings(m).map(r => simplify(r, tol)).filter(r => r.length >= 4);
const areaCells = m => m.reduce((s, x) => s + x, 0);

async function traceChineseCivilWar(statePath, platePath) {
    const out = {
        eventId: 'chinese-civil-war-1945-1949',
        generatedBy: 'scripts/trace-event-control-maps.js',
        step: STEP,
        phases: {},
    };
    const state = await loadRaw(statePath);
    // The Hainan/Kwangtung inset and the boundary disclaimer box.
    const exclude = (u, v) => (u > 0.62 && v > 0.74) || (u > 0.76 && v < 0.12);
    for (const [date, frame] of Object.entries(STATE_PANELS)) {
        const grids = rasterize(state, frame, STATE_FORWARD, stateClass, { radius: 4, stride: 2, exclude });
        let red = threshold(grids.red, 0.5);
        red = dropSmall(red, 1, 8);
        red = dropSmall(red, 0, 10, true);
        const phase = { ccp: polygons(red, 0.045) };
        if (date === '1946.01') {
            let pink = close(threshold(grids.pink, 0.12), 3);
            pink = dropSmall(pink, 1, 200);
            pink = dropSmall(pink, 0, 200, true);
            phase.soviet = polygons(pink, 0.06);
        }
        out.phases[date] = phase;
        console.log(date, 'ccp cells', areaCells(red), 'rings', phase.ccp.length);
    }
    const plate = await loadRaw(platePath);
    const grids = rasterize(plate, { l: 0, t: 0, r: 888, b: 687 }, PLATE_FORWARD, plateClass, { radius: 1, stride: 1 });
    let japan = close(threshold(grids.salmon, 0.34), 4);
    japan = dropSmall(japan, 1, 40);
    japan = dropSmall(japan, 0, 400, true);
    out.phases['1945.08'].japan = polygons(japan, 0.08);
    console.log('1945.08 japan cells', areaCells(japan));

    return out;
}

// Plate 4: the pink Japanese-occupied area of 1940.
async function traceSinoJapaneseWar(platePath) {
    const plate = await loadRaw(platePath);
    const grids = rasterize(plate, { l: 0, t: 0, r: 1119, b: 857 }, PLATE4_FORWARD, plate4Class, { radius: 1, stride: 1 });
    let japan = close(threshold(grids.pink, 0.4), 3);
    japan = dropSmall(japan, 1, 20);
    japan = dropSmall(japan, 0, 200, true);
    console.log('1940 japan cells', areaCells(japan));
    return {
        eventId: 'sino-japanese-war-1937-1945',
        generatedBy: 'scripts/trace-event-control-maps.js',
        step: STEP,
        phases: { '1940': { japan: polygons(japan, 0.06) } },
    };
}

// The Spanish series: Republican (blue-violet) areas, month by month.
async function traceSpanishCivilWar(...files) {
    setGrid(-10, 5, 35.5, 44.5, 0.02);
    const dates = ['1936.07', '1936.09', '1937.03', '1937.10', '1938.07', '1939.02'];
    const phases = {};
    for (const [i, file] of files.entries()) {
        const img = await loadRaw(file);
        const grids = rasterize(img, { l: 0, t: 0, r: 900, b: 725 }, SPAIN_FORWARD, spainClass, { radius: 5, stride: 1 });
        let rep = threshold(grids.blue, 0.5);
        rep = dropSmall(rep, 1, 6);
        rep = dropSmall(rep, 0, 10, true);
        phases[dates[i]] = { rep: polygons(rep, 0.03) };
        console.log(dates[i], 'republican cells', areaCells(rep));
    }
    return {
        eventId: 'spanish-civil-war',
        generatedBy: 'scripts/trace-event-control-maps.js',
        licence: 'CC BY-SA 3.0; traced from maps by NordNordWest, modified by Sting and Grandiose (Wikimedia Commons)',
        step: STEP,
        phases,
    };
}

const EVENTS = {
    'chinese-civil-war': { files: 2, run: traceChineseCivilWar },
    'sino-japanese-war': { files: 1, run: traceSinoJapaneseWar },
    'spanish-civil-war': { files: 6, run: traceSpanishCivilWar },
};

async function main() {
    const [name, ...files] = process.argv.slice(2);
    const event = EVENTS[name];
    if (!event || files.length !== event.files) {
        console.error('usage: node scripts/trace-event-control-maps.js chinese-civil-war <state-dept.jpg> <west-point-plate-5.png>');
        console.error('       node scripts/trace-event-control-maps.js sino-japanese-war <west-point-plate-4.jpg>');
        console.error('       node scripts/trace-event-control-maps.js spanish-civil-war <six monthly maps, 1936-07 … 1939-02>');
        process.exit(2);
    }
    const out = await event.run(...files);
    const target = path.join(__dirname, 'content', 'event-control', `${out.eventId}.traced.json`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(out) + '\n');
    console.log('wrote', path.relative(process.cwd(), target));
}

main().catch(err => { console.error(err); process.exit(1); });
