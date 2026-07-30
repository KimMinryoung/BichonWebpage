-- The glossary category registry, moved out of code.
--
-- The slug has always been data (commulingo_terms.category, migration 071), but
-- the ten bilingual labels and their thematic order lived in
-- data/commulingo/term-categories.js. That file's own comment explains the
-- reasoning — "labels stay in code so they can be reworded without a migration"
-- — and it is exactly backwards: rewording in code costs a commit, an image
-- rebuild and a container recreate, while a migration costs one UPDATE. The
-- person dictionary's parallel registry (commulingo_role_categories) has been a
-- table all along; today a role category was relabelled and retired with no
-- deploy at all, which is the standard this brings the glossary up to.
--
-- Shape mirrors commulingo_role_categories deliberately, minus `icon`: the
-- glossary renders category chips as text, not glyphs.

CREATE TABLE IF NOT EXISTS commulingo_term_categories (
    id         text        NOT NULL PRIMARY KEY,
    sort_order integer     NOT NULL DEFAULT 0,
    label_ko   text        NOT NULL DEFAULT '',
    label_en   text        NOT NULL DEFAULT '',
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE commulingo_term_categories IS
    'Glossary category registry. Ordered thematically, not alphabetically. Terms reference it by commulingo_terms.category; an unknown or blank slug renders as 미분류/Uncategorized rather than disappearing, so no foreign key is enforced.';

INSERT INTO commulingo_term_categories (id, sort_order, label_ko, label_en) VALUES
    ('theory',        1, '이념·이론',      'Ideology and theory'),
    ('economy',       2, '경제·계획',      'Economy and planning'),
    ('party-state',   3, '당·국가 기구',   'Party and state'),
    ('factions',      4, '당내 분파',      'Factions and line struggles'),
    ('repression',    5, '억압·사법',      'Repression and law'),
    ('nationalities', 6, '민족문제',       'Nationalities'),
    ('culture',       7, '문화·교육',      'Culture and education'),
    ('international', 8, '국제 운동',      'International movement'),
    ('korea',         9, '한국 정치경제',  'Korean political economy'),
    ('contemporary', 10, '현대 자본주의',  'Contemporary capitalism')
ON CONFLICT (id) DO NOTHING;
