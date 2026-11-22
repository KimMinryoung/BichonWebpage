-- Person life years and fate follow the 2026-11-22 rules (owner's decision),
-- enforced in the database as well as in the store (person-life-years.js,
-- person-card-validation.js), so SQL that bypasses the store cannot bring the
-- old forms back:
--   years_label: 1898–1976, 1987– (living), 1757?–1791 (uncertain),
--     1896/1898–1937 (two possible years), ? for an unknown year — joined by
--     an en dash with no spaces; no c., no 이후, no hyphen. (The ascending
--     order of a/b is checked by the store only.)
--   fate_kind: one of the contract's fateKinds
--     (data/commulingo/person-editorial-contract.json) or '' — '' only for a
--     living person or one whose years are unknown; a dead person has a kind
--     (unknown when the cause is not known).
-- The data was normalized the same day; every row passes.
BEGIN;

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_years_format;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_years_format CHECK (
    years_label = ''
    OR years_label ~ '^([0-9]{3,4}(/[0-9]{3,4})?\??|\?)–(([0-9]{3,4}(/[0-9]{3,4})?\??|\?))?$'
);

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_fate_kind;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_fate_kind CHECK (
    fate_kind IN ('', 'natural', 'executed', 'assassinated', 'murdered', 'killed',
                  'accident', 'custody', 'suicide', 'disappeared', 'unknown')
);

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_dead_fate_kind;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_dead_fate_kind CHECK (
    years_label = '' OR years_label ~ '–$' OR fate_kind <> ''
);

COMMIT;
