-- Where retired CommuLingo ids now point.
--
-- These lived as three hardcoded maps in routes/commulingo.js
-- (LEGACY_PERSON_IDS, LEGACY_OFFICE_IDS, LEGACY_ROLE_CATEGORY_IDS). Merging two
-- duplicate person cards is a DB-only operation, but keeping the dropped id's
-- URL alive meant a code commit, an image rebuild and a container recreate every
-- single time — three deploy steps to record one string. The table below carries
-- the same mapping as data, so a merge inserts its own redirect in the same
-- transaction and the running app picks it up on the next people-store refresh
-- (60s), with no deploy at all.
--
-- Seeded with every mapping the code held on 2026-07-30, including the seven
-- duplicate people merged that day.

CREATE TABLE IF NOT EXISTS commulingo_id_redirects (
    entity_type text        NOT NULL CHECK (entity_type IN ('person', 'office', 'role-category')),
    from_id     text        NOT NULL,
    to_id       text        NOT NULL,
    note        text        NOT NULL DEFAULT '',
    created_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (entity_type, from_id),
    -- A self-redirect is an infinite loop dressed as a row.
    CONSTRAINT commulingo_id_redirects_not_self CHECK (from_id <> to_id)
);

COMMENT ON TABLE commulingo_id_redirects IS
    'Retired ids and their canonical target. Written by merges; read by the people-store snapshot.';

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('person', 'stepan-shahumyan', 'stepan-shaumyan', 'transliteration corrected'),
    ('person', 'valerian-obolensky', 'osinsky', 'duplicate record merged into the canonical entry'),
    ('person', 'georgy-piatakov', 'yuri-pyatakov', 'duplicate record merged into the canonical entry'),
    -- 2026-07-30: seven people held two cards each, entered twice under a second
    -- transliteration — or, for Zverev and Kuznetsov, under a disambiguation
    -- suffix carried inside the name itself.
    ('person', 'hryhoriy-hrynko', 'grigory-grinko', 'duplicate merged 2026-07-30 (Ukrainian transliteration of the same card)'),
    ('person', 'alexander-tsiurupa', 'alexander-tsyurupa', 'duplicate merged 2026-07-30'),
    ('person', 'zverev-defense-industry', 'sergei-zverev', 'duplicate merged 2026-07-30'),
    ('person', 'efim-slavskii', 'slavsky', 'duplicate merged 2026-07-30'),
    ('person', 'otto-shmidt', 'otto-schmidt', 'duplicate merged 2026-07-30'),
    ('person', 'jakub-hanecki', 'yakov-ganetsky', 'duplicate merged 2026-07-30'),
    ('person', 'nikolai-kuznetsov-admiral', 'nikolai-kuznetsov-navy', 'duplicate merged 2026-07-30 (carried the birth year Kuznetsov falsified to enlist)'),
    ('office', 'heavy-industry-mic', 'heavy-military-industry', 'office id renamed'),
    ('office', 'security', 'state-security', 'office id renamed'),
    ('office', 'government', 'head-of-government', 'office id renamed'),
    ('office', 'planning', 'central-planning', 'office id renamed'),
    ('role-category', 'writer', 'writer-artist', 'role category renamed'),
    ('role-category', 'old-regime', 'imperial-white', 'role category renamed'),
    ('role-category', 'intl-revolutionary', 'non-soviet-revolutionary', 'role category renamed'),
    ('role-category', 'bloc-reformer', 'socialist-bloc-reform-leader', 'role category renamed')
ON CONFLICT (entity_type, from_id) DO NOTHING;
