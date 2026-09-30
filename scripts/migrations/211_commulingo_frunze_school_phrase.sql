-- 211: 210 blocked 프룬제 군사아카데미, but prose also has 프룬제 군사학교; block
-- the shared head 프룬제 군사 so every Frunze military school name stays plain.

BEGIN;
DELETE FROM commulingo_link_blocklist WHERE kind = 'phrase' AND lang = 'ko' AND phrase = '프룬제 군사아카데미';
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note)
    VALUES ('phrase', 'ko', '프룬제 군사', '프룬제 군사아카데미·군사학교 등 학교 이름 — 인물 미하일 프룬제로 오링크 방지');
COMMIT;
