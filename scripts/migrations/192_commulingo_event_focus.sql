-- 192: the side or process each history event centres on, for relation kinds.
--
-- A person linked to an event is an opponent when they stood on the side
-- against this focus (camp-based, whatever their role): the Whites against the
-- Bolshevik regime in the civil war, the coalition against revolutionary France.
-- NULL means the event has no single focus (a two-sided clash, or a title that
-- joins two processes); people there are leader/executor/participant within
-- their own side and never opponent. Operator decision 2026-09-29, after a Jev
-- reclassification could not place 153 opponent candidates without it
-- (Kamenev judged an opponent of the post-Lenin power struggle he led).
-- Shape: {"ko": "...", "en": "..."}. Read by the leninbot linking pipeline;
-- not rendered on the page.

BEGIN;
ALTER TABLE commulingo_history_events ADD COLUMN IF NOT EXISTS focus jsonb;
COMMENT ON COLUMN commulingo_history_events.focus IS
    'Side or process the event centres on ({ko,en}); opponents stood against it. NULL: no single focus, no opponents.';
COMMIT;
