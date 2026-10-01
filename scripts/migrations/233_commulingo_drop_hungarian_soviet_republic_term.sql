-- 2026-10-01: the glossary entry hungarian-soviet-republic (created the same day
-- by the hungary-interwar-20261001 batch) only repeated the event
-- hungarian-soviet-republic-1919. As in 134, the narrative stays with the event;
-- its title links the name. Live for about an hour, so no redirect.
BEGIN;
DELETE FROM commulingo_terms WHERE id = 'hungarian-soviet-republic';
COMMIT;
