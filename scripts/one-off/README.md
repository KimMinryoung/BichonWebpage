# one-off

Scripts that were run once against the production database or an external
API and are kept for the record, not for re-running:

- `backfill-research-series.js` (2026-05-05) — filled `series_slug`/`series_order` on research_documents.
- `normalize-commulingo-fate-db.js` (2026-07-14) — normalized fate labels in commulingo_people.
- `cloudflare-analytics.js` (2026-05-30) — one-time Cloudflare analytics pull; reads the retired `data/post-cache/`.

Re-runnable tools stay in `scripts/` (audits, `seed-commulingo-person-roles.js`
as the fresh-DB seed, `wrap-fic-names.js`, `bake-event-basemap.js`).
