-- 191: Himmler is 힘러 in Korean, not 히믈러.
--
-- The foreign-word orthography writes German double consonants once
-- (Himmler → 힘러), and Korean references use 하인리히 힘러. The card had been
-- created as 히믈러 while other cards' prose already said 힘러, so a reader
-- searching 힘러 found nothing. The card, its sections and Guderian's section
-- were rewritten through the people upsert (히믈러 kept as a search alias);
-- this sweeps the event prose and the resolved curation-gap label.

BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '히믈러', '힘러')
 WHERE id = 'warsaw-uprising' AND body_ko LIKE '%히믈러%';
UPDATE commulingo_curation_gaps
   SET label_ko = replace(label_ko, '히믈러', '힘러')
 WHERE label_ko LIKE '%히믈러%';
COMMIT;
