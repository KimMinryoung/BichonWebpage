-- 299: the control-commission lineage gets its own office page (2026-10-07):
-- the party's Central Control Commission → Commission/Committee of Party
-- Control → CPSU Central Control Commission, and beside it the state line
-- (State Control → Rabkrin → Soviet Control → Ministry of State Control →
-- Party-State Control → People's Control). It sits after the Secretariat and
-- cadres page; the holder rows come from
-- scripts/content/office-lineages-20261006/control-commissions.json.
BEGIN;
UPDATE commulingo_offices SET sort_order = sort_order + 1, updated_at = NOW() WHERE sort_order >= 2;
INSERT INTO commulingo_offices (id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en, icon)
VALUES ('control-commissions', 2, '1918–1991', '통제 · 감찰 기관', 'Control and inspection bodies',
    '당 규율을 다룬 통제위원회 계열과 국가기관을 감찰한 국가통제 계열.',
    'The party''s control commissions, which enforced party discipline, and the state control bodies that inspected the administration.',
    'scale');
COMMIT;
