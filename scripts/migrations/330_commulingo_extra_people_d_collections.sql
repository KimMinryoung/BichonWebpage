-- 2026-10-07: political-position collections for the second Balkan/Haiti follow-up cards
-- (scripts/content/queue-events-20261007/people-extra-20261007-d.js). Cards with no position on
-- record (Putnik, Savov, Nazım, Essad, Raimond, Biassou, Jean-François) are left out.
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('conservative', 'titu-maiorescu'),
    ('liberal-republican', 'stoyan-danev'),
    ('liberal-republican', 'vasil-radoslavov'),
    ('liberal-republican', 'kamil-pasha'),
    ('liberal-republican', 'edward-grey'),
    ('imperial-white', 'sergey-sazonov'),
    ('national-liberation', 'francois-capois'),
    ('national-liberation', 'jean-pierre-boyer')
ON CONFLICT DO NOTHING;
