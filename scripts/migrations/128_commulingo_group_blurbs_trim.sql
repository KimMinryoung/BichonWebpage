-- Cut both non-Soviet group blurbs to their first sentence.
--
-- The blurb sits under a group heading on the roster page, where it is a label
-- for what the shelf holds. The second and third sentences were commentary on
-- how to read the group, which is a different job and belongs in the entries
-- themselves. Owner decision, 2026-08-09.

UPDATE commulingo_people_groups
   SET blurb_ko = '소련과 협상하고 대치한 각국의 정치가와 외교관들.',
       blurb_en = 'The politicians and diplomats who negotiated with the Soviet Union and stood against it.',
       updated_at = NOW()
 WHERE id = 'foreign-statesmen';

UPDATE commulingo_people_groups
   SET blurb_ko = '소련 밖에서 혁명과 사회주의 진영에 맞섰던 지배자와 군인들.',
       blurb_en = 'Rulers and soldiers outside the Soviet world who fought the revolution and the socialist camp.',
       updated_at = NOW()
 WHERE id = 'international-counterrevolutionary';
