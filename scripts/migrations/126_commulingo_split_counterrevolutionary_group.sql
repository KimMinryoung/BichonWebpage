-- Split 「비소련 반혁명 진영」 into the counter-revolution proper and the
-- statesmen the USSR negotiated with.
--
-- The group held thirteen people, and ten of them were Cold War statesmen:
-- Roosevelt, Truman, Marshall, Kennan, Kennedy, Reagan, Shultz, Churchill,
-- Clayton, Paasikivi. Its own blurb says the group is for 「혁명과 사회주의
-- 진영에 맞섰던 지배자와 군인들」 who tore something down, which describes
-- Franco and Mannerheim and does not describe the man who wrote the Marshall
-- Plan or the architect of Finnish-Soviet coexistence.
--
-- The site's editorial line forbids a polemical anti-Soviet frame. A blanket
-- 「반혁명」 label on every Western politician is the same error pointed the
-- other way, and it was about to be read by anyone arriving from the Yalta
-- declaration published on 2026-08-09, whose people are mostly in this group.
--
-- Nothing in code references either group id: membership is data, and the
-- roster page builds itself from these rows.

INSERT INTO commulingo_people_groups (id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en)
VALUES (
    'foreign-statesmen',
    100,
    '1870–2021',
    '소련을 상대한 정치가들',
    'Statesmen across the table',
    '소련과 협상하고 대치한 각국의 정치가와 외교관들. 혁명 진영에 속하지도, 그것을 무너뜨리려 군대를 이끌지도 않았다. 소련의 역사는 전선에서만이 아니라 이들과 마주 앉은 자리에서도 쓰였다.',
    'The politicians and diplomats who negotiated with the Soviet Union and stood against it. They belonged to no revolutionary camp and led no army against one. Soviet history was written at the table with them as well as at the front.'
)
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    range_label = EXCLUDED.range_label,
    title_ko = EXCLUDED.title_ko,
    title_en = EXCLUDED.title_en,
    blurb_ko = EXCLUDED.blurb_ko,
    blurb_en = EXCLUDED.blurb_en,
    updated_at = NOW();

UPDATE commulingo_people
   SET group_id = 'foreign-statesmen', updated_at = NOW()
 WHERE group_id = 'international-counterrevolutionary'
   AND id IN (
       'franklin-d-roosevelt', 'harry-s-truman', 'george-c-marshall',
       'george-f-kennan', 'john-f-kennedy', 'ronald-reagan', 'george-shultz',
       'winston-churchill', 'william-l-clayton', 'juho-kusti-paasikivi'
   );

-- What stays is the counter-revolution as the blurb already defines it: men who
-- took up arms against a revolution at home. The range now reflects the three
-- who remain (Mannerheim 1867, Franco d. 1975), and the group sorts after the
-- statesmen.
UPDATE commulingo_people_groups
   SET range_label = '1867–1975', sort_order = 101, updated_at = NOW()
 WHERE id = 'international-counterrevolutionary';
