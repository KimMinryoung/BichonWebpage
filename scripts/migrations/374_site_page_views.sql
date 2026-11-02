-- Daily page-view counts per page (path without the /en prefix, query string
-- dropped), next to the per-menu totals in site_menu_views. Only beacons from
-- browsers holding the menu_view_seen cookie are counted here, so cookie-less
-- scrapers that walk every page never add a row; their visits stay in the
-- menu table's first_views. No IP, cookie or visitor id is stored.
BEGIN;
CREATE TABLE IF NOT EXISTS site_page_views (
    day date NOT NULL,
    path text NOT NULL CHECK (path ~ '^/' AND length(path) <= 300),
    lang text NOT NULL CHECK (lang IN ('ko', 'en')),
    views integer NOT NULL DEFAULT 0 CHECK (views >= 0),
    PRIMARY KEY (day, path, lang)
);
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'site_menu_views'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON site_page_views TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
