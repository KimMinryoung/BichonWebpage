-- The zapovedniki entry names the botanist who proposed a systematic reserve
-- network as '식물학자 보로딘(I.P. Borodin)' / 'botanist I.P. Borodin'. That is
-- Ivan Parfenyevich Borodin (1847–1930), who is not in the dictionary — the
-- 보로딘 entry is Mikhail Borodin, the Comintern agent in China — so the bare
-- surname linked the wrong man.
--
-- Giving him his given name fixes the reader's problem (the sentence now says
-- which Borodin) and lets the linker fix the machine's: the full name goes in
-- BLOCKED_KO/EN, which keeps 보로딘 linking to Mikhail everywhere else.
-- Idempotent: the WHERE clause matches only the un-fixed text.

INSERT INTO commulingo_people_revisions (entity_type, entity_id, revision_note, snapshot, changed_by)
SELECT 'term', 'zapovedniki', 'name I.P. Borodin in full so the surname stops linking to Mikhail Borodin',
       jsonb_build_object(
           'before', jsonb_build_object('body_ko', body_ko, 'body_en', body_en),
           'after', jsonb_build_object(
               'body_ko', replace(body_ko, '식물학자 보로딘(I.P. Borodin)', '식물학자 이반 보로딘(I.P. Borodin)'),
               'body_en', replace(body_en, 'botanist I.P. Borodin', 'botanist Ivan Borodin (I.P. Borodin)')
           )
       ),
       'claude-code'
  FROM commulingo_terms
 WHERE id = 'zapovedniki' AND body_ko LIKE '%식물학자 보로딘(I.P. Borodin)%';

UPDATE commulingo_terms
   SET body_ko = replace(body_ko, '식물학자 보로딘(I.P. Borodin)', '식물학자 이반 보로딘(I.P. Borodin)'),
       body_en = replace(body_en, 'botanist I.P. Borodin', 'botanist Ivan Borodin (I.P. Borodin)'),
       updated_at = NOW()
 WHERE id = 'zapovedniki' AND body_ko LIKE '%식물학자 보로딘(I.P. Borodin)%';
