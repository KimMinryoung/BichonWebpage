#!/usr/bin/env python3
"""Build public/fonts/pretendard/PretendardVariable.common.woff2.

One file with the Hangul and symbols a page almost always needs, so a
Korean page makes one font request instead of 20-30 unicode-range slices
(each arrival re-lays out the page). It holds the 2,350 KS X 1001
syllables, every other syllable the site's content uses today, the
compatibility jamo and CJK punctuation, and the symbols the content uses
that IBM Plex does not draw (arrows, circled numbers, IPA, fullwidth
punctuation), with the weight axis cut to 400-800 (the weights the CSS asks
for). pretendard-subset.css declares it as 'Pretendard'; the official slices
follow as 'Pretendard Extra', the next family in every font stack, so a
character this file lacks (in practice Hanja) fetches only its slice.

Needs fonttools and brotli. The source is the full variable font that
ef4631d replaced with the slices:

  git show ef4631d^:public/fonts/pretendard/PretendardVariable.woff2 > /tmp/PretendardVariable.woff2
  python3 scripts/build-pretendard-common.py /tmp/PretendardVariable.woff2
"""
import glob
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'public', 'fonts', 'pretendard', 'PretendardVariable.common.woff2')


# The blocks the common face's unicode-range in pretendard-subset.css
# claims besides Hangul: IPA, general punctuation to symbols and dingbats,
# CJK symbols and compatibility, fullwidth forms. Keep the two in step.
SYMBOL_BLOCKS = [(0x0250, 0x02FF), (0x2000, 0x2BFF), (0x3000, 0x33FF), (0xFF00, 0xFFEF)]


def site_characters():
    """Every character in the content on disk: data files, docs, views, scripts."""
    patterns = ['data/**/*.json', 'data/commulingo/docs/**/*.html', 'data/commulingo/courses/*.js',
                'views/**/*.ejs', 'public/js/*.js']
    found = set()
    for pattern in patterns:
        for path in glob.glob(os.path.join(ROOT, pattern), recursive=True):
            try:
                text = open(path, encoding='utf-8').read()
            except (UnicodeDecodeError, OSError):
                continue
            found.update(ord(ch) for ch in text)
    return found


def main(source):
    ksx1001 = {cp for cp in range(0xAC00, 0xD7A4) if len(chr(cp).encode('euc-kr')) == 2}
    used = site_characters()
    syllables = {cp for cp in used if 0xAC00 <= cp <= 0xD7A3}
    symbols = {cp for cp in used if any(a <= cp <= b for a, b in SYMBOL_BLOCKS)}
    codepoints = ksx1001 | syllables | symbols | set(range(0x3131, 0x318F)) | set(range(0x3000, 0x3040))
    font = TTFont(source)
    options = subset.Options()
    options.hinting = False
    options.layout_features = ['*']
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    font = instancer.instantiateVariableFont(font, {'wght': (400, 800)})
    font.flavor = 'woff2'
    font.save(OUT)
    print(f'{len(codepoints)} code points, {os.path.getsize(OUT) // 1024} KB -> {OUT}')


if __name__ == '__main__':
    main(sys.argv[1])
