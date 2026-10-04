-- Daily page-view counts per site menu (services/menu-views.js). A browser
-- sends one beacon per page it opens; detail pages count toward their menu.
-- Only the aggregate is stored: no path, IP, cookie or visitor id.
BEGIN;
CREATE TABLE IF NOT EXISTS site_menu_views (
    day date NOT NULL,
    menu text NOT NULL CHECK (menu ~ '^[a-z][a-z.]{0,39}$'),
    lang text NOT NULL CHECK (lang IN ('ko', 'en')),
    views integer NOT NULL DEFAULT 0 CHECK (views >= 0),
    PRIMARY KEY (day, menu, lang)
);
-- Grant to the same application roles as the existing progress table.
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'commulingo_progress'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON site_menu_views TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
