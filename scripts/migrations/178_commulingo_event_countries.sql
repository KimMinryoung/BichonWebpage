-- 178: direct state/polity parties for every published history event.
--
-- This is deliberately separate from `locations`: an event taking place in a
-- territory does not automatically make that state a participant, while a
-- treaty party or belligerent may have no location marker on the map. Codes
-- are the constrained keys in data/commulingo/flag-icons.js.

BEGIN;

ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS countries JSONB NOT NULL DEFAULT '[]'::jsonb;

WITH tagged(id, codes) AS (VALUES
    ('revolution-1905', ARRAY['russia']),
    ('february-revolution', ARRAY['russia']),
    ('october-revolution', ARRAY['russia','soviet']),
    ('brest-litovsk', ARRAY['russia','soviet','germany','austria','bulgaria','turkey','ukraine']),
    ('ukraine-1917-1921', ARRAY['ukraine','russia','soviet','germany','poland']),
    ('civil-war', ARRAY['russia','soviet','uk','france','usa','japan','poland']),
    ('baltic-wars-of-independence', ARRAY['estonia','latvia','lithuania','soviet','russia','germany','uk','poland','finland']),
    ('soviet-polish-war', ARRAY['soviet','poland','ukraine','lithuania']),
    ('kronstadt-1921', ARRAY['soviet']),
    ('volga-famine', ARRAY['soviet','russia']),
    ('ussr-formation', ARRAY['soviet','russia','ukraine','belarus','georgia','armenia','azerbaijan']),
    ('new-economic-policy', ARRAY['soviet']),
    ('succession-struggle', ARRAY['soviet']),
    ('five-year-plans', ARRAY['soviet']),
    ('holodomor', ARRAY['soviet','ukraine','kazakhstan']),
    ('february-1934-crisis', ARRAY['france']),
    ('french-popular-front', ARRAY['france']),
    ('spanish-civil-war', ARRAY['spain','germany','italy','soviet','portugal']),
    ('great-terror', ARRAY['soviet']),
    ('soviet-japanese-border-wars', ARRAY['soviet','japan']),
    ('nazi-soviet-pact', ARRAY['soviet','germany','poland','finland','estonia','latvia','lithuania','romania']),
    ('winter-war', ARRAY['soviet','finland']),
    ('fall-of-france', ARRAY['france','germany','italy','uk']),
    ('battle-of-britain', ARRAY['uk','germany','italy']),
    ('great-patriotic-war', ARRAY['soviet','germany','romania','hungary','italy','finland','poland']),
    ('siege-of-leningrad', ARRAY['soviet','germany','finland']),
    ('pacific-war', ARRAY['japan','usa','china','uk','soviet']),
    ('stalingrad', ARRAY['soviet','germany','romania','italy','hungary']),
    ('second-front-normandy', ARRAY['usa','uk','france','germany']),
    ('italian-campaign', ARRAY['italy','germany','usa','uk']),
    ('french-resistance', ARRAY['france','germany','uk','usa']),
    ('warsaw-uprising', ARRAY['poland','germany','soviet']),
    ('yugoslav-partisans', ARRAY['yugoslavia','germany','italy','uk','soviet']),
    ('greek-resistance', ARRAY['greece','germany','italy','uk']),
    ('yalta-potsdam', ARRAY['soviet','usa','uk','germany']),
    ('manchurian-operation', ARRAY['soviet','japan','china','north-korea']),
    ('eastern-europe-peoples-democracies', ARRAY['poland','bulgaria','uk','soviet','romania','hungary','east-germany','czechoslovakia','yugoslavia','albania']),
    ('poland-1944-1948', ARRAY['poland','soviet']),
    ('romania-1944-1948', ARRAY['romania','soviet']),
    ('bulgaria-1944-1949', ARRAY['bulgaria','soviet','yugoslavia']),
    ('hungary-1945-1949', ARRAY['hungary','soviet']),
    ('marshall-plan', ARRAY['usa','uk','france','germany','italy','soviet']),
    ('berlin-blockade', ARRAY['soviet','usa','uk','france','germany']),
    ('tito-stalin-split', ARRAY['yugoslavia','soviet']),
    ('leningrad-affair', ARRAY['soviet']),
    ('soviet-atomic-project', ARRAY['soviet','usa']),
    ('doctors-plot', ARRAY['soviet']),
    ('korean-war', ARRAY['north-korea','south-korea','usa','china','soviet','uk']),
    ('beria-purge', ARRAY['soviet']),
    ('warsaw-pact', ARRAY['soviet','poland','east-germany','czechoslovakia','hungary','romania','bulgaria','albania']),
    ('twentieth-party-congress', ARRAY['soviet']),
    ('poznan-1956', ARRAY['poland','soviet']),
    ('hungarian-revolution', ARRAY['hungary','soviet']),
    ('anti-party-group', ARRAY['soviet']),
    ('soviet-space-program', ARRAY['soviet','usa']),
    ('sino-soviet-split', ARRAY['soviet','china']),
    ('berlin-wall', ARRAY['east-germany','germany','soviet','usa','uk','france']),
    ('cuban-missile-crisis', ARRAY['cuba','usa','soviet','turkey']),
    ('kosygin-reform', ARRAY['soviet']),
    ('prague-spring', ARRAY['czechoslovakia','soviet','poland','east-germany','hungary','bulgaria']),
    ('detente-salt', ARRAY['soviet','usa']),
    ('helsinki-accords', ARRAY['soviet','usa','finland','uk','france','germany']),
    ('afghanistan-war', ARRAY['soviet','afghanistan']),
    ('solidarity-martial-law', ARRAY['poland','soviet']),
    ('war-scare-1983', ARRAY['soviet','usa','uk']),
    ('perestroika', ARRAY['soviet']),
    ('anti-alcohol-campaign', ARRAY['soviet']),
    ('chernobyl', ARRAY['soviet','ukraine','belarus']),
    ('new-thinking-diplomacy', ARRAY['soviet','usa','east-germany','germany']),
    ('nineteenth-party-conference', ARRAY['soviet']),
    ('nationalities-crisis', ARRAY['soviet','armenia','azerbaijan','georgia','ukraine','moldova','kazakhstan','kyrgyzstan','tajikistan','uzbekistan']),
    ('baltic-independence', ARRAY['soviet','estonia','latvia','lithuania']),
    ('revolutions-1989', ARRAY['poland','hungary','east-germany','czechoslovakia','bulgaria','romania','soviet']),
    ('economic-reform-debate', ARRAY['soviet','russia']),
    ('novo-ogaryovo-process', ARRAY['soviet','russia','ukraine','belarus','kazakhstan']),
    ('soviet-collapse', ARRAY['soviet','russia','ukraine','belarus','moldova','estonia','latvia','lithuania','georgia','armenia','azerbaijan','kazakhstan','uzbekistan','turkmenistan','tajikistan','kyrgyzstan'])
)
UPDATE commulingo_history_events AS event
   SET countries = to_jsonb(tagged.codes), updated_at = NOW()
  FROM tagged
 WHERE event.id = tagged.id;

DO $$
DECLARE missing text;
BEGIN
    SELECT string_agg(id, ', ' ORDER BY sort_order, id) INTO missing
      FROM commulingo_history_events
     WHERE COALESCE(summary_ko, '') <> ''
       AND jsonb_array_length(countries) = 0;
    IF missing IS NOT NULL THEN
        RAISE EXCEPTION 'published CommuLingo events missing direct countries: %', missing;
    END IF;
END $$;

COMMIT;
