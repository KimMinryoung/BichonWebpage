-- 2026-10-02: political-position collections for the 33 people added to the
-- hungary-interwar-20261001 batch (people named in the three event bodies
-- without a card). Same scheme as 228: Horthy-era officers and ministers as
-- counterrevolution, legitimist officers also as monarchists, the 1919
-- Communists, the murdered Népszava journalists as non-Bolshevik socialists.
-- Left without a collection: Vix, Smuts, Szombathelyi, Serédi, Rothermere.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'aurel-stromfeld'),
    ('communist', 'jozsef-cserny'),
    ('communist', 'antonin-janousek'),
    ('non-bolshevik-socialist', 'bela-somogyi'),
    ('non-bolshevik-socialist', 'bela-bacso'),
    ('liberal-republican', 'oszkar-jaszi'),
    ('liberal-republican', 'denes-berinkey'),
    ('liberal-republican', 'georges-clemenceau'),
    ('conservative', 'istvan-tisza'),
    ('conservative', 'gyula-karolyi'),
    ('counterrevolution', 'gyula-karolyi'),
    ('conservative', 'ferenc-keresztes-fischer'),
    ('conservative', 'engelbert-dollfuss'),
    ('fascist', 'engelbert-dollfuss'),
    ('counterrevolution', 'istvan-friedrich'),
    ('counterrevolution', 'archduke-joseph-august'),
    ('monarchist', 'archduke-joseph-august'),
    ('monarchist', 'charles-i-of-austria'),
    ('counterrevolution', 'ivan-hejjas'),
    ('counterrevolution', 'gyula-ostenburg-moravek'),
    ('monarchist', 'gyula-ostenburg-moravek'),
    ('fascist', 'gyula-ostenburg-moravek'),
    ('counterrevolution', 'antal-lehar'),
    ('monarchist', 'antal-lehar'),
    ('counterrevolution', 'istvan-haller'),
    ('counterrevolution', 'kalman-daranyi'),
    ('counterrevolution', 'dome-sztojay'),
    ('counterrevolution', 'henrik-werth'),
    ('counterrevolution', 'karoly-bartha'),
    ('fascist', 'ferenc-feketehalmy-czeydner'),
    ('fascist', 'friedrich-jeckeln'),
    ('fascist', 'adolf-eichmann'),
    ('nationalist', 'endre-bajcsy-zsilinszky'),
    ('nationalist', 'avgustyn-voloshyn')
ON CONFLICT DO NOTHING;
COMMIT;
