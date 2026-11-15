#!/usr/bin/env python3
"""The war games' share images (og:image), 1200x630 JPEG: the whole war's
and each battle's that has its own page (services/war-promos.js).

    python3 scripts/war-og-images.py [scenario ...]   # default: every scenario with a promo

The site's own font (PretendardVariable.common.woff2) holds Hangul but not
Latin or digits, so the drawing takes the full variable font out of git
history (the commit before ef4631d), the same one
scripts/build-pretendard-common.py builds from.

Reads the scenario through node (services/war-promos.js, the same cards
the pages show), draws the scenario's picture on the left and the title on
the game's red on the right, and writes <pictureDir>og-game.jpg and
og-<battle>.jpg under public/. Rerun after a battle's title, date, turns or
picture change; the files are committed.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FONT_COMMIT = 'ef4631d^:public/fonts/pretendard/PretendardVariable.woff2'
FONT = None
W, H = 1200, 630
ART_W = 560
RED = (178, 34, 34)
CREAM = (250, 242, 218)
PALE = (240, 205, 190)
INK = (20, 17, 13)

DUMP = r"""
const { SCENARIOS } = require('./services/war-map');
const P = require('./services/war-promos');
const want = JSON.parse(process.argv[1]);
const out = [];
for (const id of Object.keys(SCENARIOS)) {
    if (want.length && !want.includes(id)) continue;
    const whole = P.gamePage(id);
    if (!whole) continue;
    out.push({ whole, battles: P.battlesOf(id), dir: SCENARIOS[id].pictureDir });
}
process.stdout.write(JSON.stringify(out));
"""


def font(size, weight):
    f = ImageFont.truetype(str(FONT), size)
    try:
        f.set_variation_by_axes([weight])
    except OSError:
        pass
    return f


def full_picture(src):
    """The card's picture is the small file; the share image wants the full one."""
    path = ROOT / 'public' / src.lstrip('/')
    big = path.with_name(path.name.replace('-sm.webp', '.webp'))
    return big if big.exists() else path


def wrap(draw, text, f, width):
    """Korean breaks between words; a word longer than the line breaks anywhere."""
    lines, line = [], ''
    for word in text.split(' '):
        trial = f'{line} {word}'.strip()
        if draw.textlength(trial, font=f) <= width:
            line = trial
            continue
        if line:
            lines.append(line)
        line = word
        while draw.textlength(line, font=f) > width:
            cut = len(line)
            while cut > 1 and draw.textlength(line[:cut], font=f) > width:
                cut -= 1
            lines.append(line[:cut])
            line = line[cut:]
    if line:
        lines.append(line)
    return lines


def render(card, kicker, title, lines, cta, out):
    img = Image.new('RGB', (W, H), RED)
    if card.get('picture'):
        art = Image.open(full_picture(card['picture']['src'])).convert('RGB')
        art = ImageOps.fit(art, (ART_W, H), method=Image.LANCZOS, centering=(0.5, 0.4))
        img.paste(art, (0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([ART_W, 0, ART_W + 8, H], fill=INK)
    x, width = ART_W + 56, W - ART_W - 56 - 52
    y = 58
    k = font(28, 700)
    d.text((x, y), kicker, font=k, fill=PALE)
    y += 58
    size = 64
    while size > 40:
        t = font(size, 800)
        tl = wrap(d, title, t, width)
        if len(tl) <= 3:
            break
        size -= 4
    for line in tl:
        d.text((x, y), line, font=t, fill=CREAM)
        y += int(size * 1.18)
    y += 18
    b = font(28, 500)
    room = max(1, (H - 140 - y) // 40)
    body = [line for text in lines for line in wrap(d, text, b, width)]
    if len(body) > room:
        body = body[:room]
        last = body[-1]
        while last and d.textlength(last + '…', font=b) > width:
            last = last[:-1]
        body[-1] = last.rstrip() + '…'
    for line in body:
        d.text((x, y), line, font=b, fill=PALE)
        y += 40
    c = font(32, 800)
    cw = d.textlength(cta, font=c)
    d.rectangle([x, H - 112, x + cw + 48, H - 52], fill=CREAM)
    d.text((x + 24, H - 102), cta, font=c, fill=RED)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
    print(out.relative_to(ROOT))


def load_font():
    global FONT
    data = subprocess.run(['git', 'show', FONT_COMMIT], cwd=ROOT, check=True, capture_output=True).stdout
    tmp = tempfile.NamedTemporaryFile(suffix='.woff2', delete=False)
    tmp.write(data)
    tmp.close()
    FONT = Path(tmp.name)


def main():
    load_font()
    want = sys.argv[1:]
    data = json.loads(subprocess.run(['node', '-e', DUMP, json.dumps(want)], cwd=ROOT, check=True,
                                     capture_output=True, text=True).stdout)
    for s in data:
        whole = s['whole']
        pub = ROOT / 'public' / s['dir'].lstrip('/')
        render(whole, '역사 전략 게임', whole['title'],
               [f"결정적인 전투 {whole['battles']}개를 칸 위에서 지휘한다", '로그인 없이 · 브라우저에서 바로'],
               '직접 지휘하기 →', pub / 'og-game.jpg')
        for b in s['battles']:
            render(b, f"{whole['title']} · 전투 하나", b['title'],
                   [f"{b['date']} · {b['turns']}턴", b['pitch']], '이 전투 지휘하기 →', pub / f"og-{b['id']}.jpg")


if __name__ == '__main__':
    main()
