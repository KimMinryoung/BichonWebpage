-- 224: one glyph per political-position collection.
--
-- Several collections shared a glyph with each other or with an activity
-- function on the people index (flag, landmark, shield, crown, globe,
-- book-open, flame, feather, rose). Each now has its own; the drawings are in
-- data/icons.js. jacobin keeps the scale now that law uses gavel; narodnik
-- keeps flame now that organizing uses users.

BEGIN;
SET LOCAL lock_timeout = '5s';

UPDATE commulingo_person_collections AS c
SET icon = v.icon, updated_at = now()
FROM (VALUES
    ('anarchist', 'circle-a'),
    ('communist', 'hammer-sickle'),
    ('non-bolshevik-socialist', 'rose'),
    ('liberal-republican', 'vote'),
    ('fascist', 'fasces'),
    ('dissident', 'mic-off'),
    ('monarchist', 'chess-king'),
    ('imperial-white', 'castle'),
    ('western-marxist', 'glasses'),
    ('early-socialist', 'sprout'),
    ('revolutionary-socialist', 'hand-fist'),
    ('revolutionary-democrat', 'newspaper'),
    ('national-liberation', 'unlink'),
    ('nationalist', 'map-pinned')
) AS v(id, icon)
WHERE c.id = v.id;

COMMIT;
