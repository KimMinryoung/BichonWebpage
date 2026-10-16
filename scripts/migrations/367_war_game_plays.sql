-- Play logs of the war games (public/js/war/), sent by the browser as a game
-- goes on so real play can steer the rules (services/war-plays.js). One row
-- per game and attempt (a battle retried after a defeat is a new attempt of
-- the same game): the decision log as the save holds it, and what the
-- server's replay of it decided. No IP, cookie or visitor id is stored.
BEGIN;
CREATE TABLE IF NOT EXISTS war_game_plays (
    run_id uuid NOT NULL,
    attempt integer NOT NULL CHECK (attempt BETWEEN 0 AND 100),
    scenario text NOT NULL CHECK (scenario ~ '^[a-z][a-z0-9-]{0,39}$'),
    seq integer NOT NULL CHECK (seq >= 0),
    save_version integer NOT NULL,
    rules integer NOT NULL,
    log jsonb NOT NULL,
    decisions integer NOT NULL,
    replayed integer NOT NULL,
    turn integer NOT NULL,
    phase text NOT NULL,
    ended boolean NOT NULL DEFAULT false,
    outcome text,
    stars integer,
    stats jsonb,
    narrow boolean NOT NULL DEFAULT false,
    operator boolean NOT NULL DEFAULT false,
    sends integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    ended_at timestamptz,
    PRIMARY KEY (run_id, attempt)
);
CREATE INDEX IF NOT EXISTS war_game_plays_updated_idx ON war_game_plays(scenario, updated_at DESC);
-- Grant to the same application roles as the existing progress table.
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'commulingo_progress'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON war_game_plays TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
