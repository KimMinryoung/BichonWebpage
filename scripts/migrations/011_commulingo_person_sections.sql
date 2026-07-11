CREATE TABLE IF NOT EXISTS commulingo_person_sections (
    id BIGSERIAL PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    slug TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    heading_ko TEXT NOT NULL DEFAULT '',
    heading_en TEXT NOT NULL DEFAULT '',
    body_ko TEXT NOT NULL DEFAULT '',
    body_en TEXT NOT NULL DEFAULT '',
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (person_id, slug)
);

CREATE INDEX IF NOT EXISTS commulingo_person_sections_person_idx
    ON commulingo_person_sections(person_id, sort_order, id);
