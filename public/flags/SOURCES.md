# Additional country flag sources

These present-day flags identify country facets, not historical citizenship.
Fetched 2026-09-07 from Flagcdn (flag designs sourced from Wikimedia Commons).

- `serbia.svg`: https://flagcdn.com/rs.svg
- `croatia.svg`: https://flagcdn.com/hr.svg
- `slovenia.svg`: https://flagcdn.com/si.svg
- `montenegro.svg`: https://flagcdn.com/me.svg
- `bosnia-herzegovina.svg`: https://flagcdn.com/ba.svg
- `switzerland.svg`: https://flagcdn.com/ch.svg

## Full country registry (2026-09-08)

Additional modern-country codes, ISO alpha-2 IDs and labels are listed in `data/commulingo/additional-countries.json`. Each corresponding `<code>.svg` was fetched from `https://flagcdn.com/<lowercase-iso>.svg`. Map geometry comes from Natural Earth 110m map units, supplemented with 50m map units for missing islands and microstates.

Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson (public domain).

## Size reduction (2026-11-11)

The flags show at 20-24 px (`commu-flag`, the world map's 24x16 markers).
Every file went through svgo 3.3.2 (`multipass`, `floatPrecision: 1`, the
default preset keeping `viewBox`). The 25 that were still over 12 KB — mostly
coats of arms (Bolivia, Ecuador, Oman, Mexico, …) — were rendered at 96 px wide
and wrapped as a WebP `<image>` inside the same `.svg`, keeping the original
root's width/height and viewBox (or stretching like it when it had none). The
folder went from 2.30 MB to 0.25 MB. The full drawings are in git history
before this change; redraw from those if a flag is ever needed large.

## Period flags for scene cards (2026-11-12)

`historical/` holds flags of 1848 states whose modern successor's flag would
mislead (`data/commulingo/story-markers.js`). They are not person-card codes.
From Wikimedia Commons (public domain); the four with coats of arms were
rendered 14 px high at 3x to PNG.

- `austrian-empire.svg`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Habsburg_Monarchy.svg
- `prussia.png`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Kingdom_of_Prussia_(1803-1892).svg
- `sardinia-1848.png`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Kingdom_of_Sardinia_(1848-1851).svg
- `two-sicilies.png`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Kingdom_of_the_Two_Sicilies_(1816).svg
- `papal-states.png`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Papal_States_(1825-1870).svg
- `san-marco-1848.png`: https://commons.wikimedia.org/wiki/File:Flag_of_the_Republic_of_San_Marco.svg
- `croatia-1848.svg`: drawn here, the red-white-blue Croatian tricolour of 1848 (no arms).
