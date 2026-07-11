-- 007_commulingo_people.sql
-- Normalized CommuLingo people/institution data.

CREATE TABLE IF NOT EXISTS commulingo_people_groups (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    range_label TEXT NOT NULL DEFAULT '',
    title_ko TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    blurb_ko TEXT NOT NULL DEFAULT '',
    blurb_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commulingo_people (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES commulingo_people_groups(id) ON UPDATE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    initial TEXT NOT NULL DEFAULT '',
    cyrillic TEXT NOT NULL DEFAULT '',
    years_label TEXT NOT NULL DEFAULT '',
    birth_year INTEGER,
    death_year INTEGER,
    name_ko TEXT NOT NULL DEFAULT '',
    name_en TEXT NOT NULL DEFAULT '',
    epithet_ko TEXT NOT NULL DEFAULT '',
    epithet_en TEXT NOT NULL DEFAULT '',
    bio_ko TEXT NOT NULL DEFAULT '',
    bio_en TEXT NOT NULL DEFAULT '',
    fate_kind TEXT NOT NULL DEFAULT '',
    fate_label_ko TEXT NOT NULL DEFAULT '',
    fate_label_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commulingo_people_group_sort_idx
    ON commulingo_people(group_id, sort_order);

CREATE TABLE IF NOT EXISTS commulingo_person_patronymics (
    person_id TEXT PRIMARY KEY REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    patronymic_ko TEXT NOT NULL DEFAULT '',
    patronymic_en TEXT NOT NULL DEFAULT '',
    cyrillic_patronymic TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commulingo_person_aliases (
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    lang TEXT NOT NULL CHECK (lang IN ('ko', 'en')),
    alias TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (person_id, lang, alias)
);

CREATE INDEX IF NOT EXISTS commulingo_person_aliases_lookup_idx
    ON commulingo_person_aliases(lang, alias);

CREATE TABLE IF NOT EXISTS commulingo_person_scenes (
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    collection_id TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (person_id, collection_id, episode_id)
);

CREATE TABLE IF NOT EXISTS commulingo_person_career_entries (
    id BIGSERIAL PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    period_label TEXT NOT NULL DEFAULT '',
    start_year INTEGER,
    start_month INTEGER,
    end_year INTEGER,
    end_month INTEGER,
    role_ko TEXT NOT NULL DEFAULT '',
    role_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commulingo_person_career_person_sort_idx
    ON commulingo_person_career_entries(person_id, sort_order);

CREATE TABLE IF NOT EXISTS commulingo_offices (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    range_label TEXT NOT NULL DEFAULT '',
    title_ko TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    blurb_ko TEXT NOT NULL DEFAULT '',
    blurb_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commulingo_office_rows (
    id BIGSERIAL PRIMARY KEY,
    office_id TEXT NOT NULL REFERENCES commulingo_offices(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    period_label TEXT NOT NULL DEFAULT '',
    start_year INTEGER,
    start_month INTEGER,
    end_year INTEGER,
    end_month INTEGER,
    body_ko TEXT NOT NULL DEFAULT '',
    body_en TEXT NOT NULL DEFAULT '',
    person_id TEXT REFERENCES commulingo_people(id) ON DELETE SET NULL ON UPDATE CASCADE,
    name_ko TEXT NOT NULL DEFAULT '',
    name_en TEXT NOT NULL DEFAULT '',
    note_ko TEXT NOT NULL DEFAULT '',
    note_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commulingo_office_rows_office_sort_idx
    ON commulingo_office_rows(office_id, sort_order);

CREATE INDEX IF NOT EXISTS commulingo_office_rows_person_idx
    ON commulingo_office_rows(person_id);

CREATE TABLE IF NOT EXISTS commulingo_people_revisions (
    id BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    revision_note TEXT NOT NULL DEFAULT '',
    snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    changed_by TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commulingo_people_revisions_entity_idx
    ON commulingo_people_revisions(entity_type, entity_id, created_at DESC);

CREATE TABLE IF NOT EXISTS commulingo_agent_suggestions (
    id BIGSERIAL PRIMARY KEY,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    action TEXT NOT NULL,
    patch_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    source_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
    confidence NUMERIC(4, 3),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'superseded')),
    suggested_by TEXT NOT NULL DEFAULT '',
    reviewer TEXT NOT NULL DEFAULT '',
    review_note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS commulingo_agent_suggestions_status_idx
    ON commulingo_agent_suggestions(status, created_at DESC);
