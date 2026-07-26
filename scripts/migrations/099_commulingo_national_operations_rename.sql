-- '민족 작전' reads in Korean as either 'the nation's operation' or 'a
-- nationwide operation', neither of which is what Национальные операции НКВД
-- were: a series of operations whose targeting criterion was nationality —
-- the Polish operation under order 00485, the German operation, the Korean
-- deportation. '민족별 작전' states that criterion in the headword. The
-- Russian form is untouched in the `original` column, and '민족 작전' is
-- already registered as an alias, so prose using the old name still links.

UPDATE commulingo_terms
   SET term_ko = '민족별 작전',
       updated_at = NOW()
 WHERE id = 'national-operations-nkvd';

-- The new headword joins the alias list; site-wide auto-linking reads aliases,
-- not the headword alone.
INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order)
VALUES ('national-operations-nkvd', 'ko', '민족별 작전', 0)
ON CONFLICT (term_id, lang, alias) DO NOTHING;
