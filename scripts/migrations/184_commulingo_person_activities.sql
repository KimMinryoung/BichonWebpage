-- Additive: existing role assignments and office timelines remain intact.
-- Person writes go through the editorial service, not a data backfill here.
ALTER TABLE commulingo_people ADD COLUMN IF NOT EXISTS activities JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_people_activities_array;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_people_activities_array
    CHECK (jsonb_typeof(activities) = 'array');
