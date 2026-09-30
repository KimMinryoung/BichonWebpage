-- 217: Drop the legacy person role tables.
--
-- Every person carries a primary activity (migrations 184, 215, 216 and the
-- reviewed activity specs of 2026-09-22..30). The frontend (8c4a397) and the
-- leninbot pipeline no longer read or write these tables. Position categories
-- live on as commulingo_person_collections (213); function categories redirect
-- to activity filters and regional ones are pointer pages
-- (data/commulingo/retired-role-pages.js). A pg_dump of both tables taken
-- before this ran is kept in the gitignored scripts/migrations/data/person-roles-20260930/.

BEGIN;
SET LOCAL lock_timeout = '5s';
DROP TABLE commulingo_person_roles;
DROP TABLE commulingo_role_categories;
COMMIT;
