-- 2026-10-07 owner decision: event cards follow the published translations of
-- the docs queue (dev_docs/commulingo-queue-docs-20261007/PLAN.md).
-- new-thinking-diplomacy: the 23 January 1989 memo was signed by six (doc 691).
-- economic-reform-debate: the 14 December 1990 letter recalls the earlier report;
--   quote follows the translation ("몰수형").
-- french-resistance: the 28 September 1941 decree set the range of hostages and the
--   selection/execution procedure, not the 50–100 ratio; Alfons Moser (doc 1599).
-- congo-peoples-republic-1969-1991: preamble quoted in full, one name for the
--   Conseil supérieur de la République, document named by its alias (doc 1825).
-- beninese-socialist-transition-1974-1990: original title is Loi n° 90-32 (doc 1838).
BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '셰바르드나제, 체브리코프, 야조프 등이 공동 제출한 메모', '셰바르드나제, 체브리코프, 야코블레프, 야조프, 무라홉스키, 크류치코프가 공동 제출한 메모'), updated_at = now()
 WHERE id = 'new-thinking-diplomacy' AND strpos(body_ko, '셰바르드나제, 체브리코프, 야조프 등이 공동 제출한 메모') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '서한에서 "사회정치적 상황, 소비재 시장의 극도로 긴장된 상태, 개혁 이후 루블 구매력을 지탱할 상품·외환 준비금의 부재를 고려할 때 현재 압수형 화폐 개혁은 부적절하다"고 명시했던 것이다.',
         '서한에서 두 기관이 앞서 "사회의 사회정치적 상황, 소비재 시장의 극도로 긴장된 상태, 그리고 개혁을 실시할 경우 개혁 뒤 루블의 구매력을 지탱할 상품·외환 준비금이 없다는 점을 고려할 때, 지금 몰수형 화폐개혁을 실시하는 것은 부적절하다"고 보고했고 각료회의가 1990년 8월 11일 이에 동의했음을 다시 확인했던 것이다.'),
       updated_at = now()
 WHERE id = 'economic-reform-debate' AND strpos(body_ko, '현재 압수형 화폐 개혁은 부적절하다"고 명시했던 것이다.') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '독일 해군 장교 모제르를 사살했다', '독일 해군 군인 알폰스 모저를 사살했다'),
         '오토 폰 슈튈프나겔은 9월 28일 이를 프랑스의 ‘인질 규정’으로 구체화했다', '오토 폰 슈튈프나겔은 9월 28일 훈령으로 인질로 삼을 사람의 범위와 명단 작성, 처형 건의와 결정 절차를 정한 프랑스의 ‘인질 규정’을 내렸다'),
       body_en = replace(replace(body_en,
         'shot the German naval officer Moser at', 'shot the German navy serviceman Alfons Moser at'),
         'and Otto von Stülpnagel specified the practice in his French hostage code of 28 September.', 'and on 28 September Otto von Stülpnagel issued his French hostage code, a decree setting out who could be taken hostage, how hostage lists were kept, and how executions were proposed and decided.'),
       updated_at = now()
 WHERE id = 'french-resistance' AND strpos(body_ko, '모제르') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(body_ko,
         '6월 4일 회의는 기본법(Acte fondamental)을 채택했다. 그 전문은 일당제를 "전체주의, 권력의 혼재, 족벌주의, 부족주의, 기본권 침해"로 단죄했고, 국호에서 인민( populaire)을',
         '6월 4일 회의는 과도기 공권력 조직에 관한 기본법(Acte fondamental)을 채택했다. 그 전문은 일당제를 "전체주의, 권력의 혼재, 족벌주의, 부족주의, 지역주의, 사회적 불평등, 기본적 자유의 침해"로 단죄했고, 국호에서 인민(populaire)을'),
         '최고공화국평의회', '공화국 최고평의회'),
         '공화국 최고평의회(CSR)', '공화국 최고평의회(CSR)'),
       body_en = replace(body_en,
         'On 4 June the conference adopted a Fundamental Act (Acte fondamental). Its preamble indicted one-party rule for "totalitarianism, confusion of powers, nepotism, tribalism, and violations of fundamental rights,"',
         'On 4 June the conference adopted the Fundamental Act of 4 June 1991 (Acte fondamental). Its preamble indicted one-party rule for "totalitarianism, confusion of powers, nepotism, tribalism, regionalism, social inequalities, and violations of fundamental freedoms,"'),
       updated_at = now()
 WHERE id = 'congo-peoples-republic-1969-1991' AND strpos(body_ko, '인민( populaire)') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '12월 11일 헌법법률 제90-32호로 공포됐다', '12월 11일 법률 제90-32호로 공포됐다'),
       body_en = replace(body_en, 'promulgated as Constitutional Act No. 90-32 on', 'promulgated as Law No. 90-32 on'),
       updated_at = now()
 WHERE id = 'beninese-socialist-transition-1974-1990' AND strpos(body_ko, '헌법법률 제90-32호') > 0;
COMMIT;
