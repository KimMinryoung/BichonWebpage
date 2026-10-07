-- 2026-10-07 owner decision (event cards follow the published translations):
-- vietnam-reunification-1975-1976: the Fourth Congress resolution (doc
--   cpv-fourth-congress-resolution-1976) gives the 1980 targets in physical quantities and has no
--   growth percentages; it keeps "priority to heavy industry on the basis of agriculture and light
--   industry" in the general line while concentrating the plan on agriculture and light industry.
-- malagasy-socialist-transition-1972-1975: FNDR = 혁명수호민족전선 (doc madagascar-constitution-1975).
BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '대회의 경제적 핵심은 공업 연평균 16~18%, 농업 8~10%, 국민소득 13~14% 성장을 내건 제2차 5개년계획(1976~80)이었다. 이 목표치는',
         '대회의 경제적 핵심은 제2차 5개년계획(1976~80)이었다. 흔히 공업 연평균 16~18%, 농업 8~10%, 국민소득 13~14% 성장 목표로 요약되지만, 대회 결의 자체는 1980년 목표를 식량 2,100만 톤, 바다 어획 100만 톤 같은 물량으로 제시했다. 이 목표치는'),
         '대회는 제3차 대회가 내세웠던 중공업 우선을 뒤로 젖히고 경공업·농업·임업·어업으로 무게를 옮겼다.',
         '대회는 총노선에서 「농업과 경공업의 발전을 바탕으로 중공업을 합리적으로 우선 발전」시킨다는 원칙을 유지하면서, 5개년계획의 당면 배치에서는 농업·경공업·임업·어업에 힘을 모았다.'),
       body_en = replace(replace(body_en,
         'The economic core of the congress was the Second Five-Year Plan (1976–80), with targets of 16 to 18 percent annual growth in industry, 8 to 10 percent in agriculture, and 13 to 14 percent in national income: figures expressing',
         'The economic core of the congress was the Second Five-Year Plan (1976–80). It is usually summarized as targets of 16 to 18 percent annual growth in industry, 8 to 10 percent in agriculture, and 13 to 14 percent in national income, but the congress resolution itself set the 1980 targets in physical quantities, such as 21 million tonnes of food and one million tonnes of sea catch: figures expressing'),
         'The congress shifted emphasis away from the heavy industry prioritized since the Third Congress, toward light industry, agriculture, forestry and fishing.',
         'In its general line the congress kept "rational priority to heavy industry on the basis of developing agriculture and light industry", while concentrating the plan''s immediate effort on agriculture, light industry, forestry and fishing.'),
       updated_at = now()
 WHERE id = 'vietnam-reunification-1975-1976' AND strpos(body_ko, '중공업 우선을 뒤로 젖히고') > 0;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '혁명방위국민전선', '혁명수호민족전선'), updated_at = now()
 WHERE id = 'malagasy-socialist-transition-1972-1975' AND strpos(body_ko, '혁명방위국민전선') > 0;
COMMIT;
