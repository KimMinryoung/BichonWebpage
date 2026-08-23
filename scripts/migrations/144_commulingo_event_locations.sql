-- 144: history events get map locations.
--
-- Event pages had no visual geography at all — a reader who does not already
-- know where Kronstadt or Poznań is got no help from the page. Each event now
-- carries zero or more map markers, rendered server-side onto a coastline-only
-- SVG map (data/commulingo/event-map-svg.js) so no modern borders sit under a
-- historical event.
--
-- Shape, matching the nested {ko,en} convention of the timeline column:
--   [{ "lat": 60.01, "lng": 29.77,
--      "label": { "ko": "크론시타트", "en": "Kronstadt" },
--      "kind": "main" }]
-- kind is 'main' for the event's focal site (emphasized marker); omitted or
-- anything else renders the standard marker. Empty by default, so an event
-- without coordinates simply has no map section.

ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS locations jsonb NOT NULL DEFAULT '[]';
