-- 209: 두브체크 is the spelling Korean press and books mostly use, so it stays
-- as a search alias of 알렉산데르 둡체크 (206 had renamed the alias to 둡체크).

BEGIN;
INSERT INTO commulingo_person_aliases (person_id, lang, alias) VALUES ('dubcek', 'ko', '두브체크') ON CONFLICT DO NOTHING;
COMMIT;
