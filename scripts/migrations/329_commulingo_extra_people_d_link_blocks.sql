-- 2026-10-07: link guards before registering the second follow-up batch
-- (scripts/content/queue-events-20261007/people-extra-20261007-d.js, REPORT-people-extra-d.md).
-- Edward Grey's bare surname also matches 그레이엄·그레이브스·그레이스 and Earl Grey /
-- Grey Cardinal; the other bare 사조노프/Sazonov in the corpus are Yegor Sazonov and a
-- Priamurye official; 레몽 푸앵카레 (no card) would link to Julien Raimond. Full names still
-- link. The Balkan Wars body names Sergey Sazonov in full so it keeps its link.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '그레이', 'Edward Grey''s surname; also 그레이엄·그레이브스·그레이스 and generic grey', 'alias'),
    ('en', 'grey', 'Edward Grey''s surname; also Earl Grey, Grey Cardinal and the colour', 'alias'),
    ('ko', '사조노프', 'Sergey Sazonov''s surname; other bare uses are Yegor Sazonov and others', 'alias'),
    ('en', 'sazonov', 'Sergey Sazonov''s surname; other bare uses are Yegor Sazonov and others', 'alias'),
    ('ko', '레몽 푸앵카레', 'Raymond Poincaré, not Julien Raimond', 'phrase')
ON CONFLICT DO NOTHING;
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '러시아 외무장관 사조노프는', '러시아 외무장관 세르게이 사조노프는'),
       body_en = replace(body_en, 'Foreign Minister Sazonov instead', 'Foreign Minister Sergey Sazonov instead'),
       updated_at = now()
 WHERE id = 'balkan-wars-1912-1913' AND strpos(body_ko, '러시아 외무장관 사조노프는') > 0;
COMMIT;
