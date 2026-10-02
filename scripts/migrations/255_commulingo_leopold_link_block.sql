-- 2026-10-02: the bare given name 레오폴트 (indexed from 레오폴트 2세 once the
-- regnal number is stripped) fires 13 times, mostly on other Leopolds:
-- 레오폴트 트레퍼, 레오폴트 아베르바흐, 레오폴트 하임슨, 레오폴트 오쿨리츠키.
-- Only the full 레오폴트 2세 links (user decision). English "Leopold" alone is
-- not indexed.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '레오폴트', '레오폴트 2세만 링크; 맨 이름은 트레퍼·아베르바흐 등 다른 레오폴트', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
