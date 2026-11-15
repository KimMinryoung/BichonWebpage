#!/usr/bin/env python3
"""PDF → text (or page images) with PyMuPDF, which this host has; pdftotext is not installed.

  python3 -P scripts/commulingo-dict-kit/pdf2txt.py <file.pdf> [out.txt] [--pages 3-10]
  python3 -P scripts/commulingo-dict-kit/pdf2txt.py <file.pdf> --png <dir> [--pages 3-10] [--dpi 150]

Text goes to out.txt (default: <file>.txt), one "=== page N ===" line before each page.
A scanned PDF has no text layer: the script says so, and --png writes page images to read instead.
"""
import os
import sys

import pymupdf


def main(argv):
    args, pages, png, dpi = [], None, None, 150
    it = iter(argv)
    for a in it:
        if a == '--pages':
            lo, _, hi = next(it).partition('-')
            pages = (int(lo), int(hi or lo))
        elif a == '--png':
            png = next(it)
        elif a == '--dpi':
            dpi = int(next(it))
        else:
            args.append(a)
    if not args:
        sys.exit(__doc__)
    doc = pymupdf.open(args[0])
    lo, hi = pages or (1, doc.page_count)
    span = range(max(lo, 1) - 1, min(hi, doc.page_count))
    if png:
        os.makedirs(png, exist_ok=True)
        for i in span:
            doc[i].get_pixmap(dpi=dpi).save(os.path.join(png, 'p%04d.png' % (i + 1)))
        print('%d page images in %s' % (len(span), png))
        return
    out = args[1] if len(args) > 1 else os.path.splitext(args[0])[0] + '.txt'
    chars = 0
    with open(out, 'w', encoding='utf-8') as fh:
        for i in span:
            text = doc[i].get_text()
            chars += len(text.strip())
            fh.write('=== page %d ===\n%s\n' % (i + 1, text))
    print('%s: %d pages, %d characters' % (out, len(span), chars))
    if chars < 20 * len(span):
        print('almost no text layer (a scan?): use --png <dir> and read the page images')


main(sys.argv[1:])
