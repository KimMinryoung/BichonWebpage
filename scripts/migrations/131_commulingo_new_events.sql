-- Seven events the catalogue was missing, and room to add more.
--
-- The existing 39 were numbered 10, 20, 30, 40, 45, 50, 60, 65, 70, 75, 79, 80,
-- 81, 82 … — spaced at the front and consecutive from the war onward, so there
-- was no integer between Yalta and the Marshall Plan to put the Manchurian
-- operation in. Every existing event is renumbered to its position × 10, which
-- keeps the reading order exactly as it is (this is an editorial order, not a
-- strictly chronological one: the atomic project sits after the Leningrad
-- affair, the Korean war after the doctors' plot) and leaves nine slots between
-- each pair.
--
-- The new rows carry id, period and title only. Question, summary, outcome and
-- timeline are written separately through commulingo_event_update, which
-- validates lengths and spelling; body sections are then the nightly events
-- lane's work. A row is not shown to a reader until those are filled.

BEGIN;

CREATE TEMP TABLE _order (id text PRIMARY KEY, pos integer NOT NULL);
INSERT INTO _order (id, pos) VALUES
    ('revolution-1905', 10),
    ('february-revolution', 20),
    ('october-revolution', 30),
    ('civil-war', 40),
    ('ussr-formation', 50),
    ('new-economic-policy', 60),
    ('five-year-plans', 70),
    ('spanish-civil-war', 80),
    ('great-terror', 90),
    ('winter-war', 100),
    ('great-patriotic-war', 110),
    ('yalta-potsdam', 120),
    ('marshall-plan', 130),
    ('tito-stalin-split', 140),
    ('leningrad-affair', 150),
    ('soviet-atomic-project', 160),
    ('doctors-plot', 170),
    ('korean-war', 180),
    ('beria-purge', 190),
    ('twentieth-party-congress', 200),
    ('hungarian-revolution', 210),
    ('anti-party-group', 220),
    ('soviet-space-program', 230),
    ('sino-soviet-split', 240),
    ('cuban-missile-crisis', 250),
    ('kosygin-reform', 260),
    ('prague-spring', 270),
    ('afghanistan-war', 280),
    ('perestroika', 290),
    ('anti-alcohol-campaign', 300),
    ('chernobyl', 310),
    ('new-thinking-diplomacy', 320),
    ('nineteenth-party-conference', 330),
    ('nationalities-crisis', 340),
    ('baltic-independence', 350),
    ('revolutions-1989', 360),
    ('economic-reform-debate', 370),
    ('novo-ogaryovo-process', 380),
    ('soviet-collapse', 390);

UPDATE commulingo_history_events e
   SET sort_order = o.pos, updated_at = NOW()
  FROM _order o WHERE o.id = e.id;

-- Every existing event must have been renumbered; a typo above would silently
-- leave one behind at its old number and reorder the page.
DO $$
DECLARE missed integer;
BEGIN
    SELECT count(*) INTO missed FROM commulingo_history_events e
     WHERE NOT EXISTS (SELECT 1 FROM _order o WHERE o.id = e.id);
    IF missed > 0 THEN
        RAISE EXCEPTION 'renumbering missed % existing event(s)', missed;
    END IF;
END $$;

INSERT INTO commulingo_history_events (id, sort_order, period_label, title_ko, title_en) VALUES
    -- Between the civil war and the ussr's formation: the rising that closed
    -- war communism. Eight existing event bodies already call on it.
    ('kronstadt-1921', 45, '1921.03',
     '크론시타트 봉기', 'The Kronstadt Rebellion'),
    -- Between the NEP and the five-year plans, the years the catalogue skipped.
    ('succession-struggle', 65, '1923–1927',
     '레닌 사후 권력투쟁과 좌익 반대파', 'The Succession Struggle and the Left Opposition'),
    -- The human cost of the policy the five-year-plans page describes.
    ('holodomor', 75, '1932–1933',
     '홀로도모르와 집단화 기근', 'The Holodomor and the Collectivisation Famine'),
    -- Khasan, Khalkhin Gol and the pact that closed the eastern front, which the
    -- great patriotic war currently assumes without explaining.
    ('soviet-japanese-border-wars', 95, '1938–1941',
     '소련-일본 국경 전쟁과 중립조약', 'The Soviet-Japanese Border Wars and the Neutrality Pact'),
    ('nazi-soviet-pact', 98, '1939.08–09',
     '독소 불가침조약과 폴란드 분할', 'The Nazi-Soviet Pact and the Partition of Poland'),
    -- The same enemy, a different war: it ends at the 38th parallel, which the
    -- Korean war page inherits.
    ('manchurian-operation', 125, '1945.08',
     '소련의 대일 참전과 만주 작전', 'The Soviet Entry into the War against Japan'),
    -- After Afghanistan: a workers' mass organisation against a socialist state.
    ('solidarity-martial-law', 285, '1980–1981',
     '폴란드 연대노조와 계엄', 'Solidarity and Martial Law in Poland');

DROP TABLE _order;

COMMIT;
