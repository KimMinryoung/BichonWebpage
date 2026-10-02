-- 2026-10-02: the frontend's in-memory public previews (homepage lists and
-- CommuLingo updates) used to reread on a timer. They are now refreshed when
-- the data changes: every write to a source table, from the frontend or from
-- the leninbot backend, notifies channel public_cache with the table name and
-- the listener (utils/db-change-listener.js) invalidates the matching keys.
-- Statement-level, so a bulk update sends one notification; NOTIFY is
-- delivered on commit and identical payloads in one transaction are merged.
BEGIN;
CREATE OR REPLACE FUNCTION notify_public_cache() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    PERFORM pg_notify('public_cache', TG_TABLE_NAME);
    RETURN NULL;
END;
$$;

DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY['posts', 'ai_diary', 'research_documents', 'static_pages',
                             'hub_curations', 'commulingo_history_events', 'commulingo_terms'] LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_notify_public_cache', t);
        EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE ON %I '
                       'FOR EACH STATEMENT EXECUTE FUNCTION notify_public_cache()',
                       t || '_notify_public_cache', t);
    END LOOP;
END;
$$;
COMMIT;
