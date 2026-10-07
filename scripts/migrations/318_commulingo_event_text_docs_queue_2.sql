-- 2026-10-07 owner decision (event cards follow the published translations), second set:
-- anti-alcohol-campaign (doc politburo-1985-04-04-anti-alcohol), second-front-normandy
-- (churchill-roosevelt-1942-07-08-sledgehammer), angolan-independence-1975-1977
-- (mpla-politburo-statement-27-may-1977), greek-resistance (italian-ultimatum-to-greece-1940),
-- cuban-revolution-1959-1961 (castro-1961-04-16-socialist-declaration).
BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(replace(body_ko,
         '재무차관 빅토르 데멘체프는', '재무부 제1차관 빅토르 데멘체프는'),
         '"보드카 생산의 대폭 감축은 밀주 생산 증가, 공업용 알코올 절도, 추가적인 설탕 소비를 초래할 것입니다."',
         '"보드카와 포도주·보드카류의 생산을 크게 줄이면 밀주 제조가 늘고 공업용 알코올을 빼돌리는 일이 생길 수 있으며, 그러면 설탕 소비가 추가로 늘어날 것입니다."'),
         '보로닌도 "인구가 보유한 현금을 흡수할 상품이 말 그대로 아무것도 없게 될 것"이라고 우려했다.',
         '보로닌도 "주민 손에 있는 돈과 바꿔 줄 물건이 말 그대로 하나도 없게 된다"고 우려했다.'),
         '이어 "우리는 더 이상 이 취한 예산을 용납할 수 없다"고 못 박았다.  에두아르트 셰바르드나제는',
         '토론이 이어진 끝에 그는 "알코올 중독 퇴치 문제의 핵심은 보드카 생산 감축입니다. 우리의 취한 예산을 더는 참을 수 없습니다"라고 못 박았다.  솔로멘체프가 회의에 소개한 사전 서면 제안에서 에두아르트 셰바르드나제는'),
       updated_at = now()
 WHERE id = 'anti-alcohol-campaign' AND strpos(body_ko, '재무차관 빅토르 데멘체프') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '장성·제독·공군참모가', '장군·제독·공군 원수 가운데 누구도'),
         '추천하지 않는다고 썼다. 그는 북아프리카 침공 짐내스트가 그해 소련을 구할 “진정한 제2전선”이라고',
         '권고하지 않는다고 썼다. 그는 북아프리카 침공 짐내스트가 1942년에 러시아 전선의 짐을 덜어 줄 “진정한 제2전선”이라고'),
       updated_at = now()
 WHERE id = 'second-front-normandy' AND strpos(body_ko, '공군참모가') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(body_ko,
         '"사보퉁이, 기생충, 기회주의자들을 끝장내기 위해 민주혁명독재를 적용할 것"', '"사보타주꾼, 기생충, 투기꾼을 영원히 끝장내기 위해 혁명적 민주독재를 적용하자"'),
         '8여단의 무장 행동', '제9여단의 무장 행동'),
         '「나를 위한 13개 논제」', '「나를 변호하는 13개 테제」'),
       body_en = replace(replace(body_en,
         'and with opportunists."', 'and with speculators."'),
         'the 8th Brigade', 'the 9th Brigade'),
       updated_at = now()
 WHERE id = 'angolan-independence-1975-1977' AND strpos(body_ko, '사보퉁이') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '이탈리아 대사 에마누엘레 그라치는 알바니아에서 병력을 들여보내고 전략 요충지와 통신시설 점령을 요구하는 최후통첩을',
         '이탈리아 공사 에마누엘레 그라치는 전쟁 기간 동안 그리스 영토의 몇몇 전략 지점을 이탈리아군이 점령하도록 허용하라고 요구하는 최후통첩을'),
       body_en = replace(replace(body_en,
         'Emanuele Grazzi, the Italian ambassador', 'Emanuele Grazzi, the Italian minister in Athens'),
         'demanding the occupation of strategic positions and communications sites as Italian forces moved from Albania',
         'demanding that Italian troops be allowed to occupy certain strategic points in Greek territory for the duration of the war'),
       updated_at = now()
 WHERE id = 'greek-resistance' AND strpos(body_ko, '이탈리아 대사 에마누엘레 그라치') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '''우리는 미국의 바로 코앞에서 사회주의 혁명을 이루어냈다''', '''우리가 바로 미국의 코앞에서 사회주의 혁명을 이루었다'''), updated_at = now()
 WHERE id = 'cuban-revolution-1959-1961' AND strpos(body_ko, '미국의 바로 코앞에서') > 0;
COMMIT;
