-- 2026-10-04: "Second World" is an English alias of the term socialist-camp
-- (Socialist Camp), and the term pass matched it inside "Second World War":
-- 219 fires in 201 passages by audit-link-fires, all of them the war. Block the
-- compound so the war is never read as the Cold War bloc; "Second World" alone
-- still links.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('en', 'Second World War', 'The war, not the socialist camp''s alias "Second World" (219 wrong fires)', 'term-phrase')
ON CONFLICT DO NOTHING;
COMMIT;
