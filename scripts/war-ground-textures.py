#!/usr/bin/env python3
"""The battle board's ground textures (public/js/war/ui/ground.js lays them
under the board as a tiling pattern): a seamless 384x384 tile of mottling
(soft dark and light patches) with short blades of grass for open ground,
and the mottling alone for snow. Neutral ink on transparency, so the
season's colour (war.css .cw-ground-base.is-*) shows through.

    python3 -P scripts/war-ground-textures.py   # writes public/images/war/{turf,snow}-v1.webp
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 384
OUT = Path(__file__).resolve().parent.parent / 'public' / 'images' / 'war'


def noise(period, seed):
    """Seamless value noise in [0, 1): a lattice of `period` cells, smoothly joined."""
    rng = random.Random(seed)
    grid = [[rng.random() for _ in range(period)] for _ in range(period)]
    cell = SIZE / period
    ease = lambda t: t * t * (3 - 2 * t)
    out = [[0.0] * SIZE for _ in range(SIZE)]
    for y in range(SIZE):
        gy = y / cell
        y0 = int(gy) % period
        y1 = (y0 + 1) % period
        ty = ease(gy - int(gy))
        for x in range(SIZE):
            gx = x / cell
            x0 = int(gx) % period
            x1 = (x0 + 1) % period
            tx = ease(gx - int(gx))
            top = grid[y0][x0] + (grid[y0][x1] - grid[y0][x0]) * tx
            bottom = grid[y1][x0] + (grid[y1][x1] - grid[y1][x0]) * tx
            out[y][x] = top + (bottom - top) * ty
    return out


def mottle(seed, strength):
    """Dark and light patches: ink where the summed noise runs low, paper where it runs high."""
    layers = [(noise(4, seed), .5), (noise(8, seed + 1), .3), (noise(16, seed + 2), .2)]
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            v = sum(layer[y][x] * w for layer, w in layers)
            d = (v - .5) * 2.4
            if d < 0:
                px[x, y] = (20, 30, 10, min(255, int(-d * strength)))
            else:
                px[x, y] = (255, 255, 235, min(255, int(d * strength)))
    return img


def blades(img, seed, count):
    """Short strokes of grass, dark and light, leaning a little either way; those over an edge wrap round."""
    rng = random.Random(seed)
    layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for _ in range(count):
        x, y = rng.uniform(0, SIZE), rng.uniform(0, SIZE)
        length, lean = rng.uniform(3, 7), rng.uniform(-1.6, 1.6)
        ink = (18, 34, 8, rng.randint(40, 85)) if rng.random() < .62 else (250, 250, 205, rng.randint(35, 70))
        for ox in (-SIZE, 0, SIZE):
            for oy in (-SIZE, 0, SIZE):
                draw.line([(x + ox, y + oy), (x + ox + lean, y + oy - length)], fill=ink, width=1)
    return Image.alpha_composite(img, layer)


OUT.mkdir(parents=True, exist_ok=True)
blades(mottle(11, 70), 5, 5200).save(OUT / 'turf-v1.webp', 'WEBP', lossless=True, method=6)
mottle(23, 46).save(OUT / 'snow-v1.webp', 'WEBP', lossless=True, method=6)
for name in ('turf-v1.webp', 'snow-v1.webp'):
    print(name, (OUT / name).stat().st_size)
