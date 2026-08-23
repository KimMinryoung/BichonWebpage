-- 149: visual polish on 148's arrows, after screenshot review.
--
-- A short arrow renders as almost nothing but its arrowhead — a blob, not a
-- movement — so the four sub-1.5° allied arrows get longer runs (Dunkirk
-- evacuation, Montcornet, the Sicily landing, Anzio). The two Italian arrows
-- that shared lon ~11.3 (German seizure southbound, Gothic-line drive
-- northbound) read as one muddled line; the Gothic line shifts east half a
-- degree so the opposing axes separate.

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{4,geo,points}', '[[49.15,4.4],[49.7,3.95]]'),
    '{5,geo,points}', '[[50.95,2.5],[51.2,1.35]]')
WHERE id = 'fall-of-france';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo,points}',  '[[35.5,14.9],[36.9,14.35]]'),
    '{8,geo,points}',  '[[40.9,11.9],[41.42,12.6]]'),
    '{10,geo,points}', '[[43.6,11.9],[44.45,11.7]]')
WHERE id = 'italian-campaign';
