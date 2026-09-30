-- 210: Person auto-links that land on the wrong card, found by rendering the
-- corpus and reading every surname link preceded by someone else's given name.
-- Each phrase is consumed before the surname inside it, so the surname stays
-- plain there and keeps linking everywhere else. (Surnames followed by another
-- name — 그레고리 지노비예프, 울리히 폰 브록도르프 — are handled by the name-context
-- rule in public/js/commulingo-name-context.js, not listed here.)
-- Also: the Vysočany congress term still called Dubček 알렉산드르.

BEGIN;
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
    ('phrase', 'ko', '디미트리 셰바르드나제', '1937년 총살된 조지아 화가 Dimitri Shevardnadze — 인물 에두아르트 셰바르드나제와 성이 같다'),
    ('phrase', 'ko', '지나이다 슈미트', '미생물학자 Zinaida Shmidt — 인물 오토 슈미트와 성이 같다'),
    ('phrase', 'ko', '메리 맥나마라', '2026년 AI 논평가 Mary McNamara — 인물 로버트 맥나마라와 성이 같다'),
    ('phrase', 'ko', '아브라함 하잔', '밍그렐리아 사건 피고 — 인물 알렉산드르 하잔과 성이 같다'),
    ('phrase', 'ko', '도라 하잔', '안드레예프의 아내 Dora Khazan — 인물 알렉산드르 하잔과 성이 같다'),
    ('phrase', 'ko', '훌리안 고르킨', 'POUM의 Julián Gorkin — 인물 알렉산드르 고르킨과 성이 같다'),
    ('phrase', 'ko', '볼로디미르 리트빈', '우크라이나 정치인 Volodymyr Lytvyn — 인물 미하일 리트빈과 성이 같다'),
    ('phrase', 'ko', '압둘 말리크', '후티 지도자 Abdul-Malik al-Houthi — 인물 야코프 말리크로 오링크 방지'),
    ('phrase', 'ko', '톰슨 로이터', '기업 Thomson Reuters — 인물 에른스트 로이터·톰슨으로 오링크 방지'),
    ('phrase', 'ko', '네루다', '시인 Pablo Neruda — 끝의 다가 조사로 읽혀 인물 네루로 오링크'),
    ('phrase', 'ko', '레닌 공공도서관', '도서관 이름 — 인물 레닌으로 오링크 방지'),
    ('phrase', 'ko', '프룬제 군사아카데미', '학교 이름 — 인물 미하일 프룬제로 오링크 방지'),
    ('phrase', 'ko', '보롭스키 가', '모스크바 거리 이름 — 인물 바츨라프 보롭스키로 오링크 방지')
ON CONFLICT DO NOTHING;
UPDATE commulingo_terms SET definition_ko = replace(definition_ko, '알렉산드르 둡체크', '알렉산데르 둡체크'),
    body_ko = replace(body_ko, '알렉산드르 둡체크', '알렉산데르 둡체크') WHERE id = 'vyso-any-party-congress';
COMMIT;
