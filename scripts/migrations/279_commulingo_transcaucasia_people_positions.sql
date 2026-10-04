-- 2026-10-04: political-position collections for the person cards registered
-- with the event transcaucasia-1917-1921
-- (dev_docs/commulingo-transcaucasia-1917-1921-20261004.md). The Georgian
-- Mensheviks Zhordania and Gegechkori as non-Bolshevik socialists, as
-- Chkheidze and Tsereteli are; Rasulzade (Musavat), Khatisian and Andranik
-- (Armenian national movement) and Karabekir (Turkish national movement) as
-- nationalists, as Enver and Kemal are; Gotsinsky, who led the anti-Soviet
-- Dagestan uprising, as counterrevolution, as Petliura is. Dunsterville, a
-- British officer with no political position on record, is left out.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('non-bolshevik-socialist', 'noe-zhordania'),
    ('non-bolshevik-socialist', 'evgeni-gegechkori'),
    ('nationalist', 'mammad-amin-rasulzade'),
    ('nationalist', 'alexander-khatisian'),
    ('nationalist', 'andranik-ozanian'),
    ('nationalist', 'kazim-karabekir'),
    ('counterrevolution', 'najmuddin-gotsinsky')
ON CONFLICT DO NOTHING;
COMMIT;
