-- 작명 정책: 특정 상황을 다루는 항목의 표제어는 구체적으로, 일반형은 별칭으로.
--
-- 154가 고친 오연결의 뿌리는 이름이다 — 특정 사건·제도 항목이 흔한 낱말을
-- 표제어로 쓰면, 그 낱말을 평범한 뜻으로 쓰는 모든 페이지가 그 항목으로
-- 걸린다. 이미 잘 지어진 표제어(러시아 임시정부, 아프가니스탄 인민민주당,
-- 인민전선 (페레스트로이카))를 따라, 맨 일반어 표제어 일곱을 구체화한다.
-- id는 그대로라 링크·리다이렉트 영향이 없고, 링크 동작도 그대로다: 산문의
-- 맨 일반형은 별칭 층에서 판단한다(정당하면 별칭으로 링크 유지, 아니면
-- term-alias/term-headword 행으로 차단 — 154의 기존 행들이 계속 유효하다).

UPDATE commulingo_terms SET term_ko = '한국전쟁 정전협정'
 WHERE id = 'korean-armistice-agreement' AND term_ko = '정전협정';
UPDATE commulingo_terms SET term_ko = '행동강령 (1968)', term_en = 'Action Programme (1968)'
 WHERE id = 'action-programme-1968';
UPDATE commulingo_terms SET term_ko = '후사크 정상화', term_en = 'Husák Normalization'
 WHERE id = 'normalization-czechoslovakia';
UPDATE commulingo_terms SET term_ko = '페레코프카'
 WHERE id = 'perekovka' AND term_ko = '개조';
UPDATE commulingo_terms SET term_ko = '통화 매파', term_en = 'Monetary Hawk'
 WHERE id = 'monetary-hawk';
UPDATE commulingo_terms SET term_ko = '소개 (1941년 산업 소개)'
 WHERE id = 'soviet-evacuation-1941' AND term_ko = '소개';
UPDATE commulingo_terms SET term_ko = '전세 (주택 임대)'
 WHERE id = 'jeonse' AND term_ko = '전세';

-- 맨 정전협정은 발화 26건이 거의 다 한국전쟁 문맥이라 링크를 유지한다 —
-- 표제어에서 내려온 자리를 별칭이 이어받는다. (콩피에뉴 1940 한 건은 인물
-- 서술 문제로 남겨 둔다.) 행동강령·Action Programme·후사크 정상화·통화
-- 매파는 이미 별칭에 있다.
INSERT INTO commulingo_term_aliases (term_id, lang, alias) VALUES
    ('korean-armistice-agreement', 'ko', '정전협정')
ON CONFLICT DO NOTHING;
