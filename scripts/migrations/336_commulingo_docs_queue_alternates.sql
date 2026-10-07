-- 2026-10-07: replacements for two skipped queue items are now published; the gaps stay
-- skipped (the requested documents themselves are still unavailable) but point to them.
UPDATE commulingo_curation_gaps SET resolution = resolution || ' — 대신 1975년 마다가스카르 민주공화국 헌법 완역 게재(madagascar-constitution-1975)', updated_at = now()
 WHERE id = 1810 AND status = 'skipped' AND resolution NOT LIKE '%madagascar-constitution-1975%';
UPDATE commulingo_curation_gaps SET resolution = resolution || ' — 대신 제4차 대회 결의 완역 게재(cpv-fourth-congress-resolution-1976)', updated_at = now()
 WHERE id = 1843 AND status = 'skipped' AND resolution NOT LIKE '%cpv-fourth-congress-resolution-1976%';
