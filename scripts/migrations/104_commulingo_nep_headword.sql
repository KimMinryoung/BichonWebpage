-- The glossary filed the policy under 네프 while the history dictionary filed
-- the same policy under 신경제정책(네프). One headword now, matching the event
-- in both languages, which is also what makes the two entries pair: the tabs
-- are decided by the headwords being the same string, so aligning the name is
-- the whole act.
--
-- 네프 and NEP stay as aliases — they are what prose actually says, and the
-- aliases are what drives site-wide auto-linking, so nothing stops linking.

UPDATE commulingo_terms
   SET term_ko = '신경제정책(네프)',
       term_en = 'New Economic Policy (NEP)',
       updated_at = NOW()
 WHERE id = 'nep';

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('nep', 'ko', '신경제정책(네프)', 0),
    ('nep', 'en', 'New Economic Policy (NEP)', 0)
ON CONFLICT (term_id, lang, alias) DO NOTHING;
