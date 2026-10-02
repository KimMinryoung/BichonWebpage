-- 2026-10-02: link blocks for the 33 people added to the hungary-interwar-20261001
-- batch. Their bare family names fired inside other words and on other people
-- (audit-family-name-collisions):
--   티서/Tisza (István Tisza) is mostly the river — 티서강, the Tisza offensive,
--   Danube–Tisza — so the bare name never links; 티서 이슈트반 still does.
--   The rest are phrases consumed ahead of the surname: places (체르니고프,
--   야시누바타, Iași–Chișinău, Somogy County) and namesakes (Herbert Bix, Fyodor
--   Chernyshov, Václav Černý, Józef Haller, Nicolas Werth).
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '티서', '티서 이슈트반의 성이지만 본문에서는 대개 티서강(티서 공세)', 'alias'),
    ('en', 'Tisza', 'István Tisza''s surname, but mostly the river (Tisza offensive, Danube–Tisza)', 'alias'),
    ('ko', '체르니고프', '도시 체르니히우. 체르니 요제프로 오링크 방지', 'phrase'),
    ('ko', '체르니쇼프', '표도르 체르니쇼프 등. 체르니 요제프로 오링크 방지', 'phrase'),
    ('ko', '바츨라프 체르니', '체코 문학자. 체르니 요제프로 오링크 방지', 'phrase'),
    ('ko', '허버트 빅스', '히로히토 전기 작가. 페르낭 빅스로 오링크 방지', 'phrase'),
    ('ko', '유제프 할레르', '폴란드 장군. 할레르 이슈트반으로 오링크 방지', 'phrase'),
    ('en', 'Józef Haller', 'Polish general; not István Haller', 'phrase'),
    ('ko', '니콜라 베르트', '프랑스 역사가. 베르트 헨리크로 오링크 방지', 'phrase'),
    ('en', 'Nicolas Werth', 'French historian; not Henrik Werth', 'phrase'),
    ('ko', '야시누바타', '우크라이나 마을. 야시 오스카르로 오링크 방지', 'phrase'),
    ('ko', '야시-키시뇨프', '1944년 작전 이름. 야시 오스카르로 오링크 방지', 'phrase'),
    ('ko', '쇼모지주', '헝가리의 주. 쇼모지 벨러로 오링크 방지', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
