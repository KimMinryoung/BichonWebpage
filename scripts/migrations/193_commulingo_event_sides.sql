-- 193: named sides (camps) for history events without a single focus.
--
-- Migration 192 gave an event one focus so that "opponent" had a reference
-- point. Wars between two states, splits between two parties or a revolution
-- whose government also crushed its own left have no single focus, and on those
-- pages both sides' commanders landed in the same "executor" group. Such an
-- event now names its sides instead, and each linked person may carry one:
--   commulingo_history_events.sides      [{ "id": "china", "label": {"ko": "...", "en": "..."} }, ...]
--   commulingo_history_event_people.side  a sides[].id, or NULL (witnesses,
--                                         historians, people on no side)
-- The relation kind stays the common vocabulary (leader, executor, ...); the
-- page groups people by side, then by kind. An event has a focus or sides, never
-- both, and with sides the opposing camp is a side, so "opponent" is not used.
-- Events whose subject is clear (the Great Terror) keep focus + opponent.
-- Operator decision 2026-09-29.
--
-- Also turns the JSON null that the event batch script wrote into four rows'
-- focus on 2026-09-29 into SQL NULL, the value every reader tests for.

BEGIN;
ALTER TABLE commulingo_history_events ADD COLUMN IF NOT EXISTS sides jsonb;
ALTER TABLE commulingo_history_event_people ADD COLUMN IF NOT EXISTS side text;

UPDATE commulingo_history_events SET focus = NULL WHERE jsonb_typeof(focus) = 'null';
UPDATE commulingo_history_events SET sides = NULL WHERE jsonb_typeof(sides) = 'null';

ALTER TABLE commulingo_history_events DROP CONSTRAINT IF EXISTS commulingo_history_events_sides_shape;
ALTER TABLE commulingo_history_events ADD CONSTRAINT commulingo_history_events_sides_shape
    CHECK (sides IS NULL OR (jsonb_typeof(sides) = 'array' AND jsonb_array_length(sides) >= 2));
ALTER TABLE commulingo_history_events DROP CONSTRAINT IF EXISTS commulingo_history_events_focus_or_sides;
ALTER TABLE commulingo_history_events ADD CONSTRAINT commulingo_history_events_focus_or_sides
    CHECK (focus IS NULL OR sides IS NULL);
ALTER TABLE commulingo_history_event_people DROP CONSTRAINT IF EXISTS commulingo_history_event_people_side_id;
ALTER TABLE commulingo_history_event_people ADD CONSTRAINT commulingo_history_event_people_side_id
    CHECK (side IS NULL OR side ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

COMMENT ON COLUMN commulingo_history_events.sides IS
    'Named camps ([{id,label:{ko,en}}], 2+) for events with no single focus; people are grouped by side. Exclusive with focus.';
COMMENT ON COLUMN commulingo_history_event_people.side IS
    'The camp (commulingo_history_events.sides[].id) this person acted for; NULL for witnesses, historians and people on no side.';
COMMIT;
