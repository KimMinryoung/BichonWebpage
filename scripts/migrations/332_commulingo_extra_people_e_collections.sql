-- 2026-10-07: political-position collections for the second Franco-Prussian War / Vendée
-- follow-up cards (scripts/content/queue-events-20261007/people-extra-20261007-e.js). Bourbaki,
-- Benedetti, Ollivier, Canclaux and Haxo have no position on record and are left out.
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('non-bolshevik-socialist', 'samuel-spier'),
    ('non-bolshevik-socialist', 'adolf-hepner'),
    ('revolutionary-democrat', 'johann-jacoby'),
    ('liberal-republican', 'jules-ferry'),
    ('liberal-republican', 'jules-simon'),
    ('monarchist', 'agenor-de-gramont'),
    ('revolutionary-socialist', 'gustave-flourens'),
    ('counterrevolution', 'charles-sapinaud-de-la-rairie'),
    ('counterrevolution', 'charles-aime-de-royrand'),
    ('counterrevolution', 'gaspard-de-bernard-de-marigny'),
    ('counterrevolution', 'charles-de-sombreuil'),
    ('counterrevolution', 'etienne-alexandre-bernier')
ON CONFLICT DO NOTHING;
