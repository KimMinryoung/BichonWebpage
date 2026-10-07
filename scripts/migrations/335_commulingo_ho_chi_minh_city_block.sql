-- 2026-10-07: the Ho Chi Minh card now also answers to 호찌민 (the event/term spelling); the
-- city names must not link to the person.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '호찌민시', 'Ho Chi Minh City, not the person', 'phrase'),
    ('ko', '호치민시', 'Ho Chi Minh City, not the person', 'phrase'),
    ('en', 'ho chi minh city', 'Ho Chi Minh City, not the person', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
