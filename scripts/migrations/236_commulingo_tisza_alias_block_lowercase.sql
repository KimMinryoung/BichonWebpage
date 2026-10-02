-- 2026-10-02: 235 stored the English never-link alias as 'Tisza', but the person
-- index compares English aliases lowercased (people-linkify.js), so it never
-- matched and the bare surname still linked "the Tisza offensive" to István
-- Tisza. English alias rows are lowercase, like 'luxemburg' and 'tolstoy'.
BEGIN;
UPDATE commulingo_link_blocklist SET phrase = 'tisza'
 WHERE lang = 'en' AND kind = 'alias' AND phrase = 'Tisza';
COMMIT;
