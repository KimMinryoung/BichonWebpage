-- 2026-10-03: event links for three people registered in commit dbd20a6 whose
-- events are not part of that batch. apply-history-events.js refuses these
-- events because their stored relations gained a parent after the original
-- batch JSON (german-revolution-20260929, second-international-collapse-20260929),
-- and hungarian-revolution has no batch spec, so only the link rows are added.
-- Sides follow the existing rows: Ebert on spd-government, Guesde a
-- participant on social-patriots; hungarian-revolution has no sides and links
-- Kádár as opponent.
BEGIN;
INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en, side) VALUES
    ('german-revolution-1918-1919', 'carl-legien', 30, 'participant', '자유노조 총위원회 위원장', 'Chairman of the General Commission of the German Trade Unions',
     '1918년 11월 15일 후고 슈티네스와 노조를 교섭 상대로 인정하고 8시간 노동제와 사업장 노동자위원회를 두는 협정을 맺었다.',
     'Signed the agreement with Hugo Stinnes on 15 November 1918 recognising the unions as bargaining partners, with the eight-hour day and works councils.',
     'spd-government'),
    ('second-international-collapse-1914', 'marcel-sembat', 37, 'participant', '프랑스 공공사업부 장관', 'French Minister of Public Works',
     '1914년 8월 쥘 게드와 함께 신성 연합 정부에 입각했다.',
     'Entered the Union sacrée government with Jules Guesde in August 1914.',
     'social-patriots'),
    ('hungarian-revolution', 'ferenc-munnich', 39, 'opponent', '카다르 정부 군·공안 장관', 'Minister of the armed forces and public security under Kádár',
     '너지 정부의 내무장관이었다가 11월 카다르와 함께 모스크바에서 소련 무력 개입을 지지했고, 11월 4일부터 카다르 정부에서 무장 경찰과 노동자 민병대 조직에 참여했다.',
     'Interior minister under Nagy, he backed Soviet armed intervention in Moscow with Kádár in November and from 4 November helped organise the security regiments and the Workers’ Militia in Kádár’s government.',
     NULL)
ON CONFLICT DO NOTHING;
COMMIT;
