ALTER TABLE commulingo_offices
    ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS commulingo_person_roles (
    person_id TEXT PRIMARY KEY REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    icon TEXT NOT NULL DEFAULT '',
    office_id TEXT REFERENCES commulingo_offices(id) ON UPDATE CASCADE,
    label_ko TEXT NOT NULL DEFAULT '',
    label_en TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
