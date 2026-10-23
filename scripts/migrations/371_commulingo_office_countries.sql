-- 371: office lineages belong to a country, and France gets the first
-- non-Soviet one (2026-10-23).
--
-- Every lineage so far was Soviet, and /commulingo/offices was titled 소련
-- 직책 계보. `country` is the flag/geography code of the state the office
-- belongs to (data/commulingo/country-geography.js); the index groups by it,
-- Soviet first, and a country hub (/commulingo/countries/<code>) links the
-- lineages of its own code. The Comintern lineage stays `soviet`: it sits with
-- the Soviet offices it was run from.
--
-- france-leadership follows French heads of state and government regime by
-- regime from 1789. Its tracks and holder rows come from
-- scripts/content/office-lineages-20261023/france-leadership.json through
-- scripts/commulingo-office-lineage-apply.js.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_offices
    ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'soviet';

INSERT INTO commulingo_offices (id, sort_order, section, country, range_label, title_ko, title_en, blurb_ko, blurb_en, icon)
VALUES ('france-leadership', 100, 'state', 'france', '1789–',
    '프랑스 국가원수 · 정부 수반', 'Heads of state and government of France',
    '프랑스 혁명부터 오늘까지 정체가 바뀔 때마다 국가를 대표하고 정부를 이끈 사람들.',
    'Who headed the French state and led its government, regime by regime, from the Revolution to the present.',
    'landmark')
ON CONFLICT (id) DO NOTHING;

COMMIT;
