-- Timeline points that named the office an order came from rather than
-- where the event happened. The NKVD's national operations, Order 00447 and
-- the Politburo resolutions of the Great Terror, the Holodomor's village
-- blacklists and grain searches, the United Opposition and the campaign
-- against 'rootless cosmopolitans' struck across the country, so a point at
-- Lubyanka, the Kremlin, Butovo, Kharkov or Old Square misplaced them. Those rows
-- lose their point; the Tukhachevsky trial moves from Lubyanka to Moscow.
--
-- Each change applies only while the row still carries the point it
-- removes, so a rerun is a no-op.

BEGIN;

-- NKVD Secret Operational Order No. 00439: German operation
UPDATE commulingo_history_events SET timeline = timeline #- '{1,geo}'
 WHERE id = 'great-terror' AND timeline->1->'title'->>'en' = 'NKVD Secret Operational Order No. 00439: German operation'
   AND timeline->1->'geo'->'label'->>'en' = 'Lubyanka';

-- NKVD Operational Order No. 00447: ‘kulaks, criminals, and anti-Soviet elements’
UPDATE commulingo_history_events SET timeline = timeline #- '{2,geo}'
 WHERE id = 'great-terror' AND timeline->2->'title'->>'en' = 'NKVD Operational Order No. 00447: ‘kulaks, criminals, and anti-Soviet elements’'
   AND timeline->2->'geo'->'label'->>'en' = 'Kremlin';

-- NKVD Operational Order No. 00485: Polish operation
UPDATE commulingo_history_events SET timeline = timeline #- '{3,geo}'
 WHERE id = 'great-terror' AND timeline->3->'title'->>'en' = 'NKVD Operational Order No. 00485: Polish operation'
   AND timeline->3->'geo'->'label'->>'en' = 'Lubyanka';

-- NKVD Directive No. 49990: Latvian operation
UPDATE commulingo_history_events SET timeline = timeline #- '{6,geo}'
 WHERE id = 'great-terror' AND timeline->6->'title'->>'en' = 'NKVD Directive No. 49990: Latvian operation'
   AND timeline->6->'geo'->'label'->>'en' = 'Butovo firing range';

-- NKVD Directive No. 50215: Greek operation
UPDATE commulingo_history_events SET timeline = timeline #- '{7,geo}'
 WHERE id = 'great-terror' AND timeline->7->'title'->>'en' = 'NKVD Directive No. 50215: Greek operation'
   AND timeline->7->'geo'->'label'->>'en' = 'Lubyanka';

-- National operations extended
UPDATE commulingo_history_events SET timeline = timeline #- '{8,geo}'
 WHERE id = 'great-terror' AND timeline->8->'title'->>'en' = 'National operations extended'
   AND timeline->8->'geo'->'label'->>'en' = 'Kremlin';

-- Resolution halting mass operations
UPDATE commulingo_history_events SET timeline = timeline #- '{10,geo}'
 WHERE id = 'great-terror' AND timeline->10->'title'->>'en' = 'Resolution halting mass operations'
   AND timeline->10->'geo'->'label'->>'en' = 'Kremlin';

-- Beria’s NKVD Order No. 00762
UPDATE commulingo_history_events SET timeline = timeline #- '{11,geo}'
 WHERE id = 'great-terror' AND timeline->11->'title'->>'en' = 'Beria’s NKVD Order No. 00762'
   AND timeline->11->'geo'->'label'->>'en' = 'Lubyanka';

-- The Blacklist System and Village Blockades
UPDATE commulingo_history_events SET timeline = timeline #- '{5,geo}'
 WHERE id = 'holodomor' AND timeline->5->'title'->>'en' = 'The Blacklist System and Village Blockades'
   AND timeline->5->'geo'->'label'->>'en' = 'Kharkov';

-- Stalin's New Year's Day Telegram: The Final Grain Searches
UPDATE commulingo_history_events SET timeline = timeline #- '{7,geo}'
 WHERE id = 'holodomor' AND timeline->7->'title'->>'en' = 'Stalin''s New Year''s Day Telegram: The Final Grain Searches'
   AND timeline->7->'geo'->'label'->>'en' = 'Kharkov';

-- Formation and Defeat of the United Opposition
UPDATE commulingo_history_events SET timeline = timeline #- '{9,geo}'
 WHERE id = 'succession-struggle' AND timeline->9->'title'->>'en' = 'Formation and Defeat of the United Opposition'
   AND timeline->9->'geo'->'label'->>'en' = 'Old Square';

-- The antisemitic campaign
UPDATE commulingo_history_events SET timeline = timeline #- '{0,geo}'
 WHERE id = 'doctors-plot' AND timeline->0->'title'->>'en' = 'The antisemitic campaign'
   AND timeline->0->'geo'->'label'->>'en' = 'Lubyanka';

-- Trial and execution of the military leadership
UPDATE commulingo_history_events
   SET timeline = jsonb_set(timeline, '{0,geo}', '{"kind": "point", "lat": 55.75, "lng": 37.62, "label": {"ko": "모스크바", "en": "Moscow"}}'::jsonb)
 WHERE id = 'great-terror' AND timeline->0->'title'->>'en' = 'Trial and execution of the military leadership'
   AND timeline->0->'geo'->'label'->>'en' = 'Lubyanka';

COMMIT;
