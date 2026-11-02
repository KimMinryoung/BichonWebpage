-- Real-user performance and browser errors, counted like the page views
-- (routes/site-metrics.js, services/web-vitals.js): per Korean day, menu and
-- device, each Core Web Vital lands in a fixed bucket so the dashboard can
-- read p75 without storing samples. Errors from the site's own scripts are
-- summed per day, source (path:line:col) and message. No IP, cookie, path
-- beyond the menu, or visitor id is stored.
BEGIN;
CREATE TABLE IF NOT EXISTS site_web_vitals (
    day date NOT NULL,
    menu text NOT NULL CHECK (length(menu) <= 60),
    metric text NOT NULL CHECK (metric IN ('lcp', 'inp', 'cls')),
    device text NOT NULL CHECK (device IN ('mobile', 'desktop')),
    bucket smallint NOT NULL CHECK (bucket >= 0 AND bucket < 32),
    samples integer NOT NULL DEFAULT 0 CHECK (samples >= 0),
    PRIMARY KEY (day, menu, metric, device, bucket)
);
CREATE TABLE IF NOT EXISTS site_client_errors (
    day date NOT NULL,
    source text NOT NULL CHECK (length(source) <= 200),
    message text NOT NULL CHECK (length(message) <= 300),
    hits integer NOT NULL DEFAULT 0 CHECK (hits >= 0),
    PRIMARY KEY (day, source, message)
);
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'site_menu_views'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON site_web_vitals, site_client_errors TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
