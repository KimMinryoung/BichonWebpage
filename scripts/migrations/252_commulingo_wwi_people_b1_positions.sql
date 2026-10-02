-- 2026-10-02: political-position collections for the ten First World War and
-- aftermath people registered from group B of the queue in
-- dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md (batch 3).
-- Princip (Young Bosnia) and İnönü as nationalists, Franz Ferdinand as
-- monarchist, Tirpitz (later DNVP) and Curzon as conservatives, Keynes as
-- liberal, Bauer as a non-Bolshevik socialist. Nivelle, Cadorna and the
-- non-party Cuno are left without a collection.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('nationalist', 'gavrilo-princip'),
    ('nationalist', 'ismet-inonu'),
    ('monarchist', 'franz-ferdinand'),
    ('conservative', 'alfred-von-tirpitz'),
    ('conservative', 'george-curzon'),
    ('liberal-republican', 'john-maynard-keynes'),
    ('non-bolshevik-socialist', 'gustav-bauer')
ON CONFLICT DO NOTHING;
COMMIT;
