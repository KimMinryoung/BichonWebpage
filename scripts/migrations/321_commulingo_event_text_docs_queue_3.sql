-- 2026-10-07 owner decision (event cards follow the published translations), CE2 set.
-- albanian-socialist-transition-1944-1946: the 1946 constitution (doc albania-constitution-1946)
--   numbers these provisions 5, 6, 9 and 10 (7, 8, 11, 12 are the 1950 revision), lists only
--   air transport among common property and has no domestic-trade clause; Koçi Xoxe = 코치 조제;
--   Nako Spiru died in 1947 (the English text already says so).
-- hungarian-revolution: the 14 November 1956 resolution (doc budapest-central-workers-council-
--   resolution-1956) has no right-to-strike demand; quote follows the translation.
-- prague-spring: Čierna nad Tisou = 치에르나나트티수 (doc lessons-crisis-development-1970).
BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(replace(replace(replace(replace(body_ko,
         '기업활동을 보장했지만(제11조)', '기업활동을 보장했지만(제9조)'),
         '산림과 목초지, 항공·철도·해상 운송, 우편·전신·전화·무선국과 은행을 ''인민의 공동재산''으로 규정했다(제7조). 대외무역은 국가 통제 아래 두고 국내 상업 전반에 대해서도 국가가 규제·감독권을 행사하도록 했다. 제8조는',
         '산림과 목초지, 항공 교통수단, 우편·전신·전화·무선국과 은행을 ''인민의 공동재산''으로 규정하고 대외무역을 국가 통제 아래 두었다(제5조). 제6조는'),
         '못박았고, 제12조는', '못박았고, 제10조는'),
         '1948년 스피루의 죽음', '1947년 스피루의 죽음'),
         '코치 쇼제의 처형', '코치 조제의 처형'),
         '1947~1948년의 숙청과 1947년 스피루의 죽음, 코치 조제의 처형', '1947~1948년의 숙청과 1947년 스피루의 죽음, 1949년 코치 조제의 처형'),
         '코치 쇼제', '코치 조제'),
       body_en = replace(replace(replace(replace(body_en,
         'private economic initiative (Article 11)', 'private economic initiative (Article 9)'),
         'pastures, air, rail and sea transport, postal, telegraph, telephone and radio services, and the banks as ''the common property of the people'' (Article 7). Foreign trade was placed under state control, and the state was to regulate and supervise the whole of domestic trade. Article 8',
         'pastures, air transport, postal, telegraph, telephone and radio services, and the banks as ''the common property of the people'' and placed foreign trade under state control (Article 5). Article 6'),
         'private sector; Article 12 declared', 'private sector; Article 10 declared'),
         'and exercises general control over the private sector; Article 12', 'and exercises general control over the private sector; Article 10'),
       updated_at = now()
 WHERE id = 'albanian-socialist-transition-1944-1946' AND strpos(body_ko, '(제11조)') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '"우리는 사회주의 원칙에 대한 흔들리지 않는 충성을 선언한다"면서도 소련군 철수와 너지 임레의 복권, 파업권 보장을 요구했다.',
         '"우리는 엄격히 사회주의의 원칙 위에 서 있다"고 선언하면서도 너지 임레의 정부 복귀와 소련군 철수, 일당제 폐지와 자유선거를 요구했다.'),
       body_en = replace(body_en,
         '"We declare our unshaken loyalty to the principles of socialism," they proclaimed, while demanding the withdrawal of Soviet troops, the restoration of Imre Nagy, and the guarantee of the right to strike.',
         '"We stand strictly on the principles of socialism," they declared, while demanding Imre Nagy''s return as head of government, the withdrawal of Soviet troops, an end to one-party rule and free elections.'),
       updated_at = now()
 WHERE id = 'hungarian-revolution' AND strpos(body_ko, '흔들리지 않는 충성') > 0;

UPDATE commulingo_history_events SET body_ko = replace(body_ko, '7월 체르나 협상', '7월 치에르나나트티수 협상'), updated_at = now()
 WHERE id = 'prague-spring' AND strpos(body_ko, '체르나 협상') > 0;
COMMIT;
