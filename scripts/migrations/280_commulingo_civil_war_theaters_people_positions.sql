-- 2026-10-04: political-position collections for the person cards registered
-- with the Russian Civil War child events central-asia-1917-1924,
-- siberia-far-east-1918-1922 and peasant-uprisings-1920-1922
-- (dev_docs/commulingo-civil-war-theaters-20261004.md). Communists: the Red
-- commanders and officials Kolesov, Shchetinkin and Kakurin. Kuchak Khan as
-- national liberation; Bukeikhanov (Alash Orda) as nationalist; the emir Said
-- Alim Khan as monarchist and counterrevolution; Ibrahim Bek and Junaid Khan,
-- who fought Soviet rule, and the ataman Kalmykov (imperial-white, as Semyonov)
-- as counterrevolution; the SR Tokmakov as a non-Bolshevik socialist (as
-- Antonov); the Left SR Sapozhkov in the left criticism of the Bolsheviks (as
-- Spiridonova). Graves (neutral US commander) and Tryapitsyn (anarchist
-- leanings, no party on record) are left out.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'fyodor-kolesov'),
    ('communist', 'pyotr-shchetinkin'),
    ('communist', 'nikolai-kakurin'),
    ('national-liberation', 'mirza-kuchik-khan'),
    ('nationalist', 'alikhan-bukeikhanov'),
    ('monarchist', 'said-alim-khan'),
    ('counterrevolution', 'said-alim-khan'),
    ('counterrevolution', 'ibrahim-bek'),
    ('counterrevolution', 'junaid-khan'),
    ('imperial-white', 'ivan-kalmykov'),
    ('non-bolshevik-socialist', 'pyotr-tokmakov'),
    ('left-opposition', 'alexander-sapozhkov')
ON CONFLICT DO NOTHING;
COMMIT;
