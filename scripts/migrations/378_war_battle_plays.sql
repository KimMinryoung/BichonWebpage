-- One battle of a war game played on its own (its page
-- /games/<id>/battle/<battle>/, services/war-promos.js), sent by the
-- browser as it goes (routes/war-plays.js POST /games/plays/battle). The
-- war before it is the engine's rehearsal (history's choices), so only the
-- battle's own moves are kept; the server replays them on that rehearsal
-- and stores what the rules decided. One row per attempt: playing it again
-- is a new run. No IP, cookie or visitor id is stored. The whole war's
-- games stay in war_game_plays.
BEGIN;
CREATE TABLE IF NOT EXISTS war_battle_plays (
    run_id uuid PRIMARY KEY,
    scenario text NOT NULL CHECK (scenario ~ '^[a-z][a-z0-9-]{0,39}$'),
    battle text NOT NULL CHECK (battle ~ '^[a-z][a-z0-9-]{0,39}$'),
    seq integer NOT NULL CHECK (seq >= 0),
    rules integer NOT NULL,
    edition integer,
    moves jsonb NOT NULL,
    decisions integer NOT NULL,
    replayed integer NOT NULL,
    turn integer NOT NULL,
    ended boolean NOT NULL DEFAULT false,
    result text CHECK (result IN ('won', 'lost')),
    stats jsonb,
    narrow boolean NOT NULL DEFAULT false,
    operator boolean NOT NULL DEFAULT false,
    sends integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    ended_at timestamptz
);
CREATE INDEX IF NOT EXISTS war_battle_plays_updated_idx ON war_battle_plays(scenario, battle, updated_at DESC);
-- Grant to the same application roles as the existing progress table.
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'commulingo_progress'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON war_battle_plays TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
