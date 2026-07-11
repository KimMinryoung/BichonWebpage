CREATE TABLE IF NOT EXISTS commulingo_role_categories (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    icon TEXT NOT NULL DEFAULT '',
    label_ko TEXT NOT NULL DEFAULT '',
    label_en TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE commulingo_person_roles
    ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES commulingo_role_categories(id) ON UPDATE CASCADE;
