-- 225: the Jacobin collection takes the Phrygian cap (bonnet rouge), the
-- symbol the radicals actually wore, instead of the generic scale.
BEGIN;
SET LOCAL lock_timeout = '5s';
UPDATE commulingo_person_collections SET icon = 'phrygian-cap', updated_at = now() WHERE id = 'jacobin';
COMMIT;
