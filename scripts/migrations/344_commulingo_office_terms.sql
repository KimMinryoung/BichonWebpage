-- 344: an office lineage names the glossary entries for the bodies it covers
-- (2026-10-09).
--
-- The office pages and the glossary described the same institutions without
-- linking to each other. term_ids lists the glossary entries an office page
-- links to, the first being the office's own entry; a term page lists every
-- office (and Central Committee roster, data/commulingo/party-bodies.js) that
-- names it, so the Central Committee entry gathers its bodies. An id with no
-- glossary entry is skipped at render time.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_offices
    ADD COLUMN IF NOT EXISTS term_ids TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN commulingo_offices.term_ids IS
    'Glossary entries the office page links to (first = the office''s own entry); term pages list the offices naming them.';

UPDATE commulingo_offices AS o
SET term_ids = v.term_ids, updated_at = NOW()
FROM (VALUES
    ('party-leadership',         ARRAY['general-secretary-of-the-cpsu', 'central-committee-of-the-cpsu']),
    ('party-secretariat-cadres', ARRAY['secretariat-of-the-cpsu-central-committee', 'central-committee-of-the-cpsu', 'nomenklatura']),
    ('control-commissions',      ARRAY['workers-and-peasants-inspectorate-rabkrin']),
    ('ideology-propaganda',      ARRAY['agitprop', 'central-committee-of-the-cpsu']),
    ('state-head',               ARRAY['presidency-ussr']),
    ('head-of-government',       ARRAY['sovnarkom']),
    ('state-security',           ARRAY['cheka', 'ogpu', 'nkvd', 'mgb', 'kgb']),
    ('defence',                  ARRAY['red-army']),
    ('nationalities-federal',    ARRAY['soviet-of-nationalities']),
    ('central-planning',         ARRAY['gosplan']),
    ('heavy-military-industry',  ARRAY['supreme-council-of-the-national-economy-vsnkh', 'vpk']),
    ('science-nuclear-space',    ARRAY['special-committee', 'ministry-of-medium-machine-building-sredmash']),
    ('comintern',                ARRAY['comintern'])
) AS v(id, term_ids)
WHERE o.id = v.id;

COMMIT;
