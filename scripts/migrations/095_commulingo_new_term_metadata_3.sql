-- Final metadata catch-up: two terms the curator registered before the
-- authoring pipeline started supplying this metadata itself (LeninBot commit
-- 0b4a2a3, which made period/category required on commulingo_term_create).
-- Terms written after that arrive complete, so this should be the last of these.

UPDATE commulingo_terms SET
    period_ko = '1917년 4월',
    period_en = 'April 1917',
    start_year = 1917,
    end_year = 1917,
    category = 'theory'
WHERE id = 'april-theses';

-- A US Christian-dominionist doctrine: not Soviet history, and the closest fit
-- among the ten categories is the contemporary group that already holds the
-- present-day political-economy entries.
UPDATE commulingo_terms SET
    period_ko = '1975–현재',
    period_en = '1975–present',
    start_year = 1975,
    end_year = NULL,
    category = 'contemporary'
WHERE id = 'seven-mountains-mandate';

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
('april-theses', 'dual-power'),
('april-theses', 'permanent-revolution'),
('april-theses', 'dictatorship-of-the-proletariat'),
('peoples-war', 'mass-strike'),
('peoples-war', 'dual-power')
ON CONFLICT DO NOTHING;
