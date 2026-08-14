-- Name the league chiefs in the body of the 6 February 1934 entry, now that
-- they have cards (142). The linkifier only reaches a person whose name is on
-- the page, and a reader met 'the Jeunesses Patriotes' with no way to ask who
-- ran it or who paid for it.
--
-- Also three details from a cross-check of the accounts: the veterans' UNC was
-- on the square with the leagues; the prosecutor who let the Stavisky case sit
-- was the prime minister's brother-in-law; and the dead are counted fifteen or
-- seventeen depending on whether those who died later of their wounds are
-- included. The entry now says both figures rather than picking one silently.

BEGIN;

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko,
    '왕당파 악시옹 프랑세즈, 청년애국단, 연대 프랑스, 그리고 참전군인 조직에서 자라난 불의 십자단은',
    '왕당파 악시옹 프랑세즈, 피에르 테탱제가 세운 청년애국단, 향수 재벌 프랑수아 코티가 만들어 자금을 댄 연대 프랑스, 그리고 참전군인 조직에서 자라난 불의 십자단은'),
  body_en = replace(body_en,
    'Action Française, the Jeunesses Patriotes, Solidarité Française and the Croix-de-Feu, the last grown out of a veterans'' association,',
    'Action Française, the Jeunesses Patriotes founded by Pierre Taittinger, Solidarité Française created and funded by the perfume magnate François Coty, and the Croix-de-Feu grown out of a veterans'' association,'),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko,
    '그 뒤에는 급진당 정치인들과 사법부의 인맥이 있었다.',
    '그 뒤에는 급진당 정치인들과 사법부의 인맥이 있었다. 사건을 쥐고 있던 파리 검사장은 쇼탕 총리의 처남이었다.'),
  body_en = replace(body_en,
    'protected by connections among Radical politicians and in the judiciary.',
    'protected by connections among Radical politicians and in the judiciary: the public prosecutor in Paris who sat on the case was the prime minister''s brother-in-law.'),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko,
    '2월 6일 저녁, 달라디에가 하원에서 신임을 묻는 동안 여러 동맹과 참전군인 단체가 각기 다른 길로 콩코르드 광장에 모였다.',
    '2월 6일 저녁, 달라디에가 하원에서 신임을 묻는 동안 여러 동맹과 90만 회원을 둔 참전군인 조직 전국연합(UNC)이 각기 다른 길로 콩코르드 광장에 모였다.'),
  body_en = replace(body_en,
    'the leagues and the veterans'' associations converged by different routes on the Place de la Concorde',
    'the leagues and the 900,000-strong veterans'' Union Nationale des Combattants converged by different routes on the Place de la Concorde'),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko,
    '밤이 끝났을 때 15명이 죽고 1,500명 넘게 다쳤다. 사망자는 대부분 시위대였고 경찰 쪽에서도 수백 명이 다쳤다.',
    '밤이 끝났을 때 열다섯 명이 죽었다. 부상 뒤에 숨진 사람까지 세는 집계는 열일곱 명으로 적는다. 부상자는 1,500명이 넘었고 대부분이 시위대였으며 경찰 쪽에서도 수백 명이 다쳤다.'),
  body_en = replace(body_en,
    'By the end of the night fifteen were dead and more than 1,500 injured. Most of the dead were demonstrators, and several hundred police were injured too.',
    'By the end of the night fifteen were dead, seventeen by the counts that include those who died later of their wounds. More than 1,500 were injured, most of them demonstrators, and several hundred police were hurt as well.'),
  updated_at = now()
WHERE id = 'february-1934-crisis';

COMMIT;
