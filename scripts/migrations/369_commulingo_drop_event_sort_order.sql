-- 369: history events are ordered by their period, not by a hand-kept number.
-- sort_order was an editorial reading order that disagreed with the dates in
-- 51 of 157 places and had to be picked by hand for every new event; the
-- dictionary list, prev/next on an event page and a person's related events
-- now sort by start date, then end date, undated last, id breaking ties
-- (history-events-store.js sortEventsByDate). The event-people sort_order
-- (order of people within one event) is a different column and stays.

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_history_events DROP COLUMN sort_order;
COMMIT;
