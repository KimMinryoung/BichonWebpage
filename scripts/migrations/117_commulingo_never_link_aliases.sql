-- The second half of the linking exception data: aliases that must never link
-- at all, not phrases that contain one.
--
-- Migration 116 moved BLOCKED_KO/BLOCKED_EN across — strings that CONTAIN an
-- alias (레닌그라드 holds 레닌) and are consumed ahead of it. That cannot help
-- when the collision is exact: 리보프 is both Prince Lvov and the Ukrainian city
-- of Lviv, 톨스토이 is the novelist far more often than the entry, 퍼스트 opens
-- 465 sentences in this corpus. For those, people-linkify.js kept a second pair
-- of arrays (NEVER_LINK_ALIAS_KO/EN) that drop the one-word alias from the index
-- entirely, so only the full name links. Same kind of data, same growth pattern,
-- same deploy cost — it belongs in the same table.
--
-- `kind` separates the two: 'phrase' is consumed ahead of the alias inside it,
-- 'alias' is never indexed in the first place.

ALTER TABLE commulingo_link_blocklist
    ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'phrase';
ALTER TABLE commulingo_link_blocklist
    DROP CONSTRAINT IF EXISTS commulingo_link_blocklist_kind_check;
ALTER TABLE commulingo_link_blocklist
    ADD CONSTRAINT commulingo_link_blocklist_kind_check CHECK (kind IN ('phrase', 'alias'));
ALTER TABLE commulingo_link_blocklist DROP CONSTRAINT commulingo_link_blocklist_pkey;
ALTER TABLE commulingo_link_blocklist ADD PRIMARY KEY (kind, lang, phrase);

COMMENT ON COLUMN commulingo_link_blocklist.kind IS
    'phrase: a longer string containing an alias, consumed ahead of it. alias: a one-word alias dropped from the index entirely, so only the full name links.';

INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
    ('alias', 'ko', '카스트로',  '동명이인·일반어와 겹치는 한 단어 별칭'),
    ('alias', 'ko', '보스',      '일반 단어'),
    ('alias', 'ko', '미신',      '일반 단어'),
    ('alias', 'ko', '레비',      '동명이인'),
    ('alias', 'ko', '스트롱',    '일반 단어'),
    ('alias', 'ko', '리드',      '일반 단어'),
    ('alias', 'ko', '포스터',    '일반 단어'),
    ('alias', 'ko', '퍼스트',    '일반 단어 — 영어 First가 이 말뭉치에 465회'),
    ('alias', 'ko', '피크',      '일반 단어'),
    ('alias', 'ko', '더트',      '일반 단어'),
    ('alias', 'ko', '보시',      '일반 단어'),
    ('alias', 'ko', '팔린',      '일반 단어 — 동사 활용형'),
    ('alias', 'ko', '데이비스',  '동명이인'),
    ('alias', 'ko', '존스',      '동명이인'),
    ('alias', 'ko', '보그스',    '동명이인'),
    ('alias', 'ko', '푸시킨',    '시인 푸시킨이 압도적으로 흔하다'),
    ('alias', 'ko', '시테른',    '동명이인'),
    ('alias', 'ko', '톨스토이',  '소설가 톨스토이가 압도적으로 흔하다'),
    ('alias', 'en', 'levi',      'shared surname'),
    ('alias', 'en', 'first',     'ordinary word — 465 sentence openings in this corpus'),
    ('alias', 'en', 'davis',     'shared surname'),
    ('alias', 'en', 'jones',     'shared surname'),
    ('alias', 'en', 'boggs',     'shared surname'),
    ('alias', 'en', 'pushkin',   'the poet is the overwhelmingly common bearer'),
    ('alias', 'en', 'tolstoy',   'the novelist is the overwhelmingly common bearer'),
    -- Found by scripts/audit-family-name-collisions.js firing inside real prose:
    -- 리보프 is the Ukrainian city (Lviv) in "리보프 출신 소련 경제학자" and
    -- "1946년 리보프에서", not Prince Georgy Lvov. The strings are identical, so
    -- no phrase can separate them — the surname stops linking, the full name
    -- 게오르기 리보프 still does.
    ('alias', 'ko', '리보프',    '우크라이나 도시 리보프(르비우)와 문자열이 같다 — 게오르기 리보프 전체 이름만 링크'),
    ('alias', 'en', 'lvov',      'the Ukrainian city (Lviv/Lvov) shares the string with Prince Lvov')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

-- Superseded: the exact-collision case is handled by the alias row above, not
-- by blocking one phrasing of it.
DELETE FROM commulingo_link_blocklist WHERE kind = 'phrase' AND phrase = '리보프 출신';
