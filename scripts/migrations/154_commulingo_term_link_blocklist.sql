-- The term pass's linking exceptions, moved out of code — the same journey the
-- person pass took in 116/117. term-linkify.js carried three arrays
-- (BLOCKED_TERM_KO, NEVER_LINK_TERM_ALIAS_KO, NEVER_LINK_TERM_HEADWORD), and
-- every mislink found in real prose cost a commit, an image rebuild and a
-- container recreate. A glossary entry about one specific situation that uses a
-- common word as its headword or alias (휴전협정 → the Korean armistice,
-- 국민전선 → the perestroika popular fronts) poisons every other page that uses
-- the word in its plain sense; the fix is data about content and belongs in
-- this table, one INSERT away.
--
-- Three new kinds, mirroring the person pass's two:
--   term-phrase   — a longer string containing a term alias, consumed ahead of
--                   it so the alias inside never fires (전세계 holds 전세).
--   term-alias    — an alias dropped from the index unless it is the entry's
--                   own headword; the entry stays reachable by its headword and
--                   its longer aliases.
--   term-headword — a string dropped even as a headword, for entries whose own
--                   name is too common or too ambiguous to link bare. English
--                   strings match case-sensitively, so each casing that should
--                   be blocked needs its own row.

ALTER TABLE commulingo_link_blocklist
    DROP CONSTRAINT IF EXISTS commulingo_link_blocklist_kind_check;
ALTER TABLE commulingo_link_blocklist
    ADD CONSTRAINT commulingo_link_blocklist_kind_check
    CHECK (kind IN ('phrase', 'alias', 'term-phrase', 'term-alias', 'term-headword'));

COMMENT ON COLUMN commulingo_link_blocklist.kind IS
    'phrase/alias act on the person pass; term-phrase/term-alias/term-headword on the term pass. *-phrase: a longer string containing an alias, consumed ahead of it. *-alias: dropped from the index (term-alias spares the entry''s own headword). term-headword: dropped even as the headword.';

-- BLOCKED_TERM_KO — compounds that contain a term alias but never mean it.
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
    ('term-phrase', 'ko', '집단농장화',   '콜호스화 과정 서술이지 콜호스 항목이 아니다'),
    ('term-phrase', 'ko', '전세계',       '『공산당 선언』의 전세계가 전세(주택 임대)로 걸렸다'),
    ('term-phrase', 'ko', '모티프',       '모플(MOPR) 별칭 모티를 품는다'),
    ('term-phrase', 'ko', '58-6조',       '58조의 항이지 헌법 6조가 아니다 (하이픈이 선행 문자 가드를 통과한다)'),
    ('term-phrase', 'ko', '근위축증',     '근위(Guards) 칭호가 아니다'),
    ('term-phrase', 'ko', '근위발달영역', '비고츠키 용어 — 근위 칭호가 아니다'),
    ('term-phrase', 'ko', '젊은 근위대',  '소설 제목 — 근위 칭호가 아니다'),
    ('term-phrase', 'ko', '오카야마',     '오카(Oka) 미사일 두 음절을 품은 지명 (2026-08-23 전수 집계)'),
    ('term-phrase', 'ko', '오카시오-코르테스', '오카 미사일 두 음절을 품은 인명 (2026-08-23 전수 집계)'),
    ('term-phrase', 'ko', '만주파 트로이카', '은유 — NKVD 3인조도 3두체제도 아니다 (최용건 카드)'),
    ('term-phrase', 'ko', '''트로이카''로 불리는', '비고츠키 연구 3인조 은유 — 어느 항목에도 걸리면 안 된다'),
    -- 2026-08-24: found on /commulingo/docs/nkvd-1937-documents — a proposed
    -- party name in an interrogation record, not the Afghan PDPA.
    ('term-phrase', 'ko', '러시아 인민민주당', '조서 속 신당 이름 — 아프가니스탄 인민민주당이 아니다'),
    -- 2026-08-24: 이승만 카드의 「대한민국 임시정부 초대 대통령」이 러시아
    -- 임시정부로 걸렸다. 수식된 형태는 절대 러시아 임시정부가 아니다.
    ('term-phrase', 'ko', '대한민국 임시정부', '상하이·충칭의 망명정부 — 러시아 임시정부가 아니다'),
    ('term-phrase', 'ko', '상하이 임시정부',   '대한민국 임시정부의 통칭 — 러시아 임시정부가 아니다')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

-- NEVER_LINK_TERM_ALIAS_KO — bare ambiguous aliases dropped from the index;
-- each entry stays reachable by its headword and longer aliases.
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
    ('term-alias', 'ko', '주체',       '일반어 주체가 주체사상으로 걸렸다 (『자본론』)'),
    ('term-alias', 'ko', '소개',       '일반어 소개(introduction)가 1941년 소개(疏開)로 걸렸다'),
    ('term-alias', 'ko', '호구',       '일반어'),
    ('term-alias', 'ko', '씨밤',       '일반어'),
    ('term-alias', 'ko', '소련 인민',  '일반 표현'),
    ('term-alias', 'ko', 'UN',        '한국어 패스는 라틴 두 글자에 경계가 없다 — UNKVD·UNRRA 머리에서 발화. 유엔으로 계속 닿는다'),
    ('term-alias', 'ko', '코르',       '코르 드 발레의 코르가 폴란드 KOR로'),
    ('term-alias', 'ko', '레프',       '인명 레프(카메네프)가 좌익예술전선(LEF)으로'),
    ('term-alias', 'ko', '정치국',     '1,084회 발화가 거의 다 제도로서의 정치국인데 1917년 10월 임시 지도부 항목으로 갔다 (2026-08-23)'),
    ('term-alias', 'ko', '볼가',       '강·자동차 공장 165회가 보스호트 에어록으로 (2026-08-23)'),
    ('term-alias', 'ko', '인민위원회', '소브나르콤·북조선 인민위원회가 유고 인민해방위원회로 (2026-08-23)'),
    ('term-alias', 'ko', '가속화',     '일반 동명사가 우스코레니예로 (2026-08-23)'),
    ('term-alias', 'ko', '매파적',     '정치·군사 강경파가 통화 매파로 (2026-08-23)'),
    ('term-alias', 'ko', '아라',       '아라곤·아라키의 머리가 ARA로 (2026-08-23)'),
    ('term-alias', 'ko', 'MO',        'UN과 같은 꼴 — MOPR·MOOP 머리에서 발화 (2026-08-23)'),
    ('term-alias', 'ko', '네프',       '네프테신디카트·네프스키처럼 무관한 음차의 머리 — 신경제정책·NEP로 계속 닿는다'),
    -- 2026-08-24: found via audit-link-fires on /commulingo/docs/cnr-programme-1944.
    ('term-alias', 'ko', '휴전협정',   '한국 정전협정 별칭인데 발화 6건 전부 2차대전 휴전(바돌리오·콩피에뉴·카시빌레)이었다. 정전협정 표제어로 계속 닿는다'),
    ('term-alias', 'ko', '국민전선',   '페레스트로이카 인민전선 별칭인데 발화 전부 체코 국민전선·프랑스 레지스탕스 국민전선이었다'),
    ('term-alias', 'ko', '민족전선',   '페레스트로이카 인민전선 별칭인데 발화 전부 체코·베트남 NLF·FRELIMO 등 무관한 전선이었다'),
    ('term-alias', 'ko', '행동 강령',  '띄어 쓴 형태는 일반명사(카브랄·파농의 행동 강령) — 붙여 쓴 행동강령만 1968년 프라하 문맥에서 발화한다'),
    ('term-alias', 'en', 'National Front', 'every fire is the Czech or French National Front, not the perestroika popular fronts (2026-08-24)')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

-- NEVER_LINK_TERM_HEADWORD — refused even as the entry's own headword.
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
    ('term-headword', 'ko', '소비에트', '국가·평의회·형용사 절반이 이 낱말 — 링크가 독자에게 주는 것이 없다. 색인·긴 별칭(소비에트 대회)으로 닿는다'),
    ('term-headword', 'ko', '소개',     '동음이의 — 산문에서는 거의 항상 introduction. 영어 쪽(Evacuation)은 쌍둥이가 없어 링크를 유지한다'),
    ('term-headword', 'ko', '전세',     '이 말뭉치에서는 거의 항상 戰勢(전세를 역전) — 전세제도로 닿는다 (2026-08-23)'),
    ('term-headword', 'ko', '개조',     '일반어 리모델링이 굴라크 페레코프카보다 훨씬 흔하다 (2026-08-23)'),
    ('term-headword', 'ko', '정상화',   '국교 정상화·관계 정상화가 후사크 정상화보다 흔하다 (2026-08-23)'),
    ('term-headword', 'ko', '매파',     '전기마다 정치·군사 매파 — 통화 매파로 닿는다 (2026-08-23)'),
    ('term-headword', 'en', 'Soviet',   'the adjective in "the Soviet Union" swamps the entry; kept in step with ko'),
    ('term-headword', 'en', 'soviet',   'case-sensitive match — each casing needs a row'),
    ('term-headword', 'en', 'soviets',  'case-sensitive match'),
    ('term-headword', 'en', 'Soviets',  'case-sensitive match'),
    ('term-headword', 'en', 'Politburo', '603 fires, nearly all the standing institution; target was the October 1917 seven (2026-08-23)'),
    ('term-headword', 'en', 'Political Bureau', 'same as Politburo (2026-08-23)'),
    ('term-headword', 'en', 'Volga',    'the river and the car plant, 126 fires (2026-08-23)'),
    ('term-headword', 'en', 'acceleration', 'the ordinary noun; capitalized Acceleration stays — it only fires as the uskoreniye slogan'),
    ('term-headword', 'en', 'hawk',     'the war hawk, not the central-bank kind (2026-08-23)'),
    ('term-headword', 'en', 'hawkish',  'the war hawk (2026-08-23)')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

-- The per-reading-unit escape hatch, for strings that are right almost
-- everywhere but wrong on one page: reference documents declare `noAutoLink`
-- in docs/manifest.json, and events carry the same list in this column. Bare
-- 임시정부 fires 199 times in this corpus and is the Russian Provisional
-- Government in essentially all of them; on the French pages it is the GPRF,
-- and no qualifying phrase exists in the prose to block instead.
ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS no_auto_link jsonb NOT NULL DEFAULT '[]';

COMMENT ON COLUMN commulingo_history_events.no_auto_link IS
    'Strings this event''s prose refuses to auto-link, e.g. ["임시정부"] — for words whose dictionary sense is right elsewhere but wrong in this event''s context. The docs counterpart is noAutoLink in data/commulingo/docs/manifest.json.';

UPDATE commulingo_history_events SET no_auto_link = '["임시정부"]'
 WHERE id = 'fall-of-france' AND no_auto_link = '[]';

