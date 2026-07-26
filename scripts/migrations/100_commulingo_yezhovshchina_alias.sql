-- '예조프시나' as a search/alias string moves to 대숙청.
--
-- The 예조프시나 entry stays: it is not a duplicate of the campaign entry but a
-- historiographical one, on why the post-Stalin USSR named two years of state
-- policy after one police chief. What moves is the word as a pointer — a reader
-- meeting 예조프시나 in prose wants the campaign, which is 대숙청.
--
-- The alias rows were redundant where they sat (the entry's own headword is
-- 예조프시나 / Yezhovshchina), so this is a move, not a loss. The auto-link
-- index registers headwords too and first registration wins, so the data move
-- alone would not redirect anything; term-linkify's LINK_OVERRIDES completes it.

DELETE FROM commulingo_term_aliases
 WHERE term_id = 'yezhovshchina'
   AND alias IN ('예조프시나', 'Yezhovshchina');

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('great-purge', 'ko', '예조프시나', 10),
    ('great-purge', 'en', 'Yezhovshchina', 10)
ON CONFLICT (term_id, lang, alias) DO NOTHING;
