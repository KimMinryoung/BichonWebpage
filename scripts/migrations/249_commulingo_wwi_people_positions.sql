-- 2026-10-02: political-position collections for the ten First World War and
-- aftermath leaders registered from the queue in
-- dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md (batch 1).
-- The Big Four liberals and Stresemann as liberal-republican, Renner as a
-- non-Bolshevik socialist, Wilhelm II as monarchist, Ludendorff (Kapp Putsch,
-- Beer Hall Putsch) as counterrevolution, Kemal and Enver as nationalists.
-- Ludendorff is not in fascist: his Reichstag seat was for the NSFB coalition,
-- not NSDAP membership. Foch is left without a collection.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('liberal-republican', 'woodrow-wilson'),
    ('liberal-republican', 'david-lloyd-george'),
    ('liberal-republican', 'vittorio-emanuele-orlando'),
    ('liberal-republican', 'gustav-stresemann'),
    ('non-bolshevik-socialist', 'karl-renner'),
    ('monarchist', 'wilhelm-ii'),
    ('counterrevolution', 'erich-ludendorff'),
    ('nationalist', 'mustafa-kemal-ataturk'),
    ('nationalist', 'enver-pasha')
ON CONFLICT DO NOTHING;
COMMIT;
