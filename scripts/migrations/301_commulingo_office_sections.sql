-- 301: the office index groups its lineages by field, and the researchers
-- leave the wider-world shelf (2026-10-07).
--
-- /commulingo/offices listed 17 lineage cards in one undivided grid, party,
-- state, economy and foreign posts interleaved. `section` says which field a
-- lineage belongs to — party (the party apparatus, its discipline and its
-- ideological line, including the cultural controls), state (head of state,
-- government, security, the armed forces, the federation), economy (planning,
-- finance, industry, agriculture, science) or international (diplomacy and the
-- Comintern) — and the index renders one titled group per section in the order
-- above. sort_order is renumbered to run section by section.
--
-- The people page's era table lists eras by region; 이 역사를 연구한 사람들 is
-- not an era of the wider world, so its group moves to a shelf of its own,
-- `scholars`, which the page shows as a separate entry beside the office index.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_offices
    ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'state';
ALTER TABLE commulingo_offices DROP CONSTRAINT IF EXISTS commulingo_offices_section_check;
ALTER TABLE commulingo_offices
    ADD CONSTRAINT commulingo_offices_section_check
    CHECK (section IN ('party', 'state', 'economy', 'international'));

UPDATE commulingo_offices AS o
SET section = v.section, sort_order = v.sort_order, updated_at = NOW()
FROM (VALUES
    ('party-leadership',         'party',          0),
    ('party-secretariat-cadres', 'party',          1),
    ('control-commissions',      'party',          2),
    ('ideology-propaganda',      'party',          3),
    ('culture-literature',       'party',          4),
    ('state-head',               'state',          5),
    ('head-of-government',       'state',          6),
    ('state-security',           'state',          7),
    ('defence',                  'state',          8),
    ('nationalities-federal',    'state',          9),
    ('central-planning',         'economy',       10),
    ('economic-management',      'economy',       11),
    ('heavy-military-industry',  'economy',       12),
    ('agriculture',              'economy',       13),
    ('science-nuclear-space',    'economy',       14),
    ('foreign-affairs',          'international', 15),
    ('comintern',                'international', 16)
) AS v(id, section, sort_order)
WHERE o.id = v.id;

UPDATE commulingo_people_groups SET shelf = 'scholars', updated_at = NOW() WHERE id = 'scholar';

COMMIT;
