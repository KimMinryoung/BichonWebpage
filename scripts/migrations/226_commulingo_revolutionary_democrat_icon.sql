-- 226: 혁명적 민주주의자 takes the bell of Herzen's Kolokol. The newspaper
-- glyph given in 224 is the same drawing as the scholarship function's library.
BEGIN;
SET LOCAL lock_timeout = '5s';
UPDATE commulingo_person_collections SET icon = 'bell', updated_at = now() WHERE id = 'revolutionary-democrat';
COMMIT;
