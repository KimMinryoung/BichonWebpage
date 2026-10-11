-- A menu-view beacon from a browser without the seen cookie (its first page
-- here, or a scraper that keeps no cookies) counts in first_views instead of
-- views, so cookie-less floods such as the 2026-10-09 people-filter scrape
-- stay out of the main count while real first visits are still visible.
BEGIN;
ALTER TABLE site_menu_views
    ADD COLUMN IF NOT EXISTS first_views integer NOT NULL DEFAULT 0 CHECK (first_views >= 0);
COMMIT;
